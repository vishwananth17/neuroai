// POST /api/auth/login
// Authenticate user and return tokens

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword, createAccessToken, createRefreshToken } from '@/lib/auth';
import { jsonSuccess, jsonErrorResponse, ValidationError, AuthError, ApiError } from '@/lib/api/errors';
import { validateEmail } from '@/lib/api/errors';
import { LoginRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as LoginRequest;

    // ── VALIDATE INPUT ──────────────────────────────────────────────────────

    if (!email || !validateEmail(email)) {
      throw new ValidationError('Valid email is required');
    }

    if (!password) {
      throw new ValidationError('Password is required');
    }

    // ── FIND USER ───────────────────────────────────────────────────────────

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't leak that user doesn't exist
      throw new AuthError('Invalid email or password', {
        userMessage: 'Invalid email or password',
      });
    }

    // ── VERIFY PASSWORD ─────────────────────────────────────────────────────

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      throw new AuthError('Invalid password', {
        userMessage: 'Invalid email or password',
      });
    }

    // ── GENERATE TOKENS ─────────────────────────────────────────────────────

    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = await createRefreshToken({
      sub: user.id,
      email: user.email,
    });

    // ── SAVE SESSION ────────────────────────────────────────────────────────

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    // ── UPDATE LAST ACTIVE ──────────────────────────────────────────────────

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // ── RETURN RESPONSE ─────────────────────────────────────────────────────

    return jsonSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          college: user.college,
          branch: user.branch,
          year: user.year,
          emailVerified: user.emailVerified,
          plan: user.plan,
          avatar: user.avatar,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '15m',
        },
      },
      200
    );
  } catch (error) {
    return jsonErrorResponse(error as any);
  }
}
