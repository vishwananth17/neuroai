import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { jsonError, jsonErrorFromCaught } from '@/lib/api/errors';
import { searchSemanticScholarPapers } from '@/lib/paper-graph';
import { searchGetQuerySchema, searchPostBodySchema } from '@/lib/validation/search';

function toLegacyPaper(p: {
  semanticId: string;
  id: string;
  title: string;
  abstract: string;
  authorNames: string[];
  year: number;
  citations: number;
  url: string;
  venue: string | null;
  fieldsOfStudy: string[];
  tldr: string | null;
}) {
  return {
    id: p.semanticId || p.id,
    title: p.title,
    abstract: p.abstract,
    authors: p.authorNames,
    year: p.year,
    citations: p.citations,
    url: p.url,
    venue: p.venue,
    fieldsOfStudy: p.fieldsOfStudy,
    tldr: p.tldr,
  };
}

function withTiming(start: number, init?: ResponseInit) {
  const ms = Date.now() - start;
  const headers = new Headers(init?.headers);
  headers.set('X-Response-Time-Ms', String(ms));
  return { ...init, headers };
}

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await request.json();
    const parsed = searchPostBodySchema.parse(body);

    const { papers, total, rawOffset, limit } = await searchSemanticScholarPapers({
      query: parsed.query,
      limit: parsed.limit,
      offset: parsed.offset,
    });

    const legacy = papers.map(toLegacyPaper);
    const hasMore = rawOffset + legacy.length < total;

    return NextResponse.json(
      {
        success: true,
        data: {
          papers: legacy,
          total_results: total,
          total,
          hasMore,
          offset: rawOffset,
          limit,
          query: parsed.query,
          search_time_ms: Date.now() - t0,
        },
        timestamp: new Date().toISOString(),
      },
      withTiming(t0, { status: 200 })
    );
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues.map((e) => e.message).join(' ');
      return jsonError(400, 'VALIDATION_ERROR', msg, {
        action: 'Check your query length (2–500 characters) and try again.',
      });
    }
    const status = typeof (err as { status?: number }).status === 'number'
      ? (err as { status: number }).status
      : 500;
    if (status === 429 || status >= 500) {
      return jsonError(503, 'INTERNAL_ERROR', 'Paper search is temporarily unavailable.', {
        action: 'Try again in a few minutes, or use a shorter query.',
      });
    }
    return jsonErrorFromCaught(err);
  }
}

export async function GET(request: NextRequest) {
  const t0 = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = searchGetQuerySchema.parse(raw);

    const { papers, total, rawOffset, limit } = await searchSemanticScholarPapers({
      query: parsed.query,
      limit: parsed.limit,
      offset: parsed.offset,
    });

    const legacy = papers.map(toLegacyPaper);
    const hasMore = rawOffset + legacy.length < total;

    return NextResponse.json(
      {
        success: true,
        data: {
          papers: legacy,
          total_results: total,
          total,
          hasMore,
          offset: rawOffset,
          limit,
          query: parsed.query,
          search_time_ms: Date.now() - t0,
        },
        timestamp: new Date().toISOString(),
      },
      withTiming(t0, { status: 200 })
    );
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues.map((e) => e.message).join(' ');
      return jsonError(400, 'VALIDATION_ERROR', msg, {
        action: 'Add query parameter q with at least 2 characters.',
      });
    }
    const status = typeof (err as { status?: number }).status === 'number'
      ? (err as { status: number }).status
      : 500;
    if (status === 429 || status >= 500) {
      return jsonError(503, 'INTERNAL_ERROR', 'Paper search is temporarily unavailable.', {
        action: 'Try again in a few minutes.',
      });
    }
    return jsonErrorFromCaught(err);
  }
}
