# SlideForge PRD

> **让 AI 生成的想法，第一次拥有可靠的展示终点。**

---

## 目录

0. [为什么是 SlideForge](#0-为什么是-slideforge)
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

## 0. 为什么是 SlideForge

### 0.1 北极星场景

> **AI 自动生成可演示、可交付的 Slides**

SlideForge 不是给人类手写 PPT 用的工具，而是 **LLM 的 Slides Output Renderer**。

目标用户：AI 应用 / Agent / 工作流开发者
核心卖点：生成 → 校验 → 演示 → 导出，一步到位

### 0.2 真实场景问题

当前 AI 已经可以生成「内容」，但生成的 Slides 存在三个致命问题：

| 问题 | 后果 |
|------|------|
| 🔴 不能直接演示 | 缺 Runtime，生成完还要手动导入其他工具 |
| 🔴 不能稳定导出 | 格式不可控，每次生成结构都不一样 |
| 🔴 不能作为"资产"管理 | 一次性产物，无法复用、版本化 |

### 0.3 SlideForge 的解决方式

SlideForge 不做「AI 生成 PPT」，而是提供：

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📋 协议层    一个 AI 能稳定输出的 JSON 协议                │
│                                                             │
│   ⚙️ 运行时    协议的 Runtime（渲染 + 动画 + 演示）          │
│                                                             │
│   🗂️ 平台层    可被平台化管理的内容系统                     │
│                                                             │
│   🤖 AI 层     端侧 AI 生成（隐私 + 免费 + 离线）            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 0.4 一份内容，多种输出

> **核心理念：内容与展示分离**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  输入: SlideForge JSON / Markdown                           │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Slides    │  │   Poster    │  │    PDF      │         │
│  │   演示模式   │  │   海报模式   │  │   文档模式   │         │
│  │             │  │             │  │             │         │
│  │  多页演示   │  │  单页图片   │  │  打印导出   │         │
│  │  动画效果   │  │  社交分享   │  │  离线阅读   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  场景: 会议演讲    场景: 朋友圈/X    场景: 正式交付          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 0.5 SlideForge 不做什么（边界）

- ❌ 不做重型所见即所得编辑器（至少 v1 不做）
- ❌ 不和 PowerPoint / Keynote 正面竞争
- ❌ 不追求「人类手写效率」，只追求「AI 生成可靠性」
- ❌ 不做内容创作（那是 Gamma / Tome 的事）

### 0.6 一句话哲学

> **Slides 不再是文件，而是一种可计算的内容结构。**

---

## 1. 产品概述

### 1.1 产品定位

SlideForge 是一个开源的、面向 AI 的 HTML Slides 协议框架 + Runtime。

**一句话描述**: AI 生成 Slides 的标准协议 + 开箱即用的渲染引擎。

**核心闭环**: `AI 生成 → 协议校验 → 立即演示 → 稳定导出`

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
│   🔒 端侧 AI         隐私友好 + 零成本 + 离线可用            │
│                                                             │
│   📦 开箱即用        内置主题、动画、布局模板                │
│                                                             │
│   🎬 在线演示        全屏演示 + 演讲者模式 + 动画效果        │
│                                                             │
│   🖼️ 海报生成        Markdown → 精美海报图片                │
│                                                             │
│   📤 多格式导出      PDF / HTML / PNG / Poster              │
│                                                             │
│   🗂️ 平台管理        统一管理多个 Slides 项目               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 目标用户

| 用户类型 | 使用场景 | 核心需求 | 优先级 |
|---------|---------|---------|--------|
| **AI 应用开发者** | 集成 Slides 生成能力到产品 | 协议文档、SDK、API | 🔴 P0 |
| Agent 开发者 | 让 Agent 输出可交付的 Slides | MCP Server、稳定输出 | 🔴 P0 |
| 内容创作者 | 通过 AI 快速生成演示文稿 | 易用的 Web 平台 | 🟡 P1 |
| 企业用户 | 批量生成标准化演示材料 | 模板管理、品牌定制 | 🟢 P2 |

---

## 2. 协议规范

### 2.1 设计原则

- **简洁**: 最小化必填字段，降低 AI 生成难度
- **可扩展**: 支持自定义元素和属性（type 为 string 非 enum）
- **可验证**: 提供 JSON Schema，支持严格校验
- **语义化**: 字段命名清晰，AI 易于理解
- **容错性**: 缺失字段有合理默认值，AI 首次生成成功率 > 95%

### 2.2 AI Safe Defaults（核心差异点）

> **这是 SlideForge 与其他 Slides 框架的本质区别**

当字段缺失时，Runtime **必须**提供稳定默认行为：

| 缺失字段 | 默认行为 |
|---------|---------|
| `slide.layout` | 根据 `slide.type` 自动推断 |
| `slide.background` | 使用 theme 默认背景 |
| `element.animation` | 使用 theme 默认动画（或 none） |
| `element.position` | 启用自动布局引擎 |
| `element.style` | 继承 theme 样式 |
| `metadata.id` | 自动生成 UUID |
| `metadata.createdAt` | 使用当前时间 |

**设计目标**: AI 只需要输出 `type` + `content`，其他全部可省略。

### 2.3 文档结构 (SlideDocument)

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

### 2.4 页面结构 (Slide)

```typescript
interface Slide {
  id?: string;                          // 页面唯一标识
  type: SlideType;                      // 页面类型（视觉）
  role?: SlideRole;                     // 页面角色（语义，AI-Native）
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

// 🆕 语义角色（AI-Native，帮助 AI 理解叙事结构）
type SlideRole =
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

// 💡 role 的价值：
// - AI 更容易生成"像人讲的 PPT"
// - v2 可以做自动结构优化 / 顺序建议
// - Runtime 可忽略，完全不影响渲染

interface Background {
  type: "color" | "gradient" | "image";
  value: string;                        // 颜色值 / 渐变 / 图片URL
  opacity?: number;                     // 透明度 0-1
}
```

### 2.5 元素类型 (Element)

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
  type: string;                         // 🆕 string 而非 enum，支持插件扩展
  namespace?: string;                   // 🆕 插件命名空间 (e.g. "plugin.chart3d")
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

### 2.7 动画系统

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

#### Sequence 触发规则（明确定义）

当 `trigger: "sequence"` 时：

1. **排序规则**: 按 `elements` 数组顺序依次触发
2. **触发时机**: 每次用户按下一步，触发下一个 sequence 元素
3. **同页多个**: 同一 slide 中可有多个 sequence 元素，依次排队
4. **混合模式**: `auto` 元素在页面加载时立即显示，`sequence` 元素等待触发

```
用户操作流程：
进入页面 → auto 元素全部显示
按下一步 → 第 1 个 sequence 元素显示
按下一步 → 第 2 个 sequence 元素显示
...
所有 sequence 显示完 → 按下一步进入下一页
```

**设计原则**: AI 不用想，Runtime 不用猜，用户行为可预测。

### 2.8 布局模板

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

### 3.0 核心用户闭环

> **SlideForge 的核心闭环是：AI 生成 → 协议校验 → 立即演示 → 稳定导出**

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ AI 生成  │────▶│  校验   │────▶│  演示   │────▶│  导出   │
│  JSON   │     │ Schema  │     │ Runtime │     │ PDF/HTML│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

#### 模块优先级

| 模块 | MVP 主闭环 | 优先级 | 说明 |
|------|-----------|--------|------|
| Runtime 渲染引擎 | ✅ 核心 | P0 | 没有它什么都不能跑 |
| Presenter 演示系统 | ✅ 核心 | P0 | 核心交付价值 |
| Export 导出系统 | ✅ 核心 | P0 | 用户最终要的是文件 |
| Project 项目管理 | ⚠️ MVP-lite | P1 | 可以先用 localStorage |
| Assets 资源管理 | ⚠️ MVP-lite | P1 | 先支持外链图片 |
| Editor 编辑器 | ❌ v2 | P2 | AI-first 不需要手写 |

### 3.1 功能模块总览

```
┌─────────────────────────────────────────────────────────────┐
│                    SlideForge 功能模块                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   渲染引擎   │  │   演示系统   │  │   导出系统   │         │
│  │   Runtime   │  │  Presenter  │  │   Export    │         │
│  │    ✅ P0    │  │    ✅ P0    │  │    ✅ P0    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   项目管理   │  │   资源管理   │  │   主题系统   │         │
│  │   Project   │  │   Assets    │  │   Themes    │         │
│  │    ⚠️ P1    │  │    ⚠️ P1    │  │    ✅ P0    │         │
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

> **Export 是 SlideForge 的核心护城河**

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

#### 导出能力分层（商业化预留）

| 能力 | 开源版 | 云端版 |
|------|--------|--------|
| HTML 导出 | ✅ | ✅ |
| PDF 标准质量 | ✅ | ✅ |
| PDF 高质量 | - | ✅ |
| 批量导出 | - | ✅ |
| 带品牌水印 | - | ✅ |
| 自定义模板 | - | ✅ |

*注：此分层仅为内部规划，不影响当前 MIT 开源策略*

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

### 3.7 海报系统 (Poster)

> **一份内容，多种输出 —— Markdown/Slides → 精美海报图片**

#### 3.7.1 功能定位

| 场景 | 说明 |
|------|------|
| 社交分享 | 朋友圈、X/Twitter、小红书 |
| 内容摘要 | 将 Slides 某一页转为分享图 |
| 快速海报 | Markdown 直接生成海报 |
| AI 输出 | AI 生成内容 → 海报图片 |

#### 3.7.2 Poster 模板

| 模板 | 描述 | 尺寸 |
|------|------|------|
| `card` | 卡片式，图文混排 | 800×auto |
| `social` | 社交分享，大字居中 | 1200×630 |
| `quote` | 引用卡片，名人名言 | 800×800 |
| `list` | 列表式，要点罗列 | 800×auto |
| `minimal` | 极简，纯文字 | 800×auto |

#### 3.7.3 Poster 协议

```typescript
interface PosterDocument {
  version: "1.0";
  type: "poster";
  metadata: {
    title?: string;
    author?: string;
  };
  config: {
    template: "card" | "social" | "quote" | "list" | "minimal";
    theme: string;
    size: {
      width: number;
      height: number | "auto";
    };
    background?: Background;
  };
  content: {
    // 方式 1: Markdown 原文
    markdown?: string;
    // 方式 2: 结构化内容
    title?: string;
    subtitle?: string;
    body?: string;
    image?: string;
    footer?: string;
    qrcode?: string;
  };
}
```

#### 3.7.4 渲染流程

```
Markdown / PosterDocument
         │
         ▼
┌─────────────────┐
│  Poster Parser  │  解析内容，提取结构
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Template Engine │  应用模板 + 主题
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTML Canvas   │  渲染到 Canvas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PNG Export    │  导出图片
└─────────────────┘
```

#### 3.7.5 与 Slides 联动

- 单页导出：将 Slides 某一页导出为海报
- 摘要生成：AI 总结 Slides 内容 → 生成分享海报
- 批量生成：Slides 每页 → 图片序列

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

> **SlideForge 是目前少数可以被 AI「端到端稳定使用」的 Slides 系统。**

### 5.0 AI 使用成功率设计

SlideForge 协议专为 AI 生成优化，目标是 **首次生成成功率 > 95%**：

| 设计点 | 实现方式 | 效果 |
|-------|---------|------|
| Schema 校验 | JSON Schema + 即时报错 | AI 知道哪里错了 |
| 错误路径可读 | 返回具体字段路径 | AI 可自修复 |
| Safe Defaults | 缺失字段有默认值 | 减少必填项 |
| 语义化命名 | `type: "heading"` 而非 `t: 1` | AI 易理解 |
| Prompt 模板 | 内嵌协议约束 | 减少幻觉 |

**对比其他方案**:

| 方案 | AI 首次成功率 | 原因 |
|------|-------------|------|
| PowerPoint XML | ~30% | 格式复杂，AI 难以生成正确结构 |
| Markdown (Slidev) | ~60% | 格式简单但表达能力有限 |
| **SlideForge JSON** | **>95%** | 结构化 + Safe Defaults + 校验 |

### 5.1 集成方式

```
┌─────────────────────────────────────────────────────────────┐
│                     AI 集成方式                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  方式 1: 端侧 AI（推荐，隐私 + 免费）                        │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │ Chrome  │────▶│  JSON   │────▶│ Runtime │              │
│  │ AI/WebLLM│    │ 协议    │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  方式 2: 本地 AI (Ollama)                                   │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │ Ollama  │────▶│  JSON   │────▶│ Runtime │              │
│  │ 本地    │     │ 协议    │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  方式 3: MCP Server                                         │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │   AI    │────▶│   MCP   │────▶│ Runtime │              │
│  │  Agent  │     │ Server  │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  方式 4: 云端 API（用户自带 Key）                            │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │ OpenAI  │────▶│  JSON   │────▶│ Runtime │              │
│  │ Claude  │     │ 协议    │     │  渲染   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 端侧 AI 策略（核心差异化）

> **SlideForge 的协议简单，小模型也能生成正确的 JSON**

#### 5.2.1 端侧 AI 优先级

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Provider 优先级                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  优先级 1: Chrome Built-in AI (Gemini Nano)                 │
│  ├─ 条件: Chrome 127+, 已启用                               │
│  ├─ 优势: 无需下载，2-5s 响应，完全免费                      │
│  └─ 限制: 仅 Chrome                                         │
│                                                             │
│  优先级 2: WebLLM (浏览器内)                                │
│  ├─ 条件: WebGPU 支持，首次需下载模型 (~2GB)                │
│  ├─ 优势: 跨浏览器，完全离线，隐私安全                       │
│  └─ 限制: 首次加载慢                                        │
│                                                             │
│  优先级 3: Ollama (本地服务)                                │
│  ├─ 条件: 用户已安装 Ollama                                 │
│  ├─ 优势: 模型选择多，质量高                                │
│  └─ 限制: 需要用户安装                                      │
│                                                             │
│  兜底: 云端 API (用户自带 Key)                              │
│  └─ OpenAI / Claude / DeepSeek / 通义千问                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 5.2.2 端侧 AI 优势

| 优势 | 说明 |
|------|------|
| 🔒 **隐私** | 数据不出本地，企业用户友好 |
| 💰 **免费** | 无 API 费用，降低使用门槛 |
| 📴 **离线** | 无网络也能用 |
| ⚡ **低延迟** | 本地推理，无网络往返 |

#### 5.2.3 推荐模型

| 模型 | 大小 | 场景 | 质量 |
|------|------|------|------|
| Gemini Nano | 内置 | Chrome 用户 | ⭐⭐⭐ |
| Llama 3.2 3B | 2GB | WebLLM / Ollama | ⭐⭐⭐⭐ |
| Qwen2.5 3B | 2GB | 中文场景 | ⭐⭐⭐⭐ |
| Phi-3 Mini | 2.3GB | 轻量级 | ⭐⭐⭐ |

#### 5.2.4 为什么端侧 AI 对 SlideForge 特别有效

| 因素 | 说明 |
|------|------|
| 协议简单 | JSON 结构清晰，小模型也能生成正确 |
| Safe Defaults | 缺失字段有默认值，容错性高 |
| 即时校验 | 生成后立即校验，错误可重试 |
| 输出短 | 6 页 Slides 约 2-3KB JSON |

### 5.3 Prompt 模板

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

### Phase 1: MVP 闭环 (2 周)

**目标**: 完成核心闭环，可以端到端跑通

| 周 | 任务 |
|---|------|
| W1 | Dashboard + 导入 + IndexedDB 存储 |
| W2 | HTML/PDF 导出 + 搜索排序 + 响应式 |

**交付物**:
- Dashboard 项目管理
- 导入 → 演示 → 导出 完整闭环

### Phase 2: AI 集成 (2 周)

**目标**: 让 AI 能直接使用 SlideForge

| 周 | 任务 |
|---|------|
| W3 | MCP Server + 端侧 AI (Chrome AI / Ollama) |
| W4 | REST API + Prompt 模板 + AI 生成面板 |

**交付物**:
- `@slideforge/mcp-server` v0.1
- 端侧 AI 生成能力
- AI 集成文档

### Phase 3: Poster 海报 (2 周)

**目标**: 一份内容，多种输出

| 周 | 任务 |
|---|------|
| W5 | Poster 渲染引擎 + 3 个基础模板 |
| W6 | Markdown → Poster + Slides → Poster 联动 |

**交付物**:
- Poster 渲染系统
- 5 个海报模板
- PNG 导出

### Phase 4: 体验优化 (2 周)

**目标**: 打磨细节，准备发布

| 周 | 任务 |
|---|------|
| W7 | 演讲者模式 + 更多动画 + WebLLM 集成 |
| W8 | 更多主题 + 文档完善 + Bug 修复 |

**交付物**:
- 演讲者模式
- 6 个内置主题
- v0.1 正式发布

### Phase 5: 生态扩展 (4 周)

**目标**: 协作功能 + 社区生态

| 周 | 任务 |
|---|------|
| W9-10 | 云端存储 + 用户系统 + 分享链接 |
| W11-12 | 插件系统 + 社区主题市场 |

**交付物**:
- 云端版本
- 插件系统

### 里程碑总览

| 里程碑 | 时间 | 标志 |
|--------|------|------|
| **MVP** | Week 2 | 导入 → 演示 → 导出 可用 |
| **AI Ready** | Week 4 | 端侧 AI + MCP Server 可用 |
| **Poster Ready** | Week 6 | 海报生成可用 |
| **v0.1 Release** | Week 8 | 可公开使用的版本 |

---

## 9. 竞品分析

### 9.1 竞品对比

| 特性 | SlideForge | reveal.js | Slidev | Marp | ReadPo |
|-----|------------|-----------|--------|------|--------|
| AI 优化协议 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 端侧 AI | ✅ | ❌ | ❌ | ❌ | ❌ |
| 结构化 JSON | ✅ | ❌ | ❌ | ❌ | ❌ |
| 在线演示 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 海报生成 | ✅ | ❌ | ❌ | ❌ | ✅ |
| PDF 导出 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 项目管理 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 开源 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 离线可用 | ✅ | ✅ | ❌ | ✅ | ❌ |

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

- **核心包**: Apache 2.0 License
- **主题包**: Apache 2.0 License
- **Web 应用**: Apache 2.0 License

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
*最后更新: 2026-01*
