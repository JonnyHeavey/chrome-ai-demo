/**
 * Summarizer availability status
 */
export type SummarizerAvailability =
  | 'available'
  | 'downloadable'
  | 'unavailable';

/**
 * Summarizer type options
 */
export type SummarizerType = 'key-points' | 'tldr' | 'teaser' | 'headline';

/**
 * Summarizer format options
 */
export type SummarizerFormat = 'markdown' | 'plain-text';

/**
 * Summarizer length options
 */
export type SummarizerLength = 'short' | 'medium' | 'long';

/**
 * Summarizer output language options
 */
export type SummarizerLanguage = 'en' | 'es' | 'ja';

/**
 * Summarizer creation options
 */
export interface SummarizerOptions {
  type?: SummarizerType;
  format?: SummarizerFormat;
  length?: SummarizerLength;
  language?: SummarizerLanguage;
  expectedInputLanguages?: string[];
  outputLanguage?: string;
  expectedContextLanguages?: string[];
  sharedContext?: string;
  monitor?: (m: EventTarget) => void;
}

/**
 * Global Summarizer interface - represents a summarizer instance
 */
export interface Summarizer {
  summarize(text: string): Promise<string>;
  destroy(): void;
}

/**
 * Global Summarizer constructor interface
 */
export interface SummarizerConstructor {
  availability(): Promise<SummarizerAvailability>;
  create(options?: SummarizerOptions): Promise<Summarizer>;
}

declare global {
  interface Window {
    Summarizer: SummarizerConstructor;
  }
}
