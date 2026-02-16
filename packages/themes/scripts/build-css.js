/**
 * Build CSS - 复制 CSS 文件到 dist 目录
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist/css');

// 确保 dist/css 目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制所有 CSS 文件
const cssFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.css'));

for (const file of cssFiles) {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${file}`);
}

console.log(`\n✅ Built ${cssFiles.length} CSS files to dist/css/`);
