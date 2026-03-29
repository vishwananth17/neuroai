// Core Research Types
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  citations: number;
  category: string;
  source: 'arxiv' | 'semantic-scholar' | 'manual';
  url?: string;
  doi?: string;
  keywords: string[];
  relevance_score?: number;
  summary?: string;
  insights?: string[];
  methodology?: string;
  results?: string;
  limitations?: string;
  future_work?: string;
}

export interface ResearchQuery {
  query: string;
  category?: string;
  year_range?: [number, number];
  min_citations?: number;
  max_results?: number;
  include_summary?: boolean;
  include_insights?: boolean;
  user_id?: string;
  session_id?: string;
}

export interface ResearchResult {
  papers: ResearchPaper[];
  total_found: number;
  query_time: number;
  suggestions: string[];
  related_topics: string[];
  quality_metrics: QualityMetrics;
}

export interface QualityMetrics {
  average_citations: number;
  average_year: number;
  relevance_score: number;
  diversity_score: number;
  novelty_score: number;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: AgentCapability[];
  model: string;
  is_active: boolean;
  performance_metrics: PerformanceMetrics;
}

export type AgentRole = 
  | 'research_analyst'
  | 'paper_summarizer'
  | 'insight_generator'
  | 'trend_analyzer'
  | 'quality_assessor'
  | 'recommendation_engine';

export type AgentCapability = 
  | 'text_generation'
  | 'text_analysis'
  | 'semantic_search'
  | 'trend_detection'
  | 'quality_assessment'
  | 'recommendation'
  | 'image_generation';

export interface PerformanceMetrics {
  total_requests: number;
  success_rate: number;
  average_response_time: number;
  error_rate: number;
  last_updated: Date;
}

// Research Session Types
export interface ResearchSession {
  id: string;
  user_id?: string;
  queries: ResearchQuery[];
  results: ResearchResult[];
  papers_saved: string[];
  insights_generated: Insight[];
  created_at: Date;
  updated_at: Date;
  duration: number;
}

export interface Insight {
  id: string;
  type: InsightType;
  content: string;
  confidence: number;
  related_papers: string[];
  generated_by: string;
  created_at: Date;
}

export type InsightType = 
  | 'trend'
  | 'gap'
  | 'methodology'
  | 'application'
  | 'limitation'
  | 'future_direction';

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  request_id: string;
}

export interface SearchAPIResponse {
  papers: ResearchPaper[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// Agent Task Types
export interface AgentTask {
  id: string;
  agent_id: string;
  type: TaskType;
  input: any;
  output?: any;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;
  error?: string;
}

export type TaskType = 
  | 'search_papers'
  | 'summarize_paper'
  | 'generate_insights'
  | 'analyze_trends'
  | 'assess_quality'
  | 'generate_recommendations'
  | 'create_visualization';

export type TaskStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type TaskPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

// User and Session Types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  research_history: string[];
  created_at: Date;
  last_active: Date;
}

export interface UserPreferences {
  default_categories: string[];
  preferred_sources: string[];
  summary_length: 'short' | 'medium' | 'long';
  include_insights: boolean;
  notification_settings: NotificationSettings;
}

export interface NotificationSettings {
  email_notifications: boolean;
  new_papers: boolean;
  trending_topics: boolean;
  weekly_digest: boolean;
}

// Analytics and Metrics Types
export interface AnalyticsData {
  total_searches: number;
  papers_viewed: number;
  insights_generated: number;
  user_sessions: number;
  popular_topics: TopicMetric[];
  search_trends: SearchTrend[];
  performance_metrics: SystemPerformance;
}

export interface TopicMetric {
  topic: string;
  search_count: number;
  view_count: number;
  trend_direction: 'up' | 'down' | 'stable';
}

export interface SearchTrend {
  date: Date;
  search_count: number;
  unique_users: number;
  average_session_duration: number;
}

export interface SystemPerformance {
  average_response_time: number;
  uptime_percentage: number;
  error_rate: number;
  active_users: number;
  api_usage: APIUsageMetrics;
}

export interface APIUsageMetrics {
  together_ai: UsageMetric;
  arxiv: UsageMetric;
  semantic_scholar: UsageMetric;
}

export interface UsageMetric {
  requests_today: number;
  requests_this_month: number;
  rate_limit_remaining: number;
  cost_estimate: number;
} 