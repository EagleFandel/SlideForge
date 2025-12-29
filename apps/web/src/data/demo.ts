import { SlideDocument } from "@slideforge/protocol";

export const demoDocument: SlideDocument = {
  version: "1.0",
  metadata: {
    id: "demo",
    title: "SlideForge 介绍",
    author: "SlideForge Team",
    createdAt: new Date().toISOString(),
    description: "SlideForge 项目介绍演示文稿",
  },
  config: {
    theme: "dark",
    aspectRatio: "16:9",
    transition: {
      type: "fade",
      duration: 300,
    },
  },
  slides: [
    // Slide 1: Title
    {
      id: "slide-1",
      type: "title",
      layout: "title-center",
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)",
      },
      elements: [
        {
          id: "badge",
          type: "text",
          content: "🚀 开源项目",
          style: {
            color: "rgba(255,255,255,0.6)",
            fontSize: "1rem",
            marginBottom: "1rem",
          },
          animation: { type: "fadeIn", duration: 400 },
        },
        {
          id: "title",
          type: "heading",
          level: 1,
          text: "SlideForge",
          style: {
            background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "5rem",
            fontWeight: "800",
          },
          animation: { type: "fadeInUp", duration: 600 },
        },
        {
          id: "subtitle",
          type: "text",
          content: "面向 AI 的 Slides 协议框架 + Runtime",
          style: { color: "rgba(255,255,255,0.8)", fontSize: "1.5rem" },
          animation: { type: "fadeInUp", delay: 200 },
        },
      ],
      notes: "欢迎使用 SlideForge！这是一个面向 AI 时代的演示文稿框架。",
    },

    // Slide 2: Problem
    {
      id: "slide-2",
      type: "content",
      background: {
        type: "color",
        value: "#0f172a",
      },
      elements: [
        {
          id: "heading",
          type: "heading",
          level: 2,
          text: "🤔 现有方案的问题",
          style: { color: "#fff", marginBottom: "2rem" },
          animation: { type: "fadeInLeft" },
        },
        {
          id: "problems",
          type: "list",
          items: [
            { text: "AI 生成的 PPT 格式不统一，难以预览", icon: "❌" },
            { text: "Markdown 方案表达能力有限", icon: "❌" },
            { text: "现有框架不是为 AI 设计的", icon: "❌" },
            { text: "缺乏标准化的协议和校验机制", icon: "❌" },
          ],
          style: { color: "rgba(255,255,255,0.9)", fontSize: "1.3rem" },
          animation: { type: "fadeInUp", delay: 200, trigger: "sequence" },
        },
      ],
      notes: "介绍现有方案存在的问题，引出 SlideForge 的价值。",
    },

    // Slide 3: Solution
    {
      id: "slide-3",
      type: "content",
      layout: "two-column",
      background: {
        type: "color",
        value: "#0f172a",
      },
      elements: [
        {
          id: "heading",
          type: "heading",
          level: 2,
          text: "✨ SlideForge 的解决方案",
          style: { color: "#fff" },
          animation: { type: "fadeIn" },
        },
        {
          id: "features-1",
          type: "list",
          position: { column: 1 },
          items: [
            { text: "标准化 JSON 协议", icon: "📋" },
            { text: "完整的类型定义", icon: "📝" },
            { text: "内置协议校验器", icon: "✅" },
          ],
          style: { color: "rgba(255,255,255,0.9)" },
          animation: { type: "fadeInLeft", delay: 200 },
        },
        {
          id: "features-2",
          type: "list",
          position: { column: 2 },
          items: [
            { text: "丰富的动画效果", icon: "🎬" },
            { text: "多主题支持", icon: "🎨" },
            { text: "PDF 高质量导出", icon: "📤" },
          ],
          style: { color: "rgba(255,255,255,0.9)" },
          animation: { type: "fadeInRight", delay: 200 },
        },
      ],
      notes: "SlideForge 提供完整的解决方案。",
    },

    // Slide 4: Code Example
    {
      id: "slide-4",
      type: "code",
      background: {
        type: "color",
        value: "#0f172a",
      },
      elements: [
        {
          id: "code-title",
          type: "heading",
          level: 2,
          text: "📝 简洁的协议格式",
          style: { color: "#fff", marginBottom: "1.5rem" },
          animation: { type: "fadeIn" },
        },
        {
          id: "code-block",
          type: "code",
          language: "json",
          content: `{
  "version": "1.0",
  "metadata": { "title": "My Presentation" },
  "config": {
    "theme": "dark",
    "aspectRatio": "16:9"
  },
  "slides": [{
    "type": "title",
    "elements": [{
      "type": "heading",
      "level": 1,
      "text": "Hello World",
      "animation": { "type": "fadeInUp" }
    }]
  }]
}`,
          showLineNumbers: true,
          animation: { type: "fadeInUp", delay: 200 },
        },
      ],
      notes: "展示 SlideForge 协议的简洁性。",
    },

    // Slide 5: Architecture
    {
      id: "slide-5",
      type: "content",
      background: {
        type: "color",
        value: "#0f172a",
      },
      elements: [
        {
          id: "heading",
          type: "heading",
          level: 2,
          text: "🏗️ 技术架构",
          style: { color: "#fff", marginBottom: "2rem" },
          animation: { type: "fadeIn" },
        },
        {
          id: "arch",
          type: "list",
          items: [
            { text: "@slideforge/protocol - 协议类型定义 + 校验器", icon: "📦" },
            { text: "@slideforge/runtime - 渲染引擎 + 动画系统", icon: "⚙️" },
            { text: "@slideforge/themes - 主题包", icon: "🎨" },
            { text: "Next.js Web 应用 - 管理平台", icon: "🌐" },
          ],
          style: { color: "rgba(255,255,255,0.9)", fontSize: "1.2rem" },
          animation: { type: "fadeInUp", delay: 200 },
        },
      ],
      notes: "介绍 SlideForge 的技术架构。",
    },

    // Slide 6: Thank You
    {
      id: "slide-6",
      type: "section",
      layout: "title-center",
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)",
      },
      elements: [
        {
          id: "thanks",
          type: "heading",
          level: 1,
          text: "感谢关注 🙏",
          style: { color: "#fff", fontSize: "3.5rem" },
          animation: { type: "zoomIn" },
        },
        {
          id: "link",
          type: "text",
          content: "github.com/slideforge/slideforge",
          style: { color: "rgba(255,255,255,0.6)", fontSize: "1.2rem" },
          animation: { type: "fadeIn", delay: 500 },
        },
        {
          id: "cta",
          type: "text",
          content: "⭐ Star on GitHub",
          style: {
            color: "#60a5fa",
            fontSize: "1rem",
            marginTop: "2rem",
          },
          animation: { type: "fadeInUp", delay: 800 },
        },
      ],
      notes: "感谢观看，欢迎 Star！",
    },
  ],
};
