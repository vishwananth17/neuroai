// NeuroAI Error Handling System - Production Grade
// Converts all errors to user-friendly API responses

import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/lib/config';

// ─── ERROR CODES ────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'EMAIL_NOT_VERIFIED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'AI_UNAVAILABLE'
  | 'PAPER_NOT_FOUND'
  | 'PDF_PARSE_FAILED'
  | 'QUOTA_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'AUTH_FAILED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'UNAUTHORIZED'
  | 'METHOD_NOT_ALLOWED'
  | 'SEMANTIC_SCHOLAR_UNAVAILABLE'
  | 'PDF_PARSE_FAILED';

export type ApiErrorPayload = {
  code: ApiErrorCode;
  message: string;
  userMessage?: string; // Friendly message for frontend display
  action?: string;
  retryAfter?: number;
  fields?: Record<string, string>; // Validation errors
};

// ─── ERROR CLASSES ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload;

  constructor(status: number, code: ApiErrorCode, message: string, options?: {
    userMessage?: string;
    action?: string;
    retryAfter?: number;
    fields?: Record<string, string>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = {
      code,
      message,
      userMessage: options?.userMessage || message,
      action: options?.action,
      retryAfter: options?.retryAfter,
      fields: options?.fields,
    };
  }
}

export class AuthError extends ApiError {
  constructor(message: string = 'Authentication failed', options?: {
    action?: string;
    userMessage?: string;
  }) {
    super(401, 'AUTH_FAILED', message, {
      userMessage: options?.userMessage || 'Please sign in to continue.',
      action: options?.action,
    });
  }
}

export class RateLimitError extends ApiError {
  constructor(quotaType: 'searches' | 'ai_queries' | 'api_calls' = 'api_calls', retryAfter: number = 3600) {
    super(429, 'RATE_LIMIT_EXCEEDED', `Rate limit exceeded for ${quotaType}`, {
      userMessage: `You've reached your daily limit. Try again tomorrow.`,
      action: 'Upgrade to Student plan for more',
      retryAfter,
    });
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, fields?: Record<string, string>) {
    super(400, 'VALIDATION_ERROR', message, {
      userMessage: message,
      fields,
    });
  }
}

export class AIUnavailableError extends ApiError {
  constructor(message: string = 'AI service temporarily unavailable') {
    super(503, 'AI_UNAVAILABLE', message, {
      userMessage: 'Our AI is thinking. Please try again in a moment.',
      action: 'Retry',
      retryAfter: 30,
    });
  }
}

export class TokenExpiredError extends ApiError {
  constructor() {
    super(401, 'TOKEN_EXPIRED', 'JWT token expired', {
      userMessage: 'Your session has expired. Please sign in again.',
      action: 'Refresh token',
    });
  }
}

// ─── RESPONSE BUILDERS ──────────────────────────────────────────────────────

export function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
  options?: {
    userMessage?: string;
    action?: string;
    retryAfter?: number;
    fields?: Record<string, string>;
  }
) {
  const error = new ApiError(status, code, message, options);
  return jsonErrorResponse(error);
}

export function jsonErrorResponse(error: ApiError | Error) {
  if (error instanceof ApiError) {
    const payload: ApiErrorPayload = {
      code: error.payload.code,
      message: error.payload.userMessage || error.payload.message,
      action: error.payload.action,
      retryAfter: error.payload.retryAfter,
      fields: error.payload.fields,
    };

    // Remove undefined fields
    Object.keys(payload).forEach((key) =>
      payload[key as keyof ApiErrorPayload] === undefined && delete payload[key as keyof ApiErrorPayload]
    );

    logError(error);

    return NextResponse.json(
      {
        error: payload,
        timestamp: new Date().toISOString(),
      },
      { status: error.status }
    );
  }

  // Unknown error - don't expose internals
  logError(error);
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR' as ApiErrorCode,
        message: 'Something went wrong. Our team has been notified.',
      },
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

export function jsonSuccess<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

// ─── ERROR LOGGING ──────────────────────────────────────────────────────────

function logError(error: ApiError | Error, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const isApiError = error instanceof ApiError;

  const logEntry = {
    timestamp,
    error: {
      name: error.name,
      message: error.message,
      code: isApiError ? error.payload.code : 'UNKNOWN',
      status: isApiError ? error.status : 500,
    },
    context,
    ...(APP_CONFIG.logging.debug && error.stack ? { stack: error.stack } : {}),
  };

  if (isApiError && error.status >= 500) {
    console.error('[ERROR]', JSON.stringify(logEntry));
    // TODO: Send to Sentry in production
  } else if (APP_CONFIG.logging.debug) {
    console.log('[LOG]', JSON.stringify(logEntry));
  }
}

// ─── VALIDATION HELPERS ─────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain an uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain a number');
  }

  return { valid: errors.length === 0, errors };
}

export function jsonErrorFromCaught(err: unknown) {
  if (err instanceof ApiError) {
    return jsonError(err.status, err.payload.code, err.payload.message, {
      action: err.payload.action,
      retryAfter: err.payload.retryAfter,
    });
  }
  console.error('Unhandled API error:', err);
  return jsonError(
    500,
    'INTERNAL_ERROR',
    'Something went wrong on our side. Please try again in a moment.',
    { action: 'Retry the request or contact support if this persists.' }
  );
}
