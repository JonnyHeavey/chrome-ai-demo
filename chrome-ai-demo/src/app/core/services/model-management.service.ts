import { Injectable } from '@angular/core';

import { ModelDownloadError } from '../../shared/types/chrome-ai.types';
import { Observable } from 'rxjs';
import {
  AI_CAPABILITIES,
  AiCapabilityId,
} from '../../shared/constants/ai-capabilities.constants';
import { AIAvailability } from '../../shared/types/chrome-ai-apis.types';

@Injectable({
  providedIn: 'root',
})
export class ModelManagementService {
  private instances = new Map<AiCapabilityId, any>();

  private getApi(capability: AiCapabilityId): any {
    switch (capability) {
      case AI_CAPABILITIES.SUMMARIZER:
        return window.Summarizer;
      case AI_CAPABILITIES.WRITER:
        return window.Writer;
      case AI_CAPABILITIES.REWRITER:
        return window.Rewriter;
      case AI_CAPABILITIES.TRANSLATOR:
        return window.Translator;
      case AI_CAPABILITIES.LANGUAGE_DETECTOR:
        return window.LanguageDetector;
      case AI_CAPABILITIES.PROMPT:
        return window.LanguageModel;
      default:
        // Fallback for unknown capabilities within the 'ai' namespace if applicable
        return (window.ai as any)?.[capability];
    }
  }

  /**
   * Check if a specific model is available
   */
  async checkAvailability(
    capability: AiCapabilityId,
    options?: any
  ): Promise<AIAvailability> {
    const api = this.getApi(capability);
    if (!api) {
      return 'unavailable';
    }
    // User indicated availability() is the correct method for Prompt API too.
    // Falling back to the default api.availability(options) below.
    return await api.availability(options);
  }

  /**
   * Download a specific model
   */
  downloadModel(
    capability: AiCapabilityId,
    options: any = {}
  ): Observable<number> {
    return new Observable<number>((observer) => {
      this.executeDownload(capability, options, observer);
    });
  }

  private async executeDownload(
    capability: AiCapabilityId,
    options: any,
    observer: any
  ) {
    try {
      const api = this.getApi(capability);

      if (!api) {
        throw new ModelDownloadError(
          `${capability} API is not available in this browser`
        );
      }

      // User indicated availability() is the correct method for Prompt API too.
      const availability = await api.availability(options);

      if (availability === 'unavailable' || availability === 'no') {
        throw new ModelDownloadError(
          `${capability} is not available (status: ${availability})`
        );
      }

      observer.next(0);

      const instance = await api.create({
        ...options,
        monitor(m: EventTarget) {
          m.addEventListener('downloadprogress', (e: Event) => {
            const progressEvent = e as any;
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            observer.next(percentage);
          });
        },
      });

      this.instances.set(capability, instance);
      observer.next(100);
      observer.complete();
    } catch (error) {
      console.error(`Download failed for ${capability}`, error);
      observer.error(
        new ModelDownloadError(`Failed to download ${capability} model`, error)
      );
    }
  }

  /**
   * Get a model instance
   */
  getInstance(capability: AiCapabilityId): any {
    return this.instances.get(capability) || null;
  }

  /**
   * Destroy a model instance
   */
  destroy(capability: AiCapabilityId): void {
    const instance = this.instances.get(capability);
    if (instance) {
      instance.destroy();
      this.instances.delete(capability);
    }
  }

  /**
   * Check global support for a list of capabilities
   */
  checkGlobalSupport(
    capabilities: AiCapabilityId[]
  ): Record<AiCapabilityId, boolean> {
    const supportMap: Record<string, boolean> = {};
    capabilities.forEach((cap) => {
      let isSupported = false;
      switch (cap) {
        case AI_CAPABILITIES.SUMMARIZER:
          isSupported = 'Summarizer' in self;
          break;
        case AI_CAPABILITIES.WRITER:
          isSupported = 'Writer' in self;
          break;
        case AI_CAPABILITIES.REWRITER:
          isSupported = 'Rewriter' in self;
          break;
        case AI_CAPABILITIES.TRANSLATOR:
          isSupported = 'Translator' in self;
          break;
        case AI_CAPABILITIES.LANGUAGE_DETECTOR:
          isSupported = 'LanguageDetector' in self;
          break;
        case AI_CAPABILITIES.PROMPT:
          isSupported = 'LanguageModel' in self;
          break;
        default:
          isSupported = false;
      }
      supportMap[cap] = isSupported;
    });
    return supportMap as Record<AiCapabilityId, boolean>;
  }

  retryDownload(capability: AiCapabilityId, options?: any): Observable<number> {
    this.destroy(capability);
    return this.downloadModel(capability, options);
  }
}
