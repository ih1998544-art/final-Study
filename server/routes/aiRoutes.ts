/**
 * Study Zone - AI Workspace, Conversations & GenAI Routes
 * 
 * ARCHITECTURE:
 * Frontend Client -> Express Route (/api/ai/chat) -> aiService -> GoogleGenAI (gemini-3.8-flash)
 * Keys are kept strictly on the backend.
 */

import { Router, type Response } from 'express';
import { db } from '../db/database.ts';
import { aiService, type GenerateAIRequest } from '../services/aiService.ts';
import { aiInferenceLimiter } from '../middleware/rateLimiter.ts';
import { optionalAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const aiRouter = Router();

// POST /api/ai/chat
// Rate limited to 30 requests/min per IP
aiRouter.post('/chat', aiInferenceLimiter, optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, role, mode, subjectName, academicLevel, difficulty, conversationHistory } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Prompt text is required for AI generation.',
      });
    }

    const aiRequest: GenerateAIRequest = {
      prompt: prompt.trim(),
      role: role || 'tutor',
      mode: mode || 'explain',
      subjectName: subjectName || 'Academic Studies',
      academicLevel: academicLevel || 'Undergraduate (College)',
      difficulty: difficulty || 'intermediate',
      conversationHistory,
    };

    const aiResponse = await aiService.generateResponse(aiRequest);

    // Save message to conversation history in memory store
    const userId = req.user?.id || 'usr_849201';
    let conversation = Array.from(db.conversations.values()).find((c) => c.userId === userId && c.subject === subjectName);
    if (!conversation) {
      const convId = `conv_${Date.now()}`;
      conversation = {
        id: convId,
        userId,
        title: `${subjectName}: ${prompt.slice(0, 30)}...`,
        subject: subjectName,
        pedagogyStyle: 'Socratic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      db.conversations.set(convId, conversation);
    }

    conversation.messages.push({
      id: `msg_${Date.now()}_u`,
      conversationId: conversation.id,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    conversation.messages.push({
      id: `msg_${Date.now()}_a`,
      conversationId: conversation.id,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formulaBlocks: aiResponse.formula ? [aiResponse.formula] : undefined,
      actionPromptSuggestions: aiResponse.suggestedFollowups,
    });

    conversation.updatedAt = new Date().toISOString();

    res.json(aiResponse);
  } catch (error: any) {
    console.error('[AI Route Error]', error);
    res.status(500).json({
      error: 'AIServiceError',
      message: 'An error occurred while synthesizing AI response. Please try again.',
      details: error.message,
    });
  }
});

// POST /api/ai/tool
// Specialized generation for any of the 15 study tools
aiRouter.post('/tool', aiInferenceLimiter, optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { toolId, prompt, options, subjectName } = req.body;
    if (!toolId || !prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'toolId and prompt are required.',
      });
    }

    const result = await aiService.generateToolResult({
      toolId,
      prompt: prompt.trim(),
      options: options || {},
      subjectName,
    });

    res.json(result);
  } catch (error: any) {
    console.error('[AI Tool Route Error]', error);
    res.status(500).json({
      error: 'ToolServiceError',
      message: 'Failed to generate study tool output.',
      details: error.message,
    });
  }
});

// GET /api/ai/conversations
aiRouter.get('/conversations', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const conversations = Array.from(db.conversations.values()).filter((c) => c.userId === userId);
  res.json({ conversations, total: conversations.length });
});

// POST /api/ai/conversations
aiRouter.post('/conversations', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_849201';
  const { title, subject, pedagogyStyle, initialMessage } = req.body;

  const convId = `conv_${Date.now()}`;
  const conversation = {
    id: convId,
    userId,
    title: title || `${subject || 'Academic'} Session`,
    subject: subject || 'General Studies',
    pedagogyStyle: pedagogyStyle || 'Socratic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: initialMessage ? [initialMessage] : [],
  };

  db.conversations.set(convId, conversation);
  res.status(201).json({ success: true, conversation });
});

// POST /api/ai/cornell-notes
aiRouter.post('/cornell-notes', aiInferenceLimiter, optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, subject } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'ValidationError', message: 'Source text required for Cornell synthesis.' });
    }

    const result = await aiService.generateResponse({
      prompt: text.trim(),
      role: 'teacher',
      mode: 'notes',
      subjectName: subject || 'Academic Studies',
      academicLevel: 'Undergraduate (College)',
      difficulty: 'intermediate',
    });

    res.json({ success: true, notes: result.cornellNotes, content: result.content });
  } catch (error: any) {
    res.status(500).json({ error: 'SynthesisError', message: error.message });
  }
});
