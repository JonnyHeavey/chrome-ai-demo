import {
  WriterConstructor,
  RewriterConstructor,
  SummarizerConstructor,
  TranslatorConstructor,
  LanguageDetectorConstructor,
  PromptConstructor,
} from '../app/shared/types/chrome-ai-apis.types';

declare global {
  interface Window {
    Summarizer: SummarizerConstructor;
    Translator: TranslatorConstructor;
    LanguageDetector: LanguageDetectorConstructor;
    LanguageModel: PromptConstructor;
    Writer: WriterConstructor;
    Rewriter: RewriterConstructor;
    ai: {
      writer: WriterConstructor;
      rewriter: RewriterConstructor;
      languageDetector: LanguageDetectorConstructor;
      summarizer: SummarizerConstructor;
      translator: TranslatorConstructor;
    };
  }
}
