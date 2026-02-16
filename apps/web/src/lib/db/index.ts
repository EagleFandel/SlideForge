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

// IndexedDB 存储层 - 使用 Dexie.js
import Dexie, { type Table } from 'dexie';
import type { SlideDocument } from '@slideforge/protocol';

export interface StoredPresentation {
  id: string;
  document: SlideDocument;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  tags: string[];
}

export interface AppSettings {
  key: string;
  value: unknown;
}

class SlideForgeDB extends Dexie {
  presentations!: Table<StoredPresentation>;
  settings!: Table<AppSettings>;

  constructor() {
    super('slideforge');
    
    this.version(1).stores({
      presentations: 'id, title, createdAt, updatedAt, *tags',
      settings: 'key'
    });
  }
}

export const db = new SlideForgeDB();

// CRUD 操作
export async function getAllPresentations(): Promise<StoredPresentation[]> {
  return db.presentations.orderBy('updatedAt').reverse().toArray();
}

export async function getPresentation(id: string): Promise<StoredPresentation | undefined> {
  return db.presentations.get(id);
}

export async function savePresentation(presentation: StoredPresentation): Promise<string> {
  await db.presentations.put(presentation);
  return presentation.id;
}

export async function deletePresentation(id: string): Promise<void> {
  await db.presentations.delete(id);
}

export async function searchPresentations(query: string): Promise<StoredPresentation[]> {
  const lowerQuery = query.toLowerCase();
  return db.presentations
    .filter(p => p.title.toLowerCase().includes(lowerQuery))
    .toArray();
}
