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
import type { SlideDocument } from '@slideforge/protocol';
import { exportToHTML, exportToJSON, downloadFile } from '@/lib/export';

interface ExportMenuProps {
  document: SlideDocument;
  filename: string;
  onClose: () => void;
}

export function ExportMenu({ document, filename, onClose }: ExportMenuProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportJSON = () => {
    const json = exportToJSON(document);
    downloadFile(json, `${filename}.json`, 'application/json');
    onClose();
  };

  const handleExportHTML = async () => {
    setExporting('html');
    try {
      const html = await exportToHTML(document);
      downloadFile(html, `${filename}.html`, 'text/html');
    } finally {
      setExporting(null);
      onClose();
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      // PDF 导出需要渲染每一页，这里用简化方案
      // 完整方案需要在隐藏容器中渲染每页再截图
      const { jsPDF } = await import('jspdf');
      
      // 创建临时容器渲染所有页面
      const container = window.document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;width:1280px;height:720px;';
      window.document.body.appendChild(container);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720],
      });

      for (let i = 0; i < document.slides.length; i++) {
        if (i > 0) pdf.addPage([1280, 720], 'landscape');
        
        // 简化：只导出基本信息
        const slide = document.slides[i];
        const headingEl = slide.elements.find((e) => e.type === 'heading');
        const title = (headingEl && 'text' in headingEl ? headingEl.text : null) || `Slide ${i + 1}`;
        
        pdf.setFontSize(48);
        pdf.text(title, 640, 360, { align: 'center' });
      }

      window.document.body.removeChild(container);
      
      const blob = pdf.output('blob');
      downloadFile(blob, `${filename}.pdf`);
    } finally {
      setExporting(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-80"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          导出演示文稿
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={handleExportJSON}
            disabled={!!exporting}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">📄</span>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">JSON</div>
              <div className="text-sm text-gray-500">SlideForge 协议格式</div>
            </div>
          </button>

          <button
            onClick={handleExportHTML}
            disabled={!!exporting}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">{exporting === 'html' ? '⏳' : '🌐'}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">HTML</div>
              <div className="text-sm text-gray-500">独立可运行的网页</div>
            </div>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={!!exporting}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">{exporting === 'pdf' ? '⏳' : '📑'}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">PDF</div>
              <div className="text-sm text-gray-500">打印和分享</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          取消
        </button>
      </div>
    </div>
  );
}
