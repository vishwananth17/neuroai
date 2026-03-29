import { NextRequest, NextResponse } from 'next/server';
import { deepseekClient } from '@/lib/ai/deepseek-client';
import { ERROR_MESSAGES } from '@/lib/ai/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content, options = {} } = body;

    // Validate API key (now supports fallback to Together.ai)
    const isValidKey = await deepseekClient.validateApiKey();
    const currentMode = deepseekClient.getCurrentMode();
    
    if (!isValidKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API key validation failed. Please check your configuration.' 
        },
        { status: 401 }
      );
    }

    switch (action) {
      case 'summarize-paper':
        if (!content) {
          return NextResponse.json(
            { success: false, error: 'Paper content is required' },
            { status: 400 }
          );
        }
        
        const summaryResponse = await deepseekClient.summarizePaper(content, {
          summary_type: options.summary_type || 'detailed',
          model: options.model,
        });
        
         return NextResponse.json({
           success: true,
           data: {
             summary: summaryResponse.choices[0].message.content,
             model: summaryResponse.model,
             usage: summaryResponse.usage,
             mode: currentMode,
           }
         });

      case 'generate-insights':
        if (!content || !Array.isArray(content)) {
          return NextResponse.json(
            { success: false, error: 'Papers array is required' },
            { status: 400 }
          );
        }
        
        const insightsResponse = await deepseekClient.generateInsights(content, {
          insight_type: options.insight_type || 'trends',
          model: options.model,
        });
        
        return NextResponse.json({
          success: true,
          data: {
            insights: insightsResponse.choices[0].message.content,
            model: insightsResponse.model,
            usage: insightsResponse.usage,
          }
        });

      case 'analyze-code':
        if (!content) {
          return NextResponse.json(
            { success: false, error: 'Code content is required' },
            { status: 400 }
          );
        }
        
        const codeAnalysisResponse = await deepseekClient.analyzeCode(content, {
          analysis_type: options.analysis_type || 'explanation',
          model: options.model,
        });
        
        return NextResponse.json({
          success: true,
          data: {
            analysis: codeAnalysisResponse.choices[0].message.content,
            model: codeAnalysisResponse.model,
            usage: codeAnalysisResponse.usage,
          }
        });

      case 'generate-code':
        if (!content) {
          return NextResponse.json(
            { success: false, error: 'Code prompt is required' },
            { status: 400 }
          );
        }
        
        const codeResponse = await deepseekClient.generateCode(content, {
          language: options.language,
          model: options.model,
          temperature: options.temperature,
        });
        
        return NextResponse.json({
          success: true,
          data: {
            code: codeResponse.choices[0].message.content,
            model: codeResponse.model,
            usage: codeResponse.usage,
          }
        });

      case 'chat':
        if (!content || !Array.isArray(content)) {
          return NextResponse.json(
            { success: false, error: 'Messages array is required' },
            { status: 400 }
          );
        }
        
        const chatResponse = await deepseekClient.generateText(content, {
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
        });
        
        return NextResponse.json({
          success: true,
          data: {
            response: chatResponse.choices[0].message.content,
            model: chatResponse.model,
            usage: chatResponse.usage,
          }
        });

      case 'validate-key':
        return NextResponse.json({
          success: true,
          data: { valid: isValidKey }
        });

      case 'get-models':
        const models = deepseekClient.getAvailableModels();
        return NextResponse.json({
          success: true,
          data: { models }
        });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            availableActions: [
              'summarize-paper',
              'generate-insights', 
              'analyze-code',
              'generate-code',
              'chat',
              'validate-key',
              'get-models'
            ]
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: ERROR_MESSAGES.DEEPSEEK_ERROR,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'validate-key') {
      const isValidKey = await deepseekClient.validateApiKey();
      return NextResponse.json({
        success: true,
        data: { valid: isValidKey }
      });
    }

    if (action === 'get-models') {
      const models = deepseekClient.getAvailableModels();
      return NextResponse.json({
        success: true,
        data: { models }
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid action',
        availableActions: ['validate-key', 'get-models']
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('DeepSeek API GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: ERROR_MESSAGES.DEEPSEEK_ERROR,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 