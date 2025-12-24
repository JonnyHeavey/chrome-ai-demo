import { AiCapabilityId } from '../constants/ai-capabilities.constants';

export type AiCapability = AiCapabilityId;

/**
 * Model download error types
 */
export class ModelDownloadError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'ModelDownloadError';
  }
}

/**
 * Summarization error types
 */
export class SummarizationError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'SummarizationError';
  }
}

/**
 * Browser support error types
 */
export class BrowserSupportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrowserSupportError';
  }
}

/**
 * Model download progress event
 */
export interface ModelDownloadProgress {
  status: 'idle' | 'downloading' | 'ready' | 'error';
  progress: number; // 0-100
  error?: string;
}

/**
 * Polling configuration
 */
export interface PollingConfig {
  interval: number; // milliseconds between polls
  timeout: number; // maximum time to wait
}

/**
 * Interface definition for the status of an AI Capability
 */
export interface AiCapabilityStatus {
  id: AiCapability;
  name: string;
  isSupported: boolean;
  isModelDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string | null;
  link: string;
}
