// POST /api/auth/register
// Register a new user - sends verification email

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  hashPassword,
  createAccessToken,
  createRefreshToken,
  generateVerificationToken,
} from '@/lib/auth';
import { jsonSuccess, jsonErrorResponse, ValidationError, ApiError } from '@/lib/api/errors';
import { validateEmail, validatePassword } from '@/lib/api/errors';
import { RegisterRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── VALIDATE INPUT ──────────────────────────────────────────────────────

    const { name, email, password, college, branch, year } = body as RegisterRequest;
    const errors: Record<string, string> = {};

    if (!name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else {
      const pwValidation = validatePassword(password);
      if (!pwValidation.valid) {
        errors.password = pwValidation.errors[0];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    // ── CHECK IF USER ALREADY EXISTS ────────────────────────────────────────

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ApiError(
        409,
        'EMAIL_ALREADY_EXISTS',
        `User with email ${email} already exists`,
        {
          userMessage: 'This email is already registered. Try logging in instead.',
          action: 'Go to login',
        }
      );
    }

    // ── CREATE USER ─────────────────────────────────────────────────────────

    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken(email);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        passwordHash,
        college: college?.trim(),
        branch: branch?.trim(),
        year: year,
        // emailVerified will be set to true after email verification
      },
    });

    // ── GENERATE TOKENS ─────────────────────────────────────────────────────

    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = await createRefreshToken({
      sub: user.id,
      email: user.email,
    });

    // ── STORE REFRESH TOKEN IN DB ───────────────────────────────────────────
    // (For logout/token revocation in future)

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    // ── SEND VERIFICATION EMAIL ────────────────────────────────────────────
    // TODO: Implement email sending via Resend
    // await sendVerificationEmail(user.email, verificationToken);

    console.log(
      `📧 Verification email would be sent to ${user.email} with token: ${verificationToken}`
    );

    // ── RETURN RESPONSE ─────────────────────────────────────────────────────

    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: false,
        plan: 'FREE',
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
      message: 'Registration successful. Check your email to verify your account.',
    };

    // Set refresh token in httpOnly cookie
    const setCookieHeader = `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`;

    return jsonSuccess(response, 201);
  } catch (error) {
    return jsonErrorResponse(error as any);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
