export const AI_CAPABILITIES = {
  SUMMARIZER: 'summarizer',
  TRANSLATOR: 'translator',
  WRITER: 'writer',
  REWRITER: 'rewriter',
  LANGUAGE_DETECTOR: 'languageDetector',
} as const;

export type AiCapabilityId =
  (typeof AI_CAPABILITIES)[keyof typeof AI_CAPABILITIES];
