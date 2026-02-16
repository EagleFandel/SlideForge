# SlideForge Protocol v1.0

> AI 生成演示文稿的统一标准协议

## 概述

SlideForge Protocol 定义了一套标准化的 JSON Schema，使 AI 能够生成结构化的演示文稿数据，并可直接导入 SlideForge 平台进行渲染、演示和导出。

## 文件格式

- 文件扩展名: `.sfp.json` (SlideForge Presentation)
- MIME Type: `application/vnd.slideforge+json`
- 编码: UTF-8

---

## Schema 结构

```
SlideForgePresentation
├── $schema          # 协议版本声明
├── meta             # 元数据
├── theme            # 主题配置
├── slides[]         # 幻灯片数组
│   ├── id           # 唯一标识
│   ├── layout       # 布局类型
│   ├── background   # 背景配置
│   ├── transition   # 过渡动画
│   ├── elements[]   # 内容元素
│   └── notes        # 演讲者备注
└── assets           # 资源引用
```

---

## 1. 根对象

```typescript
interface SlideForgePresentation {
  $schema: "https://slideforge.dev/schema/v1.json";
  meta: PresentationMeta;
  theme?: Theme;
  slides: Slide[];
  assets?: Asset[];
}
```

## 2. 元数据 (meta)

```typescript
interface PresentationMeta {
  id: string;              // UUID，平台内唯一标识
  title: string;           // 演示文稿标题
  description?: string;    // 描述
  author?: string;         // 作者
  createdAt: string;       // ISO 8601 时间戳
  updatedAt: string;       // 最后更新时间
  version: string;         // 文档版本 (如 "1.0.0")
  language?: string;       // 语言代码 (如 "zh-CN")
  tags?: string[];         // 标签
  aspectRatio?: "16:9" | "4:3" | "1:1";  // 宽高比，默认 16:9
}
```


## 3. 主题配置 (theme)

```typescript
interface Theme {
  name?: string;           // 预设主题名称
  colors?: {
    primary: string;       // 主色
    secondary: string;     // 次色
    background: string;    // 默认背景色
    text: string;          // 默认文字色
    accent: string;        // 强调色
  };
  fonts?: {
    heading: string;       // 标题字体
    body: string;          // 正文字体
    code: string;          // 代码字体
  };
  custom?: Record<string, string>;  // 自定义 CSS 变量
}
```

### 预设主题

| name | 描述 |
|------|------|
| `default` | 默认蓝紫渐变 |
| `dark` | 深色主题 |
| `light` | 浅色简约 |
| `gradient-warm` | 暖色渐变 |
| `gradient-cool` | 冷色渐变 |
| `minimal` | 极简黑白 |

---

## 4. 幻灯片 (Slide)

```typescript
interface Slide {
  id: string;                    // 唯一 ID (如 "slide-1")
  layout: SlideLayout;           // 布局类型
  background?: Background;       // 背景配置
  transition?: Transition;       // 页面过渡
  elements: Element[];           // 内容元素
  notes?: string;                // 演讲者备注 (Markdown)
  hidden?: boolean;              // 是否隐藏
  duration?: number;             // 自动播放时长 (秒)
}
```

### 4.1 布局类型 (SlideLayout)

```typescript
type SlideLayout = 
  | "title"           // 标题页：居中大标题
  | "title-subtitle"  // 标题+副标题
  | "section"         // 章节分隔页
  | "content"         // 标准内容页
  | "two-column"      // 双栏布局
  | "three-column"    // 三栏布局
  | "image-left"      // 左图右文
  | "image-right"     // 左文右图
  | "image-full"      // 全屏图片
  | "comparison"      // 对比布局
  | "quote"           // 引用页
  | "code"            // 代码展示页
  | "blank";          // 空白自由布局
```

### 4.2 背景配置 (Background)

```typescript
interface Background {
  type: "color" | "gradient" | "image" | "video";
  value: string;       // CSS 颜色/渐变 或 URL
  opacity?: number;    // 0-1
  overlay?: string;    // 叠加层颜色
  position?: string;   // 背景位置
  size?: "cover" | "contain" | "auto";
}
```

### 4.3 过渡动画 (Transition)

```typescript
interface Transition {
  type: "none" | "fade" | "slide" | "zoom" | "flip" | "cube";
  direction?: "left" | "right" | "up" | "down";
  duration?: number;   // 毫秒，默认 500
  easing?: string;     // CSS easing 函数
}
```


---

## 5. 内容元素 (Element)

```typescript
interface BaseElement {
  id?: string;                   // 元素 ID
  type: ElementType;             // 元素类型
  position?: Position;           // 自定义位置 (blank 布局)
  size?: Size;                   // 自定义尺寸
  style?: Record<string, string>; // 内联样式
  class?: string;                // CSS 类名
  animate?: Animation;           // 入场动画
  fragment?: number;             // 分步显示序号
}

interface Position {
  x: number | string;  // 像素或百分比
  y: number | string;
  anchor?: "top-left" | "center" | "bottom-right"; // 锚点
}

interface Size {
  width: number | string;
  height?: number | string;
}
```

### 5.1 元素类型

#### 文本类元素

```typescript
// 标题
interface TitleElement extends BaseElement {
  type: "title";
  content: string;
  level?: 1 | 2 | 3;   // 对应 h1/h2/h3
}

// 文本段落
interface TextElement extends BaseElement {
  type: "text";
  content: string;     // 支持 Markdown 内联语法
  align?: "left" | "center" | "right";
}

// 列表
interface ListElement extends BaseElement {
  type: "list";
  items: (string | ListItem)[];
  ordered?: boolean;   // 有序/无序
  icon?: string;       // 自定义图标
}

interface ListItem {
  content: string;
  children?: ListItem[];  // 嵌套列表
  checked?: boolean;      // 任务列表
}

// 引用
interface QuoteElement extends BaseElement {
  type: "quote";
  content: string;
  author?: string;
  source?: string;
}
```

#### 代码元素

```typescript
interface CodeElement extends BaseElement {
  type: "code";
  content: string;
  language?: string;      // 语法高亮语言
  filename?: string;      // 显示文件名
  highlight?: number[];   // 高亮行号
  showLineNumbers?: boolean;
}
```

#### 媒体元素

```typescript
// 图片
interface ImageElement extends BaseElement {
  type: "image";
  src: string;            // URL 或 asset ID
  alt?: string;
  caption?: string;
  fit?: "cover" | "contain" | "fill";
  rounded?: boolean | number;
}

// 视频
interface VideoElement extends BaseElement {
  type: "video";
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

// 图标
interface IconElement extends BaseElement {
  type: "icon";
  name: string;           // 图标名称
  set?: string;           // 图标集 (如 "lucide", "heroicons")
  color?: string;
}
```

#### 布局元素

```typescript
// 容器/分组
interface GroupElement extends BaseElement {
  type: "group";
  elements: Element[];
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
}

// 分栏
interface ColumnElement extends BaseElement {
  type: "column";
  elements: Element[];
  width?: string;         // 如 "1fr", "50%", "300px"
}

// 分隔线
interface DividerElement extends BaseElement {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
}

// 间距
interface SpacerElement extends BaseElement {
  type: "spacer";
  size: number | string;
}
```


#### 数据可视化元素

```typescript
// 表格
interface TableElement extends BaseElement {
  type: "table";
  headers?: string[];
  rows: string[][];
  striped?: boolean;
  bordered?: boolean;
}

// 图表 (基于配置生成)
interface ChartElement extends BaseElement {
  type: "chart";
  chartType: "bar" | "line" | "pie" | "donut" | "area";
  data: {
    labels: string[];
    datasets: {
      label?: string;
      values: number[];
      color?: string;
    }[];
  };
  options?: Record<string, any>;
}

// 数学公式
interface MathElement extends BaseElement {
  type: "math";
  content: string;        // LaTeX 语法
  display?: boolean;      // 行内/块级
}

// Mermaid 图表
interface DiagramElement extends BaseElement {
  type: "diagram";
  content: string;        // Mermaid 语法
}
```

#### 交互元素

```typescript
// 链接按钮
interface ButtonElement extends BaseElement {
  type: "button";
  label: string;
  href?: string;
  action?: "next" | "prev" | "goto";
  target?: string;        // slide ID
}

// 嵌入内容
interface EmbedElement extends BaseElement {
  type: "embed";
  src: string;            // iframe URL
  aspectRatio?: string;   // 如 "16:9"
}
```

### 5.2 动画配置 (Animation)

```typescript
interface Animation {
  type: "none" | "fade" | "scale" | "slide" | "bounce" | "rotate" | "blur";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;      // 毫秒
  delay?: number;         // 延迟
  easing?: string;
}
```

---

## 6. 资源声明 (Assets)

```typescript
interface Asset {
  id: string;             // 引用 ID
  type: "image" | "video" | "audio" | "font" | "file";
  src: string;            // URL
  name?: string;          // 显示名称
  size?: number;          // 文件大小 (bytes)
  mime?: string;          // MIME 类型
}
```

---

## 7. 完整示例

```json
{
  "$schema": "https://slideforge.dev/schema/v1.json",
  "meta": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "SlideForge 介绍",
    "author": "AI Assistant",
    "createdAt": "2024-12-29T10:00:00Z",
    "updatedAt": "2024-12-29T10:00:00Z",
    "version": "1.0.0",
    "language": "zh-CN",
    "tags": ["演示", "框架", "AI"],
    "aspectRatio": "16:9"
  },
  "theme": {
    "name": "gradient-cool",
    "colors": {
      "primary": "#6366f1",
      "secondary": "#8b5cf6",
      "background": "#1e1b4b",
      "text": "#ffffff",
      "accent": "#f59e0b"
    }
  },
  "slides": [
    {
      "id": "slide-1",
      "layout": "title",
      "background": {
        "type": "gradient",
        "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      },
      "elements": [
        {
          "type": "title",
          "content": "SlideForge",
          "animate": { "type": "scale", "duration": 600 }
        },
        {
          "type": "text",
          "content": "AI-Friendly Slides Framework",
          "animate": { "type": "fade", "delay": 300 }
        }
      ],
      "notes": "这是开场页，介绍产品名称和定位"
    },
    {
      "id": "slide-2",
      "layout": "content",
      "transition": { "type": "slide", "direction": "left" },
      "elements": [
        {
          "type": "title",
          "content": "核心特性",
          "level": 2
        },
        {
          "type": "list",
          "items": [
            "🤖 AI 原生设计",
            "📐 标准化 JSON Schema",
            "🎨 丰富的主题系统",
            "✨ 内置动画效果",
            "📄 一键导出 PDF"
          ],
          "animate": { "type": "slide", "direction": "up" }
        }
      ]
    }
  ],
  "assets": [
    {
      "id": "logo",
      "type": "image",
      "src": "https://example.com/logo.png",
      "name": "Logo"
    }
  ]
}
```


---

## 8. AI 生成指南

### 8.1 Prompt 模板

```
请使用 SlideForge Protocol v1.0 生成一个演示文稿。

主题：[你的主题]
页数：[预期页数]
风格：[专业/活泼/简约/科技]
语言：[zh-CN/en-US]

要求：
1. 输出完整的 JSON，符合 SlideForge Protocol 规范
2. 包含适当的布局变化
3. 添加入场动画
4. 包含演讲者备注

输出格式：仅输出 JSON，不要其他解释
```

### 8.2 AI 生成规则

1. **必须包含** `$schema`、`meta`、`slides` 字段
2. **每个 slide 必须有** `id`、`layout`、`elements`
3. **id 命名规范**: `slide-1`, `slide-2` 或语义化如 `slide-intro`
4. **动画适度**: 不要每个元素都加动画，重点内容加即可
5. **布局多样**: 避免所有页面使用相同布局
6. **备注有用**: notes 应包含演讲要点，而非重复内容

### 8.3 验证

导入平台前，JSON 需通过 Schema 验证：

```bash
npx slideforge validate presentation.sfp.json
```

---

## 9. 版本兼容

| 协议版本 | 状态 | 说明 |
|---------|------|------|
| v1.0 | Current | 当前稳定版本 |

### 向后兼容原则

- 新增字段使用可选属性
- 废弃字段保留至少 2 个主版本
- 破坏性变更仅在主版本升级时引入

---

## 10. 扩展机制

### 自定义元素

```typescript
interface CustomElement extends BaseElement {
  type: "custom";
  component: string;      // 自定义组件名
  props?: Record<string, any>;
}
```

### 插件元数据

```typescript
interface PluginMeta {
  plugins?: {
    name: string;
    version: string;
    config?: Record<string, any>;
  }[];
}
```

---

## License

MIT License - 自由使用、修改、分发
