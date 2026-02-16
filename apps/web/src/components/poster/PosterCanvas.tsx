/*
 * SlideForge - AI-First Slides Protocol Framework
 * Carbon/Poet.so 风格海报渲染
 */

'use client';

import { forwardRef, useMemo } from 'react';
import { marked } from 'marked';
import type { PosterTheme } from '@/lib/poster/themes';

interface PosterCanvasProps {
  markdown: string;
  theme: PosterTheme;
  width: number;
  showWindowButtons?: boolean;
  showWatermark?: boolean;
  authorName?: string;
  padding?: number;
}

// 提取 Tailwind 颜色类的实际颜色值
function getColorFromClass(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff',
    'text-slate-900': '#0f172a',
    'text-slate-700': '#334155',
    'text-slate-600': '#475569',
    'text-slate-500': '#64748b',
    'text-slate-400': '#94a3b8',
    'text-slate-300': '#cbd5e1',
    'text-neutral-400': '#a3a3a3',
    'text-neutral-300': '#d4d4d4',
    'text-neutral-600': '#525252',
    'text-purple-400': '#c084fc',
    'text-purple-300': '#d8b4fe',
    'text-purple-600': '#9333ea',
    'text-cyan-400': '#22d3ee',
    'text-cyan-300': '#67e8f9',
    'text-emerald-400': '#34d399',
    'text-emerald-300': '#6ee7b7',
    'text-rose-600': '#e11d48',
    'text-rose-500': '#f43f5e',
    'text-pink-500': '#ec4899',
    'text-blue-600': '#2563eb',
    'text-blue-500': '#3b82f6',
    'text-blue-400': '#60a5fa',
    'text-fuchsia-400': '#e879f9',
  };
  return colorMap[colorClass] || '#888888';
}

export const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(
  function PosterCanvas({ 
    markdown, 
    theme, 
    width, 
    showWindowButtons = true,
    showWatermark = true,
    authorName = 'Eagle',
    padding = 48 
  }, ref) {
    
    // 生成动态 CSS 样式
    const dynamicStyles = useMemo(() => {
      const accentColor = getColorFromClass(theme.colors.accent);
      const textColor = getColorFromClass(theme.colors.text);
      const subtitleColor = getColorFromClass(theme.colors.subtitle);
      const titleColor = getColorFromClass(theme.colors.title);
      const mutedColor = getColorFromClass(theme.colors.muted);
      
      return `
        .poster-content h1 { color: ${titleColor}; }
        .poster-content h2 { color: ${subtitleColor}; }
        .poster-content h3 { color: ${titleColor}; }
        .poster-content p { color: ${textColor}; }
        .poster-content strong { color: ${accentColor}; }
        .poster-content em { color: ${mutedColor}; }
        .poster-content a { color: ${getColorFromClass(theme.colors.link)}; }
        .poster-content blockquote { color: ${textColor}; border-left-color: ${accentColor}; }
        .poster-content code { color: ${accentColor}; }
        .poster-content li { color: ${textColor}; }
        .poster-content li::before { color: ${accentColor}; }
        .poster-content table { color: ${textColor}; }
        .poster-content thead tr { border-bottom-color: ${accentColor}; }
        .poster-content th { color: ${subtitleColor}; }
        .poster-content td { color: ${textColor}; }
        .poster-content hr { background-color: ${textColor}; opacity: 0.2; }
        .poster-watermark { color: ${mutedColor}; }
        .poster-watermark a { color: ${accentColor}; }
      `;
    }, [theme]);

    // 解析 Markdown
    const htmlContent = useMemo(() => {
      if (!markdown) return '';
      
      marked.setOptions({ gfm: true, breaks: true });
      return marked.parse(markdown) as string;
    }, [markdown]);

    return (
      <div
        ref={ref}
        className={`poster-canvas rounded-2xl overflow-hidden ${theme.background}`}
        style={{ width, padding }}
      >
        <style>{dynamicStyles}</style>
        
        {/* 内容卡片 */}
        <div className={`rounded-xl overflow-hidden ${theme.card.bg} ${theme.card.border} ${theme.card.shadow}`}>
          {/* 窗口按钮装饰 */}
          {showWindowButtons && (
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className={`w-3 h-3 rounded-full ${theme.windowButtons.close}`} />
              <div className={`w-3 h-3 rounded-full ${theme.windowButtons.minimize}`} />
              <div className={`w-3 h-3 rounded-full ${theme.windowButtons.maximize}`} />
            </div>
          )}
          
          {/* Markdown 内容 */}
          <div 
            className="poster-content p-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          
          {/* 水印 */}
          {showWatermark && (
            <div className="poster-watermark px-6 pb-4 pt-2 text-xs flex items-center justify-between opacity-60">
              <span>@{authorName}</span>
              <span>
                Made with <a href="https://github.com/Slidesforge/slideforge" target="_blank" rel="noopener noreferrer" className="hover:underline">SlideForge</a>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
