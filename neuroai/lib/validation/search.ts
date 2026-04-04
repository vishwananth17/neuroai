import { z } from 'zod';

/** POST /api/search body */
export const searchPostBodySchema = z
  .object({
    query: z.string().min(2, 'Query must be at least 2 characters').max(500),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    max_results: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).max(9_999).optional(),
  })
  .transform((b) => ({
    query: b.query.trim(),
    limit: b.max_results ?? b.limit ?? 10,
    offset: b.offset ?? 0,
  }));

/** GET /api/search query params */
export const searchGetQuerySchema = z
  .object({
    q: z.string().min(2).max(500),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).max(9_999).optional(),
  })
  .transform((q) => ({
    query: q.q.trim(),
    limit: q.limit ?? 10,
    offset: q.offset ?? 0,
  }));
