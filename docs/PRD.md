# SlideForge PRD

> 面向 AI 的 Slides 协议框架 + Runtime

---

## 目录

1. [产品概述](#1-产品概述)
2. [协议规范](#2-协议规范)
3. [核心功能](#3-核心功能)
4. [技术架构](#4-技术架构)
5. [AI 集成](#5-ai-集成)
6. [主题系统](#6-主题系统)
7. [非功能性需求](#7-非功能性需求)
8. [路线图](#8-路线图)
9. [竞品分析](#9-竞品分析)
10. [开源策略](#10-开源策略)
11. [附录](#11-附录)

---

## 1. 产品概述

### 1.1 产品定位

SlideForge 是一个开源的、面向 AI 的 HTML Slides 协议框架 + Runtime。

**一句话描述**: 让 AI 生成的演示文稿可演示、可管理、可导出。

### 1.2 解决的问题

| 现状痛点 | SlideForge 方案 |
|---------|----------------|
| AI 生成 PPT 格式不统一 | 标准化 JSON 协议 |
| 生成结果难以预览 | 内置 Runtime 渲染引擎 |
| 无法在线演示 | Web 演示器 + 动画支持 |
| 导出格式受限 | PDF / HTML / 图片多格式导出 |
| 多个 Slides 难以管理 | 平台化项目管理 |

### 1.3 核心价值

```
┌─────────────────────────────────────────────────────────────┐
│                     SlideForge 核心价值                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🤖 AI-First        标准化协议，降低 AI 生成复杂度          │
│                                                             │
│   📦 开箱即用        内置主题、动画、布局模板                │
│                                                             │
│   🎬 在线演示        全屏演示 + 演讲者模式 + 动画效果        │
│                                                             │
│   📤 多格式导出      PDF / HTML / PNG 一键导出              │
│                                                             │
│   🗂️ 平台管理        统一管理多个 Slides 项目               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 目标用户

| 用户类型 | 使用场景 | 核心需求 |
|---------|---------|---------|
| AI 应用开发者 | 集成 Slides 生成能力到产品 | 协议文档、SDK、API |
| 内容创作者 | 通过 AI 快速生成演示文稿 | 易用的 Web 平台 |
| 企业用户 | 批量生成标准化演示材料 | 模板管理、品牌定制 |
| 开发者 | 二次开发、自定义主题 | 源码、插件机制 |

---

## 2. 协议规范

### 2.1 设计原则

- **简洁**: 最小化必填字段，降低 AI 生成难度
- **可扩展**: 支持自定义元素和属性
- **可验证**: 提供 JSON Schema，支持严格校验
- **语义化**: 字段命名清晰，AI 易于理解

### 2.2 文档结构 (SlideDocument)

```typescript
interface SlideDocument {
  // 协议版本
  version: "1.0";
  
  // 文档元数据
  metadata: {
    id?: string;                        // 文档唯一标识
    title: string;                      // 文档标题
    author?: string;                    // 作者
    createdAt?: string;                 // 创建时间 (ISO 8601)
    updatedAt?: string;                 // 更新时间
    description?: string;               // 文档描述
    tags?: string[];                    // 标签
  };
  
  // 全局配置
  config: {
    theme: string;                      // 主题名称
    aspectRatio: "16:9" | "4:3";        // 宽高比
    transition?: TransitionConfig;      // 默认页面切换动画
    fonts?: FontConfig;                 // 自定义字体
  };
  
  // 页面列表
  slides: Slide[];
}
```

### 2.3 页面结构 (Slide)

```typescript
interface Slide {
  id?: string;                          // 页面唯一标识
  type: SlideType;                      // 页面类型
  layout?: string;                      // 布局模板
  background?: Background;              // 页面背景
  transition?: TransitionConfig;        // 页面切换动画 (覆盖全局)
  elements: Element[];                  // 页面元素
  notes?: string;                       // 演讲者备注
}

type SlideType = 
  | "title"       // 标题页
  | "section"     // 章节页
  | "content"     // 内容页
  | "image"       // 图片页
  | "code"        // 代码页
  | "comparison"  // 对比页
  | "timeline"    // 时间线页
  | "quote"       // 引用页
  | "blank";      // 空白页

interface Background {
  type: "color" | "gradient" | "image";
  value: string;                        // 颜色值 / 渐变 / 图片URL
  opacity?: number;                     // 透明度 0-1
}
```

### 2.4 元素类型 (Element)

```typescript
type Element = 
  | HeadingElement
  | TextElement
  | ListElement
  | ImageElement
  | CodeElement
  | ChartElement
  | ShapeElement
  | VideoElement
  | TableElement;

// 基础元素属性
interface BaseElement {
  id?: string;                          // 元素唯一标识
  position?: Position;                  // 位置 (可选，默认自动布局)
  animation?: Animation;                // 入场动画
  style?: Record<string, string>;       // 自定义样式
}

// 位置定义
interface Position {
  x?: number | string;                  // 水平位置 (px 或 %)
  y?: number | string;                  // 垂直位置
  width?: number | string;              // 宽度
  height?: number | string;             // 高度
  column?: 1 | 2;                       // 多列布局时的列号
}
```

### 2.5 元素详细定义

| 元素类型 | 必填属性 | 可选属性 |
|---------|---------|---------|
| heading | `level` (1-6), `text` | `align`, `color` |
| text | `content` | `align`, `fontSize`, `lineHeight` |
| list | `items[]` | `ordered`, `icon`, `columns` |
| image | `src` | `alt`, `fit`, `caption` |
| code | `content`, `language` | `highlight[]`, `showLineNumbers` |
| chart | `chartType`, `data` | `options`, `title` |
| shape | `shapeType` | `fill`, `stroke`, `text` |
| video | `src` | `autoplay`, `controls`, `loop` |
| table | `headers[]`, `rows[][]` | `striped`, `bordered` |

```typescript
// 示例：标题元素
interface HeadingElement extends BaseElement {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  align?: "left" | "center" | "right";
}

// 示例：列表元素
interface ListElement extends BaseElement {
  type: "list";
  items: (string | { text: string; icon?: string })[];
  ordered?: boolean;
  columns?: 1 | 2 | 3;
}

// 示例：代码元素
interface CodeElement extends BaseElement {
  type: "code";
  language: string;
  content: string;
  highlight?: number[];                 // 高亮行号
  showLineNumbers?: boolean;
}
```

### 2.6 动画系统

```typescript
interface Animation {
  type: AnimationType;
  duration?: number;                    // 持续时间 (ms)，默认 500
  delay?: number;                       // 延迟 (ms)，默认 0
  easing?: string;                      // 缓动函数，默认 "ease-out"
  trigger?: "auto" | "click" | "sequence"; // 触发方式
}

type AnimationType =
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

interface TransitionConfig {
  type: "none" | "fade" | "slide" | "zoom" | "flip";
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
}
```

### 2.7 布局模板

| 布局名称 | 描述 | 适用场景 |
|---------|------|---------|
| `default` | 单列居中 | 通用内容 |
| `title-center` | 标题居中 | 标题页、章节页 |
| `two-column` | 左右两列 | 对比、图文 |
| `three-column` | 三列等宽 | 多项并列 |
| `image-left` | 左图右文 | 图文混排 |
| `image-right` | 左文右图 | 图文混排 |
| `image-full` | 全屏图片 | 视觉冲击 |
| `split-horizontal` | 上下分割 | 对比展示 |

---

## 3. 核心功能

### 3.1 功能模块总览

```
┌─────────────────────────────────────────────────────────────┐
│                    SlideForge 功能模块                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   渲染引擎   │  │   演示系统   │  │   导出系统   │         │
│  │   Runtime   │  │  Presenter  │  │   Export    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   项目管理   │  │   资源管理   │  │   主题系统   │         │
│  │   Project   │  │   Assets    │  │   Themes    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 渲染引擎 (Runtime)

**职责**: 将协议 JSON 解析并渲染为可交互的 HTML

| 子模块 | 功能 |
|-------|------|
| Parser | 解析 JSON，校验协议合规性 |
| Renderer | 生成 HTML/CSS，应用主题样式 |
| Animation Engine | 管理元素动画和页面切换 |
| Layout Engine | 计算元素位置，响应式适配 |

```typescript
// Runtime API 示例
import { SlideForgeRuntime } from '@slideforge/runtime';

const runtime = new SlideForgeRuntime({
  container: document.getElementById('slides'),
  theme: 'default',
});

runtime.load(slideDocument);
runtime.render();
runtime.goTo(2);           // 跳转到第 2 页
runtime.next();            // 下一页/下一动画
runtime.previous();        // 上一页
```

### 3.3 演示系统 (Presenter)

**职责**: 提供完整的演示体验

#### 3.3.1 演示模式

| 模式 | 描述 | 快捷键 |
|-----|------|-------|
| 普通模式 | 标准演示视图 | `F` 全屏 |
| 演讲者模式 | 备注 + 计时 + 预览 | `S` |
| 概览模式 | 缩略图网格 | `O` |

#### 3.3.2 导航控制

| 操作 | 键盘 | 触控 |
|-----|------|------|
| 下一页/动画 | `→` `↓` `Space` `Enter` | 左滑 / 点击右侧 |
| 上一页 | `←` `↑` `Backspace` | 右滑 / 点击左侧 |
| 跳转到页 | `G` + 页码 | 概览模式点击 |
| 首页 | `Home` | - |
| 末页 | `End` | - |

#### 3.3.3 演讲者工具

- ⏱️ 计时器 (已用时间 / 预计时间)
- 📝 演讲者备注显示
- 🔍 当前页 + 下一页预览
- 🖊️ 激光笔 / 画笔标注
- 🔊 音量控制 (视频页面)

### 3.4 导出系统 (Export)

| 格式 | 说明 | 实现方式 |
|-----|------|---------|
| PDF | 高质量打印版 | Puppeteer 服务端渲染 |
| HTML | 可离线演示的静态包 | 打包 Runtime + 数据 |
| PNG/JPG | 图片序列 | Puppeteer 截图 |
| JSON | 协议源文件 | 直接导出 |

**PDF 导出选项**:
```typescript
interface PDFExportOptions {
  format?: "A4" | "16:9" | "4:3";       // 页面尺寸
  quality?: "draft" | "standard" | "high";
  includeNotes?: boolean;               // 包含演讲者备注
  notesPosition?: "below" | "right" | "separate";
}
```

### 3.5 项目管理 (Project)

| 功能 | 描述 |
|-----|------|
| 创建项目 | 从空白 / 模板 / 导入 JSON 创建 |
| 项目列表 | 卡片视图，支持搜索、筛选、排序 |
| 分类标签 | 自定义标签，项目分组 |
| 版本历史 | 自动保存，版本回滚 |
| 复制/删除 | 项目复制、批量删除 |

### 3.6 资源管理 (Assets)

| 资源类型 | 支持格式 | 存储方式 |
|---------|---------|---------|
| 图片 | PNG, JPG, SVG, WebP, GIF | IndexedDB / 云存储 |
| 视频 | MP4, WebM | 外链 / 云存储 |
| 字体 | WOFF2, TTF | 本地上传 |
| 主题 | CSS | 本地 / 导入 |

---

## 4. 技术架构

### 4.1 技术栈

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| 框架 | Next.js 14+ (App Router) | SSR/SSG，API Routes |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS + CSS Variables | 原子化 + 主题变量 |
| 状态 | Zustand | 轻量状态管理 |
| 动画 | Framer Motion | React 动画库 |
| 本地存储 | Dexie.js (IndexedDB) | 离线数据持久化 |
| PDF 导出 | Puppeteer | 服务端高质量渲染 |
| 包管理 | pnpm + Turborepo | Monorepo 管理 |
| 部署 | Vercel / Docker | 云端 / 自托管 |

### 4.2 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户界面层                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────── Next.js App ───────────────────┐       │
│    │                                                    │       │
│    │  /                     首页 & 项目列表             │       │
│    │  /slides/new           新建 Slides                │       │
│    │  /slides/[id]          编辑器                     │       │
│    │  /slides/[id]/present  演示模式                   │       │
│    │  /slides/[id]/speaker  演讲者模式                 │       │
│    │  /themes               主题管理                   │       │
│    │  /settings             设置                       │       │
│    │                                                    │       │
│    └────────────────────────────────────────────────────┘       │
│                              │                                  │
├──────────────────────────────┼──────────────────────────────────┤
│                        API 层                                   │
├──────────────────────────────┼──────────────────────────────────┤
│    │                                                            │
│    │  /api/validate         协议校验                            │
│    │  /api/export/pdf       PDF 导出                            │
│    │  /api/export/html      HTML 打包导出                       │
│    │  /api/export/images    图片序列导出                        │
│    │                                                            │
├─────────────────────────────────────────────────────────────────┤
│                        核心包层 (NPM Packages)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ @slideforge/     │  │ @slideforge/     │  │ @slideforge/ │  │
│  │ runtime          │  │ protocol         │  │ themes       │  │
│  │                  │  │                  │  │              │  │
│  │ • Parser         │  │ • TypeScript     │  │ • default    │  │
│  │ • Renderer       │  │   Types          │  │ • corporate  │  │
│  │ • Animation      │  │ • JSON Schema    │  │ • dark       │  │
│  │ • Layout         │  │ • Validator      │  │ • minimal    │  │
│  │ • React Bindings │  │ • Utils          │  │ • ...        │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 目录结构

```
slideforge/
│
├── apps/
│   └── web/                          # Next.js 主应用
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # 首页
│       │   ├── slides/
│       │   │   ├── new/page.tsx      # 新建
│       │   │   └── [id]/
│       │   │       ├── page.tsx      # 编辑器
│       │   │       ├── present/page.tsx
│       │   │       └── speaker/page.tsx
│       │   ├── themes/page.tsx
│       │   ├── settings/page.tsx
│       │   └── api/
│       │       ├── validate/route.ts
│       │       └── export/
│       │           ├── pdf/route.ts
│       │           ├── html/route.ts
│       │           └── images/route.ts
│       │
│       ├── components/
│       │   ├── slides/               # Slides 渲染组件
│       │   │   ├── SlideCanvas.tsx
│       │   │   ├── SlideElement.tsx
│       │   │   └── elements/         # 各元素类型组件
│       │   ├── presenter/            # 演示相关组件
│       │   │   ├── PresenterView.tsx
│       │   │   ├── SpeakerView.tsx
│       │   │   └── Controls.tsx
│       │   ├── editor/               # 编辑器组件 (v2)
│       │   └── ui/                   # 通用 UI 组件
│       │
│       ├── lib/
│       │   ├── store/                # Zustand stores
│       │   │   ├── slides.ts
│       │   │   └── presenter.ts
│       │   ├── db/                   # IndexedDB
│       │   │   ├── index.ts
│       │   │   └── schemas.ts
│       │   └── hooks/                # 自定义 Hooks
│       │
│       └── styles/
│           └── globals.css
│
├── packages/
│   ├── protocol/                     # 协议定义包
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types.ts              # TypeScript 类型
│   │   │   ├── schema.json           # JSON Schema
│   │   │   ├── validator.ts          # 校验器
│   │   │   └── utils.ts              # 工具函数
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── runtime/                      # 渲染引擎包
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── parser.ts
│   │   │   ├── renderer.ts
│   │   │   ├── animation.ts
│   │   │   ├── layout.ts
│   │   │   └── react/                # React 绑定
│   │   │       ├── index.ts
│   │   │       ├── SlideForgeProvider.tsx
│   │   │       └── useSlideForge.ts
│   │   └── package.json
│   │
│   └── themes/                       # 主题包
│       ├── src/
│       │   ├── index.ts
│       │   ├── default.css
│       │   ├── corporate.css
│       │   ├── dark.css
│       │   ├── minimal.css
│       │   ├── academic.css
│       │   └── creative.css
│       └── package.json
│
├── docs/                             # 文档
│   ├── PRD.md
│   ├── protocol.md                   # 协议详细文档
│   └── api.md                        # API 文档
│
├── examples/                         # 示例
│   ├── basic.json
│   ├── with-animations.json
│   └── full-featured.json
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### 4.4 数据流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   AI 生成   │────▶│  JSON 协议  │────▶│   校验器    │
│  / 用户输入 │     │ SlideDoc    │     │  Validator  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┘
                         ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   IndexedDB │◀───▶│   Zustand   │◀───▶│  React 组件 │
│   持久化    │     │   Store     │     │   渲染      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┘
                         ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    PDF      │     │    HTML     │     │    PNG      │
│   导出      │◀────│   渲染      │────▶│   截图      │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 4.5 关键技术决策

| 决策 | 选择 | 备选方案 | 选择理由 |
|-----|------|---------|---------|
| 前端框架 | Next.js 14 | Remix, Nuxt | App Router 成熟，Vercel 部署便捷 |
| 状态管理 | Zustand | Redux, Jotai | 轻量，TS 友好，无 boilerplate |
| 动画库 | Framer Motion | GSAP, anime.js | React 生态最佳，声明式 API |
| PDF 导出 | Puppeteer | jsPDF, react-pdf | 渲染质量最高，与预览一致 |
| 本地存储 | Dexie.js | localForage | IndexedDB 封装最佳，支持复杂查询 |
| Monorepo | Turborepo | Nx, Lerna | 配置简单，构建缓存高效 |

---

## 5. AI 集成

### 5.1 集成方式

```
┌─────────────────────────────────────────────────────────────┐
│                     AI 集成方式                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  方式 1: 直接生成 JSON                                       │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │   AI    │────▶│  JSON   │────▶│ Runtime │              │
│  │  Model  │     │ 协议    │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  方式 2: MCP Server                                         │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │   AI    │────▶│   MCP   │────▶│ Runtime │              │
│  │  Agent  │     │ Server  │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  方式 3: REST API                                           │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │  应用   │────▶│   API   │────▶│ Runtime │              │
│  │ 后端    │     │ Server  │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Prompt 模板

```markdown
# SlideForge 演示文稿生成

你是一个专业的演示文稿生成助手。请根据用户需求生成符合 SlideForge 协议的 JSON。

## 协议版本
SlideForge Protocol v1.0

## 输出要求
1. 输出纯 JSON，无 markdown 代码块包裹
2. 必须包含 version, metadata, config, slides 字段
3. 每页 slides 必须有 type 和 elements
4. 合理使用动画，避免过度

## 可用页面类型
title, section, content, image, code, comparison, timeline, quote, blank

## 可用元素类型
heading, text, list, image, code, chart, shape, video, table

## 可用动画类型
fadeIn, fadeInUp, slideInLeft, slideInRight, zoomIn, typewriter

## 用户需求
{user_input}
```

### 5.3 MCP Server

```typescript
// MCP Server 工具定义
const tools = {
  // 创建完整演示文稿
  create_presentation: {
    description: "创建一个完整的 SlideForge 演示文稿",
    parameters: {
      title: { type: "string", required: true },
      theme: { type: "string", default: "default" },
      slides: { type: "array", required: true }
    }
  },
  
  // 添加单页
  add_slide: {
    description: "向演示文稿添加一页",
    parameters: {
      type: { type: "string", required: true },
      elements: { type: "array", required: true },
      layout: { type: "string" },
      notes: { type: "string" }
    }
  },
  
  // 设置主题
  set_theme: {
    description: "设置演示文稿主题",
    parameters: {
      theme: { type: "string", required: true }
    }
  },
  
  // 导出 PDF
  export_pdf: {
    description: "导出演示文稿为 PDF",
    parameters: {
      quality: { type: "string", enum: ["draft", "standard", "high"] },
      includeNotes: { type: "boolean" }
    }
  },
  
  // 验证协议
  validate: {
    description: "验证 SlideForge JSON 协议合规性",
    parameters: {
      document: { type: "object", required: true }
    }
  }
};
```

### 5.4 REST API

| 端点 | 方法 | 描述 |
|-----|------|------|
| `/api/validate` | POST | 验证协议合规性 |
| `/api/export/pdf` | POST | 导出 PDF |
| `/api/export/html` | POST | 导出静态 HTML |
| `/api/export/images` | POST | 导出图片序列 |

```typescript
// POST /api/validate
// Request
{ "document": SlideDocument }
// Response
{ 
  "valid": boolean,
  "errors": Array<{
    "path": string,
    "message": string,
    "code": string
  }>
}

// POST /api/export/pdf
// Request
{ 
  "document": SlideDocument,
  "options": PDFExportOptions
}
// Response
{ "downloadUrl": string, "expiresAt": string }
```

---

## 6. 主题系统

### 6.1 内置主题

| 主题 | 风格 | 配色 | 适用场景 |
|-----|------|------|---------|
| `default` | 简洁现代 | 蓝白 | 通用 |
| `corporate` | 商务专业 | 深蓝灰 | 企业汇报 |
| `creative` | 创意活泼 | 多彩渐变 | 产品发布 |
| `academic` | 学术严谨 | 黑白蓝 | 论文答辩 |
| `dark` | 深色科技 | 深灰亮色 | 技术分享 |
| `minimal` | 极简留白 | 黑白 | 艺术展示 |

### 6.2 主题变量

```css
/* 主题 CSS 变量规范 */
:root {
  /* 颜色 */
  --sf-color-primary: #3b82f6;
  --sf-color-secondary: #64748b;
  --sf-color-accent: #f59e0b;
  --sf-color-background: #ffffff;
  --sf-color-surface: #f8fafc;
  --sf-color-text: #1e293b;
  --sf-color-text-muted: #64748b;
  --sf-color-border: #e2e8f0;
  
  /* 字体 */
  --sf-font-heading: 'Inter', system-ui, sans-serif;
  --sf-font-body: 'Inter', system-ui, sans-serif;
  --sf-font-code: 'Fira Code', 'Consolas', monospace;
  
  /* 字号 */
  --sf-font-size-h1: 3.5rem;
  --sf-font-size-h2: 2.5rem;
  --sf-font-size-h3: 1.75rem;
  --sf-font-size-body: 1.25rem;
  --sf-font-size-small: 1rem;
  
  /* 间距 */
  --sf-spacing-page: 4rem;
  --sf-spacing-element: 1.5rem;
  
  /* 圆角 */
  --sf-radius-sm: 4px;
  --sf-radius-md: 8px;
  --sf-radius-lg: 16px;
  
  /* 阴影 */
  --sf-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --sf-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --sf-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 6.3 自定义主题

```typescript
// 主题配置文件
interface ThemeConfig {
  name: string;
  displayName: string;
  description?: string;
  variables: Record<string, string>;
  fonts?: {
    heading?: string;
    body?: string;
    code?: string;
  };
  customCSS?: string;
}

// 示例：自定义主题
const myTheme: ThemeConfig = {
  name: "my-brand",
  displayName: "My Brand Theme",
  variables: {
    "--sf-color-primary": "#ff6b00",
    "--sf-color-background": "#fafafa",
  },
  fonts: {
    heading: "Poppins",
  }
};
```

---

## 7. 非功能性需求

### 7.1 性能要求

| 指标 | 目标 | 测量方式 |
|-----|------|---------|
| 首屏加载 | < 2s (3G) | Lighthouse |
| 页面切换 | < 100ms | Performance API |
| 动画帧率 | 60fps | Chrome DevTools |
| PDF 导出 (10页) | < 10s | 服务端日志 |
| 内存占用 | < 200MB (50页) | Chrome Task Manager |

### 7.2 浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|-------|---------|------|
| Chrome | 90+ | 主要支持 |
| Firefox | 90+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| Edge | 90+ | 完全支持 |
| Mobile Safari | iOS 14+ | 触控优化 |
| Chrome Android | 90+ | 触控优化 |

### 7.3 无障碍 (Accessibility)

| 要求 | 实现方式 |
|-----|---------|
| 键盘导航 | 所有功能可通过键盘操作 |
| 屏幕阅读器 | 语义化 HTML，ARIA 标签 |
| 颜色对比度 | WCAG 2.1 AA 标准 |
| 焦点指示 | 清晰的焦点样式 |
| 字体缩放 | 支持浏览器字体缩放 |

### 7.4 国际化 (i18n)

| 范围 | 支持语言 |
|-----|---------|
| 界面文案 | 中文、英文 (MVP) |
| 日期格式 | 跟随系统 locale |
| RTL 布局 | v2 支持 |

### 7.5 安全性

| 风险 | 防护措施 |
|-----|---------|
| XSS | 内容转义，CSP 策略 |
| 恶意文件上传 | 文件类型校验，大小限制 |
| 数据泄露 | 本地存储加密 (可选) |
| API 滥用 | 速率限制，认证 (云端版) |

### 7.6 错误处理

```typescript
// 错误类型定义
enum ErrorCode {
  // 协议错误 (1xxx)
  INVALID_PROTOCOL = 1001,
  MISSING_REQUIRED_FIELD = 1002,
  INVALID_ELEMENT_TYPE = 1003,
  
  // 渲染错误 (2xxx)
  RENDER_FAILED = 2001,
  ANIMATION_ERROR = 2002,
  LAYOUT_ERROR = 2003,
  
  // 导出错误 (3xxx)
  EXPORT_FAILED = 3001,
  PDF_GENERATION_ERROR = 3002,
  
  // 存储错误 (4xxx)
  STORAGE_FULL = 4001,
  SAVE_FAILED = 4002,
  LOAD_FAILED = 4003,
}

// 错误响应格式
interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  suggestion?: string;
}
```

---

## 8. 路线图

### Phase 1: MVP (4 周)

**目标**: 可用的演示 + 导出功能

| 周 | 任务 |
|---|------|
| W1 | 项目初始化，Monorepo 搭建，协议类型定义 |
| W2 | Runtime 核心：Parser + Renderer + 基础布局 |
| W3 | 演示系统：导航控制 + 全屏 + 基础动画 |
| W4 | PDF 导出 + 3 个内置主题 + 示例 |

**交付物**:
- `@slideforge/protocol` v0.1
- `@slideforge/runtime` v0.1
- `@slideforge/themes` v0.1
- Web 应用 (演示 + 导出)
- 文档站点

### Phase 2: 平台化 (4 周)

**目标**: 完整的项目管理平台

| 周 | 任务 |
|---|------|
| W5 | 项目管理：创建、列表、删除、搜索 |
| W6 | 资源管理：图片上传、管理 |
| W7 | 演讲者模式 + 更多动画效果 |
| W8 | 更多主题 + 布局模板 + CLI 工具 |

**交付物**:
- 完整项目管理功能
- 演讲者模式
- 6 个内置主题
- `@slideforge/cli` v0.1

### Phase 3: AI 增强 (4 周)

**目标**: AI 生成能力集成

| 周 | 任务 |
|---|------|
| W9 | MCP Server 开发 |
| W10 | Prompt 模板库 + 协议文档完善 |
| W11 | AI 生成预览 + 错误提示优化 |
| W12 | 智能布局建议 + 内容优化建议 |

**交付物**:
- `@slideforge/mcp-server` v0.1
- Prompt 模板库
- AI 集成文档

### Phase 4: 协作 & 生态 (4 周)

**目标**: 协作功能 + 社区生态

| 周 | 任务 |
|---|------|
| W13 | 云端存储 + 用户系统 |
| W14 | 分享链接 + 嵌入功能 |
| W15 | 评论批注 + 版本对比 |
| W16 | 插件系统 + 社区主题市场 |

**交付物**:
- 云端版本
- 协作功能
- 插件系统

---

## 9. 竞品分析

### 9.1 竞品对比

| 特性 | SlideForge | reveal.js | Slidev | Marp | Google Slides API |
|-----|------------|-----------|--------|------|-------------------|
| AI 优化协议 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 结构化 JSON | ✅ | ❌ | ❌ | ❌ | ✅ |
| 在线演示 | ✅ | ✅ | ✅ | ✅ | ✅ |
| PDF 导出 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 演讲者模式 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 项目管理 | ✅ | ❌ | ❌ | ❌ | ✅ |
| 开源 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 学习成本 | 低 | 中 | 中 | 低 | 高 |
| 定制灵活性 | 高 | 高 | 中 | 低 | 中 |

### 9.2 差异化定位

```
┌─────────────────────────────────────────────────────────────┐
│                     竞品定位图                               │
│                                                             │
│         开发者友好                                           │
│              ▲                                              │
│              │     ┌─────────┐                              │
│              │     │ Slidev  │                              │
│              │     └─────────┘                              │
│              │                    ┌───────────┐             │
│              │                    │SlideForge │ ◀── AI优化  │
│              │  ┌─────────┐      └───────────┘             │
│              │  │reveal.js│                                 │
│              │  └─────────┘                                 │
│              │                                              │
│  简单 ───────┼──────────────────────────────────▶ 功能丰富  │
│              │                                              │
│              │  ┌─────────┐                                 │
│              │  │  Marp   │                                 │
│              │  └─────────┘      ┌─────────────┐           │
│              │                    │Google Slides│           │
│              │                    │    API      │           │
│              │                    └─────────────┘           │
│              ▼                                              │
│         用户友好                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 SlideForge 核心优势

1. **AI-First 协议设计**
   - 结构化 JSON 比 Markdown 更适合 AI 生成
   - 严格的 Schema 校验，减少生成错误
   - 语义化字段命名，AI 易于理解

2. **开箱即用的平台**
   - 不只是库，而是完整的管理平台
   - 无需搭建环境，直接使用

3. **现代技术栈**
   - Next.js 14 + TypeScript
   - 性能优化，体验流畅

---

## 10. 开源策略

### 10.1 开源协议

- **核心包**: MIT License
- **主题包**: MIT License
- **Web 应用**: MIT License

### 10.2 仓库结构

```
GitHub: slideforge/slideforge (Monorepo)
├── 核心代码
├── 文档
├── 示例
└── 社区贡献指南
```

### 10.3 社区建设

| 渠道 | 用途 |
|-----|------|
| GitHub Discussions | 问答、功能讨论 |
| GitHub Issues | Bug 报告、功能请求 |
| Discord | 实时交流 |
| 文档站点 | 教程、API 文档 |

### 10.4 贡献指南

- `CONTRIBUTING.md` - 贡献流程
- `CODE_OF_CONDUCT.md` - 行为准则
- Issue/PR 模板
- 自动化 CI/CD

### 10.5 成功指标

| 指标 | 6 个月目标 | 12 个月目标 |
|-----|-----------|------------|
| GitHub Stars | 1,000 | 5,000 |
| NPM 周下载 | 500 | 2,000 |
| 贡献者数量 | 10 | 50 |
| Discord 成员 | 100 | 500 |

---

## 11. 附录

### 11.1 完整协议示例

```json
{
  "version": "1.0",
  "metadata": {
    "id": "intro-slideforge",
    "title": "SlideForge 介绍",
    "author": "SlideForge Team",
    "createdAt": "2024-01-15T10:00:00Z",
    "description": "SlideForge 项目介绍演示文稿",
    "tags": ["介绍", "产品"]
  },
  "config": {
    "theme": "default",
    "aspectRatio": "16:9",
    "transition": {
      "type": "fade",
      "duration": 300
    }
  },
  "slides": [
    {
      "id": "slide-1",
      "type": "title",
      "layout": "title-center",
      "background": {
        "type": "gradient",
        "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      },
      "elements": [
        {
          "id": "title",
          "type": "heading",
          "level": 1,
          "text": "SlideForge",
          "animation": {
            "type": "fadeInUp",
            "duration": 600
          }
        },
        {
          "id": "subtitle",
          "type": "text",
          "content": "面向 AI 的 Slides 协议框架",
          "animation": {
            "type": "fadeInUp",
            "duration": 600,
            "delay": 200
          }
        }
      ],
      "notes": "欢迎大家，今天介绍 SlideForge 项目"
    },
    {
      "id": "slide-2",
      "type": "content",
      "layout": "two-column",
      "elements": [
        {
          "id": "heading",
          "type": "heading",
          "level": 2,
          "text": "核心特性"
        },
        {
          "id": "features-left",
          "type": "list",
          "position": { "column": 1 },
          "items": [
            { "text": "AI-First 协议设计", "icon": "🤖" },
            { "text": "标准化 JSON 格式", "icon": "📋" },
            { "text": "丰富的动画效果", "icon": "✨" }
          ],
          "animation": {
            "type": "fadeInLeft",
            "trigger": "sequence"
          }
        },
        {
          "id": "features-right",
          "type": "list",
          "position": { "column": 2 },
          "items": [
            { "text": "多主题支持", "icon": "🎨" },
            { "text": "PDF 高质量导出", "icon": "📄" },
            { "text": "演讲者模式", "icon": "🎤" }
          ],
          "animation": {
            "type": "fadeInRight",
            "trigger": "sequence"
          }
        }
      ],
      "notes": "介绍六大核心特性"
    },
    {
      "id": "slide-3",
      "type": "code",
      "elements": [
        {
          "id": "code-title",
          "type": "heading",
          "level": 2,
          "text": "简单的协议格式"
        },
        {
          "id": "code-block",
          "type": "code",
          "language": "json",
          "content": "{\n  \"type\": \"content\",\n  \"elements\": [\n    { \"type\": \"heading\", \"text\": \"Hello\" },\n    { \"type\": \"list\", \"items\": [\"Item 1\", \"Item 2\"] }\n  ]\n}",
          "highlight": [3, 4],
          "showLineNumbers": true,
          "animation": {
            "type": "fadeIn"
          }
        }
      ]
    },
    {
      "id": "slide-4",
      "type": "section",
      "layout": "title-center",
      "elements": [
        {
          "id": "thanks",
          "type": "heading",
          "level": 1,
          "text": "感谢关注",
          "animation": { "type": "zoomIn" }
        },
        {
          "id": "link",
          "type": "text",
          "content": "github.com/slideforge/slideforge",
          "style": { "opacity": "0.8" },
          "animation": { "type": "fadeIn", "delay": 500 }
        }
      ]
    }
  ]
}
```

### 11.2 术语表

| 术语 | 定义 |
|-----|------|
| SlideDocument | 完整的演示文稿 JSON 对象 |
| Slide | 单页幻灯片 |
| Element | 页面中的内容元素 |
| Runtime | 渲染和演示引擎 |
| Protocol | SlideForge JSON 协议规范 |
| Theme | 主题样式配置 |
| Layout | 页面布局模板 |
| Transition | 页面切换动画 |
| Animation | 元素入场动画 |

### 11.3 参考资料

- [reveal.js](https://revealjs.com/)
- [Slidev](https://sli.dev/)
- [Marp](https://marp.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [JSON Schema](https://json-schema.org/)

---

*文档版本: 1.0*
*最后更新: 2024-01*
