// POST /api/ai/summarize
// Generate AI summary of a paper using fallback chain (DeepSeek → Groq → OpenRouter)
// Results are cached permanently

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { callAI } from '@/lib/ai/provider';
import { authenticateRequest } from '@/lib/auth';
import {
  jsonSuccess,
  jsonErrorResponse,
  ValidationError,
  AuthError,
  AIUnavailableError,
} from '@/lib/api/errors';
import { SummarizeRequest } from '@/lib/types';

// System prompt for all AI calls
const SYSTEM_PROMPT = `You are NeuroAI, an intelligent research assistant built for Indian engineering students.
You have deep knowledge of computer science, electronics, mechanical, and civil engineering.

Your personality:
- Smart and precise, never condescending
- Respect that students are busy - be concise first, detailed on request
- Use examples from real engineering applications
- Acknowledge when something is beyond the paper's scope
- Never hallucinate citations or make up results

Your constraints:
- Only discuss what the paper actually says
- Always cite the section/finding you're drawing from
- For Indian students: relate examples to GATE syllabus where relevant`;

// Prompt templates by type
const PROMPT_TEMPLATES = {
  BRIEF: `Paper: "{title}" ({year})
Abstract: {abstract}

Task: Write a brief summary in exactly 3 bullet points.
Each bullet: one clear sentence, plain English, no jargon.
Format:
- [Core problem being solved]
- [Method or approach used]
- [Key result or contribution]

Do not include any other text.`,

  DETAILED: `Paper: "{title}" ({year})
Abstract: {abstract}
{fullText}

Write a comprehensive structured summary with these sections:
1. Problem Statement (2-3 sentences)
2. Motivation & Gap (why this research matters)
3. Proposed Method (technical approach)
4. Key Results (specific numbers, comparisons)
5. Limitations (honest assessment)
6. Future Work (what's next)
7. Relevance for Students (how to cite, what to learn)

Use clear headers. Keep each section focused.`,

  ELI5: `Explain this research paper to a second-year engineering student.
Paper: "{title}"
Abstract: {abstract}

Rules:
- Use a real-world analogy in the first paragraph
- Avoid all technical jargon OR explain it immediately
- Use short paragraphs (3-4 sentences max)
- End with "Why does this matter for you as a student?"
- Total length: 200-300 words`,

  TECHNICAL: `Paper: "{title}" ({year})
Abstract: {abstract}
{fullText}

Provide a deep technical summary covering:
1. Mathematical foundations (equations, frameworks)
2. Methodology in detail
3. Experimental setup (datasets, baselines)
4. Results & Analysis (tables, graphs descriptions)
5. Reproducibility notes
6. Comparison with related work
7. Limitations & Future directions

Be precise and technical. Include specific numbers and settings.`,

  LITERATURE_REVIEW: `Paper: "{title}" ({year})
Abstract: {abstract}

Write a paragraph suitable for a B.Tech project report literature review.
Format: flowing prose (not bullets), IEEE citation style [1], [2], etc.

The paragraph should:
- Explain what this paper does and its significance
- Show how it fits into the broader research landscape
- Identify gaps it addresses
- Be suitable for a student's literature review section
- Total: 150-250 words`,
};

export async function POST(request: NextRequest) {
  try {
    // ── AUTHENTICATE USER ──────────────────────────────────────────────────

    const auth = await authenticateRequest(request.headers.get('Authorization') ?? undefined);
    if (!auth) {
      throw new AuthError('Authentication required');
    }

    // ── PARSE REQUEST ──────────────────────────────────────────────────────

    const body = await request.json();
    const { paperId, summaryType = 'BRIEF' } = body as SummarizeRequest;

    // ── VALIDATE INPUT ────────────────────────────────────────────────────

    if (!paperId?.trim()) {
      throw new ValidationError('Paper ID is required');
    }

    const validTypes = ['BRIEF', 'DETAILED', 'ELI5', 'TECHNICAL', 'LITERATURE_REVIEW'];
    if (!validTypes.includes(summaryType)) {
      throw new ValidationError(`Invalid summary type: ${summaryType}`);
    }

    // ── FETCH PAPER ────────────────────────────────────────────────────────

    const paper = await prisma.paper.findUnique({
      where: { semanticId: paperId },
    });

    if (!paper) {
      throw new ValidationError(`Paper not found: ${paperId}`);
    }

    // ── CHECK CACHE ─────────────────────────────────────────────────────────

    const existingSummary = await prisma.paperSummary.findFirst({
      where: {
        paperId: paper.id,
        summaryType: summaryType as any,
        // Public cached summary (userId is null)
        userId: null,
      },
    });

    if (existingSummary) {
      return jsonSuccess(
        {
          summary: existingSummary.content,
          type: summaryType,
          modelUsed: existingSummary.modelUsed,
          tokensUsed: existingSummary.tokensUsed,
          cached: true,
          generatedAt: existingSummary.createdAt,
        },
        200
      );
    }

    // ── PREPARE PROMPT ──────────────────────────────────────────────────────

    let promptTemplate = PROMPT_TEMPLATES[summaryType as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.BRIEF;

    const prompt = promptTemplate
      .replace('{title}', paper.title)
      .replace('{year}', paper.year?.toString() || 'Unknown')
      .replace('{abstract}', paper.abstract)
      .replace('{fullText}', ''); // TODO: Add full text from PDF if available

    // ── CALL AI WITH FALLBACK CHAIN ─────────────────────────────────────────

    let aiResponse;
    try {
      aiResponse = await callAI({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });
    } catch (error) {
      console.error('[AI Summarize] All providers failed:', error);
      throw new AIUnavailableError(
        'Unable to generate summary. Our AI providers are temporarily unavailable.'
      );
    }

    // ── SAVE TO CACHE ──────────────────────────────────────────────────────

    await prisma.paperSummary.create({
      data: {
        paperId: paper.id,
        summaryType: summaryType as any,
        content: aiResponse.content,
        modelUsed: aiResponse.provider,
        tokensUsed: aiResponse.tokensUsed,
      },
    });

    // ── DEDUCT FROM USER QUOTA ────────────────────────────────────────────

    // Reset daily quota if day has changed
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    const lastActiveDay =
      user?.lastActiveAt?.toDateString() === new Date().toDateString();

    if (!lastActiveDay) {
      // Reset counters
      await prisma.user.update({
        where: { id: auth.userId },
        data: {
          dailyAIQueries: 1,
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Increment counter
      await prisma.user.update({
        where: { id: auth.userId },
        data: {
          dailyAIQueries: { increment: 1 },
          lastActiveAt: new Date(),
        },
      });
    }

    // ── RETURN RESPONSE ────────────────────────────────────────────────────

    return jsonSuccess(
      {
        summary: aiResponse.content,
        type: summaryType,
        modelUsed: aiResponse.provider,
        tokensUsed: aiResponse.tokensUsed,
        cached: false,
        generatedAt: new Date(),
      },
      200
    );
  } catch (error) {
    return jsonErrorResponse(error as any);
  }
}
