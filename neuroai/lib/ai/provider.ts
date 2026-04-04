// NeuroAI AI Provider Manager
// Handles fallback chain: DeepSeek → Groq → OpenRouter
// Never shows raw errors to users

import { AI_CONFIG, APP_CONFIG } from '@/lib/config';

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface AIRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  provider: 'deepseek' | 'groq' | 'openrouter';
  content: string;
  tokensUsed: number;
  finishReason: string;
  model: string;
}

export interface AIStreamResponse {
  provider: 'deepseek' | 'groq' | 'openrouter';
  stream: ReadableStream<Uint8Array>;
  model: string;
}

export interface AIProviderError {
  provider: string;
  error: string;
  statusCode?: number;
  retryable: boolean;
}

// ─── LOGGER ─────────────────────────────────────────────────────────────────

function logProviderAttempt(provider: string, action: string, details?: any) {
  const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] AI Provider: ${provider} - ${action}`;
  if (APP_CONFIG.logging.debug) {
    console.log(msg, details || '');
  }
}

function logProviderError(provider: string, error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] AI Provider Error: ${provider}`, {
    message: error.message,
    status: error.status || error.statusCode,
    code: error.code,
  });
}

// ─── DEEPSEEK CLIENT ─────────────────────────────────────────────────────────

async function callDeepSeek(request: AIRequest): Promise<AIResponse> {
  const { apiKey, baseUrl, model } = AI_CONFIG.deepseek;

  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  logProviderAttempt('DeepSeek', 'Initializing');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? AI_CONFIG.temperature,
        max_tokens: request.maxTokens ?? AI_CONFIG.maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `DeepSeek API error: ${response.status}`
      );
    }

    const data = await response.json();
    logProviderAttempt('DeepSeek', 'Success', {
      tokens: data.usage?.total_tokens,
    });

    return {
      provider: 'deepseek',
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      finishReason: data.choices[0]?.finish_reason || 'unknown',
      model,
    };
  } catch (error: any) {
    clearTimeout(timeout);
    logProviderError('DeepSeek', error);
    throw {
      provider: 'deepseek',
      error: error.message,
      statusCode: error.status,
      retryable: isRetryableError(error),
    } as AIProviderError;
  }
}

// ─── GROQ CLIENT ─────────────────────────────────────────────────────────────

async function callGroq(request: AIRequest): Promise<AIResponse> {
  const { apiKey, baseUrl, model } = AI_CONFIG.groq;

  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  logProviderAttempt('Groq', 'Initializing');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? AI_CONFIG.temperature,
        max_tokens: request.maxTokens ?? AI_CONFIG.maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `Groq API error: ${response.status}`
      );
    }

    const data = await response.json();
    logProviderAttempt('Groq', 'Success', {
      tokens: data.usage?.total_tokens,
    });

    return {
      provider: 'groq',
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      finishReason: data.choices[0]?.finish_reason || 'unknown',
      model,
    };
  } catch (error: any) {
    clearTimeout(timeout);
    logProviderError('Groq', error);
    throw {
      provider: 'groq',
      error: error.message,
      statusCode: error.status,
      retryable: isRetryableError(error),
    } as AIProviderError;
  }
}

// ─── OPENROUTER CLIENT ──────────────────────────────────────────────────────

async function callOpenRouter(request: AIRequest): Promise<AIResponse> {
  const { apiKey, baseUrl, models } = AI_CONFIG.openrouter;

  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  // Use first available model
  const model = models[0] || 'meta-llama/llama-3.1-70b-instruct:free';

  logProviderAttempt('OpenRouter', 'Initializing', { model });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': APP_CONFIG.appUrl,
        'X-Title': 'NeuroAI Research Platform',
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        temperature: request.temperature ?? AI_CONFIG.temperature,
        max_tokens: request.maxTokens ?? AI_CONFIG.maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `OpenRouter API error: ${response.status}`
      );
    }

    const data = await response.json();
    logProviderAttempt('OpenRouter', 'Success', {
      tokens: data.usage?.total_tokens,
      model,
    });

    return {
      provider: 'openrouter',
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      finishReason: data.choices[0]?.finish_reason || 'unknown',
      model,
    };
  } catch (error: any) {
    clearTimeout(timeout);
    logProviderError('OpenRouter', error);
    throw {
      provider: 'openrouter',
      error: error.message,
      statusCode: error.status,
      retryable: isRetryableError(error),
    } as AIProviderError;
  }
}

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

function isRetryableError(error: any): boolean {
  // Rate limit, timeout, or server errors are retryable
  const retryableCodes = [429, 502, 503, 504];
  const retryableMessages = ['timeout', 'ECONNRESET', 'ETIMEDOUT'];

  if (error.status && retryableCodes.includes(error.status)) {
    return true;
  }

  if (retryableMessages.some((msg) => error.message?.includes(msg))) {
    return true;
  }

  return false;
}

interface ProviderFn {
  name: string;
  fn: (req: AIRequest) => Promise<AIResponse>;
}

// ─── MAIN FALLBACK CHAIN ────────────────────────────────────────────────────

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const providers: ProviderFn[] = [
    { name: 'DeepSeek', fn: callDeepSeek },
    { name: 'Groq', fn: callGroq },
    { name: 'OpenRouter', fn: callOpenRouter },
  ];

  const errors: AIProviderError[] = [];

  for (const provider of providers) {
    try {
      logProviderAttempt(provider.name, 'Attempting...');
      const result = await provider.fn(request);
      return result;
    } catch (err: any) {
      const providerError = err as AIProviderError;
      errors.push(providerError);

      if (!providerError.retryable) {
        // Config error or invalid request - don't try other providers
        throw err;
      }

      // Try next provider
      logProviderAttempt(
        provider.name,
        'Failed, trying next...',
        providerError.error
      );
    }
  }

  // All providers failed - return friendly error
  console.error('All AI providers failed:', errors);

  throw new Error(
    'Our AI is taking a quick break. Please try again in 30 seconds.'
  );
}

// ─── STREAMING SUPPORT (Future) ─────────────────────────────────────────────

// For now, use regular call + stream the response character by character
// in the frontend using RequestAnimationFrame for smooth UX

export async function streamAI(request: AIRequest): Promise<AIStreamResponse> {
  // For MVP: just call the regular AI and stream response client-side
  // Future: implement provider-native streaming
  const result = await callAI(request);

  // Create a simple stream from the response
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(result.content));
      controller.close();
    },
  });

  return {
    provider: result.provider,
    stream,
    model: result.model,
  };
}

export default {
  callAI,
  streamAI,
};
