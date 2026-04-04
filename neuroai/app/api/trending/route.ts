import { NextRequest, NextResponse } from 'next/server';
import { jsonError, jsonErrorFromCaught } from '@/lib/api/errors';
import { searchSemanticScholarPapers } from '@/lib/paper-graph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'machine learning engineering';
    const limitRaw = searchParams.get('limit') || '10';
    const limit = Math.min(Math.max(parseInt(limitRaw, 10) || 10, 1), 50);

    const { papers, total } = await searchSemanticScholarPapers({
      query: category,
      limit,
      offset: 0,
    });

    const mapped = papers.map((p) => ({
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
      category,
    }));

    return NextResponse.json({
      success: true,
      data: {
        papers: mapped,
        total: total,
        page: 1,
        per_page: limit,
        has_more: mapped.length < total,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Trending API error:', error);
    const status = typeof (error as { status?: number }).status === 'number'
      ? (error as { status: number }).status
      : 500;
    if (status === 429 || status >= 500) {
      return jsonError(503, 'INTERNAL_ERROR', 'Could not load trending papers right now.', {
        action: 'Try again shortly.',
      });
    }
    return jsonErrorFromCaught(error);
  }
}
