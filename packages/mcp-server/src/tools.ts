import type { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * SlideForge MCP Tools
 * 
 * 遵循 MCP 规范定义的工具集，用于 AI 生成和管理演示文稿
 */
export const tools: Tool[] = [
  {
    name: "create_presentation",
    description: `创建一个完整的 SlideForge 演示文稿。

输入内容描述或大纲，生成符合 SlideForge Protocol v1.0 的 JSON 文档。
支持指定主题、页数等参数。

返回完整的 SlideDocument JSON，可直接用于渲染和演示。`,
    inputSchema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "演示文稿标题",
        },
        content: {
          type: "string",
          description: "内容描述或大纲，将据此生成幻灯片内容（每行一个要点）",
        },
        theme: {
          type: "string",
          enum: ["default", "dark", "corporate", "creative", "academic", "minimal"],
          description: "主题名称，默认 default",
        },
        slideCount: {
          type: "number",
          description: "目标页数，建议 4-12，默认 6",
        },
        language: {
          type: "string",
          enum: ["zh", "en"],
          description: "语言，默认 zh",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "add_slide",
    description: `向演示文稿添加一页幻灯片。

用于增量构建或修改现有文档。返回单个 Slide 对象，可添加到 slides 数组中。`,
    inputSchema: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["title", "section", "content", "image", "code", "comparison", "quote", "blank"],
          description: "页面类型",
        },
        title: {
          type: "string",
          description: "页面标题（可选）",
        },
        content: {
          type: "string",
          description: "页面内容，文本或列表项用换行分隔（可选）",
        },
        layout: {
          type: "string",
          enum: ["default", "title-center", "two-column", "image-left", "image-right"],
          description: "布局模板（可选）",
        },
      },
      required: ["type"],
    },
  },
  {
    name: "validate",
    description: `校验 SlideForge JSON 文档是否符合协议规范。

返回详细的错误信息和修复建议，帮助 AI 自动修复问题。
错误信息包含 JSON path，便于定位问题。`,
    inputSchema: {
      type: "object" as const,
      properties: {
        document: {
          type: "object",
          description: "待校验的 SlideDocument JSON 对象",
        },
      },
      required: ["document"],
    },
  },
  {
    name: "list_themes",
    description: "列出所有可用的主题及其描述，帮助选择合适的视觉风格。",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_protocol_info",
    description: `获取 SlideForge 协议的关键信息，包括：
- 支持的页面类型 (SlideType)
- 支持的元素类型 (ElementType)  
- 支持的动画类型 (AnimationType)
- 最小可用示例

在生成演示文稿前调用此工具了解协议规范。`,
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "create_poster",
    description: `创建一个 SlideForge 海报。

将文本内容或 Markdown 转换为精美海报，支持多种模板。
适合社交分享、名言卡片、要点总结等场景。

返回 PosterDocument JSON，可导出为 PNG 图片。`,
    inputSchema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "海报标题",
        },
        content: {
          type: "string",
          description: "海报内容，支持 Markdown 格式（## 副标题，- 列表项）",
        },
        template: {
          type: "string",
          enum: ["card", "social", "quote", "list", "minimal"],
          description: "模板类型，默认 card",
        },
        theme: {
          type: "string",
          enum: ["default", "dark", "corporate"],
          description: "主题名称，默认 default",
        },
        author: {
          type: "string",
          description: "作者名称，用于引用卡片（可选）",
        },
        image: {
          type: "string",
          description: "图片 URL（可选）",
        },
      },
      required: ["title", "content"],
    },
  },
];
