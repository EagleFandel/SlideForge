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
