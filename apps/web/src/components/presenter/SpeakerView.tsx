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

/**
 * SpeakerView - 演讲者模式
 * 显示当前页、下一页预览、演讲者备注、计时器
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SlideDocument } from '@slideforge/protocol';
import { SlideCanvas } from '../slides';

interface SpeakerViewProps {
  document: SlideDocument;
  onExit?: () => void;
}

export function SpeakerView({ document, onExit }: SpeakerViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalSlides = document.slides.length;
  const currentSlide = document.slides[currentIndex];
  const nextSlide = document.slides[currentIndex + 1];

  // 计时器
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(t => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsTimerRunning(true);
  };

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, totalSlides]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  }, [currentIndex]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  }, [totalSlides]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
        case 'Escape':
          if (onExit) onExit();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetTimer();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setIsTimerRunning(r => !r);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goTo, totalSlides, onExit]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex">
      {/* 左侧：当前页 + 下一页 */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* 当前页 */}
        <div className="flex-1 relative">
          <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            当前页 {currentIndex + 1}/{totalSlides}
          </div>
          <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <div className="transform scale-[0.55] origin-center">
              <SlideCanvas slide={currentSlide} />
            </div>
          </div>
        </div>

        {/* 下一页预览 */}
        <div className="h-48 relative">
          <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            下一页
          </div>
          <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
            {nextSlide ? (
              <div className="transform scale-[0.25] origin-center">
                <SlideCanvas slide={nextSlide} />
              </div>
            ) : (
              <div className="text-gray-500 text-lg">演示结束</div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧：备注 + 控制 */}
      <div className="w-96 bg-gray-800 flex flex-col">
        {/* 计时器 */}
        <div className="p-4 border-b border-gray-700">
          <div className="text-center">
            <div className="text-5xl font-mono text-white mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setIsTimerRunning(r => !r)}
                className={`px-4 py-1 rounded text-sm ${
                  isTimerRunning 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition-colors`}
              >
                {isTimerRunning ? '暂停' : '继续'}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-1 rounded text-sm bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* 演讲者备注 */}
        <div className="flex-1 p-4 overflow-auto">
          <h3 className="text-gray-400 text-sm font-medium mb-2">演讲者备注</h3>
          <div className="text-white text-lg leading-relaxed">
            {currentSlide.notes || (
              <span className="text-gray-500 italic">此页没有备注</span>
            )}
          </div>
        </div>

        {/* 导航控制 */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              ← 上一页
            </button>
            <span className="text-white font-medium">
              {currentIndex + 1} / {totalSlides}
            </span>
            <button
              onClick={goNext}
              disabled={currentIndex === totalSlides - 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              下一页 →
            </button>
          </div>

          {/* 进度条 */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="p-4 border-t border-gray-700 text-gray-500 text-xs">
          <div className="grid grid-cols-2 gap-1">
            <span>← → 导航</span>
            <span>P 暂停/继续</span>
            <span>R 重置计时</span>
            <span>ESC 退出</span>
          </div>
        </div>

        {/* 退出按钮 */}
        {onExit && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onExit}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              退出演讲者模式
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
