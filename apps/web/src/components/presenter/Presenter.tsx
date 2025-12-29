"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideDocument } from "@slideforge/protocol";
import { SlideCanvas } from "../slides";

interface PresenterProps {
  document: SlideDocument;
  onExit?: () => void;
}

export function Presenter({ document, onExit }: PresenterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const totalSlides = document.slides.length;

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalSlides]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  }, [currentIndex, totalSlides]);

  const toggleFullscreen = useCallback(() => {
    if (!window.document.fullscreenElement) {
      window.document.documentElement.requestFullscreen();
    } else {
      window.document.exitFullscreen();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "Enter":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "Backspace":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (onExit) onExit();
          break;
      }
    };

    // 鼠标滚轮导航
    let wheelTimeout: NodeJS.Timeout | null = null;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // 防抖，避免滚动过快
      if (wheelTimeout) return;
      
      if (e.deltaY > 0) {
        goNext();
      } else if (e.deltaY < 0) {
        goPrev();
      }
      
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 300);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [goNext, goPrev, goTo, totalSlides, toggleFullscreen, onExit]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Click navigation
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) {
      goPrev();
    } else if (x > (rect.width * 2) / 3) {
      goNext();
    }
  };

  const currentSlide = document.slides[currentIndex];
  const scale = typeof window !== "undefined"
    ? Math.min(window.innerWidth / 1280, window.innerHeight / 720) * 0.95
    : 1;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      onClick={handleClick}
    >
      {/* Slide */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <SlideCanvas slide={currentSlide} />
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-white font-medium min-w-[80px] text-center">
          {currentIndex + 1} / {totalSlides}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === totalSlides - 1}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.div>

      {/* Keyboard Hints */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="fixed bottom-6 right-6 text-white/40 text-xs space-y-1 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div>← → 或 滚轮 导航</div>
        <div>F 全屏</div>
        <div>ESC 退出</div>
      </motion.div>
    </div>
  );
}
