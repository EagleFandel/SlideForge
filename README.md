# SlideForge

> **让 AI 生成的想法，第一次拥有可靠的展示终点。**

**v0.1 Release Ready** | [文档](./docs) | [社区](./COMMUNITY.md) | [GitHub](https://github.com/slideforge/slideforge)

---

## 🎯 北极星场景

**AI 自动生成可演示、可交付的 Slides**

SlideForge 不是给人类手写 PPT 用的工具，而是 **LLM 的 Slides Output Renderer**。

```
AI 生成 JSON → 协议校验 → 立即演示 → 稳定导出
```

## 💡 核心理念

> **Slides 不再是文件，而是一种可计算的内容结构。**

| 现有方案 | 问题 | SlideForge |
|---------|------|------------|
| AI 生成 PPT | 格式不统一，无法预览 | 标准化 JSON 协议 |
| Markdown Slides | 表达能力有限 | 结构化 + 丰富元素 |
| PowerPoint API | 复杂，AI 难以生成 | AI 首次成功率 >95% |

## ✨ 特性

- 🤖 **AI-First** - 标准化 JSON 协议，Safe Defaults，AI 生成成功率 >95%
- 🎬 **在线演示** - 全屏演示 + 动画效果 + 演讲者模式 + 概览模式
- 📤 **多格式导出** - PDF / HTML / JSON / PNG 一键导出 + 批量导出
- 🎨 **主题系统** - 内置 6 套主题，CSS 变量驱动
- 🔌 **易于集成** - MCP Server / REST API / NPM 包
- 🧠 **4 种 AI Provider** - Chrome AI / Ollama / WebLLM / Cloud API
- 🖼️ **海报系统** - 5 种模板，Markdown 解析，QR 码生成

## 📦 项目结构

```
slideforge/
├── apps/
│   └── web/                 # Next.js Web 应用
├── packages/
│   ├── protocol/            # @slideforge/protocol - 类型 + 校验
│   ├── themes/              # @slideforge/themes - 主题包
│   └── mcp-server/          # @slideforge/mcp-server - MCP Server
└── docs/
    ├── PRD.md               # 产品需求文档
    ├── DESIGN.md            # 技术设计文档
    ├── AI_INTEGRATION.md    # AI 集成规范
    └── DEVELOPMENT_PLAN.md  # 开发计划
```

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/slideforge/slideforge.git
cd slideforge

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 使用 MCP Server（Claude Desktop）

1. 安装 Claude Desktop
2. 编辑配置文件：
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "slideforge": {
      "command": "npx",
      "args": ["-y", "@slideforge/mcp-server"]
    }
  }
}
```

3. 重启 Claude Desktop，即可使用 SlideForge Tools

### 使用 Web 应用

1. 访问 Dashboard：`http://localhost:3000/dashboard`
2. 点击 "✨ AI 生成" 按钮
3. 输入演示文稿主题和内容
4. 自动生成 JSON 并预览
5. 导出为 HTML / PDF / JSON

## 📝 协议示例（最小可用）

```json
{
  "version": "1.0",
  "metadata": { "title": "My Presentation" },
  "config": { "theme": "default", "aspectRatio": "16:9" },
  "slides": [
    {
      "type": "title",
      "elements": [
        { "type": "heading", "level": 1, "text": "Hello SlideForge" }
      ]
    }
  ]
}
```

AI 只需要输出 `type` + `content`，其他字段全部可省略（Safe Defaults）。

## 🤖 AI 集成

### MCP Server Tools

```
create_presentation  - 创建完整演示文稿
add_slide           - 添加单页幻灯片
validate            - 校验协议合规性
export_html         - 导出 HTML
create_poster       - 创建海报
list_themes         - 列出可用主题
get_protocol_schema - 获取协议 Schema
```

### AI Provider 优先级

1. **Chrome AI** (Gemini Nano) - 免费、快速、无需下载
2. **Ollama** (本地) - 模型选择多、质量高
3. **WebLLM** (浏览器内) - 完全离线、跨浏览器
4. **Cloud API** (用户自带 Key) - OpenAI / Claude / DeepSeek

### 首次成功率

- 首次生成成功率 > 95%
- 错误信息包含 JSON path 和修复建议
- 支持自动重试修复（最多 3 次）

## 📚 文档

### 快速开始

- [🚀 快速开始指南](./GETTING_STARTED.md) - 5 分钟上手 SlideForge
- [📖 示例和教程](./EXAMPLES.md) - 各种使用场景的代码示例
- [❓ 常见问题 (FAQ)](./FAQ.md) - 50+ 个常见问题解答

### 产品文档

- [📋 PRD 产品需求文档](./docs/PRD.md) - 完整的产品设计和理念
- [🏗️ DESIGN 技术设计](./docs/DESIGN.md) - 架构和技术方案
- [🤖 AI_INTEGRATION AI 集成规范](./docs/AI_INTEGRATION.md) - MCP Server + Prompt 工程
- [📊 DEVELOPMENT_PLAN 开发计划](./docs/DEVELOPMENT_PLAN.md) - 功能完成状态和路线图
- [✅ COMPLETION_SUMMARY 完成总结](./docs/COMPLETION_SUMMARY.md) - v0.1 功能清单和统计

### 社区和贡献

- [🤝 贡献指南](./CONTRIBUTING.md) - 如何贡献代码、文档或反馈
- [💬 社区指南](./COMMUNITY.md) - 社区价值观、参与方式和规则
- [📜 行为准则](./CODE_OF_CONDUCT.md) - 社区行为标准和报告机制
- [🎉 社区建立总结](./COMMUNITY_SETUP.md) - 社区基础设施概览

### 发布相关

- [📋 发布检查清单](./RELEASE_CHECKLIST.md) - v0.1 发布前后的检查项

## 🎨 主题

内置 6 套主题：

- `default` - 简洁现代，蓝白配色
- `dark` - 深色科技风
- `corporate` - 商务专业
- `creative` - 创意活泼
- `academic` - 学术严谨
- `minimal` - 极简留白

## 💬 社区

我们有一个充满活力的社区！欢迎加入：

- 📖 [快速开始指南](./GETTING_STARTED.md) - 5 分钟上手
- 💡 [示例和教程](./EXAMPLES.md) - 学习各种用法
- ❓ [常见问题](./FAQ.md) - 解答你的疑问
- 🤝 [贡献指南](./CONTRIBUTING.md) - 如何参与
- 💬 [社区指南](./COMMUNITY.md) - 社区规则和价值观
- 📜 [行为准则](./CODE_OF_CONDUCT.md) - 我们的承诺

### 获取帮助

- 📚 查看 [完整文档](./docs)
- 💬 在 [GitHub Discussions](https://github.com/slideforge/slideforge/discussions) 中提问
- 🐛 [报告 Bug](https://github.com/slideforge/slideforge/issues)
- 💡 [建议功能](https://github.com/slideforge/slideforge/issues)

## 🚧 Roadmap

### v0.1 (当前) ✅
- [x] 协议定义 + 类型
- [x] 渲染引擎 + 演示
- [x] Dashboard 管理平台
- [x] 多格式导出（HTML / PDF / JSON）
- [x] MCP Server + REST API
- [x] 4 种 AI Provider
- [x] 海报系统 + QR 码
- [x] 批量导出

### v0.2 (计划中)
- [ ] 云端同步（可选）
- [ ] 协作编辑
- [ ] 更多主题和动画
- [ ] 性能优化
- [ ] 移动端适配完善
- [ ] 国际化支持

## 📊 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 语言 | TypeScript (严格模式) |
| 样式 | Tailwind CSS + CSS Variables |
| 状态 | Zustand |
| 动画 | Framer Motion |
| 存储 | Dexie.js (IndexedDB) |
| 包管理 | pnpm + Turborepo |
| AI | Chrome AI / Ollama / WebLLM / Cloud API |

## 🤝 贡献

欢迎各种形式的贡献！

- 🐛 [报告 Bug](https://github.com/slideforge/slideforge/issues/new?template=bug_report.md)
- 💡 [建议功能](https://github.com/slideforge/slideforge/issues/new?template=feature_request.md)
- 📝 改进文档
- 💻 提交代码

详见 [贡献指南](./CONTRIBUTING.md)

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](./LICENSE) file for details.

### What does Apache 2.0 mean?

- ✅ You can use, modify, and distribute this code
- ✅ You can use it for commercial purposes
- ✅ You can keep modifications private
- ✅ You can build closed-source products
- 📋 You must include the license and copyright notice
- 📋 You must state significant changes
- 📋 You must include a copy of the license

In short: **Use it however you want, just give credit.**

See [APACHE_2_0_GUIDE.md](./APACHE_2_0_GUIDE.md) for detailed explanation.
