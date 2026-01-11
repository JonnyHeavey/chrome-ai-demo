import { Injectable } from '@angular/core';
import { Observable, from, switchMap, scan } from 'rxjs';
import { PromptConfig, PromptSession } from '../types/prompt.types';

@Injectable()
export class PromptService {
  private session: PromptSession | null = null;

  async createSession(config: PromptConfig = {}): Promise<PromptSession> {
    const languageModel = window.LanguageModel;

    if (!languageModel) {
      throw new Error('Language Model API not supported');
    }

    this.session = await languageModel.create({
      systemPrompt: config.systemPrompt,
    });

    return this.session!;
  }

  destroySession(): void {
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }

  prompt(message: string): Observable<string> {
    return from(this.ensureSession()).pipe(
      switchMap((session) =>
        this.streamResponse(session.promptStreaming(message))
      ),
      scan((acc, chunk) => acc + chunk, '')
    );
  }

  async ensureSession(config: PromptConfig = {}): Promise<PromptSession> {
    if (!this.session) {
      return this.createSession(config);
    }
    return this.session;
  }

  private streamResponse(stream: ReadableStream<string>): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = stream.getReader();
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            observer.next(value);
          }
          observer.complete();
        } catch (err) {
          observer.error(err);
        } finally {
          reader.releaseLock();
        }
      })();
      return () => reader.cancel();
    });
  }
}
