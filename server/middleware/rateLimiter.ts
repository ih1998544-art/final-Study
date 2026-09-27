/**
 * Study Zone - Rate Limiting Architecture Middleware
 * Protects backend AI inference and general API routes from abuse.
 */

import type { Request, Response, NextFunction } from 'express';

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const clientTrackers = new Map<string, RateLimitTracker>();

export function createRateLimiter(options: {
  windowMs: number; // e.g. 60,000 ms (1 minute)
  maxRequests: number; // e.g. 30 requests per minute
  routeLabel: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const key = `${options.routeLabel}_${ip}`;
    const now = Date.now();

    let tracker = clientTrackers.get(key);

    if (!tracker || now > tracker.resetTime) {
      tracker = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      clientTrackers.set(key, tracker);
      return next();
    }

    if (tracker.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((tracker.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: 'TooManyRequests',
        message: `Rate limit exceeded for ${options.routeLabel}. Maximum ${options.maxRequests} requests allowed per ${options.windowMs / 1000}s. Please retry in ${retryAfterSeconds} seconds.`,
        retryAfterSeconds,
      });
    }

    tracker.count += 1;
    next();
  };
}

// Pre-configured rate limiters
export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  routeLabel: 'general_api',
});

export const aiInferenceLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30, // 30 AI queries / min per client
  routeLabel: 'ai_inference',
});
