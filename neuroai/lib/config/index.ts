// NeuroAI Configuration
// Central configuration for all services and providers

// Validate required environment variables at startup
function validateEnv(
  key: string,
  defaultValue?: string
): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
  return value || '';
}

// ─── DATABASE ───────────────────────────────────────────────────────────────
export const DATABASE_CONFIG = {
  url: validateEnv('DATABASE_URL'),
  // Connection pool settings for Supabase
  pool: {
    min: 2,
    max: 10,
  },
} as const;

// ─── REDIS / CACHE ──────────────────────────────────────────────────────────
export const REDIS_CONFIG = {
  url: validateEnv('UPSTASH_REDIS_URL'),
  token: validateEnv('UPSTASH_REDIS_TOKEN'),
  // Cache TTLs in seconds
  ttl: {
    paperSearch: parseInt(process.env.CACHE_TTL_PAPER_SEARCH || '3600'), // 1 hour
    paperMetadata: parseInt(process.env.CACHE_TTL_PAPER_METADATA || '86400'), // 24 hours
    aiSummary: 86400 * 365, // 1 year (summaries don't change)
    trending: parseInt(process.env.CACHE_TTL_TRENDING || '3600'),
    userSession: parseInt(process.env.CACHE_TTL_USER_SESSION || '900'), // 15 min
  },
} as const;

// ─── AUTHENTICATION ─────────────────────────────────────────────────────────
export const AUTH_CONFIG = {
  jwtSecret: validateEnv(
    'JWT_SECRET',
    'dev-secret-change-in-production-min-32-chars'
  ),
  jwtRefreshSecret: validateEnv(
    'JWT_REFRESH_SECRET',
    'dev-refresh-secret-change-in-production-min-32'
  ),
  accessTokenExpiry: `${parseInt(process.env.JWT_EXPIRY_MINUTES || '15')}m`,
  refreshTokenExpiry: `${parseInt(process.env.JWT_REFRESH_EXPIRY_DAYS || '7')}d`,
  // Convert to milliseconds for internal use
  accessTokenExpiryMs: 1000 * 60 * parseInt(process.env.JWT_EXPIRY_MINUTES || '15'),
  refreshTokenExpiryMs: 1000 * 60 * 60 * 24 * parseInt(process.env.JWT_REFRESH_EXPIRY_DAYS || '7'),
} as const;

// ─── EMAIL CONFIGURATION ────────────────────────────────────────────────────
export const EMAIL_CONFIG = {
  apiKey: validateEnv('RESEND_API_KEY'),
  fromEmail: validateEnv('RESEND_FROM_EMAIL', 'noreply@neuroai.tech'),
  supportEmail: validateEnv('RESEND_SUPPORT_EMAIL', 'support@neuroai.tech'),
} as const;

// ─── AI PROVIDER CONFIGURATION ──────────────────────────────────────────────
export const AI_CONFIG = {
  // Primary provider: DeepSeek
  deepseek: {
    apiKey: validateEnv('DEEPSEEK_API_KEY'),
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
  
  // Fallback 1: Groq (LLaMA 3.1 70B)
  groq: {
    apiKey: validateEnv('GROQ_API_KEY'),
    baseUrl: 'https://api.groq.com/openai/v1',
    model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
  },
  
  // Fallback 2: OpenRouter
  openrouter: {
    apiKey: validateEnv('OPENROUTER_API_KEY'),
    baseUrl: 'https://openrouter.ai/api/v1',
    models: (process.env.OPENROUTER_MODELS || 'meta-llama/llama-3.1-70b-instruct:free').split(','),
  },

  // Global AI settings
  temperature: parseFloat(process.env.AI_MODEL_TEMPERATURE || '0.3'),
  maxTokens: parseInt(process.env.AI_MODEL_MAX_TOKENS || '2000'),
  summaryMaxTokens: parseInt(process.env.AI_SUMMARY_MAX_TOKENS || '3000'),
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '15000'), // 15 seconds
} as const;

// ─── SEMANTIC SCHOLAR API ───────────────────────────────────────────────────
export const SEMANTIC_SCHOLAR_CONFIG = {
  baseUrl: process.env.SEMANTIC_SCHOLAR_BASE_URL || 'https://api.semanticscholar.org/graph/v1',
  timeout: 10000, // 10 seconds
  cache: {
    enabled: true,
    ttl: 86400 * 7, // 7 days
  },
} as const;

// ─── CLOUDINARY CONFIGURATION ───────────────────────────────────────────────
export const CLOUDINARY_CONFIG = {
  cloudName: validateEnv('CLOUDINARY_CLOUD_NAME'),
  apiKey: validateEnv('CLOUDINARY_API_KEY'),
  apiSecret: validateEnv('CLOUDINARY_API_SECRET'),
  uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'neuroai/pdfs',
  maxFileSize: 50 * 1024 * 1024, // 50 MB
} as const;

// ─── SENTRY CONFIGURATION ───────────────────────────────────────────────────
export const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  authToken: validateEnv('SENTRY_AUTH_TOKEN', ''),
  projectId: validateEnv('SENTRY_PROJECT_ID', ''),
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
} as const;

// ─── POSTHOG ANALYTICS ──────────────────────────────────────────────────────
export const POSTHOG_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
  enabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
} as const;

// ─── RATE LIMITING ──────────────────────────────────────────────────────────
export const RATE_LIMIT_CONFIG = {
  enabled: process.env.ENABLE_RATE_LIMITING !== 'false',
  perDay: {
    searches: parseInt(process.env.RATE_LIMIT_SEARCHES || '20'),
    aiQueries: parseInt(process.env.RATE_LIMIT_AI_QUERIES || '10'),
    apiCalls: parseInt(process.env.RATE_LIMIT_API_CALLS || '100'),
  },
  perMinute: {
    api: 30, // Global API rate limit
    auth: 5, // Authentication attempts
    search: 10, // Search requests
  },
} as const;

// ─── APPLICATION CONFIG ─────────────────────────────────────────────────────
export const APP_CONFIG = {
  name: 'NeuroAI',
  tagline: 'Research Smarter. Think Deeper.',
  environment: (process.env.NODE_ENV || 'development') as 'development' | 'production',
  apiUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    debug: process.env.DEBUG === 'true',
  },
  features: {
    rateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
    pdfUpload: process.env.ENABLE_PDF_UPLOAD !== 'false',
    chatExport: process.env.ENABLE_CHAT_EXPORT !== 'false',
    literatureReview: process.env.ENABLE_LITERATURE_REVIEW === 'true',
  },
} as const;

// ─── API ENDPOINT CONSTANTS ─────────────────────────────────────────────────
export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    verifyEmail: '/api/auth/verify-email',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    me: '/api/auth/me',
  },
  papers: {
    search: '/api/papers/search',
    detail: '/api/papers/:id',
    related: '/api/papers/:id/related',
    citations: '/api/papers/:id/citations',
    references: '/api/papers/:id/references',
    fromUrl: '/api/papers/from-url',
    uploadPdf: '/api/papers/upload-pdf',
  },
  ai: {
    summarize: '/api/ai/summarize',
    chat: '/api/ai/chat',
    explainCode: '/api/ai/explain-code',
    generateCitation: '/api/ai/generate-citation',
    literatureReview: '/api/ai/literature-review',
    jobStatus: '/api/ai/job/:jobId',
  },
  users: {
    profile: '/api/users/profile',
    savedPapers: '/api/users/saved-papers',
    collections: '/api/users/collections',
    searchHistory: '/api/users/search-history',
    usageStats: '/api/users/usage-stats',
  },
  analytics: {
    overview: '/api/analytics/overview',
    users: '/api/analytics/users',
    searches: '/api/analytics/searches',
    aiUsage: '/api/analytics/ai-usage',
  },
} as const;

// ─── VALIDATION RULES ───────────────────────────────────────────────────────
export const VALIDATION = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: false,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  search: {
    minChars: 2,
    maxChars: 500,
  },
} as const;

export default {
  DATABASE_CONFIG,
  REDIS_CONFIG,
  AUTH_CONFIG,
  EMAIL_CONFIG,
  AI_CONFIG,
  SEMANTIC_SCHOLAR_CONFIG,
  CLOUDINARY_CONFIG,
  SENTRY_CONFIG,
  POSTHOG_CONFIG,
  RATE_LIMIT_CONFIG,
  APP_CONFIG,
  API_ENDPOINTS,
  VALIDATION,
} as const;
