# SlideForge

> AI-First Slides Protocol Framework + Runtime

SlideForge 是一个开源的、面向 AI 的 HTML Slides 协议框架。它定义了一套标准化的 Slides 生成协议，让 AI 能够生成结构化、可演示、可导出的演示文稿。

## ✨ 特性

- 🤖 **AI-First** - 标准化 JSON 协议，AI 生成更可控
- 🎬 **在线演示** - 全屏演示 + 动画效果 + 演讲者模式
- 📤 **多格式导出** - PDF / HTML / PNG 一键导出
- 🎨 **主题系统** - 内置多套主题，支持自定义
- 📦 **开箱即用** - 丰富的布局模板和动画效果

## 📦 项目结构

```
slideforge/
├── apps/
│   └── web/                 # Next.js Web 应用
├── packages/
│   ├── protocol/            # 协议类型定义 + 校验器
│   └── themes/              # 主题包
└── docs/                    # 文档
```

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

## 📝 协议示例

```json
{
  "version": "1.0",
  "metadata": { "title": "My Presentation" },
  "config": { "theme": "default", "aspectRatio": "16:9" },
  "slides": [
    {
      "type": "title",
      "elements": [
        { "type": "heading", "level": 1, "text": "Hello SlideForge" },
        { "type": "text", "content": "AI-First Slides Framework" }
      ]
    }
  ]
}
```

## 📚 文档

- [PRD 产品需求文档](./docs/PRD.md)

## 📄 License

MIT
