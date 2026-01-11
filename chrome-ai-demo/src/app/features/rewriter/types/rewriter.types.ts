import {
  RewriterOptions,
  RewriterTone,
  RewriterFormat,
  RewriterLength,
} from '../../../shared/types/chrome-ai-apis.types';

export interface RewriterState {
  input: string;
  context: string;
  output: string;
  tone: RewriterTone;
  format: RewriterFormat;
  length: RewriterLength;
  isWriting: boolean;
  error: string | null;
}

export type { RewriterOptions, RewriterTone, RewriterFormat, RewriterLength };
