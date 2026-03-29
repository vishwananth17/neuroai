import { BaseAgent } from './agents/base-agent';
import { ResearchAnalystAgent } from './agents/research-analyst';
import { PaperSummarizerAgent } from './agents/paper-summarizer';
import { AgentTask, TaskStatus, TaskPriority, ResearchQuery, ResearchResult, ResearchPaper } from './types';
import { ERROR_MESSAGES } from './config';

export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map();
  private taskQueue: AgentTask[] = [];
  private activeTasks: Map<string, AgentTask> = new Map();
  private isProcessing = false;

  constructor() {
    this.initializeAgents();
  }

  /**
   * Initialize all AI agents
   */
  private initializeAgents(): void {
    // Research Analyst Agent
    const researchAnalyst = new ResearchAnalystAgent();
    this.agents.set(researchAnalyst.id, researchAnalyst);

    // Paper Summarizer Agent
    const paperSummarizer = new PaperSummarizerAgent();
    this.agents.set(paperSummarizer.id, paperSummarizer);

    console.log(`🤖 Initialized ${this.agents.size} AI agents`);
  }

  /**
   * Submit a task to the agent manager
   */
  public async submitTask(
    type: string,
    input: any,
    priority: TaskPriority = 'normal',
    agentId?: string
  ): Promise<string> {
    const taskId = this.generateTaskId();
    
    const task: AgentTask = {
      id: taskId,
      agent_id: agentId || this.selectBestAgent(type),
      type: type as any,
      input,
      status: 'pending',
      priority,
      created_at: new Date(),
    };

    this.taskQueue.push(task);
    this.sortTaskQueue();

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processTaskQueue();
    }

    return taskId;
  }

  /**
   * Get task status
   */
  public getTaskStatus(taskId: string): AgentTask | null {
    return this.activeTasks.get(taskId) || 
           this.taskQueue.find(task => task.id === taskId) || 
           null;
  }

  /**
   * Get all agent statuses
   */
  public getAgentStatuses(): Array<{ id: string; name: string; status: any }> {
    return Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agent.getStatus(),
    }));
  }

  /**
   * Search for research papers
   */
  public async searchPapers(query: ResearchQuery): Promise<ResearchResult> {
    const taskId = await this.submitTask('search_papers', query, 'high');
    
    // Wait for completion
    const result = await this.waitForTaskCompletion(taskId);
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Search failed');
    }

    return result.output as ResearchResult;
  }

  /**
   * Summarize a research paper
   */
  public async summarizePaper(
    paper: ResearchPaper,
    summaryLength: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<string> {
    const taskId = await this.submitTask('summarize_paper', { paper, summaryLength });
    
    const result = await this.waitForTaskCompletion(taskId);
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Summarization failed');
    }

    return result.output.summary;
  }

  /**
   * Generate insights from a paper
   */
  public async generateInsights(
    paper: ResearchPaper,
    insightTypes: string[] = ['trend', 'gap', 'methodology']
  ): Promise<any[]> {
    const taskId = await this.submitTask('generate_insights', { paper, insightTypes });
    
    const result = await this.waitForTaskCompletion(taskId);
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Insight generation failed');
    }

    return result.output.insights;
  }

  /**
   * Analyze trends from a set of papers
   */
  public async analyzeTrends(papers: ResearchPaper[]): Promise<string> {
    const taskId = await this.submitTask('analyze_trends', { papers }, 'normal', 'research-analyst-001');
    
    const result = await this.waitForTaskCompletion(taskId);
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Trend analysis failed');
    }

    return result.output.analysis;
  }

  /**
   * Assess paper quality
   */
  public async assessPaperQuality(paper: ResearchPaper): Promise<string> {
    const taskId = await this.submitTask('assess_quality', { paper }, 'normal', 'research-analyst-001');
    
    const result = await this.waitForTaskCompletion(taskId);
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Quality assessment failed');
    }

    return result.output.assessment;
  }

  /**
   * Process the task queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (!task) continue;

      await this.processTask(task);
    }

    this.isProcessing = false;
  }

  /**
   * Process a single task
   */
  private async processTask(task: AgentTask): Promise<void> {
    const agent = this.agents.get(task.agent_id);
    if (!agent) {
      task.status = 'failed';
      task.error = `Agent ${task.agent_id} not found`;
      return;
    }

    if (!agent.is_active) {
      task.status = 'failed';
      task.error = `Agent ${agent.name} is not active`;
      return;
    }

    try {
      task.status = 'running';
      task.started_at = new Date();
      this.activeTasks.set(task.id, task);

      const result = await agent.processTask(task);
      
      this.activeTasks.delete(task.id);
      
      if (result.status === 'completed') {
        task.status = 'completed';
        task.output = result.output;
        task.completed_at = new Date();
      } else {
        task.status = 'failed';
        task.error = result.error;
      }

    } catch (error) {
      this.activeTasks.delete(task.id);
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  /**
   * Wait for task completion
   */
  private async waitForTaskCompletion(taskId: string, timeout: number = 30000): Promise<AgentTask> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const task = this.getTaskStatus(taskId);
      
      if (task && (task.status === 'completed' || task.status === 'failed')) {
        return task;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Task timeout');
  }

  /**
   * Select the best agent for a task type
   */
  private selectBestAgent(taskType: string): string {
    const agentCapabilities: Record<string, string[]> = {
      'search_papers': ['research-analyst-001'],
      'analyze_trends': ['research-analyst-001'],
      'assess_quality': ['research-analyst-001'],
      'summarize_paper': ['paper-summarizer-001'],
      'generate_insights': ['paper-summarizer-001'],
    };

    const availableAgents = agentCapabilities[taskType] || [];
    
    // Find the first available agent
    for (const agentId of availableAgents) {
      const agent = this.agents.get(agentId);
      if (agent && agent.is_active) {
        return agentId;
      }
    }

    // Fallback to research analyst
    return 'research-analyst-001';
  }

  /**
   * Sort task queue by priority
   */
  private sortTaskQueue(): void {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    
    this.taskQueue.sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // If same priority, sort by creation time
      return a.created_at.getTime() - b.created_at.getTime();
    });
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system statistics
   */
  public getSystemStats(): {
    totalAgents: number;
    activeAgents: number;
    queuedTasks: number;
    activeTasks: number;
    averageResponseTime: number;
  } {
    const agents = Array.from(this.agents.values());
    const activeAgents = agents.filter(agent => agent.is_active);
    
    const totalResponseTime = activeAgents.reduce(
      (sum, agent) => sum + agent.performance_metrics.average_response_time, 
      0
    );

    return {
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      queuedTasks: this.taskQueue.length,
      activeTasks: this.activeTasks.size,
      averageResponseTime: activeAgents.length > 0 ? totalResponseTime / activeAgents.length : 0,
    };
  }

  /**
   * Reset all agent metrics
   */
  public resetAllMetrics(): void {
    this.agents.forEach(agent => agent.resetMetrics());
  }

  /**
   * Activate/deactivate an agent
   */
  public setAgentActive(agentId: string, active: boolean): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.setActive(active);
      return true;
    }
    return false;
  }
} 