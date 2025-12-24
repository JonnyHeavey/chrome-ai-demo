import { SummarizerOptions } from '../types/summarizer.types';

export const DEFAULT_SUMMARIZER_OPTIONS: SummarizerOptions = {
  type: 'key-points',
  format: 'plain-text',
  length: 'medium',
  expectedInputLanguages: ['en', 'es', 'ja'],
  outputLanguage: 'en',
};
