// Cloud API Provider - OpenAI / Claude / 其他云端 API
import type { AIProvider, GenerateOptions } from '../types';
import { SYSTEM_PROMPT } from '../prompts';

export type CloudAPIType = 'openai' | 'claude' | 'deepseek';

interface CloudAPIConfig {
  type: CloudAPIType;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

let config: CloudAPIConfig | null = null;

const DEFAULT_MODELS: Record<CloudAPIType, string> = {
  openai: 'gpt-4o-mini',
  claude: 'claude-3-haiku-20240307',
  deepseek: 'deepseek-chat',
};

const API_URLS: Record<CloudAPIType, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  claude: 'https://api.anthropic.com/v1/messages',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
};

export function configureCloudAPI(cfg: CloudAPIConfig): void {
  config = cfg;
}

export function getCloudAPIConfig(): CloudAPIConfig | null {
  return config;
}

export function clearCloudAPIConfig(): void {
  config = null;
}

export const cloudAPIProvider: AIProvider = {
  name: 'Cloud API',
  priority: 4,

  available: async () => {
    return config !== null && !!config.apiKey;
  },

  generate: async (prompt: string, options?: GenerateOptions): Promise<string> => {
    if (!config) throw new Error('Cloud API not configured');

    const model = config.model || DEFAULT_MODELS[config.type];
    const baseUrl = config.baseUrl || API_URLS[config.type];
    const systemPrompt = options?.systemPrompt || SYSTEM_PROMPT;

    if (config.type === 'claude') {
      return generateClaude(baseUrl, config.apiKey, model, systemPrompt, prompt, options);
    } else {
      return generateOpenAICompatible(baseUrl, config.apiKey, model, systemPrompt, prompt, options);
    }
  },
};

async function generateOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}


async function generateClaude(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Claude API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  return data.content[0]?.text || '';
}
