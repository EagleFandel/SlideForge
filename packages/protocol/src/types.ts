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

// ============================================
// SlideForge Protocol v1.0 - Type Definitions
// ============================================

/** 协议版本 */
export type ProtocolVersion = "1.0";

/** 宽高比 */
export type AspectRatio = "16:9" | "4:3";

/** 页面类型 */
export type SlideType =
  | "title"
  | "section"
  | "content"
  | "image"
  | "code"
  | "comparison"
  | "timeline"
  | "quote"
  | "blank";

/** 
 * 页面语义角色 (AI-Native)
 * 帮助 AI 理解这一页在叙事结构中的作用
 */
export type SlideRole =
  | "hook"        // 开场吸引注意力
  | "agenda"      // 议程/目录
  | "problem"     // 痛点/问题陈述
  | "solution"    // 解决方案
  | "feature"     // 功能/特性介绍
  | "demo"        // 演示/示例
  | "case"        // 案例/故事
  | "data"        // 数据/证据
  | "comparison"  // 对比
  | "summary"     // 总结/回顾
  | "cta";        // 行动号召

/** 元素类型 */
export type ElementType =
  | "heading"
  | "text"
  | "list"
  | "image"
  | "code"
  | "chart"
  | "shape"
  | "video"
  | "table"
  | "quote";

/** 动画类型 */
export type AnimationType =
  | "none"
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "zoomIn"
  | "zoomOut"
  | "slideInLeft"
  | "slideInRight"
  | "slideInUp"
  | "slideInDown"
  | "typewriter"
  | "highlight"
  | "bounce";

/** 过渡类型 */
export type TransitionType = "none" | "fade" | "slide" | "zoom" | "flip";

/** 方向 */
export type Direction = "left" | "right" | "up" | "down";

/** 对齐方式 */
export type Alignment = "left" | "center" | "right";

/** 触发方式 */
export type AnimationTrigger = "auto" | "click" | "sequence";

// ============================================
// 动画与过渡
// ============================================

export interface Animation {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  trigger?: AnimationTrigger;
}

export interface TransitionConfig {
  type: TransitionType;
  duration?: number;
  direction?: Direction;
}


// ============================================
// 背景与位置
// ============================================

export interface Background {
  type: "color" | "gradient" | "image";
  value: string;
  opacity?: number;
}

export interface Position {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  column?: 1 | 2 | 3;
}

// ============================================
// 元素定义
// ============================================

export interface BaseElement {
  id?: string;
  type: string;                         // string 而非 enum，支持插件扩展
  namespace?: string;                   // 插件命名空间 (e.g. "plugin.chart3d")
  position?: Position;
  animation?: Animation;
  style?: Record<string, string>;
}

export interface HeadingElement extends BaseElement {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  align?: Alignment;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  align?: Alignment;
  fontSize?: string;
}

export interface ListItem {
  text: string;
  icon?: string;
}

export interface ListElement extends BaseElement {
  type: "list";
  items: (string | ListItem)[];
  ordered?: boolean;
  columns?: 1 | 2 | 3;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt?: string;
  fit?: "cover" | "contain" | "fill";
  caption?: string;
}

export interface CodeElement extends BaseElement {
  type: "code";
  language: string;
  content: string;
  highlight?: number[];
  showLineNumbers?: boolean;
}

export interface ChartElement extends BaseElement {
  type: "chart";
  chartType: "bar" | "line" | "pie" | "doughnut";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shapeType: "rectangle" | "circle" | "triangle" | "arrow";
  fill?: string;
  stroke?: string;
  text?: string;
}

export interface VideoElement extends BaseElement {
  type: "video";
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

export interface TableElement extends BaseElement {
  type: "table";
  headers: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
}

export interface QuoteElement extends BaseElement {
  type: "quote";
  text: string;
  author?: string;
  source?: string;
}

export type Element =
  | HeadingElement
  | TextElement
  | ListElement
  | ImageElement
  | CodeElement
  | ChartElement
  | ShapeElement
  | VideoElement
  | TableElement
  | QuoteElement;


// ============================================
// 页面定义
// ============================================

export interface Slide {
  id?: string;
  type: SlideType;
  /** 
   * 语义角色 (AI-Native)
   * 帮助 AI 理解这一页在叙事结构中的作用
   * Runtime 可忽略，不影响渲染
   */
  role?: SlideRole;
  layout?: string;
  background?: Background;
  transition?: TransitionConfig;
  elements: Element[];
  notes?: string;
}

// ============================================
// 文档定义
// ============================================

export interface FontConfig {
  heading?: string;
  body?: string;
  code?: string;
}

export interface SlideConfig {
  theme: string;
  aspectRatio: AspectRatio;
  transition?: TransitionConfig;
  fonts?: FontConfig;
}

export interface SlideMetadata {
  id?: string;
  title: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  tags?: string[];
}

export interface SlideDocument {
  version: ProtocolVersion;
  metadata: SlideMetadata;
  config: SlideConfig;
  slides: Slide[];
}

// ============================================
// 布局模板
// ============================================

export type LayoutTemplate =
  | "default"
  | "title-center"
  | "two-column"
  | "three-column"
  | "image-left"
  | "image-right"
  | "image-full"
  | "split-horizontal";


// ============================================
// Poster 文档定义
// ============================================

/** Poster 模板类型 */
export type PosterTemplate = 
  | "card"      // 卡片式
  | "social"    // 社交分享
  | "quote"     // 引用卡片
  | "list"      // 列表式
  | "minimal";  // 极简

/** Poster 配置 */
export interface PosterConfig {
  template: PosterTemplate;
  theme: string;
  size: {
    width: number;
    height: number | "auto";
  };
  background?: Background;
  padding?: number;
  borderRadius?: number;
}

/** Poster 内容 */
export interface PosterContent {
  /** Markdown 原文（二选一） */
  markdown?: string;
  
  /** 结构化内容（二选一） */
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  footer?: string;
  qrcode?: string;
  
  /** 元数据 */
  author?: string;
  date?: string;
  logo?: string;
}

/** Poster 文档 */
export interface PosterDocument {
  version: ProtocolVersion;
  type: "poster";
  metadata: {
    title?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  config: PosterConfig;
  content: PosterContent;
}

/** 统一文档类型 */
export type SlideForgeDocument = SlideDocument | PosterDocument;
