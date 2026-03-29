import { NextRequest, NextResponse } from 'next/server';
import { ResearchService } from '@/lib/ai/research-service';

// Initialize the research service
const researchService = new ResearchService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const includeSummary = searchParams.get('summary') !== 'false';
    const includeInsights = searchParams.get('insights') !== 'false';

    const paperId = id;

    if (!paperId) {
      return NextResponse.json({
        success: false,
        error: 'Paper ID is required',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Get paper details with AI-generated content
    const result = await researchService.getPaperDetails(
      paperId,
      includeSummary,
      includeInsights
    );

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
      request_id: result.request_id,
    });

  } catch (error) {
    console.error('Paper details API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 