// NeuroAI Authentication Utilities
// JWT handling, password hashing, session management

import { jwtVerify, SignJWT } from 'jose';
import { AUTH_CONFIG } from '@/lib/config';
import crypto from 'crypto';

// Convert string secrets to Uint8Array for jose
const accessSecret = new TextEncoder().encode(AUTH_CONFIG.jwtSecret);
const refreshSecret = new TextEncoder().encode(AUTH_CONFIG.jwtRefreshSecret);

// ─── PASSWORD HASHING ───────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  // For production, use bcrypt: const bcrypt = require('bcrypt')
  // For now, use a simple approach with crypto
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}.${hash}`;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, hash] = hashedPassword.split('.');
  const newHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return newHash === hash;
}

// ─── JWT TOKEN CREATION ─────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  iat?: number;
  exp?: number;
}

export async function createAccessToken(payload: JWTPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expirySeconds = 60 * 15; // 15 minutes

  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + expirySeconds)
    .sign(accessSecret);

  return token;
}

export async function createRefreshToken(payload: JWTPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expirySeconds = 60 * 60 * 24 * 7; // 7 days

  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + expirySeconds)
    .sign(refreshSecret);

  return token;
}

// ─── JWT TOKEN VERIFICATION ─────────────────────────────────────────────────

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, accessSecret);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, refreshSecret);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── REQUEST AUTHENTICATION ─────────────────────────────────────────────────

export function getAuthHeaderToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export async function authenticateRequest(
  authHeader?: string
): Promise<{ userId: string; email: string } | null> {
  const token = getAuthHeaderToken(authHeader);
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  return {
    userId: payload.sub,
    email: payload.email,
  };
}

// ─── SESSION MANAGEMENT ─────────────────────────────────────────────────────

export function generateVerificationToken(email: string): string {
  return crypto
    .createHash('sha256')
    .update(`${email}-${Date.now()}-${Math.random()}`)
    .digest('hex');
}

export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ─── COOKIE HELPERS (for httpOnly refresh tokens) ──────────────────────────

export function setRefreshTokenCookie(refreshToken: string): string {
  const expiryDate = new Date(
    Date.now() + AUTH_CONFIG.refreshTokenExpiryMs
  ).toUTCString();

  return `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expiryDate}`;
}

export function clearRefreshTokenCookie(): string {
  return 'refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC';
}

// ─── TOKEN RENEWAL ──────────────────────────────────────────────────────────

export async function renewAccessToken(
  refreshToken: string
): Promise<{ accessToken: string } | null> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) return null;

  const newAccessToken = await createAccessToken({
    sub: payload.sub,
    email: payload.email,
  });

  return { accessToken: newAccessToken };
}

export default {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateRequest,
  generateVerificationToken,
  generatePasswordResetToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  renewAccessToken,
};
