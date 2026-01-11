import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withProps,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { tap, switchMap, pipe } from 'rxjs';

import { ModelManagementService } from '../services/model-management.service';
import {
  AiCapability,
  AiCapabilityStatus,
} from '../../shared/types/chrome-ai.types';

import { AI_CAPABILITIES } from '../../shared/constants/ai-capabilities.constants';

import { INITIAL_CAPABILITIES_CONFIG } from '../config/app.config';

interface AppState {
  capabilities: Record<AiCapability, AiCapabilityStatus>;
}

const initialState: AppState = {
  capabilities: INITIAL_CAPABILITIES_CONFIG,
};

export const AppStore = signalStore(
  withState(initialState),
  withProps(() => ({
    modelMgmt: inject(ModelManagementService),
  })),
  withComputed((store) => ({
    supportSummary: computed(() => {
      const allCaps = store.capabilities();
      const relevantCaps = [
        allCaps[AI_CAPABILITIES.SUMMARIZER],
        allCaps[AI_CAPABILITIES.WRITER],
        allCaps[AI_CAPABILITIES.REWRITER],
        allCaps[AI_CAPABILITIES.LANGUAGE_DETECTOR],
        allCaps[AI_CAPABILITIES.TRANSLATOR],
        allCaps[AI_CAPABILITIES.PROMPT],
      ];

      const supportedCount = relevantCaps.filter((c) => c.isSupported).length;

      if (supportedCount === 0) return 'none';
      if (supportedCount === relevantCaps.length) return 'full';
      return 'partial';
    }),
  })),
  withMethods((store) => ({
    downloadModel: rxMethod<{ capability: AiCapability; options?: any }>(
      pipe(
        tap(({ capability: capabilityId }) =>
          patchState(store, (state) => ({
            capabilities: {
              ...state.capabilities,
              [capabilityId]: {
                ...state.capabilities[capabilityId],
                isDownloading: true,
                downloadError: null,
              },
            },
          }))
        ),
        switchMap(({ capability: capabilityId, options }) => {
          return store.modelMgmt.downloadModel(capabilityId, options).pipe(
            tap({
              next: (progress) =>
                patchState(store, (state) => ({
                  capabilities: {
                    ...state.capabilities,
                    [capabilityId]: {
                      ...state.capabilities[capabilityId],
                      downloadProgress: progress,
                    },
                  },
                })),
              error: (error) => {
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error';
                patchState(store, (state) => ({
                  capabilities: {
                    ...state.capabilities,
                    [capabilityId]: {
                      ...state.capabilities[capabilityId],
                      isDownloading: false,
                      downloadError: errorMessage,
                      downloadProgress: 0,
                    },
                  },
                }));
              },
              complete: () =>
                patchState(store, (state) => ({
                  capabilities: {
                    ...state.capabilities,
                    [capabilityId]: {
                      ...state.capabilities[capabilityId],
                      isDownloading: false,
                      isModelDownloaded: true,
                      downloadProgress: 100,
                    },
                  },
                })),
            })
          );
        })
      )
    ),
    retryDownload(capabilityId: AiCapability, options?: any): void {
      patchState(store, (state) => ({
        capabilities: {
          ...state.capabilities,
          [capabilityId]: {
            ...state.capabilities[capabilityId],
            downloadError: null,
          },
        },
      }));
      this.downloadModel({ capability: capabilityId, options });
    },
  })),
  withHooks({
    onInit(store) {
      const capabilityKeys = Object.keys(
        store.capabilities()
      ) as AiCapability[];
      const supportMap = store.modelMgmt.checkGlobalSupport(capabilityKeys);
      patchState(store, (state) => {
        const newCapabilities = { ...state.capabilities };
        capabilityKeys.forEach((key) => {
          newCapabilities[key] = {
            ...newCapabilities[key],
            isSupported: supportMap[key],
          };
        });
        return { capabilities: newCapabilities };
      });
    },
  })
);
