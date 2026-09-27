/**
 * Study Zone - Saved Content & Academic Resource Vault API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import type { SavedResourceRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const savedContentRouter = Router();

// GET /api/saved-content
savedContentRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const resources = db.savedResources.filter((r) => r.userId === userId);
  res.json({ resources, total: resources.length });
});

// POST /api/saved-content
savedContentRouter.post('/', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { title, type, subject, description, fileSizeOrFormat, url, previewContent, tags } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'ValidationError', message: 'Resource title is required.' });
  }

  const newResource: SavedResourceRecord = {
    id: `res_${Date.now()}`,
    userId,
    title: title.trim(),
    type: type || 'study_material',
    subject: subject || 'General STEM',
    description: description || '',
    fileSizeOrFormat: fileSizeOrFormat || 'Reference',
    url: url || undefined,
    previewContent: previewContent || undefined,
    tags: Array.isArray(tags) ? tags : [],
    isBookmarked: true,
    dateAdded: new Date().toISOString().split('T')[0],
  };

  db.savedResources.unshift(newResource);
  res.status(201).json({ success: true, resource: newResource });
});

// PUT /api/saved-content/:id/bookmark
savedContentRouter.put('/:id/bookmark', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const resource = db.savedResources.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'NotFound', message: `Resource "${req.params.id}" not found.` });
  }

  resource.isBookmarked = !resource.isBookmarked;
  res.json({ success: true, isBookmarked: resource.isBookmarked });
});

// DELETE /api/saved-content/:id
savedContentRouter.delete('/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const initialCount = db.savedResources.length;
  db.savedResources = db.savedResources.filter((r) => r.id !== req.params.id);

  if (db.savedResources.length === initialCount) {
    return res.status(404).json({ error: 'NotFound', message: 'Resource not found.' });
  }

  res.json({ success: true, message: 'Resource removed from vault.' });
});
