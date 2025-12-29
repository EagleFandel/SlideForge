"use client";

import { useRef, useEffect, useState } from "react";
import { Slide } from "@slideforge/protocol";
import { SlideCanvas } from "./SlideCanvas";

interface ScaledSlideProps {
  slide: Slide;
  className?: string;
}

export function ScaledSlide({ slide, className = "" }: ScaledSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 1280);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: "16/9" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1280px",
          height: "720px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <SlideCanvas slide={slide} />
      </div>
    </div>
  );
}
