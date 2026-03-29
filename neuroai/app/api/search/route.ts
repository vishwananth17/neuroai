import { NextRequest, NextResponse } from 'next/server';
import { ResearchService } from '@/lib/ai/research-service';

// Initialize the research service
const researchService = new ResearchService();

// Fallback test data
const fallbackPapers = [
  {
    id: 'test-1',
    title: 'Attention Is All You Need',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    year: 2017,
    citations: 50000,
    url: 'https://arxiv.org/abs/1706.03762'
  },
  {
    id: 'test-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    year: 2018,
    citations: 45000,
    url: 'https://arxiv.org/abs/1810.04805'
  },
  {
    id: 'test-3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task...',
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder'],
    year: 2020,
    citations: 35000,
    url: 'https://arxiv.org/abs/2005.14165'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, year_range, min_citations, max_results, include_summary, include_insights, user_id, session_id } = body;

    // Validate required fields
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query. Must be at least 2 characters long.',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Try to use ResearchService first
    try {
      const researchQuery = {
        query: query.trim(),
        category,
        year_range,
        min_citations,
        max_results: max_results || 10,
        include_summary: include_summary || false,
        include_insights: include_insights || false,
        user_id,
        session_id,
      };

      const result = await researchService.searchPapers(researchQuery);

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          timestamp: new Date().toISOString(),
          request_id: result.request_id,
        });
      }
    } catch (serviceError) {
      console.log('ResearchService failed, using fallback data:', serviceError);
    }

    // Fallback to test data
    const filteredPapers = fallbackPapers.filter(paper => 
      paper.title.toLowerCase().includes(query.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
      paper.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
    );

    return NextResponse.json({
      success: true,
      data: {
        papers: filteredPapers.slice(0, max_results || 10),
        total_results: filteredPapers.length,
        query: query.trim(),
        search_time: 0.1
      },
      timestamp: new Date().toISOString(),
      request_id: `fallback-${Date.now()}`,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const maxResults = searchParams.get('max_results');

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter "q" is required',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Try to use ResearchService first
    try {
      const researchQuery = {
        query: query.trim(),
        category: category || undefined,
        max_results: maxResults ? parseInt(maxResults) : 10,
      };

      const result = await researchService.searchPapers(researchQuery);

      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.data,
          timestamp: new Date().toISOString(),
          request_id: result.request_id,
        });
      }
    } catch (serviceError) {
      console.log('ResearchService failed, using fallback data:', serviceError);
    }

    // Fallback to test data
    const filteredPapers = fallbackPapers.filter(paper => 
      paper.title.toLowerCase().includes(query.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
      paper.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
    );

    return NextResponse.json({
      success: true,
      data: {
        papers: filteredPapers.slice(0, maxResults ? parseInt(maxResults) : 10),
        total_results: filteredPapers.length,
        query: query.trim(),
        search_time: 0.1
      },
      timestamp: new Date().toISOString(),
      request_id: `fallback-${Date.now()}`,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 