/**
 * Common Availability Type
 */
export type AIAvailability = 'available' | 'downloadable' | 'unavailable'; // deprecated value is 'no'/'yes'/'after-download' in older specs, but sticking to newer 'available' | 'downloadable' | 'unavailable' if applicable, or string.
// Note: The actual return values might vary by API version.

/**
 * SUMMARIZER API
 */
export type SummarizerType = 'key-points' | 'tldr' | 'teaser' | 'headline';
export type SummarizerFormat = 'markdown' | 'plain-text';
export type SummarizerLength = 'short' | 'medium' | 'long';

export interface SummarizerOptions {
  type?: SummarizerType;
  format?: SummarizerFormat;
  length?: SummarizerLength;
  sharedContext?: string;
  monitor?: (m: EventTarget) => void;
}

export interface Summarizer {
  summarize(text: string): Promise<string>;
  destroy(): void;
  ready: Promise<void>;
}

export interface SummarizerConstructor {
  availability(): Promise<AIAvailability>;
  create(options?: SummarizerOptions): Promise<Summarizer>;
}

/**
 * TRANSLATOR API
 */
export interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (monitor: EventTarget) => void;
}

export interface Translator {
  translate(input: string): Promise<string>;
  destroy(): void;
}

export interface TranslatorConstructor {
  availability(options?: TranslatorOptions): Promise<AIAvailability>;
  create(options?: TranslatorOptions): Promise<Translator>;
}

/**
 * LANGUAGE DETECTOR API
 */
export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

export interface LanguageDetector {
  detect(input: string): Promise<LanguageDetectionResult[]>;
  destroy(): void;
  ready: Promise<void>;
}

export interface LanguageDetectorConstructor {
  availability(): Promise<AIAvailability>;
  create(): Promise<LanguageDetector>;
}

/**
 * WRITER API
 */
export type WriterTone = 'formal' | 'neutral' | 'casual';
export type WriterFormat = 'markdown' | 'plain-text';
export type WriterLength = 'short' | 'medium' | 'long';

export interface WriterOptions {
  tone?: WriterTone;
  format?: WriterFormat;
  length?: WriterLength;
  sharedContext?: string;
  context?: string;
  monitor?: (m: EventTarget) => void;
  expectedInputLanguages?: string[];
  expectedContextLanguages?: string[];
  outputLanguage?: string;
}

export interface Writer {
  write(input: string, options?: { context?: string }): Promise<string>;
  writeStreaming(
    input: string,
    options?: { context?: string }
  ): ReadableStream<string>;
  destroy(): void;
  ready: Promise<void>;
}

export interface WriterConstructor {
  availability(): Promise<AIAvailability>;
  create(options?: WriterOptions): Promise<Writer>;
}

/**
 * REWRITER API
 */
export type RewriterTone = 'more-formal' | 'as-is' | 'more-casual';
export type RewriterFormat = 'as-is' | 'markdown' | 'plain-text';
export type RewriterLength = 'shorter' | 'as-is' | 'longer';

export interface RewriterOptions {
  tone?: RewriterTone;
  format?: RewriterFormat;
  length?: RewriterLength;
  sharedContext?: string;
  context?: string;
  monitor?: (m: EventTarget) => void;
  expectedInputLanguages?: string[];
  expectedContextLanguages?: string[];
  outputLanguage?: string;
}

export interface Rewriter {
  rewrite(input: string, options?: { context?: string }): Promise<string>;
  rewriteStreaming(
    input: string,
    options?: { context?: string }
  ): ReadableStream<string>;
  destroy(): void;
  ready: Promise<void>;
}

export interface RewriterConstructor {
  availability(): Promise<AIAvailability>;
  create(options?: RewriterOptions): Promise<Rewriter>;
}

/**
 * PROMPT API
 */
export interface PromptOptions {
  systemPrompt?: string;
  monitor?: (m: EventTarget) => void;
}

export interface PromptSession {
  destroy(): void;
  prompt(input: string, options?: any): Promise<string>;
  promptStreaming(input: string, options?: any): ReadableStream<string>;
}

export interface PromptConstructor {
  availability(): Promise<AIAvailability>;
  create(options?: PromptOptions): Promise<PromptSession>;
  capabilities(): Promise<{ available: AIAvailability }>;
}
