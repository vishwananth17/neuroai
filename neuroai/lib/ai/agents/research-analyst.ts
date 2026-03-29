import { BaseAgent } from './base-agent';
import { AgentTask, TaskStatus, ResearchQuery, ResearchResult, ResearchPaper } from '../types';
import { arxiv, semanticScholar } from '../api';

export class ResearchAnalystAgent extends BaseAgent {
  constructor() {
    super(
      'research-analyst-001',
      'Research Analyst',
      'research_analyst',
      ['text_generation', 'text_analysis', 'semantic_search'],
      'research_analyst'
    );
  }

  async processTask(task: AgentTask): Promise<AgentTask> {
    try {
      switch (task.type) {
        case 'search_papers':
          return await this.searchPapers(task);
        case 'analyze_trends':
          return await this.analyzeTrends(task);
        case 'assess_quality':
          return await this.assessQuality(task);
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createTaskResponse(
        task.id,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Search for research papers across multiple sources
   */
  private async searchPapers(task: AgentTask): Promise<AgentTask> {
    const query = task.input as ResearchQuery;
    this.validateInput(query, ['query']);

    const startTime = Date.now();
    const papers: ResearchPaper[] = [];

    try {
      // Search arXiv
      const arxivResults = await arxiv.searchPapers(query.query, query.max_results || 10);
      papers.push(...this.transformArxivResults(arxivResults));

      // Search Semantic Scholar
      const semanticResults = await semanticScholar.searchPapers(query.query, query.max_results || 10);
      papers.push(...this.transformSemanticScholarResults(semanticResults));

      // Remove duplicates and sort by relevance
      const uniquePapers = this.deduplicatePapers(papers);
      const sortedPapers = this.sortByRelevance(uniquePapers, query.query);

      // Generate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(sortedPapers);

      // Generate suggestions and related topics
      const suggestions = await this.generateSearchSuggestions(query.query);
      const relatedTopics = await this.generateRelatedTopics(query.query);

      const result: ResearchResult = {
        papers: sortedPapers,
        total_found: sortedPapers.length,
        query_time: Date.now() - startTime,
        suggestions,
        related_topics: relatedTopics,
        quality_metrics: qualityMetrics,
      };

      return this.createTaskResponse(task.id, 'completed', result);

    } catch (error) {
      throw new Error(`Paper search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze research trends
   */
  private async analyzeTrends(task: AgentTask): Promise<AgentTask> {
    const papers = task.input.papers as ResearchPaper[];
    this.validateInput({ papers }, ['papers']);

    const prompt = `
      Analyze the following research papers and identify key trends:
      
      Papers:
      ${papers.map(p => `- ${p.title} (${p.year})`).join('\n')}
      
      Please provide:
      1. Main research trends
      2. Emerging topics
      3. Methodology patterns
      4. Future directions
      5. Gaps in research
      
      Format your response as a structured analysis.
    `;

    const analysis = await this.executeTask(prompt, { temperature: 0.3 });

    return this.createTaskResponse(task.id, 'completed', { analysis });
  }

  /**
   * Assess paper quality
   */
  private async assessQuality(task: AgentTask): Promise<AgentTask> {
    const paper = task.input.paper as ResearchPaper;
    this.validateInput({ paper }, ['paper']);

    const prompt = `
      Assess the quality of this research paper:
      
      Title: ${paper.title}
      Authors: ${paper.authors.join(', ')}
      Year: ${paper.year}
      Citations: ${paper.citations}
      Abstract: ${paper.abstract}
      
      Please evaluate:
      1. Research significance (1-10)
      2. Methodology quality (1-10)
      3. Innovation level (1-10)
      4. Potential impact (1-10)
      5. Overall quality score (1-10)
      6. Strengths and weaknesses
      7. Recommendations for improvement
      
      Provide a detailed assessment with scores and explanations.
    `;

    const assessment = await this.executeTask(prompt, { temperature: 0.2 });

    return this.createTaskResponse(task.id, 'completed', { assessment });
  }

  /**
   * Transform arXiv API results to our format
   */
  private transformArxivResults(results: any): ResearchPaper[] {
    // Implementation depends on actual arXiv API response format
    return [];
  }

  /**
   * Transform Semantic Scholar API results to our format
   */
  private transformSemanticScholarResults(results: any): ResearchPaper[] {
    // Implementation depends on actual Semantic Scholar API response format
    return [];
  }

  /**
   * Remove duplicate papers based on title similarity
   */
  private deduplicatePapers(papers: ResearchPaper[]): ResearchPaper[] {
    const seen = new Set<string>();
    return papers.filter(paper => {
      const normalizedTitle = paper.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) {
        return false;
      }
      seen.add(normalizedTitle);
      return true;
    });
  }

  /**
   * Sort papers by relevance to query
   */
  private sortByRelevance(papers: ResearchPaper[], query: string): ResearchPaper[] {
    return papers.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, query);
      const bScore = this.calculateRelevanceScore(b, query);
      return bScore - aScore;
    });
  }

  /**
   * Calculate relevance score for a paper
   */
  private calculateRelevanceScore(paper: ResearchPaper, query: string): number {
    const queryTerms = query.toLowerCase().split(' ');
    const titleTerms = paper.title.toLowerCase().split(' ');
    const abstractTerms = paper.abstract.toLowerCase().split(' ');

    let score = 0;

    // Title matches
    queryTerms.forEach(term => {
      if (titleTerms.includes(term)) score += 3;
    });

    // Abstract matches
    queryTerms.forEach(term => {
      if (abstractTerms.includes(term)) score += 1;
    });

    // Citation bonus
    score += Math.min(paper.citations / 100, 2);

    // Recency bonus
    const currentYear = new Date().getFullYear();
    score += Math.max(0, (paper.year - (currentYear - 5)) / 5);

    return score;
  }

  /**
   * Calculate quality metrics for a set of papers
   */
  private calculateQualityMetrics(papers: ResearchPaper[]) {
    if (papers.length === 0) {
      return {
        average_citations: 0,
        average_year: 0,
        relevance_score: 0,
        diversity_score: 0,
        novelty_score: 0,
      };
    }

    const citations = papers.map(p => p.citations);
    const years = papers.map(p => p.year);
    const categories = papers.map(p => p.category);

    return {
      average_citations: citations.reduce((a, b) => a + b, 0) / citations.length,
      average_year: years.reduce((a, b) => a + b, 0) / years.length,
      relevance_score: 0.8, // Would be calculated based on query relevance
      diversity_score: new Set(categories).size / categories.length,
      novelty_score: 0.7, // Would be calculated based on publication recency and citations
    };
  }

  /**
   * Generate search suggestions
   */
  private async generateSearchSuggestions(query: string): Promise<string[]> {
    const prompt = `
      Based on the search query "${query}", suggest 5 related search terms that would help find relevant research papers.
      
      Return only the search terms, one per line, without numbering or additional text.
    `;

    const suggestions = await this.executeTask(prompt, { temperature: 0.5 });
    return suggestions.split('\n').filter(s => s.trim()).slice(0, 5);
  }

  /**
   * Generate related topics
   */
  private async generateRelatedTopics(query: string): Promise<string[]> {
    const prompt = `
      Based on the search query "${query}", identify 5 related research topics or areas that researchers might be interested in.
      
      Return only the topic names, one per line, without numbering or additional text.
    `;

    const topics = await this.executeTask(prompt, { temperature: 0.5 });
    return topics.split('\n').filter(t => t.trim()).slice(0, 5);
  }
} 