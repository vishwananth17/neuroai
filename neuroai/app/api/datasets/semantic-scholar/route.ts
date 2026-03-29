import { NextRequest, NextResponse } from 'next/server';
import { semanticScholarDatasets } from '@/lib/ai/semantic-scholar-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const releaseId = searchParams.get('releaseId');
    const datasetName = searchParams.get('datasetName');
    const startRelease = searchParams.get('startRelease');
    const endRelease = searchParams.get('endRelease');

    switch (action) {
      case 'latest-release':
        const latestRelease = await semanticScholarDatasets.getLatestRelease();
        return NextResponse.json({ success: true, data: latestRelease });

      case 'dataset-metadata':
        if (!releaseId || !datasetName) {
          return NextResponse.json(
            { success: false, error: 'Missing releaseId or datasetName parameter' },
            { status: 400 }
          );
        }
        const metadata = await semanticScholarDatasets.getDatasetMetadata(releaseId, datasetName);
        return NextResponse.json({ success: true, data: metadata });

      case 'incremental-updates':
        if (!datasetName || !startRelease || !endRelease) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameters for incremental updates' },
            { status: 400 }
          );
        }
        const updates = await semanticScholarDatasets.getIncrementalUpdates(
          datasetName,
          startRelease,
          endRelease
        );
        return NextResponse.json({ success: true, data: updates });

      case 'available-datasets':
        if (!releaseId) {
          return NextResponse.json(
            { success: false, error: 'Missing releaseId parameter' },
            { status: 400 }
          );
        }
        const datasets = await semanticScholarDatasets.getAvailableDatasets(releaseId);
        return NextResponse.json({ success: true, data: datasets });

      case 'papers-dataset':
        if (!releaseId) {
          return NextResponse.json(
            { success: false, error: 'Missing releaseId parameter' },
            { status: 400 }
          );
        }
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
        const venue = searchParams.get('venue') || undefined;
        const fields = searchParams.get('fields')?.split(',') || undefined;
        
        const papers = await semanticScholarDatasets.getPapersDataset(releaseId, {
          year,
          venue,
          fields,
        });
        return NextResponse.json({ success: true, data: papers });

      case 'abstracts-dataset':
        if (!releaseId) {
          return NextResponse.json(
            { success: false, error: 'Missing releaseId parameter' },
            { status: 400 }
          );
        }
        const abstracts = await semanticScholarDatasets.getAbstractsDataset(releaseId);
        return NextResponse.json({ success: true, data: abstracts });

      case 'check-updates':
        if (!datasetName || !startRelease) {
          return NextResponse.json(
            { success: false, error: 'Missing datasetName or startRelease parameter' },
            { status: 400 }
          );
        }
        const updateStatus = await semanticScholarDatasets.checkForUpdates(datasetName, startRelease);
        return NextResponse.json({ success: true, data: updateStatus });

      case 'dataset-stats':
        if (!releaseId || !datasetName) {
          return NextResponse.json(
            { success: false, error: 'Missing releaseId or datasetName parameter' },
            { status: 400 }
          );
        }
        const stats = await semanticScholarDatasets.getDatasetStats(releaseId, datasetName);
        return NextResponse.json({ success: true, data: stats });

      case 'process-updates':
        if (!datasetName || !startRelease || !endRelease) {
          return NextResponse.json(
            { success: false, error: 'Missing required parameters for processing updates' },
            { status: 400 }
          );
        }
        const maxFiles = searchParams.get('maxFiles') ? parseInt(searchParams.get('maxFiles')!) : undefined;
        const filterByYear = searchParams.get('filterByYear') ? parseInt(searchParams.get('filterByYear')!) : undefined;
        const filterByVenue = searchParams.get('filterByVenue') || undefined;
        
        const processingResult = await semanticScholarDatasets.processIncrementalUpdates(
          datasetName,
          startRelease,
          endRelease,
          {
            maxFiles,
            filterByYear,
            filterByVenue
          }
        );
        return NextResponse.json({ success: true, data: processingResult });

      case 'cache-stats':
        const cacheStats = semanticScholarDatasets.getCacheStats();
        return NextResponse.json({ success: true, data: cacheStats });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action parameter',
            availableActions: [
              'latest-release',
              'dataset-metadata',
              'incremental-updates',
              'available-datasets',
              'papers-dataset',
              'abstracts-dataset',
              'check-updates',
              'dataset-stats',
              'process-updates',
              'cache-stats'
            ]
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Semantic Scholar Datasets API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'download-dataset':
        const { fileUrl } = params;
        if (!fileUrl) {
          return NextResponse.json(
            { success: false, error: 'Missing fileUrl parameter' },
            { status: 400 }
          );
        }
        
        // Note: This is a placeholder. In a real implementation, you would:
        // 1. Download the file
        // 2. Process it (parse JSON, extract relevant data)
        // 3. Store it in a database or cache
        // 4. Return processed results
        
        return NextResponse.json({
          success: true,
          message: 'Download initiated (placeholder implementation)',
          fileUrl,
          note: 'Full implementation would download and process the dataset file'
        });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action parameter',
            availableActions: ['download-dataset']
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Semantic Scholar Datasets POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 