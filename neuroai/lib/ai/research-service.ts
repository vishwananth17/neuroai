import { AgentManager } from './agent-manager';
import { 
  ResearchQuery, 
  ResearchResult, 
  ResearchPaper, 
  Insight, 
  APIResponse,
  SearchAPIResponse,
  ResearchSession,
  User
} from './types';
import { ERROR_MESSAGES, QUALITY_METRICS } from './config';

export class ResearchService {
  private agentManager: AgentManager;
  private sessions: Map<string, ResearchSession> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.agentManager = new AgentManager();
    console.log('🔬 Research Service initialized');
  }

  /**
   * Search for research papers
   */
  public async searchPapers(query: ResearchQuery): Promise<APIResponse<ResearchResult>> {
    const requestId = this.generateRequestId();
    
    try {
      // Validate query
      if (!query.query || query.query.trim().length < 2) {
        return this.createErrorResponse(
          requestId,
          ERROR_MESSAGES.INVALID_QUERY
        );
      }

      // Create or update session
      const sessionId = query.session_id || this.generateSessionId();
      const session = this.getOrCreateSession(sessionId, query.user_id);
      session.queries.push(query);

      // Perform search using AI agents
      const result = await this.agentManager.searchPapers(query);
      
      // Update session
      session.results.push(result);
      session.updated_at = new Date();
      session.duration = session.updated_at.getTime() - session.created_at.getTime();

      return this.createSuccessResponse(requestId, result);

    } catch (error) {
      console.error('Search error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Search failed'
      );
    }
  }

  /**
   * Get paper details with AI-generated summary and insights
   */
  public async getPaperDetails(
    paperId: string,
    includeSummary: boolean = true,
    includeInsights: boolean = true
  ): Promise<APIResponse<{
    paper: ResearchPaper;
    summary?: string;
    insights?: Insight[];
    quality_assessment?: string;
  }>> {
    const requestId = this.generateRequestId();

    try {
      // In a real implementation, you would fetch the paper from your database
      const paper = await this.getPaperById(paperId);
      
      if (!paper) {
        return this.createErrorResponse(requestId, 'Paper not found');
      }

      const result: any = { paper };

      // Generate summary if requested
      if (includeSummary) {
        result.summary = await this.agentManager.summarizePaper(paper);
      }

      // Generate insights if requested
      if (includeInsights) {
        result.insights = await this.agentManager.generateInsights(paper);
      }

      // Generate quality assessment
      result.quality_assessment = await this.agentManager.assessPaperQuality(paper);

      return this.createSuccessResponse(requestId, result);

    } catch (error) {
      console.error('Paper details error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Failed to get paper details'
      );
    }
  }

  /**
   * Analyze trends from a set of papers
   */
  public async analyzeTrends(papers: ResearchPaper[]): Promise<APIResponse<{ analysis: string }>> {
    const requestId = this.generateRequestId();

    try {
      if (!papers || papers.length === 0) {
        return this.createErrorResponse(requestId, 'No papers provided for analysis');
      }

      const analysis = await this.agentManager.analyzeTrends(papers);

      return this.createSuccessResponse(requestId, { analysis });

    } catch (error) {
      console.error('Trend analysis error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Trend analysis failed'
      );
    }
  }

  /**
   * Get trending papers
   */
  public async getTrendingPapers(
    category?: string,
    limit: number = 10
  ): Promise<APIResponse<SearchAPIResponse>> {
    const requestId = this.generateRequestId();

    try {
      // In a real implementation, you would query your database for trending papers
      const trendingQuery: ResearchQuery = {
        query: category ? `${category} trending research` : 'trending research papers',
        category,
        max_results: limit,
        year_range: [new Date().getFullYear() - 2, new Date().getFullYear()],
        min_citations: QUALITY_METRICS.citation_threshold,
      };

      const result = await this.agentManager.searchPapers(trendingQuery);

      const response: SearchAPIResponse = {
        papers: result.papers,
        total: result.total_found,
        page: 1,
        per_page: limit,
        has_more: result.papers.length === limit,
      };

      return this.createSuccessResponse(requestId, response);

    } catch (error) {
      console.error('Trending papers error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Failed to get trending papers'
      );
    }
  }

  /**
   * Get search suggestions
   */
  public async getSearchSuggestions(query: string): Promise<APIResponse<{ suggestions: string[] }>> {
    const requestId = this.generateRequestId();

    try {
      if (!query || query.trim().length < 2) {
        return this.createSuccessResponse(requestId, { suggestions: [] });
      }

      // Use the research analyst to generate suggestions
      const searchQuery: ResearchQuery = { query: query.trim() };
      const result = await this.agentManager.searchPapers(searchQuery);

      return this.createSuccessResponse(requestId, { 
        suggestions: result.suggestions 
      });

    } catch (error) {
      console.error('Search suggestions error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Failed to get suggestions'
      );
    }
  }

  /**
   * Get system status and metrics
   */
  public getSystemStatus(): APIResponse<{
    agents: any[];
    stats: any;
    uptime: number;
  }> {
    const requestId = this.generateRequestId();

    try {
      const agentStatuses = this.agentManager.getAgentStatuses();
      const systemStats = this.agentManager.getSystemStats();

      const result = {
        agents: agentStatuses,
        stats: systemStats,
        uptime: Date.now(), // In a real app, you'd track actual uptime
      };

      return this.createSuccessResponse(requestId, result);

    } catch (error) {
      console.error('System status error:', error);
      return this.createErrorResponse(
        requestId,
        error instanceof Error ? error.message : 'Failed to get system status'
      );
    }
  }

  /**
   * Create or get a research session
   */
  private getOrCreateSession(sessionId: string, userId?: string): ResearchSession {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }

    const session: ResearchSession = {
      id: sessionId,
      user_id: userId,
      queries: [],
      results: [],
      papers_saved: [],
      insights_generated: [],
      created_at: new Date(),
      updated_at: new Date(),
      duration: 0,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get paper by ID (placeholder implementation)
   */
  private async getPaperById(paperId: string): Promise<ResearchPaper | null> {
    // In a real implementation, this would query your database
    // For now, return a sample paper
    return {
      id: paperId,
      title: 'Sample Research Paper',
      authors: ['John Doe', 'Jane Smith'],
      abstract: 'This is a sample research paper abstract...',
      year: 2023,
      citations: 50,
      category: 'machine-learning',
      source: 'arxiv',
      keywords: ['AI', 'machine learning', 'research'],
    };
  }

  /**
   * Create success response
   */
  private createSuccessResponse<T>(requestId: string, data: T): APIResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date(),
      request_id: requestId,
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(requestId: string, error: string): APIResponse<any> {
    return {
      success: false,
      error,
      timestamp: new Date(),
      request_id: requestId,
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old sessions
   */
  public cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const sessionsToDelete: string[] = [];

    this.sessions.forEach((session, sessionId) => {
      if (now - session.updated_at.getTime() > maxAge) {
        sessionsToDelete.push(sessionId);
      }
    });

    sessionsToDelete.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });

    if (sessionsToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${sessionsToDelete.length} old sessions`);
    }
  }

  /**
   * Get session by ID
   */
  public getSession(sessionId: string): ResearchSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Save paper to session
   */
  public savePaperToSession(sessionId: string, paperId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && !session.papers_saved.includes(paperId)) {
      session.papers_saved.push(paperId);
      session.updated_at = new Date();
      return true;
    }
    return false;
  }
} 