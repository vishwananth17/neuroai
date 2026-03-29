import { NextRequest, NextResponse } from 'next/server';
import { ResearchService } from '@/lib/ai/research-service';

// Initialize the research service
const researchService = new ResearchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    // Get trending papers using AI agents
    const result = await researchService.getTrendingPapers(
      category || undefined,
      limit ? parseInt(limit) : 10
    );

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
      request_id: result.request_id,
    });

  } catch (error) {
    console.error('Trending papers API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 