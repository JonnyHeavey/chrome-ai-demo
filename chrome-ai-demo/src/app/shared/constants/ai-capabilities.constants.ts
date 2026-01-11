export const AI_CAPABILITIES = {
  SUMMARIZER: 'summarizer',
  TRANSLATOR: 'translator',
  WRITER: 'writer',
  REWRITER: 'rewriter',
  LANGUAGE_DETECTOR: 'languageDetector',
  PROMPT: 'prompt',
} as const;

export type AiCapabilityId =
  (typeof AI_CAPABILITIES)[keyof typeof AI_CAPABILITIES];
