import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'cf_session';

export interface JwtPayload {
  sub: string;
  role: 'admin' | 'client';
}

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: 'admin' | 'client';
}

function secret(): string {
  return process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
}

export function signToken(userId: string, role: 'admin' | 'client'): string {
  return jwt.sign({ sub: userId, role }, secret(), { expiresIn: '7d' });
}

export function setSessionCookie(req: Request, res: Response, token: string) {
  const secure = req.secure || req.get('x-forwarded-proto') === 'https';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export function readToken(req: Request): JwtPayload | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret()) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (!payload) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  req.userId = payload.sub;
  req.userRole = payload.role;
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (!payload) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  if (payload.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  req.userId = payload.sub;
  req.userRole = payload.role;
  next();
}
