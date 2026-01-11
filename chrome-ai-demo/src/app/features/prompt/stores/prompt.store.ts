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
import { PromptService } from '../services/prompt.service';
import { PromptMessage, PromptStatus } from '../types/prompt.types';
import { AppStore } from '../../../core/stores/app.store';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';

interface PromptState {
  messages: PromptMessage[];
  status: PromptStatus;
  error: string | null;
  systemPrompt: string;
}

const initialState: PromptState = {
  messages: [],
  status: 'idle',
  error: null,
  systemPrompt: 'You are a helpful AI assistant.',
};

export const PromptStore = signalStore(
  withState(initialState),
  withProps(() => ({
    service: inject(PromptService),
    appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    isModelDownloaded: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.PROMPT]
          ?.isModelDownloaded ?? false
    ),
    isDownloadingModel: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.PROMPT]?.isDownloading ??
        false
    ),
    modelDownloadProgress: computed(
      () =>
        store.appStore.capabilities()[AI_CAPABILITIES.PROMPT]
          ?.downloadProgress ?? 0
    ),
  })),
  withMethods((store) => ({
    updateSystemPrompt(prompt: string): void {
      patchState(store, { systemPrompt: prompt });
      store.service.destroySession();
    },
    downloadModel(): void {
      store.appStore.downloadModel({
        capability: AI_CAPABILITIES.PROMPT,
        options: {},
      });
    },
    chat: rxMethod<string>(
      pipe(
        tap((message) => {
          patchState(store, {
            status: 'generating' as PromptStatus,
            messages: [
              ...store.messages(),
              { role: 'user', content: message },
              { role: 'model', content: '' },
            ],
            error: null,
          });
        }),
        switchMap((message) => {
          return store.service.prompt(message).pipe(
            tap({
              next: (chunk) => {
                patchState(store, (state) => {
                  const newMessages = [...state.messages];
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: chunk,
                  };
                  return {
                    messages: newMessages,
                    status: 'generating' as PromptStatus,
                  };
                });
              },
              complete: () => {
                patchState(store, (state) => {
                  const newMessages = [...state.messages];
                  if (newMessages.length > 0) {
                    const lastMsg = newMessages[newMessages.length - 1];
                    newMessages[newMessages.length - 1] = {
                      ...lastMsg,
                      content: lastMsg.content.trim(),
                    };
                  }
                  return {
                    messages: newMessages,
                    status: 'idle' as PromptStatus,
                  };
                });
              },

              error: (err) => {
                patchState(store, {
                  error: err.message || 'Error generating response',
                  status: 'error' as PromptStatus,
                });
              },
            })
          );
        })
      )
    ),
    reset(): void {
      store.service.destroySession();
      patchState(store, { messages: [] });
    },
  })),
  withHooks({
    async onInit(store) {
      try {
        const capabilities = await window.LanguageModel.capabilities();
        if (capabilities.available === 'available') {
          store.downloadModel();
        } else {
          store.downloadModel();
        }
      } catch (e) {
        store.downloadModel();
      }
    },
  })
);
