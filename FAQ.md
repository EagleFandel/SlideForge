# 常见问题 (FAQ)

## 基础问题

### Q: SlideForge 是什么？

A: SlideForge 是一个 **AI-First** 的 Slides 协议框架 + Runtime。它让 AI 能够生成可靠的、可演示的演示文稿。

核心理念：Slides 不再是文件，而是一种可计算的内容结构。

### Q: SlideForge 和 PowerPoint/Keynote 有什么区别？

A: SlideForge 不是给人类手写 PPT 的工具，而是 **LLM 的 Slides Output Renderer**。

- PowerPoint/Keynote：人类编辑工具
- SlideForge：AI 生成工具

### Q: SlideForge 支持哪些功能？

A: SlideForge 支持：

- 🤖 AI 生成演示文稿（4 种 AI Provider）
- 🎬 在线演示和动画效果
- 📤 多格式导出（JSON、HTML、PDF、PNG）
- 🎨 6 套内置主题
- 🖼️ 海报生成系统
- 🔌 MCP Server 集成
- 📊 完整的协议规范

## 安装和使用

### Q: 如何安装 SlideForge？

A: 有两种方式：

**方式一：本地开发**
```bash
git clone https://github.com/slideforge/slideforge.git
cd slideforge
pnpm install
pnpm dev
```

**方式二：使用 MCP Server**
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

### Q: 系统要求是什么？

A: 
- Node.js 18+
- pnpm 8+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### Q: 我可以离线使用 SlideForge 吗？

A: 可以。使用以下方式之一：

1. **WebLLM Provider** - 浏览器内离线 AI
2. **Ollama** - 本地 AI 服务
3. 导入预先生成的 JSON 文件

### Q: 我的数据存储在哪里？

A: 所有数据都存储在浏览器的 IndexedDB 中，不会上传到任何服务器。完全隐私友好。

## AI 和生成

### Q: SlideForge 支持哪些 AI Provider？

A: 支持 4 种，按优先级排列：

1. **Chrome Built-in AI** (Gemini Nano) - 无需下载，2-5s 响应
2. **Ollama** (本地) - 模型选择多
3. **WebLLM** (浏览器内) - 完全离线
4. **Cloud API** (用户自带 Key) - OpenAI / Claude / DeepSeek

### Q: AI 生成的成功率是多少？

A: 首次生成成功率 > 95%。如果生成失败，系统会自动重试修复（最多 3 次）。

### Q: 我可以使用自己的 AI 模型吗？

A: 可以。你可以：

1. 使用 Ollama 运行本地模型
2. 使用 Cloud API 配置自己的 API Key
3. 实现自定义 AIProvider 接口

### Q: AI 生成的演示文稿质量如何？

A: 质量取决于：

- AI 模型的能力（Chrome AI < Ollama < Claude）
- 输入的 Prompt 质量
- 演示文稿的复杂度

建议使用更强大的模型（如 Claude）获得更好的质量。

## 协议和格式

### Q: 什么是 SlideForge Protocol？

A: SlideForge Protocol 是一个标准化的 JSON 格式，用于定义演示文稿。

最小示例：
```json
{
  "version": "1.0",
  "metadata": { "title": "My Presentation" },
  "config": { "theme": "default", "aspectRatio": "16:9" },
  "slides": [
    {
      "type": "title",
      "elements": [
        { "type": "heading", "level": 1, "text": "Hello" }
      ]
    }
  ]
}
```

### Q: 支持哪些页面类型？

A: 支持 9 种：

- `title` - 标题页
- `section` - 章节页
- `content` - 内容页
- `image` - 图片页
- `code` - 代码页
- `comparison` - 对比页
- `timeline` - 时间线页
- `quote` - 引用页
- `blank` - 空白页

### Q: 支持哪些元素类型？

A: 支持 9 种：

- `heading` - 标题
- `text` - 文本
- `list` - 列表
- `image` - 图片
- `code` - 代码块
- `chart` - 图表
- `shape` - 形状
- `video` - 视频
- `table` - 表格

### Q: 支持哪些动画？

A: 支持 15 种动画：

- `fadeIn` - 淡入
- `fadeInUp` - 向上淡入
- `slideInLeft` - 从左滑入
- `slideInRight` - 从右滑入
- `zoomIn` - 缩放进入
- `typewriter` - 打字机效果
- 等等...

### Q: 我可以自定义协议吗？

A: 不建议。SlideForge Protocol 是标准化的，修改可能导致兼容性问题。

但你可以：
- 使用所有可选字段
- 自定义主题
- 添加自定义 CSS

## 主题和样式

### Q: 支持哪些主题？

A: 内置 6 套主题：

- `default` - 简洁现代，蓝白配色
- `dark` - 深色科技风
- `corporate` - 商务专业
- `creative` - 创意活泼
- `academic` - 学术严谨
- `minimal` - 极简留白

### Q: 我可以自定义主题吗？

A: 可以。主题使用 CSS 变量，你可以：

1. 修改 `packages/themes/src/` 中的 CSS 文件
2. 创建新主题
3. 在运行时覆盖 CSS 变量

### Q: 如何创建新主题？

A: 
1. 在 `packages/themes/src/` 创建 `{theme-name}.css`
2. 定义所有 `--sf-*` CSS 变量
3. 在 `packages/themes/src/index.ts` 导出

参考现有主题的结构。

## 导出和分享

### Q: 支持哪些导出格式？

A: 支持 4 种：

- **JSON** - 原始协议数据
- **HTML** - 独立可运行的 HTML 文件
- **PDF** - 打印友好的 PDF
- **PNG** - 海报图片

### Q: 导出的 HTML 可以离线使用吗？

A: 可以。导出的 HTML 包含所有必要的资源，可以完全离线使用。

### Q: 我可以批量导出吗？

A: 可以。使用批量导出功能，可以将多个演示文稿打包为 ZIP 文件。

### Q: 导出的文件大小是多少？

A: 取决于内容：

- JSON：通常 10-100 KB
- HTML：通常 100-500 KB
- PDF：通常 500 KB - 5 MB

## 性能和限制

### Q: SlideForge 可以处理多少页？

A: 理论上没有限制，但建议：

- 小型演示：1-20 页
- 中型演示：20-100 页
- 大型演示：100+ 页（可能需要虚拟滚动优化）

### Q: 演示文稿的最大文件大小是多少？

A: 没有硬性限制，但建议不超过 10 MB。

### Q: 性能如何？

A: 
- 加载时间：< 2 秒（小型演示）
- 动画帧率：60 FPS
- 内存占用：< 100 MB（小型演示）

## 集成和 API

### Q: 我可以在我的应用中使用 SlideForge 吗？

A: 可以。有多种集成方式：

1. **MCP Server** - 在 Claude Desktop 中使用
2. **REST API** - HTTP 调用
3. **NPM 包** - 在 Node.js 中使用
4. **Web 组件** - 在网页中嵌入

### Q: 如何使用 MCP Server？

A: 
1. 在 Claude Desktop 配置中添加 SlideForge MCP Server
2. 在 Claude 中使用 SlideForge Tools
3. 生成演示文稿

详见 [GETTING_STARTED.md](./GETTING_STARTED.md)

### Q: 有 REST API 吗？

A: 有。支持以下端点：

- `POST /api/validate` - 校验协议
- `POST /api/export/html` - 导出 HTML

### Q: 我可以自托管 SlideForge 吗？

A: 可以。SlideForge 是开源的，你可以：

1. Fork 仓库
2. 部署到自己的服务器
3. 自定义和扩展

## 贡献和社区

### Q: 我可以贡献代码吗？

A: 当然！我们欢迎各种形式的贡献。

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

### Q: 如何报告 Bug？

A: 
1. 在 GitHub 创建 Issue
2. 使用 Bug Report 模板
3. 提供详细的复现步骤

### Q: 如何建议新功能？

A: 
1. 在 GitHub 创建 Issue
2. 使用 Feature Request 模板
3. 清晰描述使用场景

### Q: 有社区讨论区吗？

A: 有。在 GitHub Discussions 中讨论：

- 问题和帮助
- 想法和建议
- 展示和案例

## 许可证和法律

### Q: SlideForge 的许可证是什么？

A: MIT 许可证。你可以自由使用、修改和分发。

### Q: 我可以用于商业用途吗？

A: 可以。MIT 许可证允许商业使用。

### Q: 我需要署名吗？

A: 不需要，但我们会很感激。

## 其他问题

### Q: SlideForge 的路线图是什么？

A: 详见 [DEVELOPMENT_PLAN.md](./docs/DEVELOPMENT_PLAN.md)

近期计划：
- v0.2：云端同步、协作编辑
- v0.3：更多主题和动画
- v1.0：完整功能和稳定 API

### Q: 我在哪里可以获得帮助？

A: 
- 📖 查看 [文档](./docs)
- 💬 在 [Discussions](https://github.com/slideforge/slideforge/discussions) 中提问
- 🐛 [报告 Bug](https://github.com/slideforge/slideforge/issues)
- 💡 [建议功能](https://github.com/slideforge/slideforge/issues)

### Q: 我可以联系维护者吗？

A: 可以。通过以下方式：

- GitHub Issues
- GitHub Discussions
- 项目主页

---

还有其他问题？欢迎在 [Discussions](https://github.com/slideforge/slideforge/discussions) 中提问！
