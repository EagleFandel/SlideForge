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
 * Poster Templates - 海报模板样式定义
 */

import type { PosterTemplate } from '@slideforge/protocol';

export interface TemplateStyles {
  container: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  footer: string;
  items: string;
  item: string;
  author: string;
  date: string;
  logo: string;
  qrcode: string;
}

export interface TemplateConfig {
  name: PosterTemplate;
  displayName: string;
  description: string;
  defaultSize: { width: number; height: number | 'auto' };
  styles: TemplateStyles;
}

/**
 * Card 模板 - 卡片式，图文混排
 */
const cardTemplate: TemplateConfig = {
  name: 'card',
  displayName: '卡片',
  description: '图文混排的卡片式海报',
  defaultSize: { width: 800, height: 'auto' },
  styles: {
    container: 'flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden',
    title: 'text-3xl font-bold text-gray-900 px-8 pt-8',
    subtitle: 'text-lg text-gray-500 px-8 mt-2',
    body: 'text-base text-gray-700 px-8 py-6 leading-relaxed',
    image: 'w-full h-64 object-cover',
    footer: 'text-sm text-gray-400 px-8 pb-6 border-t border-gray-100 pt-4 mt-auto',
    items: 'px-8 py-4 space-y-3',
    item: 'flex items-start gap-3 text-gray-700',
    author: 'text-sm text-gray-500 px-8',
    date: 'text-sm text-gray-400 px-8 pb-6',
    logo: 'h-8 px-8 pt-6',
    qrcode: 'w-20 h-20 absolute bottom-6 right-6',
  },
};

/**
 * Social 模板 - 社交分享，大字居中
 */
const socialTemplate: TemplateConfig = {
  name: 'social',
  displayName: '社交分享',
  description: '适合朋友圈、Twitter 分享',
  defaultSize: { width: 1200, height: 630 },
  styles: {
    container: 'flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-blue-600 to-purple-700',
    title: 'text-5xl font-bold text-white mb-4 leading-tight',
    subtitle: 'text-2xl text-white/80 mb-8',
    body: 'text-xl text-white/90 max-w-2xl leading-relaxed',
    image: 'w-32 h-32 rounded-full object-cover mb-8 border-4 border-white/30',
    footer: 'text-base text-white/60 mt-auto pt-8',
    items: 'flex flex-wrap justify-center gap-4 mt-6',
    item: 'bg-white/20 px-4 py-2 rounded-full text-white text-sm',
    author: 'text-lg text-white/70 mt-4',
    date: 'text-sm text-white/50 mt-2',
    logo: 'h-10 absolute top-8 left-8',
    qrcode: 'w-24 h-24 absolute bottom-8 right-8 bg-white p-2 rounded-lg',
  },
};

/**
 * Quote 模板 - 引用卡片，名人名言
 */
const quoteTemplate: TemplateConfig = {
  name: 'quote',
  displayName: '引用卡片',
  description: '适合名言警句、金句分享',
  defaultSize: { width: 800, height: 800 },
  styles: {
    container: 'flex flex-col items-center justify-center p-16 bg-gradient-to-br from-amber-50 to-orange-100 relative',
    title: 'text-2xl font-medium text-gray-800 mb-8 text-center',
    subtitle: 'text-lg text-gray-500 text-center',
    body: 'text-3xl font-serif text-gray-800 text-center leading-relaxed italic before:content-["""] before:text-6xl before:text-amber-400 before:absolute before:top-8 before:left-8 after:content-["""] after:text-6xl after:text-amber-400 after:absolute after:bottom-8 after:right-8',
    image: 'w-24 h-24 rounded-full object-cover mb-6 border-4 border-white shadow-lg',
    footer: 'text-sm text-gray-400 mt-auto pt-8',
    items: 'hidden',
    item: 'hidden',
    author: 'text-xl font-medium text-gray-700 mt-8 before:content-["—"] before:mr-2',
    date: 'text-sm text-gray-400 mt-2',
    logo: 'h-8 absolute top-8 right-8',
    qrcode: 'w-16 h-16 absolute bottom-8 left-8',
  },
};

/**
 * List 模板 - 列表式，要点罗列
 */
const listTemplate: TemplateConfig = {
  name: 'list',
  displayName: '列表',
  description: '适合要点总结、清单分享',
  defaultSize: { width: 800, height: 'auto' },
  styles: {
    container: 'flex flex-col p-10 bg-white',
    title: 'text-3xl font-bold text-gray-900 mb-2',
    subtitle: 'text-lg text-gray-500 mb-8 pb-6 border-b border-gray-200',
    body: 'text-base text-gray-600 mb-6',
    image: 'w-full h-48 object-cover rounded-xl mb-8',
    footer: 'text-sm text-gray-400 mt-auto pt-6 border-t border-gray-100',
    items: 'space-y-4',
    item: 'flex items-start gap-4 p-4 bg-gray-50 rounded-xl text-gray-700 before:content-["✓"] before:text-green-500 before:font-bold before:text-lg',
    author: 'text-sm text-gray-500 mt-6',
    date: 'text-sm text-gray-400',
    logo: 'h-8 mb-6',
    qrcode: 'w-20 h-20 mt-6',
  },
};

/**
 * Minimal 模板 - 极简，纯文字
 */
const minimalTemplate: TemplateConfig = {
  name: 'minimal',
  displayName: '极简',
  description: '简洁纯文字风格',
  defaultSize: { width: 800, height: 'auto' },
  styles: {
    container: 'flex flex-col p-16 bg-white min-h-[400px]',
    title: 'text-4xl font-light text-gray-900 tracking-tight',
    subtitle: 'text-xl text-gray-400 mt-4 font-light',
    body: 'text-lg text-gray-600 mt-12 leading-relaxed font-light',
    image: 'hidden',
    footer: 'text-sm text-gray-300 mt-auto pt-12',
    items: 'mt-8 space-y-3',
    item: 'text-gray-600 font-light before:content-["·"] before:mr-3 before:text-gray-300',
    author: 'text-base text-gray-400 mt-8 font-light',
    date: 'text-sm text-gray-300 mt-2',
    logo: 'h-6 mb-8 opacity-50',
    qrcode: 'w-16 h-16 mt-8 opacity-50',
  },
};

/**
 * 所有模板配置
 */
export const templates: Record<PosterTemplate, TemplateConfig> = {
  card: cardTemplate,
  social: socialTemplate,
  quote: quoteTemplate,
  list: listTemplate,
  minimal: minimalTemplate,
};

/**
 * 获取模板配置
 */
export function getTemplate(name: PosterTemplate): TemplateConfig {
  return templates[name] || templates.minimal;
}

/**
 * 获取所有模板列表
 */
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templates);
}
