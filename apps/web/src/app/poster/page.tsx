'use client';

/**
 * Poster Page - Markdown 海报生成器
 */

import Link from 'next/link';
import { PosterEditor } from '@/components/poster';

export default function PosterPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Markdown 海报</h1>
        </div>
        <div className="text-sm text-gray-500">
          输入 Markdown，生成精美海报
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <PosterEditor />
      </main>
    </div>
  );
}
