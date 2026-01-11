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
import { WriterService } from '../services/writer.service';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';
import { DEFAULT_WRITER_OPTIONS } from '../config/writer.config';
import { WriterState } from '../types/writer.types';

const initialState: WriterState = {
  input: '',
  context: '',
  output: '',
  tone: DEFAULT_WRITER_OPTIONS.tone!,
  format: DEFAULT_WRITER_OPTIONS.format!,
  length: DEFAULT_WRITER_OPTIONS.length!,
  isWriting: false,
  error: null,
};

export const WriterStore = signalStore(
  withState(initialState),
  withProps(() => ({
    service: inject(WriterService),
    appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    isModelDownloaded: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.WRITER]
          ?.isModelDownloaded ?? false
    ),
    isDownloadingModel: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.WRITER]?.isDownloading ??
        false
    ),
    modelDownloadProgress: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.WRITER]
          ?.downloadProgress ?? 0
    ),
    modelDownloadError: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.WRITER]?.downloadError ??
        null
    ),
    canWrite: computed(
      () => store.input().trim().length > 0 && !store.isWriting()
    ),
    hasOutput: computed(() => store.output().length > 0),
  })),
  withMethods((store) => ({
    downloadModel(): void {
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.WRITER,
        options: DEFAULT_WRITER_OPTIONS,
      });
    },
    setInput(text: string): void {
      patchState(store, { input: text, error: null });
    },
    setContext(text: string): void {
      patchState(store, { context: text });
    },
    setOption<K extends keyof WriterState>(
      key: K,
      value: WriterState[K]
    ): void {
      patchState(store, { [key]: value } as Partial<WriterState>);
    },
    write: rxMethod<void>(
      pipe(
        tap(() => {
          if (!store.input().trim()) {
            patchState(store, { error: 'Please enter text to write about' });
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

          return store.service.writeStreaming(store.input(), options).pipe(
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
