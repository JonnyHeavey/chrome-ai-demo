import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ModelManagementService } from '../../../core/services/model-management.service';
import { AI_CAPABILITIES } from '../../../shared/constants/ai-capabilities.constants';
import {
  WriterOptions,
  Writer,
} from '../../../shared/types/chrome-ai-apis.types';
import { DEFAULT_WRITER_OPTIONS } from '../config/writer.config';

@Injectable()
export class WriterService {
  private readonly modelMgmt = inject(ModelManagementService);

  write(
    text: string,
    options: WriterOptions = DEFAULT_WRITER_OPTIONS
  ): Observable<string> {
    return from(this.performWrite(text, options));
  }

  writeStreaming(
    text: string,
    options: WriterOptions = DEFAULT_WRITER_OPTIONS
  ): Observable<string> {
    return new Observable((subscriber) => {
      this.performWriteStreaming(text, options, subscriber).catch((err) =>
        subscriber.error(err)
      );
    });
  }

  private async performWrite(
    text: string,
    options: WriterOptions
  ): Promise<string> {
    const writer = await this.getWriterInstance(options);
    return await writer.write(text, { context: options.context });
  }

  private async performWriteStreaming(
    text: string,
    options: WriterOptions,
    subscriber: any
  ): Promise<void> {
    const writer = await this.getWriterInstance(options);
    const stream = writer.writeStreaming(text, { context: options.context });

    let fullText = '';
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        fullText += value;
        subscriber.next(fullText);
      }
    } finally {
      reader.releaseLock();
    }
    subscriber.complete();
  }

  private async getWriterInstance(options: WriterOptions): Promise<Writer> {
    const writer = this.modelMgmt.getInstance(AI_CAPABILITIES.WRITER) as Writer;

    if (!writer) {
      throw new Error('Writer model is not ready');
    }

    return window.Writer.create(options);
  }
}
