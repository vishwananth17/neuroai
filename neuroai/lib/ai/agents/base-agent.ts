import { generateText, streamText } from 'ai';
import { AGENT_CONFIG } from '../config';
import {
  AIAgent,
  AgentCapability,
  AgentRole,
  AgentTask,
  PerformanceMetrics,
  TaskStatus,
} from '../types';

export abstract class BaseAgent implements AIAgent {
  public id: string;
  public name: string;
  public role: AgentRole;
  public capabilities: AgentCapability[];
  public model: string;
  public is_active: boolean;
  public performance_metrics: PerformanceMetrics;

  constructor(
    id: string,
    name: string,
    role: AgentRole,
    capabilities: AgentCapability[],
    model: string
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.model = model;
    this.is_active = true;
    this.performance_metrics = {
      total_requests: 0,
      success_rate: 1.0,
      average_response_time: 0,
      error_rate: 0,
      last_updated: new Date(),
    };
  }

  /**
   * Execute a task with the AI model
   */
  protected async executeTask(
    prompt: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      const model = this.getModel();
      const profile =
        this.role === 'paper_summarizer'
          ? AGENT_CONFIG.paper_summarizer
          : AGENT_CONFIG.research_analyst;
      const config = {
        model,
        prompt,
        maxTokens: options.maxTokens ?? profile.max_tokens,
        temperature: options.temperature ?? profile.temperature,
      };

      let result: string;

      if (options.stream) {
        const stream = await streamText(config);
        result = await this.handleStream(stream);
      } else {
        const { text } = await generateText(config);
        result = text;
      }

      this.updatePerformanceMetrics(Date.now() - startTime, true);
      return result;

    } catch (error) {
      this.updatePerformanceMetrics(Date.now() - startTime, false);
      throw new Error(`Agent ${this.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle streaming responses
   */
  private async handleStream(stream: any): Promise<string> {
    let fullText = '';
    for await (const chunk of stream.textStream) {
      fullText += chunk;
    }
    return fullText;
  }

  /**
   * Get the appropriate model for this agent
   */
  protected getModel() {
    if (this.role === 'paper_summarizer') {
      return AGENT_CONFIG.paper_summarizer.model;
    }
    return AGENT_CONFIG.research_analyst.model;
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(responseTime: number, success: boolean) {
    const metrics = this.performance_metrics;
    metrics.total_requests++;
    
    if (success) {
      metrics.success_rate = (metrics.success_rate * (metrics.total_requests - 1) + 1) / metrics.total_requests;
      metrics.error_rate = (metrics.error_rate * (metrics.total_requests - 1)) / metrics.total_requests;
    } else {
      metrics.success_rate = (metrics.success_rate * (metrics.total_requests - 1)) / metrics.total_requests;
      metrics.error_rate = (metrics.error_rate * (metrics.total_requests - 1) + 1) / metrics.total_requests;
    }

    metrics.average_response_time = 
      (metrics.average_response_time * (metrics.total_requests - 1) + responseTime) / metrics.total_requests;
    metrics.last_updated = new Date();
  }

  /**
   * Validate input data
   */
  protected validateInput(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Create a standardized task response
   */
  protected createTaskResponse(
    taskId: string,
    status: TaskStatus,
    output?: any,
    error?: string
  ): AgentTask {
    return {
      id: taskId,
      agent_id: this.id,
      type: 'search_papers', // Will be overridden by subclasses
      input: {},
      output,
      status,
      priority: 'normal',
      created_at: new Date(),
      started_at: new Date(),
      completed_at: status === 'completed' ? new Date() : undefined,
      error,
    };
  }

  /**
   * Abstract method that must be implemented by subclasses
   */
  abstract processTask(task: AgentTask): Promise<AgentTask>;

  /**
   * Get agent status
   */
  public getStatus(): { is_active: boolean; performance: PerformanceMetrics } {
    return {
      is_active: this.is_active,
      performance: this.performance_metrics,
    };
  }

  /**
   * Activate/deactivate agent
   */
  public setActive(active: boolean): void {
    this.is_active = active;
  }

  /**
   * Reset performance metrics
   */
  public resetMetrics(): void {
    this.performance_metrics = {
      total_requests: 0,
      success_rate: 1.0,
      average_response_time: 0,
      error_rate: 0,
      last_updated: new Date(),
    };
  }
} 