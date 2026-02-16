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

// QR Code 生成工具
// 使用 Canvas API 生成简单的 QR 码

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

const DEFAULT_OPTIONS: Required<QRCodeOptions> = {
  size: 200,
  margin: 4,
  darkColor: '#000000',
  lightColor: '#ffffff',
};

export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // 动态导入 qrcode 库
  const QRCode = await import('qrcode');
  
  const dataUrl = await QRCode.toDataURL(text, {
    width: opts.size,
    margin: opts.margin,
    color: {
      dark: opts.darkColor,
      light: opts.lightColor,
    },
  });
  
  return dataUrl;
}

export async function generateQRCodeCanvas(
  text: string,
  canvas: HTMLCanvasElement,
  options: QRCodeOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const QRCode = await import('qrcode');
  
  await QRCode.toCanvas(canvas, text, {
    width: opts.size,
    margin: opts.margin,
    color: {
      dark: opts.darkColor,
      light: opts.lightColor,
    },
  });
}
