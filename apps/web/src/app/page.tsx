"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-8 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>开源项目 · MIT License</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SlideForge
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
              面向 AI 的 Slides 协议框架 + Runtime
            </p>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto">
              标准化 JSON 协议，让 AI 生成的演示文稿可演示、可管理、可导出
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/slides/demo"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                查看演示
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <a
                href="https://github.com/slideforge/slideforge"
                target="_blank"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">核心特性</h2>
          <p className="text-slate-400">为 AI 时代重新设计的演示文稿框架</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Preview Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">简洁的 JSON 协议</h2>
            <p className="text-slate-400 mb-6">
              结构化的 JSON 格式，AI 生成更可控，校验更简单。
              支持丰富的元素类型、动画效果和布局模板。
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                完整的 TypeScript 类型定义
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                JSON Schema 校验支持
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                AI Prompt 模板库
              </li>
            </ul>
          </div>
          <div className="bg-slate-950 rounded-2xl p-6 border border-white/10 font-mono text-sm overflow-hidden">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <pre className="text-slate-300 overflow-x-auto"><code>{codeExample}</code></pre>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>MIT License · Made with ❤️ for the AI era</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "🤖",
    title: "AI-First 设计",
    description: "专为 AI 生成优化的协议，结构化 JSON 比 Markdown 更可控，校验更简单。",
  },
  {
    icon: "🎬",
    title: "在线演示",
    description: "全屏演示模式，支持键盘导航、触控手势、演讲者备注和计时器。",
  },
  {
    icon: "✨",
    title: "丰富动画",
    description: "内置 15+ 种入场动画和页面切换效果，支持序列触发和自定义时序。",
  },
  {
    icon: "🎨",
    title: "主题系统",
    description: "6 套内置主题，CSS 变量驱动，支持完全自定义品牌样式。",
  },
  {
    icon: "📤",
    title: "多格式导出",
    description: "高质量 PDF 导出，静态 HTML 打包，图片序列生成。",
  },
  {
    icon: "🔌",
    title: "易于集成",
    description: "提供 MCP Server、REST API 和 NPM 包，轻松集成到任何 AI 应用。",
  },
];

const codeExample = `{
  "version": "1.0",
  "metadata": { "title": "My Slides" },
  "config": {
    "theme": "dark",
    "aspectRatio": "16:9"
  },
  "slides": [{
    "type": "title",
    "elements": [{
      "type": "heading",
      "level": 1,
      "text": "Hello SlideForge",
      "animation": { "type": "fadeInUp" }
    }]
  }]
}`;
