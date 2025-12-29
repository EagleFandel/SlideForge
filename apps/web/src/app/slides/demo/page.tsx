"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { demoDocument } from "@/data/demo";
import { SlideCanvas, ScaledSlide } from "@/components/slides";
import { Presenter } from "@/components/presenter";

export default function DemoPage() {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isPresenting) {
    return (
      <Presenter
        document={demoDocument}
        onExit={() => setIsPresenting(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <h1 className="font-semibold">{demoDocument.metadata.title}</h1>
              <p className="text-sm text-slate-400">{demoDocument.slides.length} 页</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPresenting(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              开始演示
            </button>
            <button className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出 PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Thumbnails Sidebar */}
          <div className="w-44 flex-shrink-0">
            <p className="text-sm text-slate-400 mb-4">页面列表</p>
            <div className="space-y-3">
              {demoDocument.slides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Thumbnail Container - 16:9 比例 */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        width: "1280px",
                        height: "720px",
                        transform: "scale(0.1375)",
                        transformOrigin: "top left",
                      }}
                    >
                      <SlideCanvas slide={slide} />
                    </div>
                  </div>
                  {/* Slide Number */}
                  <div className={`py-1.5 text-xs font-medium text-center ${
                    index === currentIndex ? "bg-blue-500" : "bg-white/10"
                  }`}>
                    第 {index + 1} 页
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 min-w-0">
            {/* Slide Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScaledSlide slide={demoDocument.slides[currentIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="p-3 rounded-xl bg-white/10 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="px-6 py-2 bg-white/10 rounded-xl border border-white/20 font-medium">
                {currentIndex + 1} / {demoDocument.slides.length}
              </div>

              <button
                onClick={() => setCurrentIndex((i) => Math.min(demoDocument.slides.length - 1, i + 1))}
                disabled={currentIndex === demoDocument.slides.length - 1}
                className="p-3 rounded-xl bg-white/10 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Speaker Notes */}
            {demoDocument.slides[currentIndex].notes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl"
              >
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  演讲者备注
                </div>
                <p className="text-amber-100/80">
                  {demoDocument.slides[currentIndex].notes}
                </p>
              </motion.div>
            )}

            {/* Keyboard Shortcuts */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
                导航
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd>
                下一页
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
