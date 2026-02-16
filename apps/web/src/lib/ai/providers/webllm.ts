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

// WebLLM Provider - 完全离线浏览器内 AI
import type { AIProvider, GenerateOptions } from '../types';
import { SYSTEM_PROMPT } from '../prompts';

// WebGPU 类型声明
declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<GPUAdapter | null>;
    };
  }
  interface GPUAdapter {}
}

let engine: any = null;
let isLoading = false;
let webllmModule: any = null;

const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

export const webllmProvider: AIProvider = {
  name: 'WebLLM (Browser)',
  priority: 3,

  available: async () => {
    if (typeof window === 'undefined') return false;
    try {
      // 检查 WebGPU 支持
      const nav = navigator as Navigator;
      if (!nav.gpu) return false;
      const adapter = await nav.gpu.requestAdapter();
      if (!adapter) return false;
      
      // 尝试动态导入 webllm
      try {
        // @ts-ignore - WebLLM 是可选依赖
        webllmModule = await import('@mlc-ai/web-llm');
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  },

  generate: async (prompt: string, options?: GenerateOptions): Promise<string> => {
    if (!engine) {
      await initEngine();
    }
    
    const messages = [
      { role: 'system', content: options?.systemPrompt || SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ];

    const response = await engine.chat.completions.create({
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });

    return response.choices[0]?.message?.content || '';
  },
};


async function initEngine(): Promise<void> {
  if (engine || isLoading) return;
  
  isLoading = true;
  try {
    if (!webllmModule) {
      // @ts-ignore - WebLLM 是可选依赖
      webllmModule = await import('@mlc-ai/web-llm');
    }
    
    engine = await webllmModule.CreateMLCEngine(MODEL_ID, {
      initProgressCallback: (progress: { text: string }) => {
        console.log(`[WebLLM] Loading: ${progress.text}`);
      },
    });
  } finally {
    isLoading = false;
  }
}

export async function getWebLLMLoadingProgress(): Promise<number> {
  return engine ? 100 : 0;
}

export function isWebLLMReady(): boolean {
  return engine !== null;
}
