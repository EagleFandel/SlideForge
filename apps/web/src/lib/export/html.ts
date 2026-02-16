// HTML 导出 - 打包成独立可运行的 HTML 文件
import type { SlideDocument } from '@slideforge/protocol';

export async function exportToHTML(document: SlideDocument): Promise<string> {
  const { metadata, config, slides } = document;
  
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metadata.title)}</title>
  <style>
    ${getBaseStyles()}
    ${getThemeStyles(config.theme)}
  </style>
</head>
<body>
  <div id="slideforge-app">
    <div class="sf-presenter">
      ${slides.map((slide, i) => renderSlide(slide, i)).join('\n')}
    </div>
    <div class="sf-controls">
      <button onclick="prev()" id="prevBtn">←</button>
      <span id="counter">1 / ${slides.length}</span>
      <button onclick="next()" id="nextBtn">→</button>
      <button onclick="toggleFullscreen()">⛶</button>
    </div>
    <div class="sf-progress"><div class="sf-progress-bar" id="progressBar"></div></div>
  </div>
  <script>
    ${getPresenterScript(slides.length)}
  </script>
</body>
</html>`;

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSlide(slide: any, index: number): string {
  const elements = slide.elements.map((el: any) => renderElement(el)).join('\n');
  const bgStyle = slide.background 
    ? `background: ${slide.background.value};` 
    : '';
  
  return `
    <div class="sf-slide" data-index="${index}" style="${bgStyle}">
      <div class="sf-slide-content sf-layout-${slide.layout || 'default'} sf-type-${slide.type}">
        ${elements}
      </div>
    </div>`;
}

function renderElement(el: any): string {
  switch (el.type) {
    case 'heading':
      return `<h${el.level} class="sf-heading">${escapeHtml(el.text)}</h${el.level}>`;
    case 'text':
      return `<p class="sf-text">${escapeHtml(el.content)}</p>`;
    case 'list':
      const tag = el.ordered ? 'ol' : 'ul';
      const items = el.items.map((item: any) => {
        const text = typeof item === 'string' ? item : item.text;
        const icon = typeof item === 'object' && item.icon ? `<span class="sf-icon">${item.icon}</span>` : '';
        return `<li>${icon}${escapeHtml(text)}</li>`;
      }).join('');
      return `<${tag} class="sf-list">${items}</${tag}>`;
    case 'code':
      return `<pre class="sf-code"><code class="language-${el.language}">${escapeHtml(el.content)}</code></pre>`;
    case 'image':
      return `<img class="sf-image" src="${el.src}" alt="${escapeHtml(el.alt || '')}" />`;
    default:
      return '';
  }
}

function getBaseStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #000; overflow: hidden; }
    #slideforge-app { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    .sf-presenter { position: relative; width: 100%; height: 100%; }
    .sf-slide { position: absolute; inset: 0; display: none; padding: 4rem; }
    .sf-slide.active { display: flex; align-items: center; justify-content: center; }
    .sf-slide-content { max-width: 1200px; width: 100%; }
    .sf-heading { margin-bottom: 1rem; }
    h1 { font-size: 3.5rem; }
    h2 { font-size: 2.5rem; }
    h3 { font-size: 1.75rem; }
    .sf-text { font-size: 1.25rem; line-height: 1.6; margin-bottom: 1rem; }
    .sf-list { font-size: 1.25rem; padding-left: 2rem; }
    .sf-list li { margin-bottom: 0.5rem; }
    .sf-icon { margin-right: 0.5rem; }
    .sf-code { background: #1e1e1e; padding: 1.5rem; border-radius: 8px; overflow-x: auto; }
    .sf-code code { font-family: 'Fira Code', monospace; font-size: 1rem; color: #d4d4d4; }
    .sf-image { max-width: 100%; max-height: 70vh; border-radius: 8px; }
    .sf-controls { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; background: rgba(0,0,0,0.7); padding: 0.75rem 1.5rem; border-radius: 2rem; }
    .sf-controls button { background: none; border: none; color: #fff; font-size: 1.25rem; cursor: pointer; padding: 0.5rem; }
    .sf-controls button:hover { opacity: 0.7; }
    .sf-controls button:disabled { opacity: 0.3; }
    #counter { color: #fff; min-width: 80px; text-align: center; }
    .sf-progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.1); }
    .sf-progress-bar { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); transition: width 0.3s; }
    .sf-type-title .sf-slide-content { text-align: center; }
    .sf-type-section .sf-slide-content { text-align: center; }
  `;
}

function getThemeStyles(theme: string): string {
  const themes: Record<string, string> = {
    default: `
      .sf-slide { background: #ffffff; color: #1e293b; }
      h1, h2, h3 { color: #0f172a; }
    `,
    dark: `
      .sf-slide { background: #0f172a; color: #e2e8f0; }
      h1, h2, h3 { color: #f8fafc; }
    `,
    corporate: `
      .sf-slide { background: #f8fafc; color: #334155; }
      h1, h2, h3 { color: #1e40af; }
    `,
  };
  return themes[theme] || themes.default;
}

function getPresenterScript(total: number): string {
  return `
    let current = 0;
    const total = ${total};
    const slides = document.querySelectorAll('.sf-slide');
    const counter = document.getElementById('counter');
    const progress = document.getElementById('progressBar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function show(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      counter.textContent = (index + 1) + ' / ' + total;
      progress.style.width = ((index + 1) / total * 100) + '%';
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === total - 1;
    }

    function next() { if (current < total - 1) show(++current); }
    function prev() { if (current > 0) show(--current); }
    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'f') toggleFullscreen();
    });

    show(0);
  `;
}
