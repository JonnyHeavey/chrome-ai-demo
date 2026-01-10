import {
  SummarizerConstructor,
  TranslatorConstructor,
  LanguageDetectorConstructor,
} from '../app/shared/types/chrome-ai-apis.types';

declare global {
  interface Window {
    Summarizer: SummarizerConstructor;
    Translator: TranslatorConstructor;
    LanguageDetector: LanguageDetectorConstructor;
    ai: {
      writer: any;
      rewriter: any;
      languageDetector: LanguageDetectorConstructor;
      summarizer: SummarizerConstructor;
      translator: TranslatorConstructor;
    };
  }
}
