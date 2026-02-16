// AI Provider 类型定义
import type { SlideDocument } from '@slideforge/protocol';

export interface AIProvider {
  name: string;
  priority: number;
  available: () => Promise<boolean>;
  generate: (prompt: string, options?: GenerateOptions) => Promise<string>;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface CreatePresentationInput {
  title: string;
  content: string;
  theme?: string;
  slideCount?: number;
  language?: 'zh' | 'en';
}

export interface AIGenerateResult {
  success: boolean;
  document?: SlideDocument;
  error?: string;
  provider?: string;
}
