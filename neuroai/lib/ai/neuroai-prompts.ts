/**
 * NeuroAI system and task prompts — tuned for Indian engineering students (spec Section 05).
 */

export const NEUROAI_SYSTEM_PROMPT = `You are NeuroAI, an intelligent research assistant built specifically for Indian engineering students. You have deep knowledge of computer science, electronics, mechanical, and civil engineering research domains.

Your personality:
- Smart and precise, but never condescending
- You respect that students are busy — be concise first, detailed on request
- You use examples from real engineering applications
- You acknowledge when something is beyond the paper's scope
- You never hallucinate citations or make up results

Your constraints:
- Only discuss what the paper actually says
- If asked something outside the paper, say so clearly
- Always cite the section/finding you're drawing from
- For Indian students: relate examples to GATE syllabus topics where relevant`;

export function briefSummaryPrompt(input: {
  title: string;
  authors: string;
  abstract: string;
}): string {
  return `Paper Title: ${input.title}
Authors: ${input.authors}
Abstract: ${input.abstract}

Task: Write a brief summary in exactly 3 bullet points.
Each bullet: one clear sentence, plain English, no jargon.
Format:
- [Core problem being solved]
- [Method or approach used]
- [Key result or contribution]
Do not include any other text.`;
}

export function detailedSummaryPrompt(input: {
  title: string;
  year: number | string;
  abstract: string;
  fullText?: string;
}): string {
  const full = input.fullText?.trim()
    ? `\n\nFull text (excerpt):\n${input.fullText.slice(0, 24_000)}`
    : '';
  return `Paper: ${input.title} (${input.year})
Abstract: ${input.abstract}${full}

Write a comprehensive structured summary with these sections:
1. Problem Statement (2-3 sentences)
2. Motivation & Gap (why this research matters)
3. Proposed Method (technical approach, clearly explained)
4. Key Results (specific numbers, comparisons)
5. Limitations (honest assessment)
6. Future Work (what's next)
7. Relevance for Students (how to cite this, what to learn)

Use clear headers. Keep each section focused.`;
}

export function eli5SummaryPrompt(input: { title: string; abstract: string }): string {
  return `Explain this research paper to a second-year engineering student who is smart but has no research experience.
Paper: ${input.title}
Abstract: ${input.abstract}

Rules:
- Use a real-world analogy in the first paragraph
- Avoid all technical jargon OR explain it immediately after using it in parentheses
- Use short paragraphs (3-4 sentences max)
- End with "Why does this matter for you as a student?"
- Total length: 200-300 words`;
}

export function technicalSummaryPrompt(input: { title: string; abstract: string }): string {
  return `${NEUROAI_SYSTEM_PROMPT}

Paper title: ${input.title}
Abstract: ${input.abstract}

Write a technical deep dive: methodology, datasets or setup, metrics, benchmarks, equations where relevant, reproducibility notes, and open questions. Use clear headings. Stay grounded in the abstract; if the abstract does not mention a detail, say it is not specified.`;
}

export type LitReviewPaper = { title: string; year?: number | null; abstract: string };

export function literatureReviewPrompt(input: {
  papers: LitReviewPaper[];
  topic: string;
  wordLimit?: number;
}): string {
  const lines = input.papers.map(
    (p) => `- "${p.title}" (${p.year ?? 'n.d.'}): ${p.abstract}`
  );
  const limit = input.wordLimit ?? 400;
  return `You are helping an Indian B.Tech student write their project report literature review section.

Papers to synthesize:
${lines.join('\n')}

Topic: ${input.topic}
Word limit: ${limit} words

Write a flowing literature review paragraph (not bullet points) that:
1. Groups papers by theme or approach
2. Shows how each work builds on previous ones
3. Identifies the research gap these papers collectively reveal
4. Ends with a sentence about what your project addresses
5. Uses IEEE in-text citation style: [1], [2], etc.

Return the paragraph + a references list at the end.`;
}
