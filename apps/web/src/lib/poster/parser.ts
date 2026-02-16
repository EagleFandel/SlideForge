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

/**
 * Poster Parser - 解析 Markdown 或 PosterDocument
 */

import type { PosterDocument, PosterContent, PosterTemplate } from '@slideforge/protocol';

export interface ParsedPoster {
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  image?: string;
  footer?: string;
  qrcode?: string;
  author?: string;
  date?: string;
  logo?: string;
}

// QR 码缓存
const qrCodeCache = new Map<string, string>();

/**
 * 生成 QR 码 Data URL
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  if (qrCodeCache.has(text)) {
    return qrCodeCache.get(text)!;
  }
  
  const { generateQRCode } = await import('@/lib/qrcode');
  const dataUrl = await generateQRCode(text, { size: 120, margin: 2 });
  qrCodeCache.set(text, dataUrl);
  return dataUrl;
}

/**
 * 从 Markdown 解析海报内容
 */
export function parseMarkdown(markdown: string): ParsedPoster {
  const lines = markdown.trim().split('\n');
  const result: ParsedPoster = {
    items: [],
  };

  let currentSection: 'body' | 'items' = 'body';
  const bodyLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // H1 -> title
    if (trimmed.startsWith('# ')) {
      result.title = trimmed.slice(2).trim();
      continue;
    }

    // H2 -> subtitle
    if (trimmed.startsWith('## ')) {
      result.subtitle = trimmed.slice(3).trim();
      continue;
    }

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      currentSection = 'items';
      const itemText = trimmed.replace(/^[-*]\s|^\d+\.\s/, '');
      result.items?.push(itemText);
      continue;
    }

    // Image
    const imageMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      result.image = imageMatch[2];
      continue;
    }

    // Blockquote -> can be used as footer or quote body
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.slice(2).trim();
      // If starts with "—" or "--", it's attribution
      if (quoteText.startsWith('—') || quoteText.startsWith('--')) {
        result.author = quoteText.replace(/^[—-]+\s*/, '');
      } else {
        bodyLines.push(quoteText);
      }
      continue;
    }

    // Regular text -> body
    if (trimmed && currentSection === 'body') {
      bodyLines.push(trimmed);
    }
  }

  if (bodyLines.length > 0) {
    result.body = bodyLines.join('\n');
  }

  // Clean up empty items array
  if (result.items?.length === 0) {
    delete result.items;
  }

  return result;
}

/**
 * 从 PosterContent 解析
 */
export function parseContent(content: PosterContent): ParsedPoster {
  // 如果有 markdown，优先解析 markdown
  if (content.markdown) {
    const parsed = parseMarkdown(content.markdown);
    // 合并结构化字段（结构化字段优先级更高）
    return {
      ...parsed,
      title: content.title || parsed.title,
      subtitle: content.subtitle || parsed.subtitle,
      body: content.body || parsed.body,
      image: content.image || parsed.image,
      footer: content.footer || parsed.footer,
      qrcode: content.qrcode || parsed.qrcode,
      author: content.author || parsed.author,
      date: content.date || parsed.date,
      logo: content.logo || parsed.logo,
    };
  }

  // 直接使用结构化内容
  return {
    title: content.title,
    subtitle: content.subtitle,
    body: content.body,
    image: content.image,
    footer: content.footer,
    qrcode: content.qrcode,
    author: content.author,
    date: content.date,
    logo: content.logo,
  };
}

/**
 * 自动推断最佳模板
 */
export function inferTemplate(parsed: ParsedPoster): PosterTemplate {
  // 有列表项 -> list
  if (parsed.items && parsed.items.length > 0) {
    return 'list';
  }

  // 有图片 -> card
  if (parsed.image) {
    return 'card';
  }

  // 短文本 + 作者 -> quote
  if (parsed.body && parsed.body.length < 200 && parsed.author) {
    return 'quote';
  }

  // 只有标题和副标题 -> social
  if (parsed.title && !parsed.body && !parsed.items) {
    return 'social';
  }

  // 默认 -> minimal
  return 'minimal';
}

/**
 * 创建默认 PosterDocument
 */
export function createDefaultPoster(content: Partial<PosterContent> = {}): PosterDocument {
  const parsed = parseContent(content as PosterContent);
  const template = inferTemplate(parsed);

  return {
    version: '1.0',
    type: 'poster',
    metadata: {
      title: parsed.title,
      createdAt: new Date().toISOString(),
    },
    config: {
      template,
      theme: 'default',
      size: {
        width: template === 'social' ? 1200 : 800,
        height: template === 'social' ? 630 : 'auto',
      },
    },
    content: content as PosterContent,
  };
}
