import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withProps,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { tap, switchMap, pipe } from 'rxjs';
import { RewriterService } from '../services/rewriter.service';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';
import { DEFAULT_REWRITER_OPTIONS } from '../config/rewriter.config';
import {
  RewriterState,
  RewriterTone,
  RewriterFormat,
  RewriterLength,
} from '../types/rewriter.types';

const initialState: RewriterState = {
  input: '',
  context: '',
  output: '',
  tone: DEFAULT_REWRITER_OPTIONS.tone!,
  format: DEFAULT_REWRITER_OPTIONS.format!,
  length: DEFAULT_REWRITER_OPTIONS.length!,
  isWriting: false,
  error: null,
};

export const RewriterStore = signalStore(
  withState(initialState),
  withProps(() => ({
    service: inject(RewriterService),
    appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    isModelDownloaded: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.REWRITER]
          ?.isModelDownloaded ?? false
    ),
    isDownloadingModel: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.REWRITER]
          ?.isDownloading ?? false
    ),
    modelDownloadProgress: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.REWRITER]
          ?.downloadProgress ?? 0
    ),
    modelDownloadError: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.REWRITER]
          ?.downloadError ?? null
    ),
    canRewrite: computed(
      () => store.input().trim().length > 0 && !store.isWriting()
    ),
    hasOutput: computed(() => store.output().length > 0),
  })),
  withMethods((store) => ({
    downloadModel(): void {
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.REWRITER,
        options: DEFAULT_REWRITER_OPTIONS,
      });
    },
    setInput(text: string): void {
      patchState(store, { input: text, error: null });
    },
    setContext(text: string): void {
      patchState(store, { context: text });
    },
    setOption<K extends keyof RewriterState>(
      key: K,
      value: RewriterState[K]
    ): void {
      patchState(store, { [key]: value } as Partial<RewriterState>);
    },
    setTone(tone: RewriterTone): void {
      patchState(store, { tone });
    },
    setFormat(format: RewriterFormat): void {
      patchState(store, { format });
    },
    setLength(length: RewriterLength): void {
      patchState(store, { length });
    },
    rewrite: rxMethod<void>(
      pipe(
        tap(() => {
          if (!store.input().trim()) {
            patchState(store, { error: 'Please enter text to rewrite' });
            return;
          }
          patchState(store, {
            isWriting: true,
            error: null,
            output: '',
          });
        }),
        switchMap(() => {
          if (!store.input().trim()) return [];

          const options = {
            tone: store.tone(),
            format: store.format(),
            length: store.length(),
            context: store.context(),
          };

          return store.service.rewriteStreaming(store.input(), options).pipe(
            tap({
              next: (chunk) =>
                patchState(store, {
                  output: chunk,
                }),
              error: (error) => {
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error';
                patchState(store, {
                  isWriting: false,
                  error: errorMessage,
                });
              },
              complete: () => {
                patchState(store, { isWriting: false });
              },
            })
          );
        })
      )
    ),
    clear(): void {
      patchState(store, {
        input: '',
        context: '',
        output: '',
        error: null,
        isWriting: false,
      });
    },
  }))
);
