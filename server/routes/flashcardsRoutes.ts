/**
 * Study Zone - Flashcard Decks & Spaced Repetition API Routes
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import type { FlashcardDeckRecord, FlashcardItemRecord } from '../db/schema.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const flashcardsRouter = Router();

// GET /api/flashcards/decks
flashcardsRouter.get('/decks', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const decks = db.flashcardDecks.filter((d) => d.userId === userId);
  res.json({ decks, total: decks.length });
});

// GET /api/flashcards/decks/:id
flashcardsRouter.get('/decks/:id', (req: AuthenticatedRequest, res: Response) => {
  const deck = db.flashcardDecks.find((d) => d.id === req.params.id);
  if (!deck) {
    return res.status(404).json({ error: 'NotFound', message: `Deck "${req.params.id}" not found.` });
  }
  res.json({ deck });
});

// POST /api/flashcards/decks
flashcardsRouter.post('/decks', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { title, subject, description, badgeColor, cards } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'ValidationError', message: 'Deck title is required.' });
  }

  const deckId = `deck_${Date.now()}`;
  const mappedCards: FlashcardItemRecord[] = Array.isArray(cards)
    ? cards.map((c: any, idx: number) => ({
        id: c.id || `card_${deckId}_${idx}`,
        deckId,
        front: c.front || '',
        back: c.back || '',
        hint: c.hint,
        status: c.status || 'unseen',
        reviewCount: c.reviewCount || 0,
      }))
    : [];

  const newDeck: FlashcardDeckRecord = {
    id: deckId,
    userId,
    title: title.trim(),
    subject: subject || 'General STEM',
    description: description || '',
    badgeColor: badgeColor || 'emerald',
    cards: mappedCards,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  db.flashcardDecks.unshift(newDeck);
  res.status(201).json({ success: true, deck: newDeck });
});

// PUT /api/flashcards/decks/:id
flashcardsRouter.put('/decks/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const deckIndex = db.flashcardDecks.findIndex((d) => d.id === req.params.id);
  if (deckIndex === -1) {
    return res.status(404).json({ error: 'NotFound', message: `Deck "${req.params.id}" not found.` });
  }

  const current = db.flashcardDecks[deckIndex];
  const { title, subject, description, cards } = req.body;

  if (title) current.title = title.trim();
  if (subject) current.subject = subject;
  if (description !== undefined) current.description = description;
  if (Array.isArray(cards)) current.cards = cards;
  current.updatedAt = new Date().toISOString().split('T')[0];

  res.json({ success: true, deck: current });
});

// PUT /api/flashcards/decks/:deckId/cards/:cardId/status
flashcardsRouter.put('/decks/:deckId/cards/:cardId/status', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const deck = db.flashcardDecks.find((d) => d.id === req.params.deckId);
  if (!deck) {
    return res.status(404).json({ error: 'NotFound', message: `Deck not found.` });
  }

  const card = deck.cards.find((c) => c.id === req.params.cardId);
  if (!card) {
    return res.status(404).json({ error: 'NotFound', message: `Card not found in deck.` });
  }

  const { status } = req.body;
  if (status) card.status = status;
  card.reviewCount += 1;
  card.lastReviewed = new Date().toISOString().split('T')[0];

  res.json({ success: true, card });
});

// DELETE /api/flashcards/decks/:id
flashcardsRouter.delete('/decks/:id', optionalAuth, (_req: AuthenticatedRequest, res: Response) => {
  const initialLength = db.flashcardDecks.length;
  db.flashcardDecks = db.flashcardDecks.filter((d) => d.id !== _req.params.id);

  if (db.flashcardDecks.length === initialLength) {
    return res.status(404).json({ error: 'NotFound', message: 'Deck not found.' });
  }

  res.json({ success: true, message: 'Deck deleted successfully.' });
});
