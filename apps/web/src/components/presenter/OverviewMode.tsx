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

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SlideDocument } from '@slideforge/protocol';
import { SlideCanvas } from '../slides';

interface OverviewModeProps {
  document: SlideDocument;
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function OverviewMode({ document, currentIndex, onSelect, onClose }: OverviewModeProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 overflow-auto p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-medium">
          概览模式 - {document.metadata.title}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {document.slides.map((slide, index) => (
          <motion.button
            key={index}
            onClick={() => { onSelect(index); onClose(); }}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
              index === currentIndex ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-gray-500'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="transform scale-[0.15] origin-center pointer-events-none">
                <SlideCanvas slide={slide} />
              </div>
            </div>
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
              index === currentIndex ? 'bg-blue-500 text-white' : 'bg-black/60 text-gray-300'
            }`}>
              {index + 1}
            </div>
          </motion.button>
        ))}
      </div>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
        点击缩略图跳转 · 按 O 或 ESC 关闭
      </div>
    </motion.div>
  );
}
