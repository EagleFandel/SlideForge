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

import { useState } from 'react';
import Link from 'next/link';
import type { StoredPresentation } from '@/lib/db';
import { ExportMenu } from './ExportMenu';

interface PresentationCardProps {
  presentation: StoredPresentation;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function PresentationCard({ presentation, onDelete, onDuplicate }: PresentationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const slideCount = presentation.document.slides.length;
  const theme = presentation.document.config.theme;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="group relative bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-600 transition-all">
        {/* 缩略图区域 */}
        <Link href={`/slides/${presentation.id}`}>
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm text-gray-400">
                {slideCount} 页 · {theme}
              </div>
            </div>
          </div>
        </Link>
        
        {/* 信息区域 */}
        <div className="p-4">
          <Link href={`/slides/${presentation.id}`}>
            <h3 className="font-medium text-gray-100 truncate hover:text-blue-400">
              {presentation.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(presentation.updatedAt)}
          </p>
        </div>

        {/* 操作菜单 */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
          >
            <MoreIcon />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-20 w-36 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1">
                <Link
                  href={`/slides/${presentation.id}/present`}
                  className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-600"
                >
                  🎬 演示
                </Link>
                <button
                  onClick={() => { setShowExport(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600"
                >
                  📤 导出
                </button>
                <button
                  onClick={() => { onDuplicate(presentation.id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-600"
                >
                  📋 复制
                </button>
                <button
                  onClick={() => { onDelete(presentation.id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                >
                  🗑️ 删除
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 导出弹窗 */}
      {showExport && (
        <ExportMenu
          document={presentation.document}
          filename={presentation.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
}

function MoreIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}
