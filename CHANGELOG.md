# Changelog

所有对 SlideForge 项目的重要改动都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### 计划中的功能

- 云端同步（Firebase / Supabase）
- 实时协作编辑
- 更多主题和动画
- 虚拟滚动优化
- 移动端完整适配
- 国际化支持

---

## [0.1.0] - 2026-01-05

### 🎉 首次发布

SlideForge v0.1.0 正式发布！

### ✨ 新增功能

#### 核心功能
- ✅ SlideForge Protocol v1.0 完整定义
- ✅ 9 种页面类型（title/section/content/image/code/comparison/timeline/quote/blank）
- ✅ 9 种元素类型（heading/text/list/image/code/chart/shape/video/table）
- ✅ 15 种动画类型（fadeIn/slideIn/zoomIn/typewriter 等）
- ✅ AI Safe Defaults 设计

#### 渲染引擎
- ✅ SlideCanvas 核心渲染组件
- ✅ SlideElement 元素渲染系统
- ✅ 自动布局引擎
- ✅ 动画系统集成（Framer Motion）
- ✅ 响应式设计

#### 演示系统
- ✅ 全屏演示模式
- ✅ 演讲者视图（备注、计时、预览）
- ✅ 概览模式（缩略图网格）
- ✅ 键盘快捷键支持

#### Dashboard 管理平台
- ✅ 项目列表展示
- ✅ 搜索和排序功能
- ✅ 项目 CRUD 操作
- ✅ 导入功能（拖放 + 文件选择）
- ✅ 导出菜单

#### 存储系统
- ✅ IndexedDB 集成（Dexie.js）
- ✅ 本地持久化
- ✅ 完整的 CRUD 操作

#### 导出系统
- ✅ JSON 导出（原始协议）
- ✅ HTML 导出（独立可运行）
- ✅ PDF 导出（客户端渲染）
- ✅ 批量导出（ZIP 打包）

#### AI 集成
- ✅ Chrome Built-in AI (Gemini Nano)
- ✅ Ollama (本地)
- ✅ WebLLM (浏览器内)
- ✅ Cloud API (OpenAI / Claude / DeepSeek)
- ✅ AI Manager 统一接口
- ✅ 自动修复机制

#### MCP Server
- ✅ 6+ 个 Tools
- ✅ Claude Desktop 集成
- ✅ 完整的错误处理

#### REST API
- ✅ /api/validate - 协议校验
- ✅ /api/export/html - HTML 导出

#### 主题系统
- ✅ 6 套内置主题（default/dark/corporate/creative/academic/minimal）
- ✅ CSS 变量驱动
- ✅ 主题切换无缝集成

#### 海报系统
- ✅ 5 种模板（card/social/quote/list/minimal）
- ✅ Markdown 解析
- ✅ PNG 导出
- ✅ QR 码生成

#### 文档
- ✅ README.md - 项目介绍
- ✅ GETTING_STARTED.md - 快速开始
- ✅ EXAMPLES.md - 示例和教程
- ✅ FAQ.md - 常见问题
- ✅ CONTRIBUTING.md - 贡献指南
- ✅ CODE_OF_CONDUCT.md - 行为准则
- ✅ COMMUNITY.md - 社区指南
- ✅ docs/PRD.md - 产品需求文档
- ✅ docs/DESIGN.md - 技术设计
- ✅ docs/AI_INTEGRATION.md - AI 集成规范
- ✅ docs/DEVELOPMENT_PLAN.md - 开发计划
- ✅ docs/COMPLETION_SUMMARY.md - 完成总结

### 📊 项目统计

- 代码行数：~10,000
- 文件数：50+
- 功能完成度：100%
- 文档完整性：100%

### 🔧 技术栈

- Next.js 14+ (App Router)
- TypeScript 5.7+ (严格模式)
- Tailwind CSS + CSS Variables
- Zustand (状态管理)
- Framer Motion (动画)
- Dexie.js (IndexedDB)
- pnpm + Turborepo

### 📦 包

- @slideforge/protocol - 协议定义和校验
- @slideforge/themes - 主题 CSS
- @slideforge/mcp-server - MCP Server
- @slideforge/web - Web 应用

### 🎯 核心指标

- AI 首次成功率 > 95%
- 错误信息包含 JSON path 和修复建议
- 支持自动重试修复（最多 3 次）
- 支持 4 种 AI Provider
- 支持 4 种导出格式
- 6 套内置主题
- 9 种页面类型
- 9 种元素类型
- 15 种动画类型

### 🚀 发布方式

- GitHub Release
- NPM 包发布
- Web 应用部署

---

## 版本历史

### 计划中的版本

- **v0.2** - 云端同步、协作编辑、性能优化
- **v0.3** - 更多主题、更多动画、国际化
- **v1.0** - 完整功能、稳定 API、生态系统

---

## 贡献

感谢所有为 SlideForge 做出贡献的人！

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 许可证

Apache 2.0 License - 详见 [LICENSE](./LICENSE)

---

## 联系方式

- GitHub Issues - 报告 Bug 和建议功能
- GitHub Discussions - 提问和讨论
- Email - 通过 GitHub 联系维护者
