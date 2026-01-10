import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withProps,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TranslatorService } from '../services/translator.service';
import { Translator } from '../types/translator.types';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';

type TranslatorState = {
  inputText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  isTranslating: boolean;
  error: string | null;
  translator: Translator | null;
};

const initialState: TranslatorState = {
  inputText: '',
  translatedText: '',
  sourceLanguage: 'en',
  targetLanguage: 'es',
  isTranslating: false,
  error: null,
  translator: null,
};

export const TranslatorStore = signalStore(
  withState(initialState),
  withProps(() => ({
    service: inject(TranslatorService),
    appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    isModelDownloaded: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.TRANSLATOR]
          .isModelDownloaded
    ),
    isDownloadingModel: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.TRANSLATOR].isDownloading
    ),
    modelDownloadProgress: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.TRANSLATOR]
          .downloadProgress
    ),
    modelDownloadError: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.TRANSLATOR].downloadError
    ),
  })),
  withMethods((store) => ({
    setLanguages(source: string, target: string): void {
      if (source === target) {
        patchState(store, {
          sourceLanguage: source,
          targetLanguage: target,
          error: 'Source and Target languages must be different',
        });
        return;
      }

      patchState(store, { sourceLanguage: source, targetLanguage: target });
      // Reset translator when languages change as we need a new instance
      if (store.translator()) {
        store.translator()?.destroy();
        patchState(store, { translator: null });
      }
      // Trigger download for new language pair if needed
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.TRANSLATOR,
        options: {
          sourceLanguage: source,
          targetLanguage: target,
        },
      });
    },
    setInputText(text: string): void {
      patchState(store, { inputText: text, error: null });
    },
    downloadModel: () => {
      if (store.sourceLanguage() === store.targetLanguage()) {
        patchState(store, {
          error: 'Source and Target languages must be different',
        });
        return;
      }
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.TRANSLATOR,
        options: {
          sourceLanguage: store.sourceLanguage(),
          targetLanguage: store.targetLanguage(),
        },
      });
    },
    translate: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isTranslating: true, error: null })),
        switchMap(async () => {
          let translator = store.translator();
          if (!translator) {
            translator = await store.service.createTranslator({
              sourceLanguage: store.sourceLanguage(),
              targetLanguage: store.targetLanguage(),
            });
            patchState(store, { translator });
          }
          if (!translator) {
            throw new Error('Failed to create translator');
          }
          return await translator.translate(store.inputText());
        }),
        tap({
          next: (translatedText) =>
            patchState(store, { translatedText, isTranslating: false }),
          error: (err) => {
            console.error('Translation failed:', err);
            patchState(store, { error: err.message, isTranslating: false });
          },
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.downloadModel();
    },
  })
);
