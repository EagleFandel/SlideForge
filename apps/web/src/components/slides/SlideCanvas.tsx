"use client";

import { Slide } from "@slideforge/protocol";
import { SlideElement } from "./SlideElement";

interface SlideCanvasProps {
  slide: Slide;
  className?: string;
  animate?: boolean;
  fullscreen?: boolean;
}

interface LayoutProps {
  slide: Slide;
  animate: boolean;
  fullscreen: boolean;
}

export function SlideCanvas({ slide, className = "", animate = true, fullscreen = false }: SlideCanvasProps) {
  const bgStyle = getBackgroundStyle(slide.background);

  // 全屏模式：完全填满屏幕，无黑边
  const containerStyle: React.CSSProperties = fullscreen 
    ? {
        width: "100vw",
        height: "100vh",
        padding: "4vh 4vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
        ...bgStyle,
      }
    : {
        width: "1280px",
        height: "720px",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        boxSizing: "border-box",
        ...bgStyle,
      };

  return (
    <div
      className={`sf-slide ${className}`}
      style={containerStyle}
    >
      {slide.layout === "title-center" ? (
        <TitleCenterLayout slide={slide} animate={animate} fullscreen={fullscreen} />
      ) : slide.layout === "two-column" ? (
        <TwoColumnLayout slide={slide} animate={animate} fullscreen={fullscreen} />
      ) : (
        <DefaultLayout slide={slide} animate={animate} fullscreen={fullscreen} />
      )}
    </div>
  );
}

function DefaultLayout({ slide, animate, fullscreen }: LayoutProps) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: fullscreen ? "3vh" : "24px", 
      flex: 1,
      overflow: "hidden",
    }}>
      {slide.elements.map((element, index) => (
        <SlideElement key={element.id || index} element={element} index={index} animate={animate} fullscreen={fullscreen} />
      ))}
    </div>
  );
}

function TitleCenterLayout({ slide, animate, fullscreen }: LayoutProps) {
  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      gap: fullscreen ? "2vh" : "16px",
      overflow: "hidden",
    }}>
      {slide.elements.map((element, index) => (
        <SlideElement key={element.id || index} element={element} index={index} animate={animate} fullscreen={fullscreen} />
      ))}
    </div>
  );
}

function TwoColumnLayout({ slide, animate, fullscreen }: LayoutProps) {
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
      gap: fullscreen ? "3vh" : "32px",
      overflow: "hidden",
    }}>
      {/* 标题区域 */}
      {headerElements.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          {headerElements.map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} animate={animate} fullscreen={fullscreen} />
          ))}
        </div>
      )}
      
      {/* 两列内容区域 */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: fullscreen ? "4vw" : "48px", 
        flex: 1,
        alignItems: "start",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: fullscreen ? "2vh" : "20px" }}>
          {col1.filter(e => e.type !== "heading" || e.position?.column === 1).map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} animate={animate} fullscreen={fullscreen} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: fullscreen ? "2vh" : "20px" }}>
          {col2.map((element, index) => (
            <SlideElement key={element.id || index} element={element} index={index} animate={animate} fullscreen={fullscreen} />
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
