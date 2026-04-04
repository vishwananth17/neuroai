/**
 * Semantic Scholar Graph API — shared search + normalization for NeuroAI.
 */

export const SEMANTIC_SCHOLAR_GRAPH = 'https://api.semanticscholar.org/graph/v1';

export type GraphAuthor = { authorId?: string; name: string };

export type NormalizedPaper = {
  id: string;
  semanticId: string;
  title: string;
  abstract: string;
  authors: GraphAuthor[];
  authorNames: string[];
  year: number;
  venue: string | null;
  citations: number;
  url: string;
  fieldsOfStudy: string[];
  tldr: string | null;
};

const DEFAULT_FIELDS =
  'paperId,title,abstract,authors,year,venue,citationCount,url,fieldsOfStudy,tldr';

export type SearchPapersParams = {
  query: string;
  limit?: number;
  offset?: number;
  fields?: string;
};

export type SearchPapersResult = {
  papers: NormalizedPaper[];
  total: number;
  rawOffset: number;
  limit: number;
};

function mapPaper(p: Record<string, unknown>): NormalizedPaper {
  const paperId = (p.paperId as string) || '';
  const authorsRaw = (p.authors as Array<{ authorId?: string; name?: string }>) || [];
  const authors: GraphAuthor[] = authorsRaw.map((a) => ({
    authorId: a.authorId,
    name: a.name || 'Unknown',
  }));
  const fos = (p.fieldsOfStudy as string[]) || [];
  const tldr = p.tldr as { text?: string } | string | undefined;
  const tldrText =
    typeof tldr === 'string' ? tldr : tldr && typeof tldr === 'object' ? tldr.text ?? null : null;

  return {
    id: paperId || `ss-${Math.random().toString(36).slice(2, 11)}`,
    semanticId: paperId,
    title: (p.title as string) || 'Untitled',
    abstract: (p.abstract as string) || 'No abstract available.',
    authors,
    authorNames: authors.map((a) => a.name),
    year: typeof p.year === 'number' ? p.year : new Date().getFullYear(),
    venue: (p.venue as string) || null,
    citations: typeof p.citationCount === 'number' ? p.citationCount : 0,
    url: (p.url as string) || `https://www.semanticscholar.org/paper/${paperId}`,
    fieldsOfStudy: Array.isArray(fos) ? fos : [],
    tldr: tldrText,
  };
}

export async function searchSemanticScholarPapers(
  params: SearchPapersParams
): Promise<SearchPapersResult> {
  const limit = Math.min(Math.max(params.limit ?? 10, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);
  const fields = params.fields ?? DEFAULT_FIELDS;

  const url = new URL(`${SEMANTIC_SCHOLAR_GRAPH}/paper/search`);
  url.searchParams.set('query', params.query.trim());
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('fields', fields);

  const headers: Record<string, string> = { Accept: 'application/json' };
  const key = process.env.SEMANTIC_SCHOLAR_API_KEY;
  if (key && !key.includes('your_')) {
    headers['x-api-key'] = key;
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const err = new Error(`Semantic Scholar API responded with ${response.status}`);
    (err as Error & { status?: number }).status = response.status;
    throw err;
  }

  const data = (await response.json()) as {
    data?: Record<string, unknown>[];
    total?: number;
  };

  const rows = data.data || [];
  const papers = rows.map(mapPaper);
  const total = typeof data.total === 'number' ? data.total : papers.length;

  return { papers, total, rawOffset: offset, limit };
}
