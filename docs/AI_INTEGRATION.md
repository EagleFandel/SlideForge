# SlideForge AI 集成设计

> AI Skill 定义 + MCP Server 规范 + Prompt 工程

---

## 目录

1. [设计目标](#1-设计目标)
2. [AI Skill 定义](#2-ai-skill-定义)
3. [MCP Server 规范](#3-mcp-server-规范)
4. [Prompt 工程](#4-prompt-工程)
5. [端侧 AI 集成](#5-端侧-ai-集成)
6. [错误处理与自修复](#6-错误处理与自修复)
7. [示例与测试](#7-示例与测试)

---

## 1. 设计目标

### 1.1 核心原则

```
┌─────────────────────────────────────────────────────────────┐
│                    AI 集成设计原则                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 首次成功率 > 95%    AI 生成的 JSON 首次校验通过率        │
│                                                             │
│  🔧 可自修复            错误信息包含路径和修复建议           │
│                                                             │
│  📦 最小输出            AI 只需输出必要字段                  │
│                                                             │
│  🔒 端侧优先            隐私友好，零成本，离线可用           │
│                                                             │
│  🔌 多模态集成          MCP / REST API / SDK 全覆盖         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 集成方式对比

| 集成方式 | 适用场景 | 优势 | 限制 |
|---------|---------|------|------|
| MCP Server | Claude Desktop / AI Agent | 原生工具调用 | 需要 MCP 支持 |
| REST API | 任意 HTTP 客户端 | 通用性强 | 需要网络 |
| 端侧 AI | Web 应用内 | 隐私 + 免费 | 模型能力有限 |
| NPM SDK | Node.js 应用 | 类型安全 | 仅 JS 生态 |

---

## 2. AI Skill 定义

### 2.1 Skill 概览

SlideForge 为 AI 提供以下核心能力（Skills）：

| Skill | 描述 | 输入 | 输出 |
|-------|------|------|------|
| `create_presentation` | 创建完整演示文稿 | 主题 + 内容描述 | SlideDocument JSON |
| `create_slide` | 创建单页幻灯片 | 页面类型 + 内容 | Slide JSON |
| `validate` | 校验协议合规性 | SlideDocument | 校验结果 |
| `suggest_layout` | 推荐布局方案 | 内容描述 | 布局建议 |
| `suggest_theme` | 推荐主题 | 场景描述 | 主题名称 |
| `export_html` | 导出 HTML | SlideDocument | HTML 字符串 |
| `export_pdf` | 导出 PDF | SlideDocument | PDF URL |
| `create_poster` | 创建海报 | Markdown / 内容 | PosterDocument JSON |

### 2.2 Skill 详细定义

#### 2.2.1 create_presentation

创建完整的演示文稿。

```typescript
interface CreatePresentationInput {
  /** 演示文稿标题 */
  title: string;
  
  /** 内容描述或大纲 */
  content: string;
  
  /** 主题名称 (可选，默认 "default") */
  theme?: "default" | "dark" | "corporate" | "minimal" | "academic" | "creative";
  
  /** 宽高比 (可选，默认 "16:9") */
  aspectRatio?: "16:9" | "4:3";
  
  /** 目标页数 (可选，默认 6-8 页) */
  slideCount?: number;
  
  /** 语言 (可选，默认根据内容自动检测) */
  language?: "zh" | "en";
  
  /** 风格偏好 (可选) */
  style?: {
    /** 动画强度: none=无动画, subtle=轻微, moderate=适中, rich=丰富 */
    animationLevel?: "none" | "subtle" | "moderate" | "rich";
    /** 是否包含演讲者备注 */
    includeNotes?: boolean;
  };
}

interface CreatePresentationOutput {
  /** 生成的文档 */
  document: SlideDocument;
  
  /** 生成统计 */
  stats: {
    slideCount: number;
    elementCount: number;
    estimatedDuration: string;  // e.g. "5-7 分钟"
  };
}
```

**使用示例**:

```json
{
  "title": "SlideForge 产品介绍",
  "content": "介绍 SlideForge 的核心功能：AI-First 协议设计、在线演示、多格式导出。目标受众是 AI 应用开发者。",
  "theme": "dark",
  "slideCount": 6,
  "style": {
    "animationLevel": "moderate",
    "includeNotes": true
  }
}
```

#### 2.2.2 create_slide

创建单页幻灯片，用于增量构建或修改。

```typescript
interface CreateSlideInput {
  /** 页面类型 */
  type: SlideType;
  
  /** 页面内容描述 */
  content: string;
  
  /** 语义角色 (可选，帮助 AI 理解叙事位置) */
  role?: SlideRole;
  
  /** 布局模板 (可选，自动推断) */
  layout?: LayoutTemplate;
  
  /** 背景 (可选) */
  background?: Background;
}

interface CreateSlideOutput {
  slide: Slide;
}
```

#### 2.2.3 validate

校验 SlideDocument 是否符合协议规范。

```typescript
interface ValidateInput {
  /** 待校验的文档 */
  document: unknown;
}

interface ValidateOutput {
  /** 是否有效 */
  valid: boolean;
  
  /** 错误列表 */
  errors?: ValidationError[];
  
  /** 警告列表 (不影响有效性) */
  warnings?: ValidationWarning[];
}

interface ValidationError {
  /** 错误码 */
  code: string;
  
  /** 错误消息 */
  message: string;
  
  /** JSON 路径 */
  path: string;
  
  /** 修复建议 (AI 可用) */
  suggestion?: string;
  
  /** 期望值示例 */
  expected?: string;
  
  /** 实际值 */
  actual?: unknown;
}
```

**错误示例**:

```json
{
  "valid": false,
  "errors": [
    {
      "code": "INVALID_ELEMENT_TYPE",
      "message": "Unknown element type: 'titl'",
      "path": "slides[0].elements[0].type",
      "suggestion": "Did you mean 'title'? Valid types: heading, text, list, image, code, chart, shape, video, table",
      "expected": "heading | text | list | ...",
      "actual": "titl"
    }
  ]
}
```

#### 2.2.4 suggest_layout

根据内容推荐最佳布局。

```typescript
interface SuggestLayoutInput {
  /** 页面类型 */
  slideType: SlideType;
  
  /** 元素列表描述 */
  elements: string[];
  
  /** 是否有图片 */
  hasImage?: boolean;
  
  /** 是否有代码 */
  hasCode?: boolean;
}

interface SuggestLayoutOutput {
  /** 推荐布局 */
  recommended: LayoutTemplate;
  
  /** 备选布局 */
  alternatives: LayoutTemplate[];
  
  /** 推荐理由 */
  reason: string;
}
```

#### 2.2.5 create_poster

从 Markdown 或结构化内容创建海报。

```typescript
interface CreatePosterInput {
  /** 方式一: Markdown 内容 */
  markdown?: string;
  
  /** 方式二: 结构化内容 */
  content?: {
    title?: string;
    subtitle?: string;
    body?: string;
    image?: string;
    footer?: string;
  };
  
  /** 模板 */
  template?: PosterTemplate;
  
  /** 主题 */
  theme?: string;
  
  /** 尺寸 */
  size?: {
    width: number;
    height: number | "auto";
  };
}

interface CreatePosterOutput {
  document: PosterDocument;
}
```

---

## 3. MCP Server 规范

### 3.1 Server 信息

```json
{
  "name": "slideforge",
  "version": "0.1.0",
  "description": "SlideForge MCP Server - AI-First Slides Protocol",
  "vendor": "SlideForge",
  "homepage": "https://github.com/slideforge/slideforge"
}
```

### 3.2 Tools 定义

```typescript
// packages/mcp-server/src/tools.ts

export const tools = [
  {
    name: "create_presentation",
    description: `创建一个完整的 SlideForge 演示文稿。
    
输入内容描述或大纲，自动生成符合协议的 JSON 文档。
支持指定主题、页数、动画风格等参数。`,
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "演示文稿标题"
        },
        content: {
          type: "string", 
          description: "内容描述或大纲，AI 将据此生成幻灯片"
        },
        theme: {
          type: "string",
          enum: ["default", "dark", "corporate", "minimal", "academic", "creative"],
          default: "default",
          description: "主题名称"
        },
        aspectRatio: {
          type: "string",
          enum: ["16:9", "4:3"],
          default: "16:9"
        },
        slideCount: {
          type: "number",
          default: 6,
          description: "目标页数 (建议 4-12)"
        },
        language: {
          type: "string",
          enum: ["zh", "en"],
          description: "语言，默认自动检测"
        }
      },
      required: ["title", "content"]
    }
  },
  
  {
    name: "add_slide",
    description: `向演示文稿添加一页幻灯片。
    
用于增量构建或修改现有文档。`,
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["title", "section", "content", "image", "code", "comparison", "timeline", "quote", "blank"],
          description: "页面类型"
        },
        content: {
          type: "string",
          description: "页面内容描述"
        },
        role: {
          type: "string",
          enum: ["hook", "agenda", "problem", "solution", "feature", "demo", "case", "data", "comparison", "summary", "cta"],
          description: "语义角色，帮助理解叙事位置"
        },
        layout: {
          type: "string",
          enum: ["default", "title-center", "two-column", "three-column", "image-left", "image-right", "image-full"],
          description: "布局模板"
        }
      },
      required: ["type", "content"]
    }
  },
  
  {
    name: "validate",
    description: `校验 SlideForge JSON 文档是否符合协议规范。
    
返回详细的错误信息和修复建议。`,
    inputSchema: {
      type: "object",
      properties: {
        document: {
          type: "object",
          description: "待校验的 SlideDocument JSON"
        }
      },
      required: ["document"]
    }
  },
  
  {
    name: "export_html",
    description: "将演示文稿导出为独立可运行的 HTML 文件",
    inputSchema: {
      type: "object",
      properties: {
        document: {
          type: "object",
          description: "SlideDocument JSON"
        },
        minify: {
          type: "boolean",
          default: false,
          description: "是否压缩输出"
        }
      },
      required: ["document"]
    }
  },
  
  {
    name: "create_poster",
    description: `从 Markdown 或结构化内容创建海报图片。
    
支持多种模板：card(卡片)、social(社交分享)、quote(引用)、list(列表)、minimal(极简)`,
    inputSchema: {
      type: "object",
      properties: {
        markdown: {
          type: "string",
          description: "Markdown 内容"
        },
        template: {
          type: "string",
          enum: ["card", "social", "quote", "list", "minimal"],
          default: "card"
        },
        theme: {
          type: "string",
          default: "default"
        },
        width: {
          type: "number",
          default: 800
        }
      },
      required: ["markdown"]
    }
  },
  
  {
    name: "list_themes",
    description: "列出所有可用的主题",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  
  {
    name: "get_protocol_schema",
    description: "获取 SlideForge 协议的 JSON Schema，用于了解文档结构",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];
```

### 3.3 MCP Server 实现

```typescript
// packages/mcp-server/src/index.ts

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools } from "./tools.js";
import { handleCreatePresentation } from "./handlers/create-presentation.js";
import { handleValidate } from "./handlers/validate.js";
import { handleExportHtml } from "./handlers/export-html.js";
import { handleCreatePoster } from "./handlers/create-poster.js";

const server = new Server(
  {
    name: "slideforge",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler("tools/list", async () => ({
  tools,
}));

// 处理工具调用
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_presentation":
      return handleCreatePresentation(args);
    case "add_slide":
      return handleAddSlide(args);
    case "validate":
      return handleValidate(args);
    case "export_html":
      return handleExportHtml(args);
    case "create_poster":
      return handleCreatePoster(args);
    case "list_themes":
      return handleListThemes();
    case "get_protocol_schema":
      return handleGetSchema();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SlideForge MCP Server running on stdio");
}

main().catch(console.error);
```

### 3.4 Claude Desktop 配置

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// %APPDATA%\Claude\claude_desktop_config.json (Windows)

{
  "mcpServers": {
    "slideforge": {
      "command": "npx",
      "args": ["-y", "@slideforge/mcp-server"],
      "env": {}
    }
  }
}
```

或本地开发模式：

```json
{
  "mcpServers": {
    "slideforge": {
      "command": "node",
      "args": ["path/to/slideforge/packages/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```



---

## 4. Prompt 工程

### 4.1 System Prompt 模板

```markdown
# SlideForge Slides 生成助手

你是一个专业的演示文稿生成助手。请根据用户需求生成符合 SlideForge Protocol v1.0 的 JSON。

## 协议要点

1. **必填字段**: version, metadata.title, config.theme, config.aspectRatio, slides
2. **页面类型**: title, section, content, image, code, comparison, timeline, quote, blank
3. **元素类型**: heading, text, list, image, code, chart, shape, video, table
4. **动画类型**: fadeIn, fadeInUp, slideInLeft, slideInRight, zoomIn, typewriter 等

## 输出规则

1. 输出纯 JSON，不要 markdown 代码块包裹
2. 每页 slide 必须有 type 和 elements 数组
3. heading 元素必须有 level (1-6) 和 text
4. list 元素的 items 可以是字符串数组或 {text, icon} 对象数组
5. 合理使用动画，避免过度（建议 animationLevel: moderate）

## 最小示例

{
  "version": "1.0",
  "metadata": { "title": "示例" },
  "config": { "theme": "default", "aspectRatio": "16:9" },
  "slides": [
    {
      "type": "title",
      "elements": [
        { "type": "heading", "level": 1, "text": "标题" }
      ]
    }
  ]
}

## 叙事结构建议

- 第 1 页: title (hook) - 吸引注意力的标题
- 第 2 页: content (agenda/problem) - 议程或问题陈述  
- 第 3-N 页: content (solution/feature) - 核心内容
- 最后一页: section (summary/cta) - 总结或行动号召
```

### 4.2 场景化 Prompt 模板

#### 产品介绍

```markdown
生成一个产品介绍演示文稿。

产品名称: {product_name}
核心功能: {features}
目标用户: {target_users}
竞争优势: {advantages}

要求:
- 6-8 页
- 包含: 标题页、痛点分析、解决方案、功能展示、案例/数据、总结
- 风格: 专业但不枯燥
- 动画: 适中
```

#### 技术分享

```markdown
生成一个技术分享演示文稿。

主题: {topic}
技术栈: {tech_stack}
核心概念: {concepts}
代码示例: {code_examples}

要求:
- 8-12 页
- 包含代码页 (type: "code")
- 使用 dark 主题
- 动画: 轻微
```

#### 周报/汇报

```markdown
生成一个工作汇报演示文稿。

汇报周期: {period}
完成事项: {completed}
进行中: {in_progress}
下周计划: {next_week}
问题/风险: {issues}

要求:
- 4-6 页
- 使用 corporate 主题
- 简洁明了，数据驱动
```

### 4.3 Few-Shot 示例

```json
{
  "version": "1.0",
  "metadata": {
    "title": "SlideForge 介绍",
    "author": "AI Assistant",
    "description": "AI-First Slides 协议框架介绍"
  },
  "config": {
    "theme": "dark",
    "aspectRatio": "16:9",
    "transition": { "type": "fade", "duration": 300 }
  },
  "slides": [
    {
      "type": "title",
      "role": "hook",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "SlideForge",
          "animation": { "type": "fadeInUp", "duration": 600 }
        },
        {
          "type": "text",
          "content": "让 AI 生成的想法，第一次拥有可靠的展示终点",
          "animation": { "type": "fadeIn", "delay": 300 }
        }
      ],
      "notes": "开场：强调 AI-First 的定位"
    },
    {
      "type": "content",
      "role": "problem",
      "layout": "two-column",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "现有方案的问题"
        },
        {
          "type": "list",
          "items": [
            { "text": "AI 生成 PPT 格式不统一", "icon": "🔴" },
            { "text": "生成结果难以预览", "icon": "🔴" },
            { "text": "无法在线演示", "icon": "🔴" }
          ],
          "animation": { "type": "fadeInLeft", "trigger": "sequence" }
        }
      ]
    },
    {
      "type": "content",
      "role": "solution",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "SlideForge 的解决方案"
        },
        {
          "type": "list",
          "items": [
            { "text": "标准化 JSON 协议", "icon": "✅" },
            { "text": "内置 Runtime 渲染引擎", "icon": "✅" },
            { "text": "Web 演示器 + 动画支持", "icon": "✅" }
          ],
          "columns": 1
        }
      ]
    },
    {
      "type": "code",
      "role": "demo",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "简单的协议格式"
        },
        {
          "type": "code",
          "language": "json",
          "content": "{\n  \"type\": \"content\",\n  \"elements\": [\n    { \"type\": \"heading\", \"text\": \"Hello\" }\n  ]\n}",
          "showLineNumbers": true
        }
      ]
    },
    {
      "type": "section",
      "role": "cta",
      "layout": "title-center",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "开始使用 SlideForge",
          "animation": { "type": "zoomIn" }
        },
        {
          "type": "text",
          "content": "github.com/slideforge/slideforge"
        }
      ]
    }
  ]
}
```

---

## 5. 端侧 AI 集成

### 5.1 Provider 优先级

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Provider 优先级                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  优先级 1: Chrome Built-in AI (Gemini Nano)                 │
│  ├─ 检测: window.ai?.languageModel                         │
│  ├─ 优势: 无需下载，2-5s 响应，完全免费                      │
│  └─ 限制: 仅 Chrome 127+                                    │
│                                                             │
│  优先级 2: Ollama (本地服务)                                │
│  ├─ 检测: fetch('http://localhost:11434/api/tags')         │
│  ├─ 优势: 模型选择多，质量高                                │
│  └─ 推荐模型: llama3.2, qwen2.5                            │
│                                                             │
│  优先级 3: WebLLM (浏览器内)                                │
│  ├─ 检测: navigator.gpu                                    │
│  ├─ 优势: 跨浏览器，完全离线                                │
│  └─ 限制: 首次需下载模型 (~2GB)                             │
│                                                             │
│  优先级 4: Cloud API (用户自带 Key)                         │
│  ├─ 支持: OpenAI / Claude / DeepSeek                       │
│  ├─ 优势: 模型能力强，质量最高                              │
│  └─ 限制: 需要网络 + API Key                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 统一接口

```typescript
// lib/ai/types.ts

export interface AIProvider {
  name: string;
  priority: number;
  available: () => Promise<boolean>;
  generate: (prompt: string, options?: GenerateOptions) => Promise<string>;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIManager {
  initialize: () => Promise<void>;
  getActiveProvider: () => string | null;
  generate: (prompt: string) => Promise<string>;
  generateSlides: (input: CreatePresentationInput) => Promise<SlideDocument>;
}
```

### 5.3 Chrome AI 实现

```typescript
// lib/ai/providers/chrome-ai.ts

export const chromeAIProvider: AIProvider = {
  name: "Chrome AI (Gemini Nano)",
  priority: 1,
  
  available: async () => {
    if (typeof window === "undefined") return false;
    const ai = (window as any).ai;
    if (!ai?.languageModel) return false;
    
    try {
      const caps = await ai.languageModel.capabilities();
      return caps.available === "readily";
    } catch {
      return false;
    }
  },
  
  generate: async (prompt, options) => {
    const ai = (window as any).ai;
    const session = await ai.languageModel.create({
      systemPrompt: options?.systemPrompt || SLIDEFORGE_SYSTEM_PROMPT,
      temperature: options?.temperature ?? 0.7,
    });
    
    try {
      return await session.prompt(prompt);
    } finally {
      session.destroy();
    }
  }
};
```

### 5.4 Ollama 实现

```typescript
// lib/ai/providers/ollama.ts

const OLLAMA_BASE = "http://localhost:11434";

export const ollamaProvider: AIProvider = {
  name: "Ollama (Local)",
  priority: 2,
  
  available: async () => {
    try {
      const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
        signal: AbortSignal.timeout(2000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  
  generate: async (prompt, options) => {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",  // 或 qwen2.5
        prompt: `${options?.systemPrompt || SLIDEFORGE_SYSTEM_PROMPT}\n\n${prompt}`,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens ?? 4096,
        }
      })
    });
    
    const data = await res.json();
    return data.response;
  }
};
```

### 5.5 WebLLM 实现

```typescript
// lib/ai/providers/webllm.ts

export const webllmProvider: AIProvider = {
  name: "WebLLM (Browser)",
  priority: 3,
  
  available: async () => {
    if (typeof window === "undefined") return false;
    try {
      // 检查 WebGPU 支持
      const nav = navigator as Navigator;
      if (!nav.gpu) return false;
      const adapter = await nav.gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  },
  
  generate: async (prompt, options) => {
    // 动态加载 WebLLM
    const webllm = await import('@mlc-ai/web-llm');
    const engine = await webllm.CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC');
    
    const response = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: options?.systemPrompt || SLIDEFORGE_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });
    
    return response.choices[0]?.message?.content || '';
  }
};
```

### 5.6 Cloud API 实现

```typescript
// lib/ai/providers/cloud-api.ts

export const cloudAPIProvider: AIProvider = {
  name: "Cloud API",
  priority: 4,
  
  available: async () => {
    // 检查是否配置了 API Key
    return !!getCloudAPIConfig()?.apiKey;
  },
  
  generate: async (prompt, options) => {
    const config = getCloudAPIConfig();
    if (!config) throw new Error('Cloud API not configured');
    
    if (config.type === 'claude') {
      return generateClaude(config, prompt, options);
    } else {
      return generateOpenAICompatible(config, prompt, options);
    }
  }
};

// 支持 OpenAI 兼容 API (OpenAI / DeepSeek 等)
async function generateOpenAICompatible(
  config: CloudAPIConfig,
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const res = await fetch(config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: options?.systemPrompt || SLIDEFORGE_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    })
  });
  
  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}

// 支持 Claude API
async function generateClaude(
  config: CloudAPIConfig,
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-haiku-20240307',
      system: options?.systemPrompt || SLIDEFORGE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
    })
  });
  
  const data = await res.json();
  return data.content[0]?.text || '';
}
```

---

## 6. 错误处理与自修复

### 6.1 错误码定义

```typescript
export enum AIErrorCode {
  // 生成错误 (1xxx)
  GENERATION_FAILED = 1001,
  INVALID_OUTPUT = 1002,
  OUTPUT_TOO_LONG = 1003,
  
  // 协议错误 (2xxx)  
  INVALID_VERSION = 2001,
  MISSING_REQUIRED = 2002,
  INVALID_SLIDE_TYPE = 2003,
  INVALID_ELEMENT_TYPE = 2004,
  INVALID_ANIMATION = 2005,
  
  // Provider 错误 (3xxx)
  NO_PROVIDER = 3001,
  PROVIDER_UNAVAILABLE = 3002,
  RATE_LIMITED = 3003,
}
```

### 6.2 自修复流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AI 生成    │────▶│   校验      │────▶│   成功？    │
│   JSON      │     │  validate   │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │ Yes                 │ No                  │
                         ▼                     ▼                     │
                  ┌─────────────┐     ┌─────────────┐               │
                  │   返回      │     │  构建修复   │               │
                  │  Document   │     │   Prompt    │               │
                  └─────────────┘     └──────┬──────┘               │
                                             │                       │
                                             ▼                       │
                                      ┌─────────────┐               │
                                      │  重试次数   │               │
                                      │   < 3?      │               │
                                      └──────┬──────┘               │
                                             │                       │
                              ┌──────────────┼──────────────┐       │
                              │ Yes          │ No           │       │
                              ▼              ▼              │       │
                       ┌─────────────┐ ┌─────────────┐     │       │
                       │  AI 修复   │ │  返回错误   │     │       │
                       │  重新生成  │ │  + 建议     │     │       │
                       └──────┬──────┘ └─────────────┘     │       │
                              │                             │       │
                              └─────────────────────────────┘       │
                                                                    │
                              └────────────────────────────────────┘
```

### 6.3 修复 Prompt 模板

```markdown
你之前生成的 JSON 有以下错误，请修复：

## 错误列表
{errors}

## 原始输出
{original_output}

## 修复要求
1. 只修复上述错误，保持其他内容不变
2. 输出完整的修复后 JSON
3. 不要添加解释，只输出 JSON
```

---

## 7. 示例与测试

### 7.1 MCP 测试用例

```typescript
// 测试 create_presentation
const result = await mcpClient.callTool("create_presentation", {
  title: "测试演示",
  content: "介绍 AI 技术的发展历程和未来趋势",
  theme: "dark",
  slideCount: 5
});

expect(result.document.version).toBe("1.0");
expect(result.document.slides.length).toBe(5);
```

### 7.2 端侧 AI 测试

```typescript
// 测试 AI 生成
const aiManager = new AIManager();
await aiManager.initialize();

const doc = await aiManager.generateSlides({
  title: "Hello World",
  content: "一个简单的测试演示",
  slideCount: 3
});

const validation = validate(doc);
expect(validation.valid).toBe(true);
```

### 7.3 Claude Desktop 测试对话

```
User: 用 SlideForge 创建一个关于 "远程工作最佳实践" 的演示文稿，5 页，使用 corporate 主题

Claude: [调用 create_presentation 工具]

我已经为你创建了一个关于远程工作最佳实践的演示文稿，包含以下内容：

1. 标题页 - 远程工作最佳实践
2. 议程页 - 今天要讨论的主题
3. 核心实践 - 沟通、时间管理、工具选择
4. 常见挑战与解决方案
5. 总结与行动建议

文档已生成，你可以：
- 使用 validate 工具检查格式
- 使用 export_html 导出为可演示的 HTML
```

---

## 附录

### A. 协议 JSON Schema

完整 Schema 见 `packages/protocol/src/schema.json`

### B. 推荐模型配置

| 场景 | 推荐模型 | 参数 |
|------|---------|------|
| 快速生成 | Gemini Nano | temperature: 0.7 |
| 高质量 | Llama 3.2 8B | temperature: 0.6, top_p: 0.9 |
| 中文优化 | Qwen2.5 7B | temperature: 0.7 |
| 代码页面 | CodeLlama | temperature: 0.3 |

### C. 相关文档

- [PRD 产品需求文档](./PRD.md)
- [DESIGN 技术设计](./DESIGN.md)
- [Protocol 协议规范](../packages/protocol/README.md)
