// NeuroAI Shared Types

// ─── USER TYPES ─────────────────────────────────────────────────────────────

export type UserPlan = 'FREE' | 'STUDENT' | 'PRO';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  college?: string;
  branch?: string;
  year?: number;
  avatar?: string;
  emailVerified: boolean;
  plan: UserPlan;
  dailySearches: number;
  dailyAIQueries: number;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

// ─── PAPER TYPES ────────────────────────────────────────────────────────────

export type SummaryType = 'BRIEF' | 'DETAILED' | 'ELI5' | 'TECHNICAL' | 'LITERATURE_REVIEW';

export interface paper {
  id: string;
  semanticId: string;
  title: string;
  abstract: string;
  authors: Array<{ name: string; id?: string }>;
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  citationCount: number;
  referenceCount: number;
  fieldsOfStudy: string[];
  tldr?: string;
  fetchedAt: Date;
}

export interface PaperSearch {
  query: string;
  limit: number;
  offset: number;
  year?: number;
  field?: string;
  sort?: 'relevance' | 'citations' | 'recency';
}

export interface SearchResults {
  papers: paper[];
  total: number;
  hasMore: boolean;
  query: string;
}

// ─── AI TYPES ───────────────────────────────────────────────────────────────

export interface SummarizeRequest {
  paperId: string;
  summaryType: SummaryType;
  userId?: string;
}

export interface SummaryResponse {
  summary: string;
  type: SummaryType;
  ModelUsed: string;
  tokensUsed: number;
  cached: boolean;
  generatedAt: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ paperId: string; title: string; relevance: number }>;
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
  paperId?: string;
  history?: ChatMessage[];
}

// ─── REQUEST/RESPONSE TYPES ─────────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  college?: string;
  branch?: string;
  year?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ─── STATS & USAGE ──────────────────────────────────────────────────────────

export interface UserStats {
  userId: string;
  searchesUsedToday: number;
  aiQueriesUsedToday: number;
  totalSavedPapers: number;
  totalCollections: number;
  lastActiveAt?: Date;
}

export interface UsageMetrics {
  date: Date;
  searches: number;
  aiQueries: number;
  papersViewed: number;
  summariesGenerated: number;
}

// ─── API RESPONSE WRAPPER ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    userMessage: string;
    action?: string;
    retryAfter?: number;
  };
  timestamp: Date;
}

export default {
  // Exported for use elsewhere
} as const;
