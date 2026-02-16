# 快速开始指南

欢迎来到 SlideForge！本指南将帮助你快速上手。

## 什么是 SlideForge？

SlideForge 是一个 **AI-First** 的 Slides 协议框架 + Runtime。它让 AI 能够生成可靠的、可演示的演示文稿。

**核心理念**：Slides 不再是文件，而是一种可计算的内容结构。

```
AI 生成 JSON → 协议校验 → 立即演示 → 稳定导出
```

## 安装

### 前置要求

- Node.js 18+
- pnpm 8+

### 本地开发

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

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build --filter @slideforge/protocol
```

## 基本使用

### 1. 访问 Web 应用

打开 http://localhost:3000

### 2. 创建演示文稿

**方式一：AI 生成**
1. 进入 Dashboard (`/dashboard`)
2. 点击 "✨ AI 生成" 按钮
3. 输入演示文稿主题和内容
4. 等待 AI 生成 JSON
5. 预览并导出

**方式二：导入 JSON**
1. 准备一个符合协议的 JSON 文件
2. 拖放到 Dashboard 或点击导入
3. 系统会校验并保存

### 3. 演示

1. 在 Dashboard 中选择一个演示文稿
2. 点击 "演示" 按钮
3. 使用键盘快捷键：
   - `→` / `←` - 下一页/上一页
   - `F` - 全屏
   - `O` - 概览模式
   - `S` - 演讲者模式
   - `ESC` - 退出

### 4. 导出

支持多种导出格式：
- **JSON** - 原始协议数据
- **HTML** - 独立可运行的 HTML 文件
- **PDF** - 打印友好的 PDF
- **PNG** - 海报图片

## 协议示例

最小可用的 SlideForge JSON：

```json
{
  "version": "1.0",
  "metadata": {
    "title": "我的演示文稿"
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
    }
  ]
}
```

## 使用 MCP Server

SlideForge 提供 MCP Server，可以在 Claude Desktop 中使用。

### 配置

编辑 Claude Desktop 配置文件：

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

添加以下配置：

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

### 使用

在 Claude 中使用 SlideForge Tools：

```
用户: 用 SlideForge 创建一个关于 "远程工作最佳实践" 的演示文稿，5 页，使用 corporate 主题

Claude: [调用 create_presentation 工具]
```

可用的 Tools：
- `create_presentation` - 创建完整演示文稿
- `add_slide` - 添加单页
- `validate` - 校验协议
- `export_html` - 导出 HTML
- `create_poster` - 创建海报
- `list_themes` - 列出主题

## 主题

SlideForge 内置 6 套主题：

- `default` - 简洁现代，蓝白配色
- `dark` - 深色科技风
- `corporate` - 商务专业
- `creative` - 创意活泼
- `academic` - 学术严谨
- `minimal` - 极简留白

在 JSON 中指定主题：

```json
{
  "config": {
    "theme": "dark"
  }
}
```

## AI Providers

SlideForge 支持 4 种 AI Provider，按优先级排列：

1. **Chrome Built-in AI** (Gemini Nano)
   - 无需下载，2-5s 响应
   - 仅 Chrome 127+

2. **Ollama** (本地)
   - 模型选择多
   - 推荐：llama3.2, qwen2.5

3. **WebLLM** (浏览器内)
   - 完全离线
   - 跨浏览器支持

4. **Cloud API** (用户自带 Key)
   - 支持 OpenAI / Claude / DeepSeek
   - 模型能力最强

## 常见问题

### Q: 我可以离线使用 SlideForge 吗？

A: 可以。使用 WebLLM Provider 或 Ollama，你可以完全离线生成演示文稿。

### Q: 我的数据存储在哪里？

A: 所有数据都存储在浏览器的 IndexedDB 中，不会上传到任何服务器。完全隐私友好。

### Q: 我可以自定义主题吗？

A: 可以。主题使用 CSS 变量，你可以修改 `packages/themes/src/` 中的 CSS 文件。

### Q: 我可以添加自己的 AI Provider 吗？

A: 可以。实现 `AIProvider` 接口并在 `apps/web/src/lib/ai/index.ts` 中注册。

### Q: 支持哪些页面类型？

A: 支持 9 种页面类型：title, section, content, image, code, comparison, timeline, quote, blank

### Q: 支持哪些元素类型？

A: 支持 9 种元素类型：heading, text, list, image, code, chart, shape, video, table

## 下一步

- 📖 查看 [完整文档](./docs)
- 🤖 了解 [AI 集成](./docs/AI_INTEGRATION.md)
- 📋 查看 [协议规范](./docs/DESIGN.md)
- 💡 查看 [示例](./examples)
- 🤝 [贡献代码](./CONTRIBUTING.md)

## 获取帮助

- 📚 查看 [文档](./docs)
- 💬 在 [Discussions](https://github.com/slideforge/slideforge/discussions) 中提问
- 🐛 [报告 Bug](https://github.com/slideforge/slideforge/issues)
- 💡 [建议功能](https://github.com/slideforge/slideforge/issues)

## 许可证

MIT

---

祝你使用愉快！如有任何问题，欢迎提问。🎉
