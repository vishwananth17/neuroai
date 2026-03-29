import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content } = body;

    // Simulate DeepSeek API responses
    const mockResponses = {
      'summarize-paper': {
        summary: 'This is a comprehensive summary of the research paper. The study demonstrates significant findings in the field of artificial intelligence and neural networks. Key contributions include novel architecture design and improved performance metrics.',
        model: 'deepseek-ai/deepseek-llm-67b-chat',
        usage: {
          prompt_tokens: 150,
          completion_tokens: 200,
          total_tokens: 350
        },
        mode: 'deepseek'
      },
      'generate-insights': {
        insights: 'Analysis of the provided research papers reveals several emerging trends in the field. Key patterns include increased focus on transformer architectures, growing interest in multimodal learning, and significant advances in efficiency optimization.',
        model: 'deepseek-ai/deepseek-llm-67b-chat',
        usage: {
          prompt_tokens: 200,
          completion_tokens: 300,
          total_tokens: 500
        },
        mode: 'deepseek'
      },
      'analyze-code': {
        analysis: 'This code implements a recursive Fibonacci function. While functional, it has exponential time complexity O(2^n) which makes it inefficient for large values. Consider using dynamic programming or iterative approaches for better performance.',
        model: 'deepseek-ai/deepseek-coder-33b-instruct',
        usage: {
          prompt_tokens: 100,
          completion_tokens: 150,
          total_tokens: 250
        },
        mode: 'deepseek'
      },
      'chat': {
        response: 'I\'d be happy to help you with your research questions! Based on the current state of AI and machine learning, there are several exciting developments happening in transformer architectures, multimodal learning, and efficiency optimization.',
        model: 'deepseek-ai/deepseek-llm-67b-chat',
        usage: {
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150
        },
        mode: 'deepseek'
      }
    };

    const response = mockResponses[action as keyof typeof mockResponses];
    
    if (!response) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action specified'
      }, { status: 400 });
    }

    // Add a small delay to simulate real API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 