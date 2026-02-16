// PDF 导出 - 客户端方案 (html2canvas + jsPDF)
import type { SlideDocument } from '@slideforge/protocol';

export interface PDFExportOptions {
  quality?: 'draft' | 'standard' | 'high';
  includeNotes?: boolean;
}

export async function exportToPDF(
  document: SlideDocument,
  renderSlide: (index: number) => Promise<HTMLElement>,
  options: PDFExportOptions = {}
): Promise<Blob> {
  // 动态导入，减少初始包大小
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ]);

  const { quality = 'standard' } = options;
  const scale = quality === 'high' ? 3 : quality === 'standard' ? 2 : 1;
  
  // 16:9 比例
  const slideWidth = 1280;
  const slideHeight = 720;
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [slideWidth, slideHeight],
    hotfixes: ['px_scaling'],
  });

  const totalSlides = document.slides.length;

  for (let i = 0; i < totalSlides; i++) {
    if (i > 0) {
      pdf.addPage([slideWidth, slideHeight], 'landscape');
    }

    const element = await renderSlide(i);
    
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: null,
      width: slideWidth,
      height: slideHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, slideWidth, slideHeight);
  }

  return pdf.output('blob');
}

// 简化版：直接从当前 DOM 截图
export async function exportCurrentViewToPDF(
  container: HTMLElement,
  filename: string = 'slides.pdf'
): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
}
