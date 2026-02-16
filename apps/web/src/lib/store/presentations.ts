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

// Zustand 状态管理 - 演示文稿
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { SlideDocument } from '@slideforge/protocol';
import { 
  db, 
  getAllPresentations, 
  getPresentation, 
  savePresentation, 
  deletePresentation,
  type StoredPresentation 
} from '../db';

interface PresentationsState {
  presentations: StoredPresentation[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadAll: () => Promise<void>;
  create: (doc: SlideDocument) => Promise<string>;
  update: (id: string, doc: SlideDocument) => Promise<void>;
  remove: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<string>;
  importJSON: (json: string) => Promise<string>;
}

export const usePresentationsStore = create<PresentationsState>((set, get) => ({
  presentations: [],
  isLoading: false,
  error: null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const presentations = await getAllPresentations();
      set({ presentations, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  create: async (doc: SlideDocument) => {
    const id = uuidv4();
    const now = new Date();
    const presentation: StoredPresentation = {
      id,
      document: doc,
      title: doc.metadata.title,
      tags: doc.metadata.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    
    await savePresentation(presentation);
    set(state => ({ presentations: [presentation, ...state.presentations] }));
    return id;
  },

  update: async (id: string, doc: SlideDocument) => {
    const existing = await getPresentation(id);
    if (!existing) throw new Error('Presentation not found');
    
    const updated: StoredPresentation = {
      ...existing,
      document: doc,
      title: doc.metadata.title,
      tags: doc.metadata.tags || [],
      updatedAt: new Date(),
    };
    
    await savePresentation(updated);
    set(state => ({
      presentations: state.presentations.map(p => p.id === id ? updated : p)
    }));
  },

  remove: async (id: string) => {
    await deletePresentation(id);
    set(state => ({
      presentations: state.presentations.filter(p => p.id !== id)
    }));
  },

  duplicate: async (id: string) => {
    const original = await getPresentation(id);
    if (!original) throw new Error('Presentation not found');
    
    const newDoc = {
      ...original.document,
      metadata: {
        ...original.document.metadata,
        id: undefined,
        title: `${original.document.metadata.title} (副本)`,
        createdAt: new Date().toISOString(),
      }
    };
    
    return get().create(newDoc);
  },

  importJSON: async (json: string) => {
    const doc = JSON.parse(json) as SlideDocument;
    // TODO: 添加协议校验
    return get().create(doc);
  },
}));
