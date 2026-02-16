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

import { useState, useEffect } from 'react';
import { aiManager, type CreatePresentationInput } from '@/lib/ai';
import { usePresentationsStore } from '@/lib/store/presentations';

interface AIGeneratePanelProps {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export function AIGeneratePanel({ onClose, onSuccess }: AIGeneratePanelProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('default');
  const [slideCount, setSlideCount] = useState(6);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);

  const { create } = usePresentationsStore();

  useEffect(() => {
    aiManager.initialize().then(() => {
      setProviderName(aiManager.getActiveProvider());
    });
  }, []);

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) {
      setError('请填写标题和内容');
      return;
    }

    setGenerating(true);
    setError(null);

    const input: CreatePresentationInput = {
      title: title.trim(),
      content: content.trim(),
      theme,
      slideCount,
      language: 'zh',
    };

    const result = await aiManager.generatePresentation(input);

    if (result.success && result.document) {
      const id = await create(result.document);
      onSuccess?.(id);
      onClose();
    } else {
      setError(result.error || '生成失败');
    }

    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ✨ AI 生成演示文稿
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Provider 状态 */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
            {providerName ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ 使用 {providerName}
              </span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400">
                ⚠ 未检测到可用的 AI。请安装 Ollama 或使用支持 AI 的 Chrome。
              </span>
            )}
          </div>

          {/* 表单 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="演示文稿标题"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                内容描述
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="描述你想要的内容，每行一个要点..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  主题
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  页数
                </label>
                <input
                  type="number"
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  min={3}
                  max={15}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* 按钮 */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              取消
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating || !providerName}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '生成中...' : '✨ 生成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
