import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    data: {
      papers: [
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
        }
      ]
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'POST request received!',
      receivedData: body,
      timestamp: new Date().toISOString(),
      data: {
        papers: [
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
          }
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON in request body',
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  }
} 