export interface LanguageDetector {
  ready: Promise<void>;
  detect(input: string): Promise<LanguageDetectionResult[]>;
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

export interface LanguageDetectorCreateOptions {
  monitor?: (monitor: any) => void;
}
