import {
  AI_CAPABILITIES,
  AiCapabilityId,
} from '../../shared/constants/ai-capabilities.constants';
import { AiCapabilityStatus } from '../../shared/types/chrome-ai.types';

const createCapabilityConfig = (
  id: AiCapabilityId,
  name: string,
  link: string
): AiCapabilityStatus => ({
  id,
  name,
  isSupported: false,
  isModelDownloaded: false,
  isDownloading: false,
  downloadProgress: 0,
  downloadError: null,
  link,
});

export const INITIAL_CAPABILITIES_CONFIG: Record<
  AiCapabilityId,
  AiCapabilityStatus
> = {
  [AI_CAPABILITIES.SUMMARIZER]: createCapabilityConfig(
    AI_CAPABILITIES.SUMMARIZER,
    'Summarizer',
    'https://developer.mozilla.org/en-US/docs/Web/API/Summarizer_API'
  ),
  [AI_CAPABILITIES.TRANSLATOR]: createCapabilityConfig(
    AI_CAPABILITIES.TRANSLATOR,
    'Translator',
    'https://developer.mozilla.org/docs/Web/API/Translator_and_Language_Detector_APIs'
  ),
  [AI_CAPABILITIES.WRITER]: createCapabilityConfig(
    AI_CAPABILITIES.WRITER,
    'Writer',
    'https://github.com/explainers-by-googlers/writing-assistance-apis/'
  ),
  [AI_CAPABILITIES.REWRITER]: createCapabilityConfig(
    AI_CAPABILITIES.REWRITER,
    'Rewriter',
    'https://github.com/explainers-by-googlers/writing-assistance-apis/'
  ),
  [AI_CAPABILITIES.LANGUAGE_DETECTOR]: createCapabilityConfig(
    AI_CAPABILITIES.LANGUAGE_DETECTOR,
    'Language Detector',
    'https://developer.mozilla.org/docs/Web/API/Translator_and_Language_Detector_APIs'
  ),
  [AI_CAPABILITIES.PROMPT]: createCapabilityConfig(
    AI_CAPABILITIES.PROMPT,
    'Prompt API',
    'https://developer.chrome.com/docs/ai/prompt-api'
  ),
};
