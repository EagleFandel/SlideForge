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

// Chrome Built-in AI Provider (Gemini Nano)
import type { AIProvider } from '../types';
import { SYSTEM_PROMPT } from '../prompts';

// Chrome AI 类型声明
declare global {
  interface Window {
    ai?: {
      languageModel?: {
        capabilities: () => Promise<{ available: string }>;
        create: (options: { systemPrompt?: string; temperature?: number }) => Promise<{
          prompt: (text: string) => Promise<string>;
          destroy: () => void;
        }>;
      };
    };
  }
}

export const chromeAIProvider: AIProvider = {
  name: 'Chrome AI (Gemini Nano)',
  priority: 1,

  available: async () => {
    if (typeof window === 'undefined') return false;
    
    const ai = window.ai;
    if (!ai?.languageModel) return false;

    try {
      const caps = await ai.languageModel.capabilities();
      return caps.available === 'readily';
    } catch {
      return false;
    }
  },

  generate: async (prompt, options) => {
    const ai = window.ai;
    if (!ai?.languageModel) {
      throw new Error('Chrome AI not available');
    }

    const session = await ai.languageModel.create({
      systemPrompt: options?.systemPrompt || SYSTEM_PROMPT,
      temperature: options?.temperature ?? 0.7,
    });

    try {
      return await session.prompt(prompt);
    } finally {
      session.destroy();
    }
  },
};
