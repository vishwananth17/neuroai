'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon, 
  DocumentTextIcon, 
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DeepSeekResponse {
  success: boolean;
  data?: {
    summary?: string;
    insights?: string;
    analysis?: string;
    code?: string;
    response?: string;
    model?: string;
    usage?: any;
    mode?: string;
  };
  error?: string;
}

export default function DeepSeekDemo() {
  const [activeTab, setActiveTab] = useState<'paper' | 'insights' | 'code' | 'chat'>('paper');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<DeepSeekResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (action: string) => {
    if (!input.trim()) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let requestBody: any = { action };

      switch (action) {
        case 'summarize-paper':
          requestBody.content = input;
          requestBody.options = { summary_type: 'detailed' };
          break;
        case 'generate-insights':
          // Parse papers from input (assuming JSON format)
          try {
            const papers = JSON.parse(input);
            requestBody.content = papers;
            requestBody.options = { insight_type: 'trends' };
          } catch {
            setError('Please provide papers in JSON format: [{"title": "...", "abstract": "...", "citations": 0}]');
            setLoading(false);
            return;
          }
          break;
        case 'analyze-code':
          requestBody.content = input;
          requestBody.options = { analysis_type: 'explanation' };
          break;
        case 'chat':
          requestBody.content = [{ role: 'user', content: input }];
          break;
      }

                    const response = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setResponse(result);
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'paper': return <DocumentTextIcon className="h-5 w-5" />;
      case 'insights': return <LightBulbIcon className="h-5 w-5" />;
      case 'code': return <CodeBracketIcon className="h-5 w-5" />;
      case 'chat': return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'paper': return 'Paper Summarization';
      case 'insights': return 'Research Insights';
      case 'code': return 'Code Analysis';
      case 'chat': return 'AI Chat';
      default: return 'Paper Summarization';
    }
  };

  const getPlaceholder = (tab: string) => {
    switch (tab) {
      case 'paper': return 'Paste your research paper content here...';
      case 'insights': return '[{"title": "Paper Title", "abstract": "Paper abstract...", "citations": 10}]';
      case 'code': return 'Paste your code here for analysis...';
      case 'chat': return 'Ask me anything about research, code, or AI...';
      default: return 'Enter content...';
    }
  };

  const getActionButton = (tab: string) => {
    switch (tab) {
      case 'paper': return 'summarize-paper';
      case 'insights': return 'generate-insights';
      case 'code': return 'analyze-code';
      case 'chat': return 'chat';
      default: return 'summarize-paper';
    }
  };

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
            🤖 DeepSeek AI Integration
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience advanced AI capabilities with DeepSeek models for research analysis, code generation, and intelligent insights
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {(['paper', 'insights', 'code', 'chat'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getTabIcon(tab)}
              <span>{getTabTitle(tab)}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {getTabTitle(activeTab)}
            </h3>
            <p className="text-gray-300 text-sm">
              {activeTab === 'paper' && 'Generate comprehensive summaries of research papers'}
              {activeTab === 'insights' && 'Identify trends and patterns across multiple research papers'}
              {activeTab === 'code' && 'Analyze code for explanations, optimizations, and improvements'}
              {activeTab === 'chat' && 'Have a conversation with AI about research, code, or any topic'}
            </p>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholder(activeTab)}
              className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-white focus:outline-none resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <motion.button
              onClick={() => handleSubmit(getActionButton(activeTab))}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <CodeBracketIcon className="h-5 w-5" />
                  </motion.div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {getTabIcon(activeTab)}
                  <span>Generate with DeepSeek</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-300">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Response Display */}
          {response && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {response.success ? (
                <>
                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">DeepSeek Response</span>
                    </div>
                                                              {response.data?.model && (
                       <p className="text-gray-400 text-sm mb-2">
                         Model: {response.data.model}
                         {response.data?.mode && (
                           <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                             {response.data.mode === 'together-ai-fallback' ? 'Together.ai' : 'DeepSeek'}
                           </span>
                         )}
                       </p>
                     )}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                      {response.data?.summary || 
                       response.data?.insights || 
                       response.data?.analysis || 
                       response.data?.code || 
                       response.data?.response || 
                       'No content received'}
                    </pre>
                  </div>

                  {response.data?.usage && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Usage Statistics</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Prompt Tokens:</span>
                          <div className="text-white">{response.data.usage.prompt_tokens}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Completion Tokens:</span>
                          <div className="text-white">{response.data.usage.completion_tokens}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Tokens:</span>
                          <div className="text-white">{response.data.usage.total_tokens}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-300">{response.error || 'An error occurred'}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Features Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <DocumentTextIcon className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Paper Summarization</h3>
            <p className="text-gray-300 text-sm">
              Generate comprehensive summaries of research papers with key findings and implications
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <LightBulbIcon className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Research Insights</h3>
            <p className="text-gray-300 text-sm">
              Identify trends, gaps, and opportunities across multiple research papers
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <CodeBracketIcon className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Code Analysis</h3>
            <p className="text-gray-300 text-sm">
              Analyze code for explanations, optimizations, debugging, and best practices
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Chat</h3>
            <p className="text-gray-300 text-sm">
              Have intelligent conversations about research, code, or any topic
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 