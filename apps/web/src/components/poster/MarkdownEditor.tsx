/*
 * SlideForge - AI-First Slides Protocol Framework
 * Markdown 编辑器组件（基于 @uiw/react-md-editor）
 */

'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// 动态导入避免 SSR 问题
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export function MarkdownEditor({ value, onChange, height = 300 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="markdown-editor-wrapper">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
      />
      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: none;
        }
        .markdown-editor-wrapper .w-md-editor-toolbar {
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .markdown-editor-wrapper .w-md-editor-text-input {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.875rem;
        }
        .markdown-editor-wrapper .w-md-editor-content {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}
