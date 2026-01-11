import {
  SummarizerConstructor,
  TranslatorConstructor,
  LanguageDetectorConstructor,
  PromptApiConstructor,
} from '../app/shared/types/chrome-ai-apis.types';

declare global {
  interface Window {
    Summarizer: SummarizerConstructor;
    Translator: TranslatorConstructor;
    LanguageDetector: LanguageDetectorConstructor;
    LanguageModel: PromptApiConstructor;
    ai: {
      writer: any;
      rewriter: any;
      languageDetector: LanguageDetectorConstructor;
      summarizer: SummarizerConstructor;
      translator: TranslatorConstructor;
    };
  }
}
