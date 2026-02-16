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

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPresentation, type StoredPresentation } from '@/lib/db';
import { Presenter } from '@/components/presenter';

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<StoredPresentation | null>(null);
  const [loading, setLoading] = useState(true);

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

  // 安全退出：先退出全屏再导航
  const handleExit = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      // 忽略全屏退出错误
    }
    // 使用 window.location 替代 router.push 避免 fetch 错误
    window.location.href = `/slides/${id}`;
  }, [id]);

  const handleSpeakerMode = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      // 忽略全屏退出错误
    }
    window.location.href = `/slides/${id}/speaker`;
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl mb-4">演示文稿不存在</h1>
        <button onClick={() => router.push('/dashboard')} className="text-blue-400 hover:underline">
          返回 Dashboard
        </button>
      </div>
    );
  }

  return (
    <Presenter
      document={presentation.document}
      onExit={handleExit}
      onSpeakerMode={handleSpeakerMode}
    />
  );
}
