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

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePresentationsStore } from '@/lib/store/presentations';
import { PresentationCard, ImportDropzone } from '@/components/dashboard';
import { AIGeneratePanel } from '@/components/ai';

type SortOption = 'updatedAt' | 'createdAt' | 'title';

export default function DashboardPage() {
  const router = useRouter();
  const { presentations, isLoading, loadAll, remove, duplicate, importJSON } = usePresentationsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredAndSortedPresentations = useMemo(() => {
    let result = presentations.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    
    return result;
  }, [presentations, searchQuery, sortBy]);

  const handleImport = async (json: string) => {
    await importJSON(json);
    setShowImport(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个演示文稿吗？')) {
      await remove(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎴</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">SlideForge</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAIPanel(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                ✨ AI 生成
              </button>
              <Link
                href="/poster"
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                🖼️ 海报
              </Link>
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                📥 导入
              </button>
              <Link
                href="/slides/demo"
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                查看 Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和排序栏 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="搜索演示文稿..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="updatedAt">最近修改</option>
            <option value="createdAt">创建时间</option>
            <option value="title">标题排序</option>
          </select>
        </div>

        {/* 导入区域 */}
        {showImport && (
          <div className="mb-8">
            <ImportDropzone onImport={handleImport} />
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && presentations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              还没有演示文稿
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              导入 JSON 文件开始使用，或查看 Demo 了解更多
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAIPanel(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                ✨ AI 生成
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="px-6 py-3 border-2 border-gray-500 text-gray-200 rounded-lg hover:bg-gray-700 hover:border-gray-400"
              >
                📥 导入 JSON
              </button>
            </div>
          </div>
        )}

        {/* 项目网格 */}
        {!isLoading && filteredAndSortedPresentations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPresentations.map((presentation) => (
              <PresentationCard
                key={presentation.id}
                presentation={presentation}
                onDelete={handleDelete}
                onDuplicate={duplicate}
              />
            ))}
          </div>
        )}

        {/* 搜索无结果 */}
        {!isLoading && presentations.length > 0 && filteredAndSortedPresentations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-500">没有找到匹配的演示文稿</p>
          </div>
        )}
      </main>

      {/* AI 生成面板 */}
      {showAIPanel && (
        <AIGeneratePanel
          onClose={() => setShowAIPanel(false)}
          onSuccess={(id) => router.push(`/slides/${id}`)}
        />
      )}
    </div>
  );
}
