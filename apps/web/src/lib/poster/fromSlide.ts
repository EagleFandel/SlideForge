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
 * Slide to Poster - 将 Slide 转换为 Poster
 */

import type { Slide, PosterDocument, PosterTemplate, Element } from '@slideforge/protocol';

/**
 * 从 Slide 元素中提取文本内容
 */
function extractText(elements: Element[]): {
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  image?: string;
} {
  const result: {
    title?: string;
    subtitle?: string;
    body?: string;
    items?: string[];
    image?: string;
  } = {};

  for (const element of elements) {
    switch (element.type) {
      case 'heading':
        if (element.level === 1 && !result.title) {
          result.title = element.text;
        } else if (element.level === 2 && !result.subtitle) {
          result.subtitle = element.text;
        } else if (!result.body) {
          result.body = element.text;
        }
        break;

      case 'text':
        if (!result.body) {
          result.body = element.content;
        } else {
          result.body += '\n' + element.content;
        }
        break;

      case 'list':
        result.items = element.items.map(item => 
          typeof item === 'string' ? item : item.text
        );
        break;

      case 'image':
        if (!result.image) {
          result.image = element.src;
        }
        break;
    }
  }

  return result;
}

/**
 * 根据 Slide 类型推断最佳 Poster 模板
 */
function inferTemplateFromSlide(slide: Slide): PosterTemplate {
  switch (slide.type) {
    case 'title':
    case 'section':
      return 'social';
    case 'quote':
      return 'quote';
    case 'image':
      return 'card';
    default:
      // 检查是否有列表
      const hasList = slide.elements.some(e => e.type === 'list');
      if (hasList) return 'list';
      
      // 检查是否有图片
      const hasImage = slide.elements.some(e => e.type === 'image');
      if (hasImage) return 'card';
      
      return 'minimal';
  }
}

/**
 * 将 Slide 转换为 PosterDocument
 */
export function slideToPoster(
  slide: Slide,
  options: {
    template?: PosterTemplate;
    theme?: string;
    author?: string;
  } = {}
): PosterDocument {
  const extracted = extractText(slide.elements);
  const template = options.template || inferTemplateFromSlide(slide);

  return {
    version: '1.0',
    type: 'poster',
    metadata: {
      title: extracted.title,
      createdAt: new Date().toISOString(),
    },
    config: {
      template,
      theme: options.theme || 'default',
      size: {
        width: template === 'social' ? 1200 : 800,
        height: template === 'social' ? 630 : 'auto',
      },
    },
    content: {
      title: extracted.title,
      subtitle: extracted.subtitle,
      body: extracted.body,
      image: extracted.image,
      author: options.author,
    },
  };
}

/**
 * 批量将 Slides 转换为 Posters
 */
export function slidesToPosters(
  slides: Slide[],
  options: {
    theme?: string;
    author?: string;
  } = {}
): PosterDocument[] {
  return slides.map(slide => slideToPoster(slide, options));
}
