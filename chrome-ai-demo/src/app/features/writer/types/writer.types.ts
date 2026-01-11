import {
  WriterFormat,
  WriterLength,
  WriterTone,
} from '../../../shared/types/chrome-ai-apis.types';

export type {
  WriterFormat,
  WriterLength,
  WriterTone,
} from '../../../shared/types/chrome-ai-apis.types';

export interface WriterState {
  input: string;
  context: string;
  output: string;
  tone: WriterTone;
  format: WriterFormat;
  length: WriterLength;
  isWriting: boolean;
  error: string | null;
}
