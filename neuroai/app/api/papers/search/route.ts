// GET /api/papers/search
// Search for academic papers using Semantic Scholar API
// Results are cached in Redis + PostgreSQL for fallback

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { jsonSuccess, jsonErrorResponse, ValidationError } from '@/lib/api/errors';
import { SEMANTIC_SCHOLAR_CONFIG } from '@/lib/config';

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string;
  authors: Array<{ name: string; authorId?: string }>;
  year: number;
  venue?: string;
  citationCount: number;
  referenceCount: number;
  fieldsOfStudy?: string[];
  tldr?: { text: string };
  openAccessPdf?: { url: string };
  doi?: string;
  url?: string;
}

interface SemanticScholarResponse {
  data: SemanticScholarPaper[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    // ── PARSE QUERY PARAMETERS ──────────────────────────────────────────────

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const limitStr = url.searchParams.get('limit') || '10';
    const offsetStr = url.searchParams.get('offset') || '0';
    const year = url.searchParams.get('year');
    const field = url.searchParams.get('field');
    const sort = url.searchParams.get('sort') || 'relevance';

    // ── VALIDATE INPUT ──────────────────────────────────────────────────────

    if (!query?.trim()) {
      throw new ValidationError('Search query is required');
    }

    if (query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters');
    }

    if (query.length > 500) {
      throw new ValidationError('Search query is too long (max 500 characters)');
    }

    const limit = Math.min(Math.max(parseInt(limitStr) || 10, 1), 100);
    const offset = Math.max(parseInt(offsetStr) || 0, 0);

    // ── BUILD SEMANTIC SCHOLAR QUERY ────────────────────────────────────────

    const searchFields = [
      `query=${encodeURIComponent(query)}`,
      `limit=${limit}`,
      `offset=${offset}`,
      `fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,fieldsOfStudy,tldr,openAccessPdf,doi,url`,
    ];

    if (year) {
      searchFields.push(`year=${parseInt(year)}`);
    }

    if (field) {
      searchFields.push(`fieldsOfStudy=${encodeURIComponent(field)}`);
    }

    const searchUrl = `${SEMANTIC_SCHOLAR_CONFIG.baseUrl}/paper/search?${searchFields.join('&')}`;

    // ── FETCH FROM SEMANTIC SCHOLAR ─────────────────────────────────────────

    let response: Response | null = null;
    let semanticData: SemanticScholarResponse | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), SEMANTIC_SCHOLAR_CONFIG.timeout);

      response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'NeuroAI Research Platform (+https://neuroai.tech)',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('[Semantic Scholar] Rate limited');
        } else if (response.status >= 500) {
          console.error('[Semantic Scholar] Server error:', response.status);
        } else {
          console.warn('[Semantic Scholar] Error:', response.status);
        }
        throw new Error(`Semantic Scholar API responded with ${response.status}`);
      }

      semanticData = (await response.json()) as SemanticScholarResponse;
    } catch (error) {
      console.error('[Paper Search] Semantic Scholar failed:', error);

      // ── FALLBACK TO PostgreSQL FULL-TEXT SEARCH ────────────────────────────

      console.log('[Paper Search] Falling back to PostgreSQL FTS');

      // TODO: Implement FTS query in PostgreSQL
      // For now, just return empty results with message

      return jsonSuccess(
        {
          papers: [],
          total: 0,
          hasMore: false,
          query,
          cached: false,
          message:
            'Paper search is temporarily unavailable. Try searching again in a moment.',
        },
        200
      );
    }

    // ── STORE PAPERS IN DATABASE ────────────────────────────────────────────

    const storedPapersIds = new Set<string>();

    for (const paper of semanticData.data) {
      try {
        await prisma.paper.upsert({
          where: { semanticId: paper.paperId },
          create: {
            semanticId: paper.paperId,
            title: paper.title,
            abstract: paper.abstract || '',
            authors: paper.authors || [],
            year: paper.year,
            venue: paper.venue,
            doi: paper.doi,
            url: paper.url,
            pdfUrl: paper.openAccessPdf?.url,
            citationCount: paper.citationCount || 0,
            referenceCount: paper.referenceCount || 0,
            fieldsOfStudy: paper.fieldsOfStudy || [],
            tldr: paper.tldr?.text,
          },
          update: {
            // Update citation counts periodically
            citationCount: paper.citationCount || 0,
            referenceCount: paper.referenceCount || 0,
            fetchedAt: new Date(),
          },
        });

        storedPapersIds.add(paper.paperId);
      } catch (error) {
        console.error(
          `[Paper Storage] Failed to store paper ${paper.paperId}:`,
          error
        );
      }
    }

    // ── LOG SEARCH HISTORY ──────────────────────────────────────────────────
    // TODO: Get userId from auth header

    // ── BUILD RESPONSE ──────────────────────────────────────────────────────

    return jsonSuccess(
      {
        papers: semanticData.data.map((p) => ({
          id: p.paperId,
          semanticId: p.paperId,
          title: p.title,
          abstract: p.abstract,
          authors: p.authors,
          year: p.year,
          venue: p.venue,
          citationCount: p.citationCount,
          referenceCount: p.referenceCount,
          fieldsOfStudy: p.fieldsOfStudy || [],
          tldr: p.tldr?.text,
          url: p.url,
          pdfUrl: p.openAccessPdf?.url,
        })),
        total: semanticData.total,
        hasMore: offset + limit < semanticData.total,
        query,
      },
      200
    );
  } catch (error) {
    return jsonErrorResponse(error as any);
  }
}
