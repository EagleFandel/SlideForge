import type {
  SlideDocument,
  Slide,
  SlideType,
  HeadingElement,
  TextElement,
  ListElement,
  ListItem,
  Animation,
} from "./types";

/** 创建文档 */
export function createSlideDocument(
  title: string,
  options?: {
    theme?: string;
    aspectRatio?: "16:9" | "4:3";
    author?: string;
  }
): SlideDocument {
  return {
    version: "1.0",
    metadata: {
      title,
      author: options?.author,
      createdAt: new Date().toISOString(),
    },
    config: {
      theme: options?.theme ?? "default",
      aspectRatio: options?.aspectRatio ?? "16:9",
    },
    slides: [],
  };
}

/** 创建页面 */
export function createSlide(
  type: SlideType,
  options?: {
    layout?: string;
    notes?: string;
  }
): Slide {
  return {
    type,
    layout: options?.layout,
    notes: options?.notes,
    elements: [],
  };
}

/** 创建标题元素 */
export function createHeading(
  text: string,
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1,
  animation?: Animation
): HeadingElement {
  return {
    type: "heading",
    level,
    text,
    animation,
  };
}

/** 创建文本元素 */
export function createText(content: string, animation?: Animation): TextElement {
  return {
    type: "text",
    content,
    animation,
  };
}

/** 创建列表元素 */
export function createList(
  items: (string | ListItem)[],
  options?: {
    ordered?: boolean;
    columns?: 1 | 2 | 3;
    animation?: Animation;
  }
): ListElement {
  return {
    type: "list",
    items,
    ordered: options?.ordered,
    columns: options?.columns,
    animation: options?.animation,
  };
}
