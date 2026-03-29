'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ArrowDownTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DatasetInfo {
  name: string;
  description: string;
  README: string;
  files: string[];
}

interface ReleaseInfo {
  release_id: string;
  README: string;
  datasets: DatasetInfo[];
}

export default function SemanticScholarDatasets() {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState<any>(null);
  const [datasetStats, setDatasetStats] = useState<any>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);

  useEffect(() => {
    fetchLatestRelease();
  }, []);

  const fetchLatestRelease = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/datasets/semantic-scholar?action=latest-release');
      const result = await response.json();
      
      if (result.success && result.data) {
        setReleaseInfo(result.data);
        if (result.data.datasets && result.data.datasets.length > 0) {
          setSelectedDataset(result.data.datasets[0].name);
        }
      } else {
        setError(result.error || 'Failed to fetch release information');
      }
    } catch (err) {
      setError('Network error while fetching release information');
    } finally {
      setLoading(false);
    }
  };

  const checkForUpdates = async () => {
    if (!selectedDataset || !releaseInfo) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/datasets/semantic-scholar?action=check-updates&datasetName=${selectedDataset}&startRelease=${releaseInfo.release_id}`
      );
      const result = await response.json();
      
      if (result.success) {
        setUpdateStatus(result.data);
      } else {
        setError(result.error || 'Failed to check for updates');
      }
    } catch (err) {
      setError('Network error while checking for updates');
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasetStats = async () => {
    if (!selectedDataset || !releaseInfo) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/datasets/semantic-scholar?action=dataset-stats&releaseId=${releaseInfo.release_id}&datasetName=${selectedDataset}`
      );
      const result = await response.json();
      
      if (result.success) {
        setDatasetStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch dataset stats');
      }
    } catch (err) {
      setError('Network error while fetching dataset stats');
    } finally {
      setLoading(false);
    }
  };

  const processUpdates = async () => {
    if (!selectedDataset || !releaseInfo || !updateStatus?.latestRelease) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/datasets/semantic-scholar?action=process-updates&datasetName=${selectedDataset}&startRelease=${releaseInfo.release_id}&endRelease=${updateStatus.latestRelease}&maxFiles=5`
      );
      const result = await response.json();
      
      if (result.success) {
        setProcessingResult(result.data);
      } else {
        setError(result.error || 'Failed to process updates');
      }
    } catch (err) {
      setError('Network error while processing updates');
    } finally {
      setLoading(false);
    }
  };

  const getDatasetIcon = (datasetName: string) => {
    switch (datasetName.toLowerCase()) {
      case 'papers':
        return '📄';
      case 'abstracts':
        return '📝';
      case 'authors':
        return '👥';
      case 'venues':
        return '🏛️';
      case 'citations':
        return '🔗';
      default:
        return '📊';
    }
  };

  if (loading && !releaseInfo) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-gray-300 mt-4">Loading Semantic Scholar datasets...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            📚 Semantic Scholar Datasets
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Access to comprehensive academic datasets including papers, abstracts, and incremental updates
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-900/20 border border-red-700 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-300">{error}</span>
            </div>
          </motion.div>
        )}

        {releaseInfo && releaseInfo.datasets ? (
          <div className="space-y-8">
            {/* Release Information */}
            <motion.div
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-white mr-2" />
                  <h3 className="text-xl font-semibold text-white">Release Information</h3>
                </div>
                <span className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
                  {releaseInfo.release_id || 'Unknown Release'}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {releaseInfo.README?.substring(0, 200) || 'No description available'}...
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  {releaseInfo.datasets?.length || 0} datasets available
                </span>
                <motion.button
                  onClick={fetchLatestRelease}
                  disabled={loading}
                  className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </motion.button>
              </div>
            </motion.div>

            {/* Dataset Selection */}
            <motion.div
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Available Datasets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {releaseInfo.datasets?.map((dataset, index) => (
                  <motion.div
                    key={dataset.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDataset === dataset.name
                        ? 'bg-white text-black border-white'
                        : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDataset(dataset.name)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{getDatasetIcon(dataset.name || 'unknown')}</span>
                      <h4 className="font-semibold">{dataset.name || 'Unknown Dataset'}</h4>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2">
                      {dataset.description || 'No description available'}
                    </p>
                    <div className="mt-2 text-xs opacity-60">
                      {dataset.files?.length || 0} file{(dataset.files?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                )) || (
                  <div className="col-span-full p-8 text-center">
                    <p className="text-gray-400">No datasets available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Selected Dataset Details */}
            {selectedDataset && releaseInfo && (
              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-semibold text-white">
                     {getDatasetIcon(selectedDataset)} {selectedDataset} Dataset
                   </h3>
                   <div className="flex space-x-2">
                     <motion.button
                       onClick={fetchDatasetStats}
                       disabled={loading}
                       className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       {loading ? 'Loading...' : 'Get Stats'}
                     </motion.button>
                     <motion.button
                       onClick={checkForUpdates}
                       disabled={loading}
                       className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       {loading ? 'Checking...' : 'Check Updates'}
                     </motion.button>
                   </div>
                 </div>

                                 {updateStatus && (
                   <motion.div
                     className="mb-4 p-4 rounded-lg border"
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     style={{
                       backgroundColor: updateStatus.hasUpdates ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                       borderColor: updateStatus.hasUpdates ? 'rgb(34, 197, 94)' : 'rgb(107, 114, 128)'
                     }}
                   >
                     <div className="flex items-center justify-between">
                       <div className="flex items-center">
                         {updateStatus.hasUpdates ? (
                           <>
                             <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                             <span className="text-green-300">
                               Updates available! Latest release: {updateStatus.latestRelease}
                               {updateStatus.updateCount && ` (${updateStatus.updateCount} files)`}
                             </span>
                           </>
                         ) : (
                           <>
                             <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                             <span className="text-gray-300">
                               No updates available. You have the latest version.
                             </span>
                           </>
                         )}
                       </div>
                       {updateStatus.hasUpdates && (
                         <motion.button
                           onClick={processUpdates}
                           disabled={loading}
                           className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                         >
                           Process Updates
                         </motion.button>
                       )}
                     </div>
                   </motion.div>
                 )}

                 {datasetStats && (
                   <motion.div
                     className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg"
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                   >
                     <h4 className="text-white font-medium mb-2">Dataset Statistics</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                       <div>
                         <span className="text-gray-400">Files:</span>
                         <div className="text-white font-semibold">{datasetStats.totalFiles}</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Size:</span>
                         <div className="text-white font-semibold">{datasetStats.totalSize}</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Records:</span>
                         <div className="text-white font-semibold">{datasetStats.recordCount}</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Updated:</span>
                         <div className="text-white font-semibold">{datasetStats.lastUpdated}</div>
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {processingResult && (
                   <motion.div
                     className="mb-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg"
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                   >
                     <h4 className="text-white font-medium mb-2">Processing Results</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                       <div>
                         <span className="text-gray-400">Processed:</span>
                         <div className="text-white font-semibold">{processingResult.processedFiles} files</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Updates:</span>
                         <div className="text-white font-semibold">{processingResult.totalUpdates}</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Deletes:</span>
                         <div className="text-white font-semibold">{processingResult.totalDeletes}</div>
                       </div>
                       <div>
                         <span className="text-gray-400">Time:</span>
                         <div className="text-white font-semibold">{processingResult.processingTime}ms</div>
                       </div>
                     </div>
                   </motion.div>
                 )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Dataset Files</h4>
                    <div className="space-y-2">
                      {releaseInfo.datasets
                        ?.find(d => d.name === selectedDataset)
                        ?.files?.slice(0, 3)
                        ?.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                              <ArrowDownTrayIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-300 text-sm truncate">
                                {file.split('/').pop() || file}
                              </span>
                            </div>
                            <span className="text-gray-400 text-xs">Pre-signed URL</span>
                          </div>
                        )) || (
                          <div className="p-3 bg-gray-700 rounded-lg text-gray-400 text-sm">
                            No files available for this dataset
                          </div>
                        )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">API Integration</h4>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        GET /api/datasets/semantic-scholar?action=dataset-metadata&releaseId={releaseInfo.release_id || 'latest'}&datasetName={selectedDataset}
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400">No release information available</p>
          </motion.div>
        )}
      </div>
    </section>
  );
} 