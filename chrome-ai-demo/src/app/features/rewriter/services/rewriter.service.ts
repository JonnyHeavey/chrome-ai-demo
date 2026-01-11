import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ModelManagementService } from '../../../core/services/model-management.service';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';
import {
  RewriterOptions,
  Rewriter,
} from '../../../shared/types/chrome-ai-apis.types';
import { DEFAULT_REWRITER_OPTIONS } from '../config/rewriter.config';

@Injectable()
export class RewriterService {
  private readonly modelMgmt = inject(ModelManagementService);

  rewrite(
    text: string,
    options: RewriterOptions = DEFAULT_REWRITER_OPTIONS
  ): Observable<string> {
    return from(this.performRewrite(text, options));
  }

  rewriteStreaming(
    text: string,
    options: RewriterOptions = DEFAULT_REWRITER_OPTIONS
  ): Observable<string> {
    return new Observable((subscriber) => {
      this.performRewriteStreaming(text, options, subscriber).catch((err) =>
        subscriber.error(err)
      );
    });
  }

  private async performRewrite(
    text: string,
    options: RewriterOptions
  ): Promise<string> {
    const rewriter = await this.getRewriterInstance(options);
    return await rewriter.rewrite(text, { context: options.context });
  }

  private async performRewriteStreaming(
    text: string,
    options: RewriterOptions,
    subscriber: any
  ): Promise<void> {
    const rewriter = await this.getRewriterInstance(options);
    const stream = rewriter.rewriteStreaming(text, {
      context: options.context,
    });

    let fullText = '';
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        fullText += value; // Accumulate chunks
        subscriber.next(fullText);
      }
    } finally {
      reader.releaseLock();
    }
    subscriber.complete();
  }

  private async getRewriterInstance(
    options: RewriterOptions
  ): Promise<Rewriter> {
    const rewriter = this.modelMgmt.getInstance(
      AI_CAPABILITIES.REWRITER
    ) as Rewriter;

    if (!rewriter) {
      throw new Error('Rewriter model is not ready');
    }

    return window.Rewriter.create(options);
  }
}
