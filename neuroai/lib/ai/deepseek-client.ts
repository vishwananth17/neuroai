import axios from 'axios';
import { generateText } from 'ai';
import { AI_MODELS, API_CONFIG, togetherProvider } from './config';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export class DeepSeekClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private useFallback: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = API_CONFIG.deepseek.base_url;
    this.timeout = API_CONFIG.deepseek.timeout;
    
    // Check if API key looks valid (basic format check)
    this.useFallback = !this.apiKey.startsWith('sk-') || this.apiKey.length < 20;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generate text completion using DeepSeek models or fallback to Together.ai
   */
  async generateText(
    messages: DeepSeekMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<DeepSeekResponse> {
    // If using fallback, use Together.ai
    if (this.useFallback) {
      return this.generateTextWithTogether(messages, options);
    }

    try {
      const request: DeepSeekRequest = {
        model: options.model || AI_MODELS.deepseek.deepseek_llm,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000,
        stream: options.stream ?? false,
      };

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        request,
        {
          headers: this.getHeaders(),
          timeout: this.timeout,
        }
      );

      return response.data;
    } catch (error) {
      console.warn('DeepSeek API failed, falling back to Together.ai:', error);
      this.useFallback = true;
      return this.generateTextWithTogether(messages, options);
    }
  }

  /**
   * Fallback method using Together.ai
   */
  private async generateTextWithTogether(
    messages: DeepSeekMessage[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<DeepSeekResponse> {
    try {
      const modelId = options.model || AI_MODELS.together.llama3_70b;
      const { text, usage } = await generateText({
        model: togetherProvider(modelId),
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.max_tokens ?? 2000,
      });

      const promptTokens = usage?.inputTokens ?? 0;
      const completionTokens = usage?.outputTokens ?? 0;

      return {
        id: `together-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: modelId,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: text,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
        },
      };
    } catch (error) {
      throw new Error(`Together.ai fallback failed: ${error}`);
    }
  }

  /**
   * Generate code using DeepSeek Coder models
   */
  async generateCode(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      language?: string;
    } = {}
  ): Promise<DeepSeekResponse> {
    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: `You are an expert programmer. Generate clean, efficient, and well-documented code. 
      ${options.language ? `Use ${options.language} programming language.` : ''}
      Always include comments explaining complex logic.`
    };

    const userMessage: DeepSeekMessage = {
      role: 'user',
      content: prompt
    };

    return this.generateText([systemMessage, userMessage], {
      model: options.model || (this.useFallback ? AI_MODELS.together.codellama : AI_MODELS.deepseek.deepseek_coder),
      temperature: options.temperature ?? 0.1,
      max_tokens: options.max_tokens ?? 2000,
    });
  }

  /**
   * Analyze and explain code
   */
  async analyzeCode(
    code: string,
    options: {
      model?: string;
      analysis_type?: 'explanation' | 'optimization' | 'debugging' | 'review';
    } = {}
  ): Promise<DeepSeekResponse> {
    const analysisPrompts = {
      explanation: 'Explain what this code does, how it works, and its key components.',
      optimization: 'Analyze this code for performance improvements and optimization opportunities.',
      debugging: 'Identify potential bugs, issues, and suggest fixes for this code.',
      review: 'Provide a comprehensive code review including best practices, security, and maintainability.'
    };

    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: `You are an expert code analyst. Provide detailed, accurate analysis of code with practical insights.`
    };

    const userMessage: DeepSeekMessage = {
      role: 'user',
      content: `${analysisPrompts[options.analysis_type || 'explanation']}\n\nCode:\n\`\`\`\n${code}\n\`\`\``
    };

    return this.generateText([systemMessage, userMessage], {
      model: options.model || (this.useFallback ? AI_MODELS.together.codellama : AI_MODELS.deepseek.deepseek_coder),
      temperature: 0.2,
      max_tokens: 3000,
    });
  }

  /**
   * Generate research paper summaries
   */
  async summarizePaper(
    paperContent: string,
    options: {
      model?: string;
      summary_type?: 'brief' | 'detailed' | 'technical' | 'layman';
    } = {}
  ): Promise<DeepSeekResponse> {
    const summaryPrompts = {
      brief: 'Provide a concise 2-3 sentence summary of the key findings.',
      detailed: 'Create a comprehensive summary including methodology, results, and implications.',
      technical: 'Provide a technical summary suitable for researchers in the field.',
      layman: 'Explain the research in simple terms that a non-expert can understand.'
    };

    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: `You are an expert research analyst. Create accurate, well-structured summaries of academic papers.`
    };

    const userMessage: DeepSeekMessage = {
      role: 'user',
      content: `${summaryPrompts[options.summary_type || 'detailed']}\n\nPaper Content:\n${paperContent}`
    };

    return this.generateText([systemMessage, userMessage], {
      model: options.model || (this.useFallback ? AI_MODELS.together.llama3_70b : AI_MODELS.deepseek.deepseek_llm),
      temperature: 0.3,
      max_tokens: 2000,
    });
  }

  /**
   * Generate research insights and trends
   */
  async generateInsights(
    papers: Array<{ title: string; abstract: string; citations?: number }>,
    options: {
      model?: string;
      insight_type?: 'trends' | 'gaps' | 'opportunities' | 'connections';
    } = {}
  ): Promise<DeepSeekResponse> {
    const insightPrompts = {
      trends: 'Identify emerging trends and patterns across these research papers.',
      gaps: 'Identify research gaps and areas that need further investigation.',
      opportunities: 'Suggest research opportunities and potential directions for future work.',
      connections: 'Find connections and relationships between different research areas.'
    };

    const papersText = papers.map((paper, index) => 
      `${index + 1}. ${paper.title}\nAbstract: ${paper.abstract}\nCitations: ${paper.citations || 'N/A'}`
    ).join('\n\n');

    const systemMessage: DeepSeekMessage = {
      role: 'system',
      content: `You are an expert research analyst specializing in identifying patterns, trends, and insights across academic literature.`
    };

    const userMessage: DeepSeekMessage = {
      role: 'user',
      content: `${insightPrompts[options.insight_type || 'trends']}\n\nResearch Papers:\n${papersText}`
    };

    return this.generateText([systemMessage, userMessage], {
      model: options.model || (this.useFallback ? AI_MODELS.together.llama3_70b : AI_MODELS.deepseek.deepseek_llm),
      temperature: 0.4,
      max_tokens: 2500,
    });
  }

  /**
   * Check if the API key is valid
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await this.generateText([
        { role: 'user', content: 'Hello' }
      ], {
        model: this.useFallback ? AI_MODELS.together.llama3 : AI_MODELS.deepseek.deepseek_coder_1b,
        max_tokens: 10,
      });
      return !!response.choices?.[0]?.message?.content;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    if (this.useFallback) {
      return {
        text_generation: [
          AI_MODELS.together.llama3_70b,
          AI_MODELS.together.llama3,
          AI_MODELS.together.mistral,
        ],
        code_generation: [
          AI_MODELS.together.codellama,
          AI_MODELS.together.llama3,
        ],
      };
    }
    
    return {
      text_generation: [
        AI_MODELS.deepseek.deepseek_llm,
        AI_MODELS.deepseek.deepseek_coder_6b,
        AI_MODELS.deepseek.deepseek_coder_1b,
      ],
      code_generation: [
        AI_MODELS.deepseek.deepseek_coder,
        AI_MODELS.deepseek.deepseek_coder_6b,
        AI_MODELS.deepseek.deepseek_coder_1b,
      ],
    };
  }

  /**
   * Get current mode (DeepSeek or Together.ai fallback)
   */
  getCurrentMode() {
    return this.useFallback ? 'together-ai-fallback' : 'deepseek';
  }
}

// Export a singleton instance
export const deepseekClient = new DeepSeekClient(); 