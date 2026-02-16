# SlideForge 示例和教程

本文档提供了 SlideForge 的各种使用示例和教程。

## 目录

1. [基础示例](#基础示例)
2. [AI 生成示例](#ai-生成示例)
3. [高级用法](#高级用法)
4. [集成示例](#集成示例)
5. [常见场景](#常见场景)

---

## 基础示例

### 示例 1：最小演示文稿

最简单的 SlideForge 演示文稿：

```json
{
  "version": "1.0",
  "metadata": {
    "title": "Hello SlideForge"
  },
  "config": {
    "theme": "default",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "title",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "Hello SlideForge"
        }
      ]
    }
  ]
}
```

### 示例 2：多页演示文稿

包含多种页面类型的演示文稿：

```json
{
  "version": "1.0",
  "metadata": {
    "title": "产品介绍",
    "author": "AI Assistant"
  },
  "config": {
    "theme": "dark",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "title",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "SlideForge"
        },
        {
          "type": "text",
          "content": "让 AI 生成的想法，第一次拥有可靠的展示终点"
        }
      ]
    },
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "核心功能"
        },
        {
          "type": "list",
          "items": [
            "AI 生成演示文稿",
            "在线演示和动画",
            "多格式导出"
          ]
        }
      ]
    },
    {
      "type": "code",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "简单的协议格式"
        },
        {
          "type": "code",
          "language": "json",
          "content": "{\n  \"type\": \"content\",\n  \"elements\": [\n    { \"type\": \"heading\", \"text\": \"Hello\" }\n  ]\n}"
        }
      ]
    }
  ]
}
```

### 示例 3：带动画的演示文稿

使用动画效果的演示文稿：

```json
{
  "version": "1.0",
  "metadata": {
    "title": "动画演示"
  },
  "config": {
    "theme": "default",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "动画效果",
          "animation": {
            "type": "fadeInUp",
            "duration": 600
          }
        },
        {
          "type": "list",
          "items": [
            "第一项",
            "第二项",
            "第三项"
          ],
          "animation": {
            "type": "fadeInLeft",
            "trigger": "sequence",
            "delay": 100
          }
        }
      ]
    }
  ]
}
```

---

## AI 生成示例

### 示例 1：使用 Chrome AI 生成

```typescript
import { AIManager } from '@/lib/ai';

const aiManager = new AIManager();
await aiManager.initialize();

const doc = await aiManager.generateSlides({
  title: "远程工作最佳实践",
  content: "介绍远程工作的优势、挑战和最佳实践",
  theme: "corporate",
  slideCount: 5
});

console.log(doc);
```

### 示例 2：使用 Ollama 生成

```typescript
import { AIManager } from '@/lib/ai';

const aiManager = new AIManager();
await aiManager.initialize();

// 确保 Ollama 正在运行
// ollama serve

const doc = await aiManager.generateSlides({
  title: "技术分享：TypeScript",
  content: "TypeScript 的基础、高级特性和最佳实践",
  theme: "dark",
  slideCount: 8
});
```

### 示例 3：使用 Cloud API 生成

```typescript
import { configureCloudAPI } from '@/lib/ai/providers/cloud-api';
import { AIManager } from '@/lib/ai';

// 配置 OpenAI
configureCloudAPI({
  type: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4o-mini'
});

const aiManager = new AIManager();
await aiManager.initialize();

const doc = await aiManager.generateSlides({
  title: "AI 应用开发",
  content: "如何使用 LLM 构建 AI 应用",
  theme: "creative",
  slideCount: 6
});
```

---

## 高级用法

### 示例 1：自定义主题

```css
/* packages/themes/src/custom.css */

:root {
  --sf-color-primary: #ff6b6b;
  --sf-color-background: #f8f9fa;
  --sf-color-text: #2d3436;
  --sf-font-heading: 'Playfair Display', serif;
  --sf-font-body: 'Inter', sans-serif;
  --sf-font-size-h1: 4rem;
  --sf-font-size-h2: 2.5rem;
  --sf-spacing-base: 1.5rem;
}
```

### 示例 2：自定义 AI Provider

```typescript
import type { AIProvider } from '@/lib/ai/types';

export const customProvider: AIProvider = {
  name: "Custom AI",
  priority: 5,
  
  available: async () => {
    // 检查你的 AI 服务是否可用
    return true;
  },
  
  generate: async (prompt, options) => {
    // 调用你的 AI 服务
    const response = await fetch('https://your-ai-service.com/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    return data.result;
  }
};
```

### 示例 3：编程方式创建演示文稿

```typescript
import { SlideDocument, Slide, Element } from '@slideforge/protocol';

const createPresentation = (): SlideDocument => {
  const slides: Slide[] = [
    {
      type: 'title',
      elements: [
        {
          type: 'heading',
          level: 1,
          text: 'My Presentation'
        }
      ]
    },
    {
      type: 'content',
      elements: [
        {
          type: 'heading',
          level: 2,
          text: 'Content'
        },
        {
          type: 'list',
          items: ['Item 1', 'Item 2', 'Item 3']
        }
      ]
    }
  ];

  return {
    version: '1.0',
    metadata: {
      title: 'My Presentation'
    },
    config: {
      theme: 'default',
      aspectRatio: '16:9'
    },
    slides
  };
};

const doc = createPresentation();
```

---

## 集成示例

### 示例 1：在 Claude Desktop 中使用

```
用户: 用 SlideForge 创建一个关于 "AI 安全" 的演示文稿

Claude: 我来帮你创建一个关于 AI 安全的演示文稿。

[调用 create_presentation 工具]

我已经为你创建了一个包含以下内容的演示文稿：

1. 标题页 - AI 安全
2. 议程页
3. AI 安全的重要性
4. 常见风险
5. 最佳实践
6. 总结

你可以：
- 使用 export_html 导出为 HTML
- 使用 validate 检查格式
- 使用 create_poster 创建海报
```

### 示例 2：REST API 调用

```bash
# 校验演示文稿
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d @presentation.json

# 导出为 HTML
curl -X POST http://localhost:3000/api/export/html \
  -H "Content-Type: application/json" \
  -d @presentation.json \
  -o presentation.html
```

### 示例 3：在 Node.js 中使用

```typescript
import { validateDocument } from '@slideforge/protocol';

const doc = {
  version: '1.0',
  metadata: { title: 'Test' },
  config: { theme: 'default', aspectRatio: '16:9' },
  slides: [
    {
      type: 'title',
      elements: [
        { type: 'heading', level: 1, text: 'Hello' }
      ]
    }
  ]
};

const result = validateDocument(doc);
console.log(result.valid); // true
```

---

## 常见场景

### 场景 1：产品演讲

```json
{
  "version": "1.0",
  "metadata": {
    "title": "产品发布会"
  },
  "config": {
    "theme": "corporate",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "title",
      "elements": [
        {
          "type": "heading",
          "level": 1,
          "text": "产品名称"
        },
        {
          "type": "text",
          "content": "产品标语"
        }
      ]
    },
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "问题陈述"
        },
        {
          "type": "text",
          "content": "用户面临的问题..."
        }
      ]
    },
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "我们的解决方案"
        },
        {
          "type": "list",
          "items": [
            "功能 1",
            "功能 2",
            "功能 3"
          ]
        }
      ]
    }
  ]
}
```

### 场景 2：技术分享

```json
{
  "version": "1.0",
  "metadata": {
    "title": "技术分享：React Hooks"
  },
  "config": {
    "theme": "dark",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "code",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "useState Hook"
        },
        {
          "type": "code",
          "language": "typescript",
          "content": "const [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>\n);"
        }
      ]
    }
  ]
}
```

### 场景 3：周报汇报

```json
{
  "version": "1.0",
  "metadata": {
    "title": "周报 - 第 1 周"
  },
  "config": {
    "theme": "corporate",
    "aspectRatio": "16:9"
  },
  "slides": [
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "本周完成"
        },
        {
          "type": "list",
          "items": [
            "完成任务 A",
            "完成任务 B",
            "完成任务 C"
          ]
        }
      ]
    },
    {
      "type": "content",
      "elements": [
        {
          "type": "heading",
          "level": 2,
          "text": "下周计划"
        },
        {
          "type": "list",
          "items": [
            "计划 A",
            "计划 B",
            "计划 C"
          ]
        }
      ]
    }
  ]
}
```

---

## 更多资源

- 📖 [完整文档](./docs)
- 🤖 [AI 集成指南](./docs/AI_INTEGRATION.md)
- 📋 [协议规范](./docs/DESIGN.md)
- 💬 [社区讨论](https://github.com/slideforge/slideforge/discussions)

---

有问题？欢迎在 [Discussions](https://github.com/slideforge/slideforge/discussions) 中提问！
