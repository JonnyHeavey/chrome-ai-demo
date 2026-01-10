export interface Translator {
  translate(input: string): Promise<string>;
  destroy(): void;
}

export interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (monitor: EventTarget) => void;
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLanguage: string;
  targetLanguage: string;
}
