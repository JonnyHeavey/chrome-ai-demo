import { Injectable } from '@angular/core';
import { Translator, TranslatorOptions } from '../types/translator.types';

@Injectable()
export class TranslatorService {
  checkAvailability(): boolean {
    return 'Translator' in self;
  }

  async createTranslator(options: TranslatorOptions): Promise<Translator> {
    if (!this.checkAvailability()) {
      throw new Error('Translator API not available in this browser');
    }
    return await (self as any).Translator.create(options);
  }
}
