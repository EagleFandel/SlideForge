"use client";

import { Element } from "@slideforge/protocol";

interface SlideElementProps {
  element: Element;
  index: number;
}

export function SlideElement({ element, index }: SlideElementProps) {
  const animationClass = getAnimationClass(element.animation?.type);
  const delay = element.animation?.delay || index * 100;
  
  const baseStyle: React.CSSProperties = {
    animationDelay: `${delay}ms`,
  };

  // Merge custom styles
  const customStyle = element.style ? parseCustomStyle(element.style) : {};
  const style = { ...baseStyle, ...customStyle };

  switch (element.type) {
    case "heading":
      return <HeadingElement element={element} style={style} className={animationClass} />;
    case "text":
      return <TextElement element={element} style={style} className={animationClass} />;
    case "list":
      return <ListElement element={element} style={style} className={animationClass} />;
    case "code":
      return <CodeElement element={element} style={style} className={animationClass} />;
    case "image":
      return <ImageElement element={element} style={style} className={animationClass} />;
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
  className 
}: { 
  element: Extract<Element, { type: "heading" }>; 
  style: React.CSSProperties;
  className: string;
}) {
  const sizeMap: Record<number, React.CSSProperties> = {
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
  className 
}: { 
  element: Extract<Element, { type: "text" }>; 
  style: React.CSSProperties;
  className: string;
}) {
  return (
    <p 
      className={className}
      style={{ 
        fontSize: element.fontSize || "24px",
        lineHeight: 1.6,
        textAlign: element.align || "left",
        margin: 0,
        ...style,
      }}
    >
      {element.content}
    </p>
  );
}

function ListElement({ 
  element, 
  style, 
  className 
}: { 
  element: Extract<Element, { type: "list" }>; 
  style: React.CSSProperties;
  className: string;
}) {
  return (
    <ul 
      className={className}
      style={{ 
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        ...style,
      }}
    >
      {element.items.map((item, i) => {
        const text = typeof item === "string" ? item : item.text;
        const icon = typeof item === "object" ? item.icon : undefined;
        return (
          <li 
            key={i} 
            style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: "12px",
              fontSize: "22px",
              lineHeight: 1.5,
            }}
          >
            {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
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
  className 
}: { 
  element: Extract<Element, { type: "code" }>; 
  style: React.CSSProperties;
  className: string;
}) {
  return (
    <pre 
      className={className}
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "24px",
        overflow: "auto",
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: "16px",
        lineHeight: 1.6,
        color: "#e2e8f0",
        margin: 0,
        ...style,
      }}
    >
      <code>{element.content}</code>
    </pre>
  );
}

function ImageElement({ 
  element, 
  style, 
  className 
}: { 
  element: Extract<Element, { type: "image" }>; 
  style: React.CSSProperties;
  className: string;
}) {
  return (
    <figure className={className} style={{ margin: 0, ...style }}>
      <img
        src={element.src}
        alt={element.alt || ""}
        style={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: "12px",
          objectFit: element.fit || "contain",
        }}
      />
      {element.caption && (
        <figcaption style={{ 
          textAlign: "center", 
          fontSize: "14px", 
          color: "rgba(255,255,255,0.6)",
          marginTop: "12px",
        }}>
          {element.caption}
        </figcaption>
      )}
    </figure>
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
