/*
 * SlideForge - AI-First Slides Protocol Framework
 * Carbon/Poet.so 风格海报编辑器
 */

'use client';

import { useState, useRef } from 'react';
import { PosterCanvas } from './PosterCanvas';
import { MarkdownEditor } from './MarkdownEditor';
import { posterThemes, getThemeById } from '@/lib/poster/themes';
import { exportToPng, copyToClipboard } from '@/lib/poster/export';

const defaultMarkdown = `# SlideForge

## AI-First Slides Protocol

让 AI 生成的想法，第一次拥有可靠的展示终点。

---

- 🤖 AI 首次成功率 >95%
- 🎬 立即演示，无需转换
- 📤 多格式稳定导出
- 🎨 丰富主题和动画

---

> "Slides 不再是文件，而是一种可计算的内容结构。"

**Apache 2.0** · Made with ❤️
`;

export function PosterEditor() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [themeId, setThemeId] = useState('midnight');
  const [width, setWidth] = useState(600);
  const [padding, setPadding] = useState(48);
  const [showButtons, setShowButtons] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [authorName, setAuthorName] = useState('Eagle');
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentTheme = getThemeById(themeId);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(canvasRef.current, `poster-${Date.now()}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyToClipboard(canvasRef.current);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* 左侧控制面板 */}
      <div className="w-[380px] bg-white border-r border-slate-200 flex flex-col">
        {/* 主题选择 */}
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-medium text-slate-700 mb-3">主题</h3>
          <div className="grid grid-cols-4 gap-2">
            {posterThemes.map(t => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`group relative h-12 rounded-lg overflow-hidden transition-all ${
                  themeId === t.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                }`}
                title={t.name}
              >
                <div className={`absolute inset-0 ${t.background}`} />
                <div className="absolute inset-2 rounded bg-black/20" />
              </button>
            ))}
          </div>
        </div>

        {/* 设置 */}
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">宽度</span>
              <span className="text-slate-400">{width}px</span>
            </div>
            <input
              type="range"
              min="400"
              max="800"
              step="50"
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">边距</span>
              <span className="text-slate-400">{padding}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="80"
              step="8"
              value={padding}
              onChange={e => setPadding(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showButtons}
              onChange={e => setShowButtons(e.target.checked)}
              className="rounded border-slate-300"
            />
            显示窗口按钮
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={e => setShowWatermark(e.target.checked)}
              className="rounded border-slate-300"
            />
            显示水印
          </label>
          {showWatermark && (
            <div>
              <label className="text-sm text-slate-600 mb-1 block">作者名</label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入作者名..."
              />
            </div>
          )}
        </div>

        {/* Markdown 编辑 */}
        <div className="flex-1 p-4 flex flex-col min-h-0">
          <h3 className="text-sm font-medium text-slate-700 mb-2">内容</h3>
          <div className="flex-1 min-h-0 overflow-hidden">
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
              height={280}
            />
          </div>
        </div>

        {/* 导出按钮 */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isExporting ? '导出中...' : '📥 导出 PNG'}
          </button>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            {copySuccess ? '✅ 已复制!' : '📋 复制到剪贴板'}
          </button>
        </div>
      </div>

      {/* 右侧预览 */}
      <div className="flex-1 p-8 overflow-auto flex items-start justify-center bg-slate-100">
        <PosterCanvas
          ref={canvasRef}
          markdown={markdown}
          theme={currentTheme}
          width={width}
          padding={padding}
          showWindowButtons={showButtons}
          showWatermark={showWatermark}
          authorName={authorName}
        />
      </div>
    </div>
  );
}
