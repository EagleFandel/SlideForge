/*
 * SlideForge - AI-First Slides Protocol Framework
 * Copyright (C) 2026 SlideForge Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// AI Manager - 统一管理多个 AI Provider
import type { SlideDocument } from '@slideforge/protocol';
import type { AIProvider, CreatePresentationInput, AIGenerateResult } from './types';
import { chromeAIProvider } from './providers/chrome-ai';
import { ollamaProvider } from './providers/ollama';
import { webllmProvider } from './providers/webllm';
import { cloudAPIProvider, configureCloudAPI, clearCloudAPIConfig, type CloudAPIType } from './providers/cloud-api';
import { buildGeneratePrompt, SYSTEM_PROMPT } from './prompts';

export * from './types';
export { SYSTEM_PROMPT, buildGeneratePrompt } from './prompts';
export { configureCloudAPI, clearCloudAPIConfig, type CloudAPIType } from './providers/cloud-api';

class AIManager {
  private providers: AIProvider[] = [chromeAIProvider, ollamaProvider, webllmProvider, cloudAPIProvider];
  private activeProvider: AIProvider | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // 按优先级检测可用的 Provider
    const sorted = [...this.providers].sort((a, b) => a.priority - b.priority);
    
    for (const provider of sorted) {
      try {
        if (await provider.available()) {
          this.activeProvider = provider;
          break;
        }
      } catch {
        // 继续尝试下一个
      }
    }

    this.initialized = true;
  }

  getActiveProvider(): string | null {
    return this.activeProvider?.name ?? null;
  }

  isAvailable(): boolean {
    return this.activeProvider !== null;
  }

  async generate(prompt: string): Promise<string> {
    await this.initialize();
    
    if (!this.activeProvider) {
      throw new Error('No AI provider available');
    }

    return this.activeProvider.generate(prompt, { systemPrompt: SYSTEM_PROMPT });
  }

  async generatePresentation(input: CreatePresentationInput): Promise<AIGenerateResult> {
    await this.initialize();

    if (!this.activeProvider) {
      return {
        success: false,
        error: 'No AI provider available. Please install Ollama or use Chrome with AI features enabled.',
      };
    }

    const prompt = buildGeneratePrompt(input);

    try {
      const response = await this.activeProvider.generate(prompt, {
        systemPrompt: SYSTEM_PROMPT,
      });

      // 尝试解析 JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          error: 'AI response does not contain valid JSON',
          provider: this.activeProvider.name,
        };
      }

      const document = JSON.parse(jsonMatch[0]) as SlideDocument;

      // 基本校验
      if (!document.version || !document.slides || !Array.isArray(document.slides)) {
        return {
          success: false,
          error: 'Invalid document structure',
          provider: this.activeProvider.name,
        };
      }

      return {
        success: true,
        document,
        provider: this.activeProvider.name,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: this.activeProvider.name,
      };
    }
  }
}

// 单例
export const aiManager = new AIManager();
