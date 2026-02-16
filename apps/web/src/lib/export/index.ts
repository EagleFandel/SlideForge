export { exportToHTML } from './html';
export { exportToPDF, exportCurrentViewToPDF, type PDFExportOptions } from './pdf';
export { batchExport, batchExportWithProgress, exportAll, type BatchExportOptions, type BatchExportItem, type ExportFormat } from './batch';

import type { SlideDocument } from '@slideforge/protocol';

// JSON 导出
export function exportToJSON(document: SlideDocument): string {
  return JSON.stringify(document, null, 2);
}

// 下载文件工具函数
export function downloadFile(content: string | Blob, filename: string, type?: string): void {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type: type || 'text/plain' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
