import axios from 'axios';

export interface SemanticScholarDataset {
  name: string;
  description: string;
  README: string;
  files: string[];
}

export interface DatasetDiff {
  from_release: string;
  to_release: string;
  update_files: string[];
  delete_files: string[];
}

export interface DatasetDiffList {
  dataset: string;
  start_release: string;
  end_release: string;
  diffs: DatasetDiff[];
}

export interface ReleaseMetadata {
  release_id: string;
  README: string;
  datasets: SemanticScholarDataset[];
}

export interface DatasetProcessingOptions {
  maxFiles?: number;
  filterByYear?: number;
  filterByVenue?: string;
  includeAbstracts?: boolean;
  includeCitations?: boolean;
}

export class SemanticScholarDatasetsClient {
  private baseUrl = 'https://api.semanticscholar.org/datasets/v1';
  private apiKey: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SEMANTIC_SCHOLAR_API_KEY || '';
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey && !this.apiKey.includes('your_')) {
      headers['x-api-key'] = this.apiKey;
    }
    
    return headers;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get the latest release metadata
   */
  async getLatestRelease(): Promise<ReleaseMetadata> {
    const cacheKey = 'latest-release';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Use mock data if API key is not configured to avoid breaking the UI
    if (!this.apiKey || this.apiKey.includes('your_')) {
        const mockData = {
            release_id: 'release-2023-12-05',
            README: 'Semantic Scholar Open Research Corpus. (Note: Using mock data because API key is not configured in .env.local). Features robust academic data for papers, authors, citations, and more.',
            datasets: [
                { name: 'papers', description: 'Metadata for all papers, including titles, authors, and year.', README: '', files: ['papers-v1.jsonl.gz', 'papers-v2.jsonl.gz'] },
                { name: 'abstracts', description: 'Paper abstracts and summaries.', README: '', files: ['abstracts-v1.jsonl.gz'] },
                { name: 'authors', description: 'Author metadata and publication history.', README: '', files: ['authors-v1.jsonl.gz'] }
            ]
        };
        this.setCachedData(cacheKey, mockData);
        return mockData;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/release/latest`, {
        headers: this.getHeaders(),
      });
      
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest release:', error);
      throw new Error('Failed to fetch latest release metadata');
    }
  }

  /**
   * Get dataset metadata for a specific release
   */
  async getDatasetMetadata(releaseId: string, datasetName: string): Promise<SemanticScholarDataset> {
    const cacheKey = `dataset-${releaseId}-${datasetName}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(
        `${this.baseUrl}/release/${releaseId}/dataset/${datasetName}`,
        { headers: this.getHeaders() }
      );
      
      this.setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${datasetName}:`, error);
      throw new Error(`Failed to fetch dataset ${datasetName}`);
    }
  }

  /**
   * Get incremental updates between two releases
   */
  async getIncrementalUpdates(
    datasetName: string,
    startRelease: string,
    endRelease: string
  ): Promise<DatasetDiffList> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/release/${endRelease}/dataset/${datasetName}/diff`,
        {
          headers: this.getHeaders(),
          params: {
            start_release: startRelease,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching incremental updates:', error);
      throw new Error('Failed to fetch incremental updates');
    }
  }

  /**
   * Download dataset file with progress tracking
   */
  async downloadDatasetFile(fileUrl: string, onProgress?: (progress: number) => void): Promise<any> {
    try {
      const response = await axios.get(fileUrl, {
        headers: this.getHeaders(),
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading dataset file:', error);
      throw new Error('Failed to download dataset file');
    }
  }

  /**
   * Get available datasets for a release
   */
  async getAvailableDatasets(releaseId: string): Promise<string[]> {
    try {
      const release = await this.getLatestRelease();
      return release.datasets.map(dataset => dataset.name);
    } catch (error) {
      console.error('Error fetching available datasets:', error);
      throw new Error('Failed to fetch available datasets');
    }
  }

  /**
   * Get papers dataset with filtering options
   */
  async getPapersDataset(
    releaseId: string,
    filters?: {
      year?: number;
      venue?: string;
      fields?: string[];
    }
  ): Promise<any[]> {
    try {
      const dataset = await this.getDatasetMetadata(releaseId, 'papers');
      
      // For now, return the dataset metadata
      // In a full implementation, you would download and parse the actual files
      return [{
        dataset_info: dataset,
        filters_applied: filters,
        note: 'This is a placeholder. Full implementation would download and parse the actual dataset files.',
        estimated_records: '200M+ papers',
        file_size: '~30GB compressed'
      }];
    } catch (error) {
      console.error('Error fetching papers dataset:', error);
      throw new Error('Failed to fetch papers dataset');
    }
  }

  /**
   * Get abstracts dataset
   */
  async getAbstractsDataset(releaseId: string): Promise<any[]> {
    try {
      const dataset = await this.getDatasetMetadata(releaseId, 'abstracts');
      
      return [{
        dataset_info: dataset,
        note: 'This is a placeholder. Full implementation would download and parse the actual dataset files.',
        estimated_records: '100M+ abstracts',
        file_size: '~1.8GB compressed'
      }];
    } catch (error) {
      console.error('Error fetching abstracts dataset:', error);
      throw new Error('Failed to fetch abstracts dataset');
    }
  }

  /**
   * Check if incremental updates are available
   */
  async checkForUpdates(
    datasetName: string,
    currentRelease: string
  ): Promise<{ hasUpdates: boolean; latestRelease?: string; updateCount?: number }> {
    try {
      const latestRelease = await this.getLatestRelease();
      const hasUpdates = latestRelease.release_id !== currentRelease;
      
      let updateCount = 0;
      if (hasUpdates) {
        try {
          const updates = await this.getIncrementalUpdates(
            datasetName,
            currentRelease,
            latestRelease.release_id
          );
          updateCount = updates.diffs.reduce((total, diff) => 
            total + diff.update_files.length + diff.delete_files.length, 0
          );
        } catch (error) {
          console.warn('Could not fetch update count:', error);
        }
      }
      
      return {
        hasUpdates,
        latestRelease: hasUpdates ? latestRelease.release_id : undefined,
        updateCount: hasUpdates ? updateCount : undefined,
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { hasUpdates: false };
    }
  }

  /**
   * Get dataset statistics
   */
  async getDatasetStats(releaseId: string, datasetName: string): Promise<{
    totalFiles: number;
    totalSize: string;
    lastUpdated: string;
    recordCount?: string;
  }> {
    try {
      const dataset = await this.getDatasetMetadata(releaseId, datasetName);
      
      // Estimate file sizes based on dataset type
      const sizeEstimates: Record<string, string> = {
        papers: '~30GB',
        abstracts: '~1.8GB',
        authors: '~500MB',
        venues: '~50MB',
        citations: '~5GB'
      };

      return {
        totalFiles: dataset.files.length,
        totalSize: sizeEstimates[datasetName] || 'Unknown',
        lastUpdated: releaseId,
        recordCount: this.getEstimatedRecordCount(datasetName)
      };
    } catch (error) {
      console.error('Error fetching dataset stats:', error);
      throw new Error('Failed to fetch dataset statistics');
    }
  }

  /**
   * Get estimated record count for dataset
   */
  private getEstimatedRecordCount(datasetName: string): string {
    const estimates: Record<string, string> = {
      papers: '200M+',
      abstracts: '100M+',
      authors: '50M+',
      venues: '100K+',
      citations: '1B+'
    };
    return estimates[datasetName] || 'Unknown';
  }

  /**
   * Process incremental updates with custom logic
   */
  async processIncrementalUpdates(
    datasetName: string,
    startRelease: string,
    endRelease: string,
    options: DatasetProcessingOptions = {}
  ): Promise<{
    processedFiles: number;
    totalUpdates: number;
    totalDeletes: number;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const updates = await this.getIncrementalUpdates(datasetName, startRelease, endRelease);
      
      let processedFiles = 0;
      let totalUpdates = 0;
      let totalDeletes = 0;

      for (const diff of updates.diffs) {
        totalUpdates += diff.update_files.length;
        totalDeletes += diff.delete_files.length;
        
        // Process update files (limited by maxFiles option)
        const filesToProcess = options.maxFiles 
          ? diff.update_files.slice(0, options.maxFiles)
          : diff.update_files;
          
        for (const fileUrl of filesToProcess) {
          try {
            // In a real implementation, you would:
            // 1. Download the file
            // 2. Parse the JSON/JSONL content
            // 3. Apply filters (year, venue, etc.)
            // 4. Store in database or process further
            console.log(`Processing file: ${fileUrl}`);
            processedFiles++;
          } catch (error) {
            console.error(`Error processing file ${fileUrl}:`, error);
          }
        }
      }

      const processingTime = Date.now() - startTime;

      return {
        processedFiles,
        totalUpdates,
        totalDeletes,
        processingTime
      };
    } catch (error) {
      console.error('Error processing incremental updates:', error);
      throw new Error('Failed to process incremental updates');
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export a singleton instance
export const semanticScholarDatasets = new SemanticScholarDatasetsClient(); 