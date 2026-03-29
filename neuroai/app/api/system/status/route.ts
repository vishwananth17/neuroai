import { NextRequest, NextResponse } from 'next/server';
import { ResearchService } from '@/lib/ai/research-service';

// Initialize the research service
const researchService = new ResearchService();

export async function GET(request: NextRequest) {
  try {
    // Get system status and metrics
    const result = researchService.getSystemStatus();

    return NextResponse.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
      request_id: result.request_id,
    });

  } catch (error) {
    console.error('System status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 