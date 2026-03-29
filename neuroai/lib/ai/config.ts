import { togetherai } from '@ai-sdk/togetherai';

// AI Model Configurations
export const AI_MODELS = {
  // Together.ai models
  together: {
    llama3: 'meta-llama/Llama-3.1-8B-Instruct',
    llama3_70b: 'meta-llama/Llama-3.1-70B-Instruct',
    codellama: 'togethercomputer/CodeLlama-34B-Instruct',
    mistral: 'mistralai/Mistral-7B-Instruct-v0.2',
    mixtral: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  },
  // DeepSeek models
  deepseek: {
    deepseek_coder: 'deepseek-ai/deepseek-coder-33b-instruct',
    deepseek_llm: 'deepseek-ai/deepseek-llm-67b-chat',
    deepseek_coder_6b: 'deepseek-ai/deepseek-coder-6.7b-instruct',
    deepseek_coder_1b: 'deepseek-ai/deepseek-coder-1.3b-instruct',
  },
  // OpenAI models (fallback)
  openai: {
    gpt4: 'gpt-4',
    gpt35: 'gpt-3.5-turbo',
  }
};

// Agent configurations
export const AGENT_CONFIG = {
  research_analyst: {
    model: AI_MODELS.together.llama3_70b,
    temperature: 0.3,
    max_tokens: 4000,
    system_prompt: `You are an expert research analyst specializing in academic papers and scientific literature. 
    Your role is to analyze research papers, identify key insights, trends, and provide comprehensive summaries.
    Focus on accuracy, relevance, and actionable insights for researchers, lawyers, and medical professionals.`
  },
  paper_summarizer: {
    model: AI_MODELS.deepseek.deepseek_llm, // Using DeepSeek for summarization
    temperature: 0.2,
    max_tokens: 3000,
    system_prompt: `You are a specialized paper summarizer with expertise in academic writing and research methodology.
    Create concise, accurate summaries that highlight key findings, methodology, and implications.
    Structure your summaries with clear sections: Key Findings, Methodology, Implications, and Future Directions.`
  },
  code_analyzer: {
    model: AI_MODELS.deepseek.deepseek_coder, // Using DeepSeek Coder for code analysis
    temperature: 0.1,
    max_tokens: 2000,
    system_prompt: `You are a code analysis expert specializing in research code, algorithms, and technical implementations.
    Analyze code for correctness, efficiency, and best practices. Provide clear explanations and suggestions for improvement.`
  }
};

// API Rate limits and configurations
export const API_CONFIG = {
  together_ai: {
    rate_limit: 100, // requests per minute
    timeout: 30000, // 30 seconds
    retry_attempts: 3,
  },
  deepseek: {
    rate_limit: 50, // requests per minute
    timeout: 45000, // 45 seconds (longer for code generation)
    retry_attempts: 3,
    base_url: 'https://api.deepseek.com/v1',
  },
  arxiv: {
    rate_limit: 10, // requests per minute
    timeout: 10000,
    retry_attempts: 2,
  },
  semantic_scholar: {
    rate_limit: 100, // requests per minute
    timeout: 15000,
    retry_attempts: 2,
  }
};

// Error messages
export const ERROR_MESSAGES = {
  API_RATE_LIMIT: 'API rate limit exceeded. Please try again in a moment.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_QUERY: 'Invalid search query. Please provide a more specific search term.',
  NO_RESULTS: 'No results found for your search query.',
  MODEL_UNAVAILABLE: 'Selected AI model is currently unavailable.',
  DEEPSEEK_ERROR: 'DeepSeek API error. Please check your API key and try again.',
};

// Quality metrics for research papers
export const QUALITY_METRICS = {
  citation_threshold: 10,
  year_threshold: 2015,
  venue_weights: {
    'Nature': 1.0,
    'Science': 1.0,
    'Cell': 0.9,
    'PNAS': 0.8,
    'arXiv': 0.6,
  }
};

// Research categories
export const RESEARCH_CATEGORIES = {
  lawyer: ['legal', 'law', 'jurisprudence', 'contract', 'litigation', 'regulation'],
  doctor: ['medical', 'healthcare', 'clinical', 'pharmaceutical', 'diagnosis', 'treatment'],
  all: ['research', 'science', 'technology', 'academic', 'study', 'analysis']
};

// Export the Together.ai client
export const togetherClient = togetherai({
  apiKey: process.env.TOGETHER_AI_API_KEY || '',
}); 