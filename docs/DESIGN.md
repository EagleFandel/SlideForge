# SlideForge Design Document

> 技术设计与架构决策

---

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户层                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│   │  Web App    │   │  MCP Client │   │  REST API   │          │
│   │  (Next.js)  │   │  (Claude)   │   │  Consumer   │          │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│          │                 │                 │                  │
├──────────┼─────────────────┼─────────────────┼──────────────────┤
│          │            接口层                  │                  │
├──────────┼─────────────────┼─────────────────┼──────────────────┤
│          │                 │                 │                  │
│          ▼                 ▼                 ▼                  │
│   ┌─────────────────────────────────────────────────────┐      │
│   │                    API Routes                        │      │
│   │  /api/validate  /api/export/*  /api/slides/*        │      │
│   └─────────────────────────┬───────────────────────────┘      │
│                             │                                   │
│   ┌─────────────────────────┼───────────────────────────┐      │
│   │                    MCP Server                        │      │
│   │  create_presentation  validate  export              │      │
│   └─────────────────────────┬───────────────────────────┘      │
│                             │                                   │
├─────────────────────────────┼───────────────────────────────────┤
│                         核心层                                   │
├─────────────────────────────┼───────────────────────────────────┤
│                             ▼                                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  @slideforge │  │  @slideforge │  │  @slideforge │         │
│   │  /protocol   │  │  /runtime    │  │  /themes     │         │
│   │              │  │              │  │              │         │
│   │  • Types     │  │  • Parser    │  │  • default   │         │
│   │  • Validator │  │  • Renderer  │  │  • dark      │         │
│   │  • Utils     │  │  • Animation │  │  • corporate │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         存储层                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │  IndexedDB   │  │  File System │  │  Cloud (v2)  │         │
│   │  (Dexie.js)  │  │  (Export)    │  │  (Optional)  │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 包依赖关系

```
@slideforge/themes
       │
       ▼
@slideforge/protocol ◄─── @slideforge/mcp-server
       │
       ▼
@slideforge/runtime ◄─── @slideforge/poster
       │
       ▼
   apps/web
       │
       ▼
   lib/ai (端侧 AI)
```

---

## 2. 端侧 AI 架构

### 2.1 AI Provider 抽象

```typescript
// lib/ai/provider.ts

interface AIProvider {
  name: string;
  available: () => Promise<boolean>;
  generate: (prompt: string) => Promise<string>;
  priority: number;  // 数字越小优先级越高
}

interface AIConfig {
  providers: AIProvider[];
  systemPrompt: string;
  maxRetries: number;
}

class AIManager {
  private providers: AIProvider[] = [];
  private activeProvider: AIProvider | null = null;
  
  async initialize(): Promise<void> {
    // 按优先级检测可用的 Provider
    for (const provider of this.providers.sort((a, b) => a.priority - b.priority)) {
      if (await provider.available()) {
        this.activeProvider = provider;
        break;
      }
    }
  }
  
  async generate(prompt: string): Promise<string> {
    if (!this.activeProvider) {
      throw new Error('No AI provider available');
    }
    return this.activeProvider.generate(prompt);
  }
  
  getActiveProvider(): string | null {
    return this.activeProvider?.name ?? null;
  }
}
```

### 2.2 Chrome Built-in AI

```typescript
// lib/ai/chrome-ai.ts

const chromeAIProvider: AIProvider = {
  name: 'Chrome AI (Gemini Nano)',
  priority: 1,
  
  available: async () => {
    if (!('ai' in window)) return false;
    const ai = (window as any).ai;
    if (!ai.languageModel) return false;
    
    const capabilities = await ai.languageModel.capabilities();
    return capabilities.available === 'readily';
  },
  
  generate: async (prompt: string) => {
    const ai = (window as any).ai;
    const session = await ai.languageModel.create({
      systemPrompt: SLIDEFORGE_SYSTEM_PROMPT,
    });
    
    const response = await session.prompt(prompt);
    session.destroy();
    return response;
  }
};
```

### 2.3 Ollama Provider

```typescript
// lib/ai/ollama.ts

const ollamaProvider: AIProvider = {
  name: 'Ollama (Local)',
  priority: 2,
  
  available: async () => {
    try {
      const res = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(2000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  
  generate: async (prompt: string) => {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',  // 或 qwen2.5
        prompt: `${SLIDEFORGE_SYSTEM_PROMPT}\n\n${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 4096,
        }
      })
    });
    
    const data = await res.json();
    return data.response;
  }
};
```

### 2.4 WebLLM Provider

```typescript
// lib/ai/webllm.ts

import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';

let engine: MLCEngine | null = null;

const webLLMProvider: AIProvider = {
  name: 'WebLLM (Browser)',
  priority: 3,
  
  available: async () => {
    // 检查 WebGPU 支持
    if (!navigator.gpu) return false;
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  },
  
  generate: async (prompt: string) => {
    if (!engine) {
      // 首次使用需要下载模型（约 2GB）
      engine = await CreateMLCEngine('Llama-3.2-3B-Instruct-q4f16_1-MLC', {
        initProgressCallback: (progress) => {
          console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
        }
      });
    }
    
    const reply = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: SLIDEFORGE_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });
    
    return reply.choices[0].message.content || '';
  }
};
```

### 2.5 云端 API Provider

```typescript
// lib/ai/cloud-api.ts

interface CloudAPIConfig {
  provider: 'openai' | 'anthropic' | 'deepseek';
  apiKey: string;
  model?: string;
}

const createCloudProvider = (config: CloudAPIConfig): AIProvider => ({
  name: `Cloud API (${config.provider})`,
  priority: 10,  // 最低优先级，作为兜底
  
  available: async () => {
    return !!config.apiKey;
  },
  
  generate: async (prompt: string) => {
    const endpoints = {
      openai: 'https://api.openai.com/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages',
      deepseek: 'https://api.deepseek.com/v1/chat/completions',
    };
    
    const res = await fetch(endpoints[config.provider], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SLIDEFORGE_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      })
    });
    
    const data = await res.json();
    return data.choices[0].message.content;
  }
});
```

---

## 3. Poster 渲染架构

### 3.1 Poster 协议

```typescript
// packages/poster/src/types.ts

interface PosterDocument {
  version: "1.0";
  type: "poster";
  metadata: {
    title?: string;
    author?: string;
    createdAt?: string;
  };
  config: PosterConfig;
  content: PosterContent;
}

interface PosterConfig {
  template: PosterTemplate;
  theme: string;
  size: {
    width: number;
    height: number | "auto";
  };
  background?: {
    type: "color" | "gradient" | "image";
    value: string;
  };
  padding?: number;
  borderRadius?: number;
}

type PosterTemplate = "card" | "social" | "quote" | "list" | "minimal";

interface PosterContent {
  // Markdown 模式
  markdown?: string;
  
  // 结构化模式
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  footer?: string;
  qrcode?: string;
  
  // 元数据
  author?: string;
  date?: string;
  logo?: string;
}
```

### 3.2 Poster 渲染引擎

```typescript
// lib/poster/renderer.ts

interface PosterRenderer {
  render(document: PosterDocument): Promise<HTMLElement>;
  toCanvas(element: HTMLElement): Promise<HTMLCanvasElement>;
  toPNG(canvas: HTMLCanvasElement): Promise<Blob>;
}

class PosterRendererImpl implements PosterRenderer {
  private templates: Map<PosterTemplate, TemplateRenderer>;
  
  async render(document: PosterDocument): Promise<HTMLElement> {
    const template = this.templates.get(document.config.template);
    if (!template) {
      throw new Error(`Unknown template: ${document.config.template}`);
    }
    
    // 解析 Markdown（如果有）
    const content = document.content.markdown
      ? this.parseMarkdown(document.content.markdown)
      : document.content;
    
    // 应用主题
    const themedContent = this.applyTheme(content, document.config.theme);
    
    // 渲染模板
    return template.render(themedContent, document.config);
  }
  
  async toCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(element, {
      scale: 2,  // 2x 分辨率
      useCORS: true,
      backgroundColor: null,
    });
  }
  
  async toPNG(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      }, 'image/png');
    });
  }
  
  private parseMarkdown(markdown: string): PosterContent {
    // 使用 marked 解析 Markdown
    // 提取标题、正文、图片等
  }
  
  private applyTheme(content: PosterContent, theme: string): PosterContent {
    // 应用主题样式
  }
}
```

### 3.3 模板系统

```typescript
// lib/poster/templates/card.ts

const cardTemplate: TemplateRenderer = {
  name: 'card',
  
  render(content: PosterContent, config: PosterConfig): HTMLElement {
    const container = document.createElement('div');
    container.className = 'poster-card';
    container.style.cssText = `
      width: ${config.size.width}px;
      padding: ${config.padding || 40}px;
      background: ${config.background?.value || '#ffffff'};
      border-radius: ${config.borderRadius || 16}px;
      font-family: system-ui, sans-serif;
    `;
    
    container.innerHTML = `
      ${content.image ? `<img src="${content.image}" class="poster-image" />` : ''}
      ${content.title ? `<h1 class="poster-title">${content.title}</h1>` : ''}
      ${content.subtitle ? `<p class="poster-subtitle">${content.subtitle}</p>` : ''}
      ${content.body ? `<div class="poster-body">${content.body}</div>` : ''}
      ${content.footer ? `<footer class="poster-footer">${content.footer}</footer>` : ''}
    `;
    
    return container;
  }
};
```

### 3.4 Slides → Poster 转换

```typescript
// lib/poster/converter.ts

function slideToPoster(slide: Slide, config?: Partial<PosterConfig>): PosterDocument {
  // 提取 slide 中的内容
  const title = slide.elements.find(e => e.type === 'heading' && e.level === 1);
  const subtitle = slide.elements.find(e => e.type === 'heading' && e.level === 2);
  const text = slide.elements.filter(e => e.type === 'text');
  const image = slide.elements.find(e => e.type === 'image');
  
  return {
    version: "1.0",
    type: "poster",
    metadata: {},
    config: {
      template: "card",
      theme: "default",
      size: { width: 800, height: "auto" },
      background: slide.background,
      ...config,
    },
    content: {
      title: title?.text,
      subtitle: subtitle?.text,
      body: text.map(t => t.content).join('\n\n'),
      image: image?.src,
    }
  };
}
```

---

## 4. 数据模型

### 2.1 IndexedDB Schema (Dexie)

```typescript
// lib/db/schema.ts

import Dexie, { Table } from 'dexie';
import { SlideDocument } from '@slideforge/protocol';

interface StoredPresentation {
  id: string;                    // UUID
  document: SlideDocument;       // 完整协议文档
  thumbnail?: string;            // Base64 缩略图
  createdAt: Date;
  updatedAt: Date;
  // 索引字段（冗余，便于查询）
  title: string;
  tags: string[];
}

interface AppSettings {
  key: string;
  value: unknown;
}

class SlideForgeDB extends Dexie {
  presentations!: Table<StoredPresentation>;
  settings!: Table<AppSettings>;

  constructor() {
    super('slideforge');
    
    this.version(1).stores({
      presentations: 'id, title, createdAt, updatedAt, *tags',
      settings: 'key'
    });
  }
}

export const db = new SlideForgeDB();
```

### 2.2 状态管理 (Zustand)

```typescript
// lib/store/presentations.ts

interface PresentationsState {
  // 列表
  presentations: StoredPresentation[];
  isLoading: boolean;
  
  // 当前打开的
  currentId: string | null;
  currentDocument: SlideDocument | null;
  
  // Actions
  loadAll: () => Promise<void>;
  create: (doc: SlideDocument) => Promise<string>;
  update: (id: string, doc: SlideDocument) => Promise<void>;
  delete: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<string>;
  
  // 当前文档
  open: (id: string) => Promise<void>;
  close: () => void;
}

// lib/store/presenter.ts

interface PresenterState {
  // 演示状态
  currentSlide: number;
  isFullscreen: boolean;
  isPresenting: boolean;
  
  // 动画队列
  animationQueue: string[];  // element ids
  currentAnimation: number;
  
  // Actions
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  toggleFullscreen: () => void;
  
  // 动画控制
  triggerNextAnimation: () => boolean;  // 返回是否还有动画
}
```

---

## 3. 核心模块设计

### 3.1 Runtime 渲染引擎

```typescript
// packages/runtime/src/index.ts

export interface RuntimeOptions {
  container: HTMLElement;
  document: SlideDocument;
  theme?: string;
  onSlideChange?: (index: number) => void;
  onAnimationComplete?: () => void;
}

export class SlideForgeRuntime {
  private options: RuntimeOptions;
  private currentSlide: number = 0;
  private animationQueue: AnimationItem[] = [];
  
  constructor(options: RuntimeOptions) {
    this.options = options;
    this.applyTheme();
    this.render();
  }
  
  // 渲染
  render(): void;
  renderSlide(slide: Slide, index: number): HTMLElement;
  renderElement(element: Element): HTMLElement;
  
  // 导航
  next(): boolean;      // 返回是否成功（到底了返回 false）
  prev(): boolean;
  goTo(index: number): void;
  
  // 动画
  private buildAnimationQueue(slide: Slide): void;
  private playNextAnimation(): boolean;
  
  // 主题
  private applyTheme(): void;
  
  // 导出
  async exportHTML(): Promise<string>;
  async exportPDF(): Promise<Blob>;
}
```

### 3.2 动画系统

```typescript
// packages/runtime/src/animation.ts

interface AnimationItem {
  elementId: string;
  type: AnimationType;
  trigger: 'auto' | 'click' | 'sequence';
  duration: number;
  delay: number;
  easing: string;
}

/**
 * 动画队列构建规则：
 * 1. auto: 页面加载时立即执行
 * 2. sequence: 按 elements 数组顺序排队
 * 3. click: 等待用户点击（暂不实现）
 */
function buildAnimationQueue(slide: Slide): AnimationItem[] {
  const queue: AnimationItem[] = [];
  
  slide.elements.forEach((el, index) => {
    if (!el.animation || el.animation.type === 'none') return;
    
    const item: AnimationItem = {
      elementId: el.id || `el-${index}`,
      type: el.animation.type,
      trigger: el.animation.trigger || 'auto',
      duration: el.animation.duration || 500,
      delay: el.animation.delay || 0,
      easing: el.animation.easing || 'ease-out',
    };
    
    queue.push(item);
  });
  
  // 按 trigger 分组排序：auto 在前，sequence 在后
  return queue.sort((a, b) => {
    if (a.trigger === 'auto' && b.trigger !== 'auto') return -1;
    if (a.trigger !== 'auto' && b.trigger === 'auto') return 1;
    return 0;
  });
}
```

### 3.3 导出系统

```typescript
// packages/runtime/src/export.ts

/**
 * HTML 导出：打包成独立可运行的 HTML 文件
 */
async function exportHTML(document: SlideDocument): Promise<string> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.metadata.title}</title>
  <style>${getThemeCSS(document.config.theme)}</style>
  <style>${getRuntimeCSS()}</style>
</head>
<body>
  <div id="slideforge-root"></div>
  <script>
    const DOCUMENT = ${JSON.stringify(document)};
    ${getRuntimeJS()}
  </script>
</body>
</html>`;
  return html;
}

/**
 * PDF 导出（客户端方案）
 * 使用 html2canvas + jsPDF
 */
async function exportPDF(
  container: HTMLElement,
  document: SlideDocument,
  options: PDFExportOptions
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1280, 720]
  });
  
  // 遍历每一页截图
  for (let i = 0; i < document.slides.length; i++) {
    // 渲染到隐藏容器
    // 截图
    // 添加到 PDF
    if (i > 0) pdf.addPage();
  }
  
  return pdf.output('blob');
}
```

---

## 4. API 设计

### 4.1 REST API

```typescript
// POST /api/validate
// 校验协议合规性
Request: {
  document: SlideDocument
}
Response: {
  valid: boolean;
  errors?: ValidationError[];
}

// POST /api/export/html
// 导出 HTML
Request: {
  document: SlideDocument;
  options?: {
    minify?: boolean;
    includeRuntime?: boolean;
  }
}
Response: {
  html: string;
  // 或返回下载 URL
  downloadUrl?: string;
}

// POST /api/export/pdf
// 导出 PDF（需要服务端渲染）
Request: {
  document: SlideDocument;
  options?: PDFExportOptions;
}
Response: {
  downloadUrl: string;
  expiresAt: string;
}
```

### 4.2 MCP Server Tools

```typescript
// packages/mcp-server/src/tools.ts

const tools = [
  {
    name: 'create_presentation',
    description: '创建一个 SlideForge 演示文稿',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '演示文稿标题' },
        theme: { type: 'string', default: 'default' },
        slides: {
          type: 'array',
          items: { $ref: '#/definitions/Slide' }
        }
      },
      required: ['title', 'slides']
    }
  },
  {
    name: 'validate_presentation',
    description: '校验演示文稿是否符合协议',
    inputSchema: {
      type: 'object',
      properties: {
        document: { $ref: '#/definitions/SlideDocument' }
      },
      required: ['document']
    }
  },
  {
    name: 'export_html',
    description: '将演示文稿导出为独立 HTML 文件',
    inputSchema: {
      type: 'object',
      properties: {
        document: { $ref: '#/definitions/SlideDocument' }
      },
      required: ['document']
    }
  }
];
```

---

## 5. UI 组件设计

### 5.1 组件树

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu (v2)
│   └── Main
│
├── Dashboard (/)
│   ├── DashboardHeader
│   │   ├── SearchInput
│   │   ├── SortSelect
│   │   └── NewButton
│   ├── PresentationGrid
│   │   └── PresentationCard[]
│   │       ├── Thumbnail
│   │       ├── Title
│   │       ├── Meta (date, slides count)
│   │       └── Actions (open, delete, duplicate)
│   ├── EmptyState
│   └── ImportDropzone
│
├── Presenter (/slides/[id]/present)
│   ├── SlideCanvas
│   │   └── SlideElement[]
│   ├── PresenterControls
│   │   ├── PrevButton
│   │   ├── SlideCounter
│   │   ├── NextButton
│   │   └── FullscreenButton
│   ├── ProgressBar
│   └── SpeakerNotes (optional)
│
└── SpeakerView (/slides/[id]/speaker)
    ├── CurrentSlide
    ├── NextSlide
    ├── Notes
    └── Timer
```

### 5.2 关键组件接口

```typescript
// components/slides/SlideCanvas.tsx
interface SlideCanvasProps {
  slide: Slide;
  theme?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

// components/slides/SlideElement.tsx
interface SlideElementProps {
  element: Element;
  animate?: boolean;
  animationState?: 'pending' | 'playing' | 'complete';
}

// components/presenter/Presenter.tsx
interface PresenterProps {
  document: SlideDocument;
  initialSlide?: number;
  onExit?: () => void;
}

// components/dashboard/PresentationCard.tsx
interface PresentationCardProps {
  presentation: StoredPresentation;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}
```

---

## 6. 路由设计

```
/                           # 落地页（已完成）
/dashboard                  # 项目管理（待开发）
/slides/demo                # Demo 演示（已完成）
/slides/[id]                # 预览/编辑（待开发）
/slides/[id]/present        # 演示模式（待开发）
/slides/[id]/speaker        # 演讲者模式（待开发）
/api/validate               # 校验 API
/api/export/html            # HTML 导出
/api/export/pdf             # PDF 导出
```

---

## 7. 错误处理

### 7.1 错误码定义

```typescript
enum ErrorCode {
  // 协议错误 (1xxx)
  INVALID_VERSION = 1001,
  MISSING_REQUIRED_FIELD = 1002,
  INVALID_SLIDE_TYPE = 1003,
  INVALID_ELEMENT_TYPE = 1004,
  INVALID_ANIMATION_TYPE = 1005,
  
  // 存储错误 (2xxx)
  STORAGE_FULL = 2001,
  PRESENTATION_NOT_FOUND = 2002,
  SAVE_FAILED = 2003,
  
  // 导出错误 (3xxx)
  EXPORT_FAILED = 3001,
  PDF_GENERATION_TIMEOUT = 3002,
  
  // 运行时错误 (4xxx)
  RENDER_FAILED = 4001,
  ANIMATION_ERROR = 4002,
}
```

### 7.2 错误响应格式

```typescript
interface ErrorResponse {
  code: ErrorCode;
  message: string;           // 人类可读
  path?: string;             // JSON path，如 "slides[0].elements[2].type"
  suggestion?: string;       // AI 可用的修复建议
  details?: unknown;
}

// 示例
{
  "code": 1004,
  "message": "Invalid element type: 'titl'",
  "path": "slides[0].elements[0].type",
  "suggestion": "Did you mean 'title'? Valid types: heading, text, list, image, code, chart, shape, video, table"
}
```

---

## 8. 性能考虑

### 8.1 渲染优化

- 虚拟化：大量 slides 时只渲染可见的
- 懒加载：图片/视频延迟加载
- 缓存：已渲染的 slide 缓存 DOM

### 8.2 动画优化

- 使用 CSS transform 而非 layout 属性
- 使用 will-change 提示浏览器
- 动画完成后移除 will-change

### 8.3 导出优化

- PDF 导出使用 Web Worker
- 大文件分片处理
- 进度反馈

---

## 9. 安全考虑

### 9.1 XSS 防护

- 所有用户内容转义
- 使用 CSP 策略
- 禁止内联脚本（导出除外）

### 9.2 文件上传

- 类型白名单
- 大小限制
- 病毒扫描（云端版）

---

## 10. 测试策略

### 10.1 单元测试

- Protocol: 类型校验、工具函数
- Runtime: 渲染逻辑、动画队列
- Store: 状态管理

### 10.2 集成测试

- API 端点
- 导入导出流程

### 10.3 E2E 测试

- 完整用户流程
- 演示模式交互

