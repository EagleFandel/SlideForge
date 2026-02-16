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

// 批量导出功能
import type { SlideDocument } from '@slideforge/protocol';
import { exportToHTML } from './html';
import { exportToJSON } from './index';
import JSZip from 'jszip';

export type ExportFormat = 'json' | 'html' | 'pdf';

export interface BatchExportOptions {
  format: ExportFormat;
  includeAssets?: boolean;
}

export interface BatchExportItem {
  id: string;
  title: string;
  document: SlideDocument;
}

/**
 * 批量导出多个演示文稿为 ZIP
 */
export async function batchExport(
  items: BatchExportItem[],
  options: BatchExportOptions
): Promise<Blob> {
  const zip = new JSZip();
  const { format } = options;

  for (const item of items) {
    const filename = sanitizeFilename(item.title);
    
    switch (format) {
      case 'json': {
        const json = exportToJSON(item.document);
        zip.file(`${filename}.json`, json);
        break;
      }
      case 'html': {
        const html = await exportToHTML(item.document);
        zip.file(`${filename}.html`, html);
        break;
      }
      case 'pdf': {
        // PDF 需要特殊处理，暂时跳过
        console.warn('PDF batch export not yet implemented');
        break;
      }
    }
  }

  return zip.generateAsync({ type: 'blob' });
}

/**
 * 导出所有演示文稿
 */
export async function exportAll(
  items: BatchExportItem[],
  format: ExportFormat = 'json'
): Promise<void> {
  const blob = await batchExport(items, { format });
  downloadBlob(blob, `slideforge-export-${Date.now()}.zip`);
}


/**
 * 清理文件名，移除非法字符
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 100) || 'untitled';
}

/**
 * 下载 Blob
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 批量导出进度回调
 */
export type BatchExportProgress = (current: number, total: number, item: string) => void;

/**
 * 带进度的批量导出
 */
export async function batchExportWithProgress(
  items: BatchExportItem[],
  options: BatchExportOptions,
  onProgress?: BatchExportProgress
): Promise<Blob> {
  const zip = new JSZip();
  const { format } = options;
  const total = items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filename = sanitizeFilename(item.title);
    
    onProgress?.(i + 1, total, item.title);
    
    switch (format) {
      case 'json': {
        const json = exportToJSON(item.document);
        zip.file(`${filename}.json`, json);
        break;
      }
      case 'html': {
        const html = await exportToHTML(item.document);
        zip.file(`${filename}.html`, html);
        break;
      }
    }
  }

  return zip.generateAsync({ type: 'blob' });
}
