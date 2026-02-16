# 贡献指南

感谢你对 SlideForge 的兴趣！我们欢迎各种形式的贡献。

## 贡献方式

### 报告 Bug

如果你发现了 Bug，请创建一个 Issue：

1. 使用清晰的标题描述问题
2. 提供详细的复现步骤
3. 说明你期望的行为和实际行为
4. 附加截图或错误日志（如果适用）
5. 告诉我们你的环境信息（OS、浏览器、Node 版本等）

**Issue 模板**：使用 `.github/ISSUE_TEMPLATE/bug_report.md`

### 建议功能

有新想法？我们很乐意听到！

1. 使用 `.github/ISSUE_TEMPLATE/feature_request.md` 创建 Issue
2. 清晰描述你的想法和使用场景
3. 解释为什么这个功能对你很重要
4. 如果可能，提供实现思路

### 改进文档

文档改进总是受欢迎的：

- 修复拼写或语法错误
- 澄清不清楚的部分
- 添加更多示例
- 翻译文档到其他语言

### 提交代码

#### 开发流程

1. **Fork 仓库**
   ```bash
   git clone https://github.com/YOUR_USERNAME/slideforge.git
   cd slideforge
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **安装依赖**
   ```bash
   pnpm install
   ```

4. **开发和测试**
   ```bash
   pnpm dev          # 启动开发服务器
   pnpm build        # 构建项目
   pnpm test         # 运行测试（如果有）
   ```

5. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能" # 遵循 Conventional Commits
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 清晰描述你的改动
   - 链接相关的 Issue
   - 确保 CI 通过

#### 代码规范

遵循项目的代码规范（见 `.kiro/steering/slideforge-rules.md`）：

- **TypeScript**: 严格模式，完整类型注解
- **命名**: 
  - React 组件: `PascalCase.tsx`
  - 工具函数: `camelCase.ts`
  - 类型定义: `types.ts`
- **导入顺序**:
  1. React / Next.js
  2. 第三方库
  3. @slideforge/* 包
  4. 相对路径导入
  5. 类型导入

示例：
```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideDocument } from '@slideforge/protocol';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import type { PresenterState } from './types';
```

#### Commit 消息规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码风格（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建、依赖等

示例：
```
feat(ai): 添加 WebLLM Provider 支持

- 实现 WebLLM 离线 AI 集成
- 添加 WebGPU 检测逻辑
- 支持 Llama-3.2-1B 模型

Closes #123
```

## 项目结构

```
slideforge/
├── apps/web/              # Next.js Web 应用
├── packages/
│   ├── protocol/          # 协议定义和校验
│   ├── themes/            # 主题 CSS
│   └── mcp-server/        # MCP Server
├── docs/                  # 文档
└── examples/              # 示例
```

## 开发指南

### 添加新功能

1. **协议层** - 如果需要新的类型或字段，先在 `packages/protocol/src/types.ts` 定义
2. **实现层** - 在 `apps/web/src/` 实现功能
3. **测试** - 确保功能正常工作
4. **文档** - 更新相关文档

### 添加新主题

1. 在 `packages/themes/src/` 创建 `{theme-name}.css`
2. 定义所有 `--sf-*` CSS 变量
3. 在 `packages/themes/src/index.ts` 导出

### 添加新 AI Provider

1. 在 `apps/web/src/lib/ai/providers/` 创建 `{provider-name}.ts`
2. 实现 `AIProvider` 接口
3. 在 `apps/web/src/lib/ai/index.ts` 注册

## 审查流程

所有 PR 都会经过：

1. **自动检查** - CI 流程（构建、类型检查、Lint）
2. **代码审查** - 至少一个维护者审查
3. **测试** - 确保功能正常
4. **合并** - 通过后合并到 main 分支

## 行为准则

请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。简而言之：

- 尊重他人
- 包容不同观点
- 建设性反馈
- 禁止骚扰和歧视

## 获取帮助

- 📖 查看 [文档](./docs)
- 💬 在 Issue 中提问
- 🐛 报告 Bug
- 💡 建议功能

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

感谢你的贡献！🎉
