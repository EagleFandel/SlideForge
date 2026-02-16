import type { 
  SlideDocument, 
  Slide, 
  SlideType, 
  PosterDocument, 
  PosterTemplate,
  Element,
} from "@slideforge/protocol";

/**
 * MCP Tool Result 类型
 * 符合 MCP 规范的工具返回格式
 */
interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/**
 * 处理工具调用的主入口
 */
export async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (name) {
      case "create_presentation":
        return handleCreatePresentation(args);
      case "add_slide":
        return handleAddSlide(args);
      case "validate":
        return handleValidate(args);
      case "list_themes":
        return handleListThemes();
      case "get_protocol_info":
        return handleGetProtocolInfo();
      case "create_poster":
        return handleCreatePoster(args);
      default:
        return errorResult(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return errorResult(`Error: ${(error as Error).message}`);
  }
}

function successResult(data: unknown): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

function errorResult(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

function handleCreatePresentation(args: Record<string, unknown>): ToolResult {
  const {
    title,
    content,
    theme = "default",
    slideCount = 6,
    language = "zh",
  } = args as {
    title: string;
    content: string;
    theme?: string;
    slideCount?: number;
    language?: string;
  };

  // 解析内容，生成幻灯片
  const contentLines = content.split("\n").filter((l) => l.trim());
  const slides: Slide[] = [];

  // 标题页
  slides.push({
    type: "title",
    elements: [
      { type: "heading", level: 1, text: title },
      {
        type: "text",
        content: contentLines[0] || (language === "zh" ? "演示文稿" : "Presentation"),
      },
    ],
  });

  // 内容页
  const itemsPerSlide = Math.ceil(contentLines.length / (slideCount - 2));
  for (let i = 0; i < slideCount - 2 && i * itemsPerSlide < contentLines.length; i++) {
    const pageItems = contentLines.slice(
      i * itemsPerSlide,
      (i + 1) * itemsPerSlide
    );
    
    slides.push({
      type: "content",
      elements: [
        {
          type: "heading",
          level: 2,
          text: pageItems[0] || `${language === "zh" ? "第" : "Part "}${i + 1}${language === "zh" ? "部分" : ""}`,
        },
        {
          type: "list",
          items: pageItems.slice(1).map((item) => item.trim()),
        },
      ],
    });
  }

  // 结束页
  slides.push({
    type: "section",
    elements: [
      {
        type: "heading",
        level: 1,
        text: language === "zh" ? "谢谢" : "Thank You",
      },
    ],
  });

  const document: SlideDocument = {
    version: "1.0",
    metadata: {
      title,
      createdAt: new Date().toISOString(),
    },
    config: {
      theme: theme as string,
      aspectRatio: "16:9",
    },
    slides,
  };

  return successResult({
    document,
    stats: {
      slideCount: slides.length,
      elementCount: slides.reduce((sum, s) => sum + s.elements.length, 0),
    },
  });
}

function handleAddSlide(args: Record<string, unknown>): ToolResult {
  const { type, title, content, layout } = args as {
    type: SlideType;
    title?: string;
    content?: string;
    layout?: string;
  };

  const elements: any[] = [];

  if (title) {
    elements.push({
      type: "heading",
      level: type === "title" || type === "section" ? 1 : 2,
      text: title,
    });
  }

  if (content) {
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length > 1) {
      elements.push({
        type: "list",
        items: lines,
      });
    } else if (lines.length === 1) {
      elements.push({
        type: "text",
        content: lines[0],
      });
    }
  }

  const slide: Slide = {
    type,
    layout,
    elements,
  };

  return successResult({ slide });
}

function handleValidate(args: Record<string, unknown>): ToolResult {
  const { document } = args as { document: unknown };
  const errors: Array<{ path: string; message: string; suggestion?: string }> = [];

  if (!document || typeof document !== "object") {
    return successResult({
      valid: false,
      errors: [{ path: "", message: "Document must be an object" }],
    });
  }

  const doc = document as Record<string, unknown>;

  // 检查必填字段
  if (!doc.version) {
    errors.push({
      path: "version",
      message: "Missing required field: version",
      suggestion: 'Add "version": "1.0"',
    });
  }

  if (!doc.metadata || typeof doc.metadata !== "object") {
    errors.push({
      path: "metadata",
      message: "Missing required field: metadata",
      suggestion: 'Add "metadata": { "title": "Your Title" }',
    });
  } else {
    const meta = doc.metadata as Record<string, unknown>;
    if (!meta.title) {
      errors.push({
        path: "metadata.title",
        message: "Missing required field: metadata.title",
        suggestion: "Add a title to metadata",
      });
    }
  }

  if (!doc.config || typeof doc.config !== "object") {
    errors.push({
      path: "config",
      message: "Missing required field: config",
      suggestion: 'Add "config": { "theme": "default", "aspectRatio": "16:9" }',
    });
  }

  if (!Array.isArray(doc.slides)) {
    errors.push({
      path: "slides",
      message: "slides must be an array",
      suggestion: "Add slides: [{ type: 'title', elements: [...] }]",
    });
  } else {
    doc.slides.forEach((slide: any, i: number) => {
      if (!slide.type) {
        errors.push({
          path: `slides[${i}].type`,
          message: "Missing slide type",
          suggestion: "Valid types: title, section, content, image, code, quote, blank",
        });
      }
      if (!Array.isArray(slide.elements)) {
        errors.push({
          path: `slides[${i}].elements`,
          message: "elements must be an array",
        });
      }
    });
  }

  return successResult({
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  });
}

function handleListThemes(): ToolResult {
  return successResult({
    themes: [
      { name: "default", description: "简洁现代，蓝白配色，适合通用场景" },
      { name: "dark", description: "深色科技风，适合技术分享" },
      { name: "corporate", description: "商务专业，深蓝灰配色，适合企业汇报" },
      { name: "creative", description: "创意活泼，多彩渐变，适合产品发布" },
      { name: "academic", description: "学术严谨，黑白蓝配色，适合论文答辩" },
      { name: "minimal", description: "极简留白，纯黑白，适合艺术展示" },
    ],
  });
}

function handleGetProtocolInfo(): ToolResult {
  return successResult({
    version: "1.0",
    slideTypes: [
      "title - 标题页",
      "section - 章节页",
      "content - 内容页",
      "image - 图片页",
      "code - 代码页",
      "comparison - 对比页",
      "quote - 引用页",
      "blank - 空白页",
    ],
    elementTypes: [
      "heading - 标题 (level: 1-6, text: string)",
      "text - 文本 (content: string)",
      "list - 列表 (items: string[])",
      "image - 图片 (src: string)",
      "code - 代码 (language: string, content: string)",
    ],
    animationTypes: [
      "fadeIn",
      "fadeInUp",
      "fadeInLeft",
      "fadeInRight",
      "zoomIn",
      "slideInLeft",
      "slideInRight",
    ],
    minimalExample: {
      version: "1.0",
      metadata: { title: "My Presentation" },
      config: { theme: "default", aspectRatio: "16:9" },
      slides: [
        {
          type: "title",
          elements: [{ type: "heading", level: 1, text: "Hello SlideForge" }],
        },
      ],
    },
  });
}


function handleCreatePoster(args: Record<string, unknown>): ToolResult {
  const {
    title,
    content,
    template = "card",
    theme = "default",
    author,
    image,
  } = args as {
    title: string;
    content: string;
    template?: PosterTemplate;
    theme?: string;
    author?: string;
    image?: string;
  };

  // 解析 Markdown 内容
  const lines = content.split("\n").filter((l) => l.trim());
  let subtitle: string | undefined;
  let body: string | undefined;
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // 副标题 (## 开头)
    if (trimmed.startsWith("## ")) {
      subtitle = trimmed.slice(3).trim();
      continue;
    }
    
    // 列表项
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      items.push(trimmed.slice(2).trim());
      continue;
    }
    
    // 普通文本
    if (trimmed && !trimmed.startsWith("#")) {
      if (!body) {
        body = trimmed;
      } else {
        body += "\n" + trimmed;
      }
    }
  }

  // 根据模板确定尺寸
  const size = template === "social" 
    ? { width: 1200, height: 630 as number | "auto" }
    : { width: 800, height: "auto" as number | "auto" };

  const poster: PosterDocument = {
    version: "1.0",
    type: "poster",
    metadata: {
      title,
      createdAt: new Date().toISOString(),
    },
    config: {
      template,
      theme,
      size,
    },
    content: {
      title,
      subtitle,
      body,
      author,
      image,
    },
  };

  return successResult({
    poster,
    info: {
      template,
      size,
      hasImage: !!image,
      itemCount: items.length,
    },
  });
}
