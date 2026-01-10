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
        return self.Summarizer;
      case AI_CAPABILITIES.WRITER:
        return self.ai?.writer;
      case AI_CAPABILITIES.REWRITER:
        return self.ai?.rewriter;
      case AI_CAPABILITIES.TRANSLATOR:
        return self.Translator;
      case AI_CAPABILITIES.LANGUAGE_DETECTOR:
        return self.LanguageDetector;
      default:
        // Fallback for unknown capabilities within the 'ai' namespace if applicable
        return (self.ai as any)?.[capability];
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

      const availability = await api.availability(options);

      if (availability === 'unavailable') {
        throw new ModelDownloadError(
          `${capability} is not available (status: unavailable)`
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
      const api = this.getApi(cap);
      supportMap[cap] = !!api;
    });
    return supportMap as Record<AiCapabilityId, boolean>;
  }

  retryDownload(capability: AiCapabilityId, options?: any): Observable<number> {
    this.destroy(capability);
    return this.downloadModel(capability, options);
  }
}
