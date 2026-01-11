import { Injectable } from '@angular/core';
import { LanguageDetector } from '../types/language-detector.types';

@Injectable()
export class LanguageDetectorService {
  checkAvailability(): boolean {
    return 'LanguageDetector' in self;
  }

  async getAvailability(): Promise<string> {
    if (!this.checkAvailability()) {
      return 'no';
    }
    return await window.LanguageDetector.availability();
  }

  async createDetector(): Promise<LanguageDetector> {
    if (!this.checkAvailability()) {
      throw new Error('Language Detector API not available in this browser');
    }
    return await window.LanguageDetector.create();
  }
}
