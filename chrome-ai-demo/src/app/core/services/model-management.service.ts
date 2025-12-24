import { Injectable } from '@angular/core';

import { ModelDownloadError } from '../../shared/types/chrome-ai.types';
import { Observable } from 'rxjs';
import {
  AI_CAPABILITIES,
  AiCapabilityId,
} from '../../shared/constants/ai-capabilities.constants';

@Injectable({
  providedIn: 'root',
})
export class ModelManagementService {
  private instances = new Map<AiCapabilityId, any>();

  private getApi(capability: AiCapabilityId): any {
    const globalState = globalThis as any;
    switch (capability) {
      case AI_CAPABILITIES.SUMMARIZER:
        return globalState.Summarizer;
      case AI_CAPABILITIES.WRITER:
        return globalState.ai?.writer;
      case AI_CAPABILITIES.REWRITER:
        return globalState.ai?.rewriter;
      case AI_CAPABILITIES.TRANSLATOR:
        return globalState.Translation;
      case AI_CAPABILITIES.LANGUAGE_DETECTOR:
        return globalState.Translation;
      default:
        return globalState.ai?.[capability];
    }
  }

  /**
   * Check if a specific model is available
   */
  async checkAvailability(
    capability: AiCapabilityId
  ): Promise<'available' | 'downloadable' | 'unavailable'> {
    const api = this.getApi(capability);
    if (!api) {
      return 'unavailable';
    }
    return await api.availability();
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

      const availability = await api.availability();

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
