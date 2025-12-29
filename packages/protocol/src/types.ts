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
  | "table";

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
  type: ElementType;
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

export type Element =
  | HeadingElement
  | TextElement
  | ListElement
  | ImageElement
  | CodeElement
  | ChartElement
  | ShapeElement
  | VideoElement
  | TableElement;


// ============================================
// 页面定义
// ============================================

export interface Slide {
  id?: string;
  type: SlideType;
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
