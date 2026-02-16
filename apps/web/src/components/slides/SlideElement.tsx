/*
 * SlideForge - AI-First Slides Protocol Framework
 * Copyright (C) 2026 SlideForge Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import { Element } from "@slideforge/protocol";

interface SlideElementProps {
  element: Element;
  index: number;
  animate?: boolean;
  fullscreen?: boolean;
}

export function SlideElement({ element, index, animate = true, fullscreen = false }: SlideElementProps) {
  // 支持两种动画格式: { type: "fadeIn" } 或直接 "fadeIn"
  const animationType = typeof element.animation === 'string' 
    ? element.animation 
    : element.animation?.type;
  const animationClass = animate ? getAnimationClass(animationType) : '';
  const animationDelay = typeof element.animation === 'object' 
    ? element.animation?.delay 
    : undefined;
  const delay = animationDelay || index * 150;
  
  const baseStyle: React.CSSProperties = {
    animationDelay: `${delay}ms`,
  };

  // Merge custom styles
  const customStyle = element.style ? parseCustomStyle(element.style) : {};
  const style = { ...baseStyle, ...customStyle };

  switch (element.type) {
    case "heading":
      return <HeadingElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    case "text":
      return <TextElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    case "list":
      return <ListElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    case "code":
      return <CodeElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    case "image":
      return <ImageElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    case "quote":
      return <QuoteElement element={element} style={style} className={animationClass} fullscreen={fullscreen} />;
    default:
      return null;
  }
}

function parseCustomStyle(style: Record<string, string>): React.CSSProperties {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    // Convert camelCase keys
    result[key] = value;
  }
  return result as React.CSSProperties;
}

function HeadingElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "heading" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  // 全屏模式使用视口单位
  const sizeMap: Record<number, React.CSSProperties> = fullscreen ? {
    1: { fontSize: "6vw", fontWeight: 800, lineHeight: 1.1 },
    2: { fontSize: "4vw", fontWeight: 700, lineHeight: 1.2 },
    3: { fontSize: "2.8vw", fontWeight: 600, lineHeight: 1.3 },
    4: { fontSize: "2.2vw", fontWeight: 600, lineHeight: 1.4 },
    5: { fontSize: "1.8vw", fontWeight: 500, lineHeight: 1.4 },
    6: { fontSize: "1.6vw", fontWeight: 500, lineHeight: 1.4 },
  } : {
    1: { fontSize: "72px", fontWeight: 800, lineHeight: 1.1 },
    2: { fontSize: "48px", fontWeight: 700, lineHeight: 1.2 },
    3: { fontSize: "32px", fontWeight: 600, lineHeight: 1.3 },
    4: { fontSize: "24px", fontWeight: 600, lineHeight: 1.4 },
    5: { fontSize: "20px", fontWeight: 500, lineHeight: 1.4 },
    6: { fontSize: "18px", fontWeight: 500, lineHeight: 1.4 },
  };

  const levelStyle = sizeMap[element.level] || sizeMap[1];

  return (
    <div 
      className={className}
      style={{ 
        ...levelStyle,
        color: "#f8fafc",
        textAlign: element.align || "left",
        margin: 0,
        ...style,
      }}
    >
      {element.text}
    </div>
  );
}

function TextElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "text" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  // 支持 text 或 content 字段
  const text = (element as any).text || element.content || '';
  
  return (
    <p 
      className={className}
      style={{ 
        fontSize: fullscreen ? "2vw" : (element.fontSize || "24px"),
        lineHeight: 1.6,
        color: "#e2e8f0",
        textAlign: element.align || "left",
        margin: 0,
        ...style,
      }}
    >
      {text}
    </p>
  );
}

function ListElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "list" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  const isOrdered = (element as any).ordered === true;
  const textColor = style.color || "#e2e8f0";
  const bulletColor = style.color ? style.color : "#a78bfa";
  
  return (
    <ul 
      className={className}
      style={{ 
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: fullscreen ? "1.5vh" : "16px",
        ...style,
      }}
    >
      {element.items.map((item, i) => {
        const text = typeof item === "string" ? item : item.text;
        const icon = typeof item === "object" ? item.icon : undefined;
        const bullet = isOrdered ? `${i + 1}.` : icon || "•";
        
        return (
          <li 
            key={i} 
            style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: fullscreen ? "1vw" : "12px",
              fontSize: fullscreen ? "1.8vw" : "22px",
              lineHeight: 1.5,
              color: textColor,
            }}
          >
            <span style={{ 
              flexShrink: 0, 
              color: bulletColor,
              fontWeight: 600,
              minWidth: isOrdered ? (fullscreen ? "2vw" : "28px") : "auto",
            }}>
              {bullet}
            </span>
            <span>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function CodeElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "code" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  // 支持 code 或 content 字段
  const code = (element as any).code || element.content || '';
  
  return (
    <pre 
      className={className}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: fullscreen ? "1vw" : "12px",
        padding: fullscreen ? "2vh 2vw" : "24px",
        overflow: "hidden",
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: fullscreen ? "1.4vw" : "16px",
        lineHeight: 1.6,
        color: "#a5f3fc",
        margin: 0,
        maxHeight: fullscreen ? "50vh" : "400px",
        ...style,
      }}
    >
      <code style={{ 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word',
        display: 'block',
        overflow: 'auto',
      }}>{code}</code>
    </pre>
  );
}

function ImageElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "image" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  return (
    <figure className={className} style={{ margin: 0, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.src}
        alt={element.alt || ""}
        style={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: fullscreen ? "1vw" : "12px",
          objectFit: element.fit || "contain",
        }}
      />
      {element.caption && (
        <figcaption style={{ 
          textAlign: "center", 
          fontSize: fullscreen ? "1.2vw" : "14px", 
          color: "rgba(255,255,255,0.6)",
          marginTop: fullscreen ? "1vh" : "12px",
        }}>
          {element.caption}
        </figcaption>
      )}
    </figure>
  );
}

function QuoteElement({ 
  element, 
  style, 
  className,
  fullscreen 
}: { 
  element: Extract<Element, { type: "quote" }>; 
  style: React.CSSProperties;
  className: string;
  fullscreen: boolean;
}) {
  return (
    <blockquote 
      className={className}
      style={{
        margin: 0,
        padding: fullscreen ? "3vh 3vw" : "32px 40px",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderLeft: fullscreen ? "0.3vw solid #a78bfa" : "4px solid #a78bfa",
        borderRadius: fullscreen ? "0 1vw 1vw 0" : "0 12px 12px 0",
        ...style,
      }}
    >
      <p style={{ 
        fontSize: fullscreen ? "2.2vw" : "28px", 
        fontStyle: "italic", 
        color: "#f1f5f9",
        lineHeight: 1.6,
        margin: 0,
      }}>
        "{element.text}"
      </p>
      {element.author && (
        <footer style={{ 
          marginTop: fullscreen ? "1.5vh" : "16px", 
          fontSize: fullscreen ? "1.4vw" : "18px", 
          color: "#94a3b8",
        }}>
          — {element.author}
        </footer>
      )}
    </blockquote>
  );
}

function getAnimationClass(type?: string): string {
  switch (type) {
    case "fadeIn":
      return "animate-fadeIn";
    case "fadeInUp":
      return "animate-fadeInUp";
    case "fadeInDown":
      return "animate-fadeInDown";
    case "fadeInLeft":
      return "animate-fadeInLeft";
    case "fadeInRight":
      return "animate-fadeInRight";
    case "zoomIn":
      return "animate-zoomIn";
    case "slideInLeft":
      return "animate-slideInLeft";
    case "slideInRight":
      return "animate-slideInRight";
    default:
      return "";
  }
}
