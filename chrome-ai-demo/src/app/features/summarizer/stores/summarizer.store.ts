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
import { SummarizerService } from '../services/summarizer.service';
import type {
  SummarizerType,
  SummarizerFormat,
  SummarizerLength,
} from '../types/summarizer.types';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';

interface SummarizerState {
  inputText: string;
  outputText: string;
  isSummarizing: boolean;
  error: string | null;
  type: SummarizerType;
  format: SummarizerFormat;
  length: SummarizerLength;
}

import { DEFAULT_SUMMARIZER_OPTIONS } from '../config/summarizer.config';

const initialState: SummarizerState = {
  inputText: '',
  outputText: '',
  isSummarizing: false,
  error: null,
  type: DEFAULT_SUMMARIZER_OPTIONS.type!,
  format: DEFAULT_SUMMARIZER_OPTIONS.format!,
  length: DEFAULT_SUMMARIZER_OPTIONS.length!,
};

export const SummarizerStore = signalStore(
  withState(initialState),
  withProps(() => ({
    service: inject(SummarizerService),
    appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    isModelDownloaded: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.SUMMARIZER]
          .isModelDownloaded
    ),
    isDownloadingModel: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.SUMMARIZER].isDownloading
    ),
    modelDownloadProgress: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.SUMMARIZER]
          .downloadProgress
    ),
    modelDownloadError: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.SUMMARIZER].downloadError
    ),
    canSummarize: computed(
      () => store.inputText().trim().length > 0 && !store.isSummarizing()
    ),
    hasOutput: computed(() => store.outputText().length > 0),
    hasError: computed(() => !!store.error()),
  })),
  withMethods((store) => ({
    downloadModel(): void {
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.SUMMARIZER,
        options: DEFAULT_SUMMARIZER_OPTIONS,
      });
    },
    setInputText(text: string): void {
      patchState(store, { inputText: text, error: null });
    },
    setOption<K extends keyof SummarizerState>(
      key: K,
      value: SummarizerState[K]
    ): void {
      patchState(store, { [key]: value } as Partial<SummarizerState>);
    },
    summarize: rxMethod<void>(
      pipe(
        tap(() => {
          if (!store.inputText().trim()) {
            patchState(store, { error: 'Please enter text to summarize' });
            return;
          }
          patchState(store, {
            isSummarizing: true,
            error: null,
            outputText: '',
          });
        }),
        switchMap(() => {
          if (!store.inputText().trim()) return [];
          return store.service.summarize(store.inputText()).pipe(
            tap({
              next: (summary) =>
                patchState(store, {
                  outputText: summary,
                  isSummarizing: false,
                }),
              error: (error) => {
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error';
                patchState(store, {
                  isSummarizing: false,
                  error: errorMessage,
                });
              },
            })
          );
        })
      )
    ),
    clear(): void {
      patchState(store, {
        inputText: '',
        outputText: '',
        error: null,
        isSummarizing: false,
      });
    },
  }))
);
