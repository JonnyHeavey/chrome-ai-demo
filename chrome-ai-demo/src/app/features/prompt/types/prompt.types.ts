export interface PromptMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export type PromptStatus =
  | 'idle'
  | 'ready'
  | 'downloading'
  | 'generating'
  | 'error';

export interface PromptSession {
  promptStreaming(input: string): ReadableStream<string>;
  destroy(): void;
}

export interface PromptConfig {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}
