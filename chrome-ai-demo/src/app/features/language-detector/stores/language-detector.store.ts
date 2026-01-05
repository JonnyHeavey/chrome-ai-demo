import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { LanguageDetectorService } from '../services/language-detector.service';
import {
  LanguageDetectionResult,
  LanguageDetector,
} from '../types/language-detector.types';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';

type LanguageDetectorState = {
  inputText: string;
  results: LanguageDetectionResult[];
  isDetecting: boolean;
  error: string | null;
  detector: LanguageDetector | null;
  isDetectorReady: boolean;
};

const initialState: LanguageDetectorState = {
  inputText: '',
  results: [],
  isDetecting: false,
  error: null,
  detector: null,
  isDetectorReady: false,
};

export const LanguageDetectorStore = signalStore(
  withState(initialState),
  withComputed((store, appStore = inject(AppStore)) => ({
    hasDetector: computed(() => !!store.detector()),
    isModelDownloaded: computed(
      () =>
        appStore.capabilities()[AI_CAPABILITIES.LANGUAGE_DETECTOR]
          .isModelDownloaded
    ),
    isDownloadingModel: computed(
      () =>
        appStore.capabilities()[AI_CAPABILITIES.LANGUAGE_DETECTOR].isDownloading
    ),
    modelDownloadProgress: computed(
      () =>
        appStore.capabilities()[AI_CAPABILITIES.LANGUAGE_DETECTOR]
          .downloadProgress
    ),
    modelDownloadError: computed(
      () =>
        appStore.capabilities()[AI_CAPABILITIES.LANGUAGE_DETECTOR].downloadError
    ),
  })),
  withMethods(
    (
      store,
      service = inject(LanguageDetectorService),
      appStore = inject(AppStore)
    ) => ({
      initializeDetector: rxMethod<void>(
        pipe(
          switchMap(async () => {
            return await service.createDetector();
          }),
          tap({
            next: (detector) => {
              patchState(store, {
                detector,
                isDetectorReady: true,
                error: null,
              });
            },
            error: (err) => {
              console.error('Failed to initialize Language Detector:', err);
              patchState(store, {
                error: err.message,
                isDetectorReady: false,
              });
            },
          })
        )
      ),
      downloadModel: () => {
        appStore.downloadModel({
          capability: AI_CAPABILITIES.LANGUAGE_DETECTOR,
        });
      },
      detectLanguage: rxMethod<string>(
        pipe(
          tap((input) =>
            patchState(store, {
              inputText: input,
              isDetecting: true,
              error: null,
              results: [],
            })
          ),
          switchMap(async (input) => {
            const detector = store.detector();
            if (!detector) throw new Error('Detector not initialized');
            return await detector.detect(input);
          }),
          tap({
            next: (results) =>
              patchState(store, { results, isDetecting: false }),
            error: (err) => {
              console.error('Language detection failed:', err);
              patchState(store, { error: err.message, isDetecting: false });
            },
          })
        )
      ),
      setInputText(text: string): void {
        patchState(store, { inputText: text, error: null });
      },
      clear(): void {
        patchState(store, {
          inputText: '',
          results: [],
          error: null,
          isDetecting: false,
        });
      },
    })
  ),
  withHooks({
    onInit(store) {
      store.initializeDetector();
    },
  })
);
