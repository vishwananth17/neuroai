import axios, { type AxiosError } from 'axios';

export class AIUnavailableError extends Error {
  readonly code = 'AI_UNAVAILABLE' as const;
  constructor(message: string) {
    super(message);
    this.name = 'AIUnavailableError';
  }
}

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type CallAIOptions = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15_000;

type OpenAICompatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { total_tokens?: number };
};

async function postChatCompletions(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  options: CallAIOptions,
  extraHeaders?: Record<string, string>
): Promise<{ content: string; totalTokens: number; provider: string; model: string }> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const { data } = await axios.post<OpenAICompatResponse>(
    url,
    {
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.max_tokens ?? 2048,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      timeout: timeoutMs,
    }
  );
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  if (!content) {
    throw new Error('Empty completion');
  }
  return {
    content,
    totalTokens: data.usage?.total_tokens ?? 0,
    provider: baseUrl,
    model,
  };
}

async function callDeepSeek(
  messages: ChatMessage[],
  options: CallAIOptions
): Promise<{ content: string; totalTokens: number; provider: string; model: string }> {
  const key = process.env.DEEPSEEK_API_KEY || '';
  if (!key.startsWith('sk-') || key.length < 20) {
    throw new Error('DeepSeek API key not configured');
  }
  const model = options.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  return postChatCompletions('https://api.deepseek.com/v1', key, model, messages, options);
}

async function callGroq(
  messages: ChatMessage[],
  options: CallAIOptions
): Promise<{ content: string; totalTokens: number; provider: string; model: string }> {
  const key = process.env.GROQ_API_KEY || '';
  if (!key) {
    throw new Error('Groq API key not configured');
  }
  const model =
    options.model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  return postChatCompletions('https://api.groq.com/openai/v1', key, model, messages, options);
}

async function callOpenRouter(
  messages: ChatMessage[],
  options: CallAIOptions
): Promise<{ content: string; totalTokens: number; provider: string; model: string }> {
  const key = process.env.OPENROUTER_API_KEY || '';
  if (!key) {
    throw new Error('OpenRouter API key not configured');
  }
  const model =
    options.model ||
    process.env.OPENROUTER_MODEL ||
    'meta-llama/llama-3.1-70b-instruct';
  return postChatCompletions(
    'https://openrouter.ai/api/v1',
    key,
    model,
    messages,
    options,
    {
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://neuroai.local',
      'X-Title': 'NeuroAI',
    }
  );
}

function logFailure(provider: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`[NeuroAI AI] ${provider} failed:`, msg);
}

/**
 * DeepSeek → Groq → OpenRouter with a per-provider timeout (default 15s).
 */
export async function callAI(
  messages: ChatMessage[],
  options: CallAIOptions = {}
): Promise<{ content: string; totalTokens: number; modelUsed: string }> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const providers: Array<{
    name: string;
    fn: () => Promise<{ content: string; totalTokens: number; provider: string; model: string }>;
  }> = [
    { name: 'deepseek', fn: () => callDeepSeek(messages, { ...options, timeoutMs }) },
    { name: 'groq', fn: () => callGroq(messages, { ...options, timeoutMs }) },
    { name: 'openrouter', fn: () => callOpenRouter(messages, { ...options, timeoutMs }) },
  ];

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      console.info(`[NeuroAI AI] success: ${provider.name} (${result.model})`);
      return {
        content: result.content,
        totalTokens: result.totalTokens,
        modelUsed: result.model,
      };
    } catch (err) {
      logFailure(provider.name, err);
      const ax = err as AxiosError;
      if (ax.response?.status === 429) {
        continue;
      }
      continue;
    }
  }

  throw new AIUnavailableError(
    'Our AI is taking a quick break. Please try again in 30 seconds.'
  );
}
