/**
 * Study Zone - Notes & Cornell Summaries API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import type { NoteRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const notesRouter = Router();

// GET /api/notes
notesRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const notes = db.notes.filter((n) => n.userId === userId);
  res.json({ notes, total: notes.length });
});

// POST /api/notes
notesRouter.post('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { title, subject, content, summary, cues, tags, isAiGenerated, aiToolSource, isPinned } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'ValidationError', message: 'Note title is required.' });
  }

  const newNote: NoteRecord = {
    id: `note_${Date.now()}`,
    userId,
    title: title.trim(),
    subject: subject || 'General Studies',
    content: content || '',
    summary: summary || undefined,
    cues: cues || [],
    tags: tags || [],
    isAiGenerated: Boolean(isAiGenerated),
    aiToolSource: aiToolSource || undefined,
    isPinned: Boolean(isPinned),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  db.notes.unshift(newNote);
  res.status(201).json({ success: true, note: newNote });
});

// PUT /api/notes/:id
notesRouter.put('/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const noteIndex = db.notes.findIndex((n) => n.id === req.params.id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'NotFound', message: `Note "${req.params.id}" not found.` });
  }

  const current = db.notes[noteIndex];
  const updates = req.body;

  const updatedNote: NoteRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  db.notes[noteIndex] = updatedNote;
  res.json({ success: true, note: updatedNote });
});

// DELETE /api/notes/:id
notesRouter.delete('/:id', optionalAuth, (_req: AuthenticatedRequest, res: Response) => {
  const initialLength = db.notes.length;
  db.notes = db.notes.filter((n) => n.id !== _req.params.id);

  if (db.notes.length === initialLength) {
    return res.status(404).json({ error: 'NotFound', message: `Note not found.` });
  }

  res.json({ success: true, message: 'Note deleted successfully.' });
});
