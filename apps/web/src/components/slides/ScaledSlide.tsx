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

import { useRef, useEffect, useState } from "react";
import { Slide, AspectRatio } from "@slideforge/protocol";
import { SlideCanvas } from "./SlideCanvas";

interface ScaledSlideProps {
  slide: Slide;
  theme?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  animate?: boolean;
}

const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number; ratio: string }> = {
  "16:9": { width: 1280, height: 720, ratio: "16/9" },
  "4:3": { width: 1024, height: 768, ratio: "4/3" },
};

export function ScaledSlide({ 
  slide, 
  theme = "default",
  aspectRatio = "16:9",
  className = "",
  animate = true
}: ScaledSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  const dimensions = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS["16:9"];

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / dimensions.width);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [dimensions.width]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: dimensions.ratio }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        data-theme={theme}
      >
        <SlideCanvas slide={slide} animate={animate} />
      </div>
    </div>
  );
}
