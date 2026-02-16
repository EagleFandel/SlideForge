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

import { NextRequest, NextResponse } from 'next/server';

interface ValidationError {
  path: string;
  message: string;
  suggestion?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document } = body;

    if (!document) {
      return NextResponse.json(
        { valid: false, errors: [{ path: '', message: 'Missing document' }] },
        { status: 400 }
      );
    }

    const errors: ValidationError[] = [];

    // 检查必填字段
    if (!document.version) {
      errors.push({
        path: 'version',
        message: 'Missing required field: version',
        suggestion: 'Add "version": "1.0"',
      });
    }

    if (!document.metadata?.title) {
      errors.push({
        path: 'metadata.title',
        message: 'Missing required field: metadata.title',
        suggestion: 'Add metadata with title',
      });
    }

    if (!document.config?.theme) {
      errors.push({
        path: 'config.theme',
        message: 'Missing required field: config.theme',
        suggestion: 'Add config.theme (e.g., "default")',
      });
    }

    if (!Array.isArray(document.slides)) {
      errors.push({
        path: 'slides',
        message: 'slides must be an array',
        suggestion: 'Add slides array with at least one slide',
      });
    } else {
      document.slides.forEach((slide: any, i: number) => {
        if (!slide.type) {
          errors.push({
            path: `slides[${i}].type`,
            message: 'Missing slide type',
            suggestion: 'Valid types: title, section, content, image, code, quote, blank',
          });
        }
        if (!Array.isArray(slide.elements)) {
          errors.push({
            path: `slides[${i}].elements`,
            message: 'elements must be an array',
          });
        }
      });
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch {
    return NextResponse.json(
      { valid: false, errors: [{ path: '', message: 'Invalid JSON' }] },
      { status: 400 }
    );
  }
}
