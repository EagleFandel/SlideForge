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

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPresentation, type StoredPresentation } from '@/lib/db';
import { ScaledSlide } from '@/components/slides';

export default function SlidePage() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<StoredPresentation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const id = params.id as string;

  useEffect(() => {
    async function load() {
      const p = await getPresentation(id);
      if (p) {
        setPresentation(p);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // 键盘导航
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!presentation) return;
    const total = presentation.document.slides.length;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      setCurrentSlide(prev => Math.min(total - 1, prev + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setCurrentSlide(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentSlide(total - 1);
    }
  }, [presentation]);

  // 滚轮切换幻灯片
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!presentation) return;
    e.preventDefault();
    const total = presentation.document.slides.length;
    
    if (e.deltaY > 0) {
      setCurrentSlide(prev => Math.min(total - 1, prev + 1));
    } else if (e.deltaY < 0) {
      setCurrentSlide(prev => Math.max(0, prev - 1));
    }
  }, [presentation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('wheel', handleWheel, { passive: false });
      return () => mainEl.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // 自动滚动缩略图到当前幻灯片
  useEffect(() => {
    const thumb = thumbnailRefs.current[currentSlide];
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSlide]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl mb-4">演示文稿不存在</h1>
        <Link href="/dashboard" className="text-blue-400 hover:underline">
          返回 Dashboard
        </Link>
      </div>
    );
  }

  const { document: doc } = presentation;
  const slides = doc.slides;
  const slide = slides[currentSlide];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Header - 固定高度 */}
      <header className="h-14 flex-shrink-0 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
            ← 返回
          </Link>
          <h1 className="text-white font-medium truncate max-w-xs">{doc.metadata.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
          <Link
            href={`/slides/${id}/present`}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            🎬 全屏演示
          </Link>
        </div>
      </header>

      {/* Main content - 填充剩余空间 */}
      <div className="flex-1 flex min-h-0">
        {/* 缩略图侧边栏 - 可滚动 */}
        <aside className="w-36 flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto p-2">
          {slides.map((s, i) => (
            <button
              key={i}
              ref={el => { thumbnailRefs.current[i] = el; }}
              onClick={() => setCurrentSlide(i)}
              className={`w-full mb-2 rounded-lg overflow-hidden border-2 transition-colors ${
                i === currentSlide 
                  ? 'border-blue-500' 
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              <div className="relative aspect-video bg-gray-900">
                <ScaledSlide
                  slide={s}
                  theme={doc.config.theme}
                  aspectRatio={doc.config.aspectRatio}
                  animate={false}
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                  {i + 1}
                </div>
              </div>
            </button>
          ))}
        </aside>

        {/* 主预览区 - 滚轮切换幻灯片 */}
        <main 
          ref={mainRef}
          className="flex-1 flex items-center justify-center p-6 min-h-0 cursor-default select-none"
        >
          <div className="w-full max-w-5xl">
            <ScaledSlide
              slide={slide}
              theme={doc.config.theme}
              aspectRatio={doc.config.aspectRatio}
            />
          </div>
        </main>
      </div>

      {/* 底部提示 - 固定高度 */}
      <footer className="h-10 flex-shrink-0 bg-gray-800 border-t border-gray-700 px-4 flex items-center justify-center">
        <span className="text-gray-500 text-xs">
          使用 ← → 或滚轮切换幻灯片 · 按 F 全屏
        </span>
      </footer>
    </div>
  );
}
