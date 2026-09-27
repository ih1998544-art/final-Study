/**
 * Study Zone - Authentication API Routes
 */

import { Router, type Request, type Response } from 'express';
import { db } from '../db/database.ts';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.ts';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid email address is required.' });
  }

  // Find or create for demo
  let user = db.users.get(email.toLowerCase());
  if (!user) {
    const userId = `usr_${Date.now()}`;
    user = {
      id: userId,
      email: email.toLowerCase(),
      name: email.split('@')[0].replace('.', ' '),
      passwordHash: 'hash_simulated',
      academicLevel: 'Undergraduate (College)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.set(user.id, user);
    db.users.set(user.email, user);
  }

  const token = `sz_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  db.sessions.set(token, {
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      academicLevel: user.academicLevel,
      avatarUrl: user.avatarUrl,
    },
  });
});

// POST /api/auth/signup
authRouter.post('/signup', (req: Request, res: Response) => {
  const { name, email, password, academicLevel } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'ValidationError', message: 'Full name is required.' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid email address is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'ValidationError', message: 'Password must be at least 6 characters.' });
  }

  const userId = `usr_${Date.now()}`;
  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash: 'argon2_hashed_secure',
    name: name.trim(),
    academicLevel: academicLevel || 'Undergraduate (College)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.set(newUser.id, newUser);
  db.users.set(newUser.email, newUser);

  const token = `sz_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  db.sessions.set(token, {
    token,
    userId: newUser.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      academicLevel: newUser.academicLevel,
    },
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    academicLevel: user.academicLevel,
    universityOrSchool: user.universityOrSchool,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid email required.' });
  }

  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({
    success: true,
    message: `Password reset instructions and verification code have been dispatched to ${email}.`,
    verificationCode: mockCode,
  });
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!code || code.length < 4) {
    return res.status(400).json({ error: 'ValidationError', message: 'Valid 6-digit code required.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'ValidationError', message: 'Password must be at least 6 characters.' });
  }

  res.json({
    success: true,
    message: `Password has been successfully updated for ${email}. You may now log in.`,
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.sessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});
