import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Summarizer } from '../types/summarizer.types';
import { SummarizationError } from '../../../shared/types/chrome-ai.types';
import { ModelManagementService } from '../../../core/services/model-management.service';
import { inject } from '@angular/core';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';

@Injectable()
export class SummarizerService {
  private readonly modelMgmt = inject(ModelManagementService);

  summarize(text: string): Observable<string> {
    return from(this.performSummarization(text));
  }

  async performSummarization(text: string): Promise<string> {
    const summarizer = this.modelMgmt.getInstance(AI_CAPABILITIES.SUMMARIZER);

    if (!summarizer) {
      throw new SummarizationError('Summarizer model is not ready');
    }

    try {
      return await summarizer.summarize(text);
    } catch (error) {
      throw new SummarizationError('Failed to summarize text', error);
    }
  }

  destroy(): void {
    this.modelMgmt.destroy(AI_CAPABILITIES.SUMMARIZER);
  }
}
