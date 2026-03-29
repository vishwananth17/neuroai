# NeuroAI - AI-Powered Research Assistant

A sophisticated research platform that uses a team of AI agents to discover, analyze, and provide insights from research papers in neuroscience and artificial intelligence.

## 🚀 Features

### 🤖 AI Agent Team
- **Research Analyst Agent**: Searches and analyzes papers across multiple sources
- **Paper Summarizer Agent**: Generates comprehensive summaries and insights
- **Quality Assessor**: Evaluates research quality and impact
- **Trend Analyzer**: Identifies emerging research trends
- **Insight Generator**: Extracts key insights and implications

### 🔍 Advanced Search
- Multi-source search (arXiv, Semantic Scholar)
- AI-powered relevance scoring
- Smart deduplication
- Quality filtering
- Citation analysis
- Incremental dataset updates
- Real-time data processing
- DeepSeek-powered research analysis

### 📊 AI-Generated Content
- Intelligent paper summaries
- Research insights and trends
- Quality assessments
- Methodology analysis
- Future work recommendations
- DeepSeek-powered code analysis
- Advanced research insights

### 🎨 Modern UI
- Black and white theme
- Smooth animations with Framer Motion
- Responsive design
- Dark/light mode toggle
- Real-time search suggestions

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Heroicons** - Beautiful icons

### AI & Backend
- **Together.ai** - 200+ open-source AI models
- **Vercel AI SDK** - Modern AI development
- **Axios** - HTTP client
- **Agent Architecture** - Scalable AI agent system

### APIs
- **arXiv API** - Research paper database
- **Semantic Scholar API** - Academic search
- **Semantic Scholar Datasets API** - Comprehensive academic datasets with incremental updates
- **Together.ai API** - AI model access
- **DeepSeek API** - Advanced AI models for research analysis and code generation

## 📁 Project Structure

```
neuroai/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── search/               # Search endpoint
│   │   ├── papers/[id]/          # Paper details
│   │   ├── trending/             # Trending papers
│   │   ├── system/status/        # System status
│   │   └── datasets/semantic-scholar/ # Semantic Scholar datasets
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── Navbar.tsx               # Navigation bar
│   ├── SearchBar.tsx            # Search interface
│   ├── TrendingPapers.tsx       # Trending papers display
│   └── SemanticScholarDatasets.tsx # Semantic Scholar datasets interface
├── lib/                         # Core library
│   ├── ai/                      # AI system
│   │   ├── agents/              # AI agents
│   │   │   ├── base-agent.ts    # Base agent class
│   │   │   ├── research-analyst.ts
│   │   │   └── paper-summarizer.ts
│   │   ├── config.ts            # AI configuration
│   │   ├── types.ts             # TypeScript types
│   │   ├── agent-manager.ts     # Agent orchestration
│   │   ├── research-service.ts  # Main service
│   │   └── semantic-scholar-client.ts # Semantic Scholar Datasets client
│   └── api.ts                   # External API clients
└── public/                      # Static assets
```

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd neuroai
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# Required: Together.ai API Key
TOGETHER_AI_API_KEY=your_together_ai_api_key_here

# Optional: Research Database APIs
ARXIV_API_KEY=your_arxiv_api_key_here
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_api_key_here

# Optional: OpenAI API (for additional features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: DeepSeek API (for advanced AI features)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. Get API Keys

#### Together.ai (Required)
- Visit [Together.ai](https://together.ai) and create an account
- Get your API key from the dashboard
- Add it to your `.env.local` file

#### DeepSeek (Optional - for advanced features)
- Visit [DeepSeek](https://platform.deepseek.com) and create an account
- Get your API key from the dashboard
- Add it to your `.env.local` file

**Getting Started with Together.ai:**
1. Visit [Together.ai](https://together.ai)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Add to your `.env.local`

#### arXiv API (Optional)
- Free to use, no API key required for basic usage
- For higher rate limits, contact arXiv

#### Semantic Scholar API (Optional)
1. Visit [Semantic Scholar](https://www.semanticscholar.org/product/api)
2. Sign up for API access
3. Get your API key

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 🤖 AI Agent System

### Agent Architecture

The system uses a sophisticated agent-based architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Agent Manager   │    │  AI Agents      │
│                 │    │                  │    │                 │
│  Search UI      │───▶│  Task Queue      │───▶│ Research Analyst│
│  Results Display│    │  Agent Selection │    │ Paper Summarizer│
│  Dark/Light Mode│    │  Performance     │    │ Quality Assessor│
└─────────────────┘    │  Monitoring      │    └─────────────────┘
                       └──────────────────┘
```

### Available Agents

#### Research Analyst Agent
- **Model**: Meta-Llama-3.3-70B-Instruct-Turbo
- **Capabilities**: Paper search, trend analysis, quality assessment
- **Tasks**: `search_papers`, `analyze_trends`, `assess_quality`

#### Paper Summarizer Agent
- **Model**: Meta-Llama-3.1-8B-Instruct-Turbo
- **Capabilities**: Text generation, insight extraction
- **Tasks**: `summarize_paper`, `generate_insights`

### Agent Features

- **Automatic Task Distribution**: Tasks are automatically assigned to the best-suited agent
- **Performance Monitoring**: Real-time metrics tracking
- **Error Handling**: Robust error recovery and logging
- **Scalability**: Easy to add new agents and capabilities

## 🔧 API Endpoints

### Search Papers
```http
POST /api/search
{
  "query": "neural networks",
  "category": "machine-learning",
  "max_results": 10,
  "include_summary": true,
  "include_insights": true
}
```

### Get Paper Details
```http
GET /api/papers/{paperId}?summary=true&insights=true
```

### Trending Papers
```http
GET /api/trending?category=neuroscience&limit=10
```

### Semantic Scholar Datasets
```http
# Get latest release
GET /api/datasets/semantic-scholar?action=latest-release

# Get dataset metadata
GET /api/datasets/semantic-scholar?action=dataset-metadata&releaseId=2024-01-01&datasetName=papers

# Get incremental updates
GET /api/datasets/semantic-scholar?action=incremental-updates&datasetName=papers&startRelease=2024-01-01&endRelease=2024-01-15

# Check for updates
GET /api/datasets/semantic-scholar?action=check-updates&datasetName=papers&startRelease=2024-01-01

# Get dataset statistics
GET /api/datasets/semantic-scholar?action=dataset-stats&releaseId=2024-01-01&datasetName=papers

# Process incremental updates
GET /api/datasets/semantic-scholar?action=process-updates&datasetName=papers&startRelease=2024-01-01&endRelease=2024-01-15&maxFiles=10&filterByYear=2024

# Get cache statistics
GET /api/datasets/semantic-scholar?action=cache-stats
```

### System Status
```http
GET /api/system/status
```

## 🎨 Customization

### Adding New Agents

1. Create a new agent class extending `BaseAgent`:
```typescript
export class NewAgent extends BaseAgent {
  constructor() {
    super('new-agent-001', 'New Agent', 'new_role', ['capability'], 'model');
  }

  async processTask(task: AgentTask): Promise<AgentTask> {
    // Implement task processing logic
  }
}
```

2. Register the agent in `AgentManager`:
```typescript
private initializeAgents(): void {
  // ... existing agents
  const newAgent = new NewAgent();
  this.agents.set(newAgent.id, newAgent);
}
```

### Customizing AI Models

Update `lib/ai/config.ts` to use different models:
```typescript
export const AI_MODELS = {
  RESEARCH_ANALYST: togetherai('your-preferred-model'),
  QUICK_RESPONDER: togetherai('fast-model'),
  // ... other models
};
```

## 📊 Performance & Monitoring

### System Metrics
- Agent response times
- Success/failure rates
- Queue length monitoring
- API usage tracking

### Quality Metrics
- Relevance scoring
- Citation analysis
- Publication recency
- Research diversity

## 🔒 Security & Best Practices

- Environment variable validation
- API rate limiting
- Error handling and logging
- Input validation and sanitization
- Secure API key management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

- [x] Semantic Scholar Datasets API integration
- [x] Incremental updates processing
- [x] Dataset statistics and caching
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and profiles
- [ ] Paper recommendation system
- [ ] Collaborative research features
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Integration with more research databases
- [ ] Real-time collaboration features
- [ ] Full dataset download and processing
- [ ] Automated incremental update scheduling

---

**Built with ❤️ using Next.js, Together.ai, and modern AI technologies**
