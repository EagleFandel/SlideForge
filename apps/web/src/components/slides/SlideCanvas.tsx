"use client";

import { Slide } from "@slideforge/protocol";
import { SlideElement } from "./SlideElement";

interface SlideCanvasProps {
  slide: Slide;
  className?: string;
}

export function SlideCanvas({ slide, className = "" }: SlideCanvasProps) {
  const bgStyle = getBackgroundStyle(slide.background);

  return (
    <div
      className={`sf-slide ${className}`}
      style={{
        width: "1280px",
        height: "720px",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        ...bgStyle,
      }}
    >
      {slide.layout === "title-center" ? (
        <TitleCenterLayout slide={slide} />
      ) : slide.layout === "two-column" ? (
        <TwoColumnLayout slide={slide} />
      ) : (
        <DefaultLayout slide={slide} />
      )}
    </div>
  );
}

function DefaultLayout({ slide }: { slide: Slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
      {slide.elements.map((element, index) => (
        <SlideElement key={element.id || index} element={element} index={index} />
      ))}
    </div>
  );
}

function TitleCenterLayout({ slide }: { slide: Slide }) {
  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      gap: "16px",
    }}>
      {slide.elements.map((element, index) => (
        <SlideElement key={element.id || index} element={element} index={index} />
      ))}
    </div>
  );
}

function TwoColumnLayout({ slide }: { slide: Slide }) {
  // 找出标题元素（不分列的）
  const headerElements = slide.elements.filter(
    (e) => e.type === "heading" && (!e.position?.column)
  );
  // 左列元素
  const col1 = slide.elements.filter(
    (e) => e.position?.column === 1 || (e.type !== "heading" && !e.position?.column)
  );
  // 右列元素
  const col2 = slide.elements.filter((e) => e.position?.column === 2);

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      height: "100%",
      gap: "32px",
    }}>
      {/* 标题区域 */}
      {headerElements.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          {headerElements.map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} />
          ))}
        </div>
      )}
      
      {/* 两列内容区域 */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "48px", 
        flex: 1,
        alignItems: "start",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {col1.filter(e => e.type !== "heading" || e.position?.column === 1).map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {col2.map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function getBackgroundStyle(bg?: Slide["background"]): React.CSSProperties {
  if (!bg) {
    return { backgroundColor: "#0f172a" };
  }
  
  switch (bg.type) {
    case "color":
      return { backgroundColor: bg.value };
    case "gradient":
      return { background: bg.value };
    case "image":
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    default:
      return { backgroundColor: "#0f172a" };
  }
}
