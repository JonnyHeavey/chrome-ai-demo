import { RewriterOptions } from '../../../shared/types/chrome-ai-apis.types';

export const DEFAULT_REWRITER_OPTIONS: RewriterOptions = {
  tone: 'as-is',
  format: 'markdown',
  length: 'as-is',
  sharedContext: '',
};
