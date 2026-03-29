import axios from 'axios';

// OpenAI API configuration
const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// arXiv API configuration
const arxivApi = axios.create({
  baseURL: 'http://export.arxiv.org/api/query',
});

// Semantic Scholar API configuration
const semanticScholarApi = axios.create({
  baseURL: 'https://api.semanticscholar.org/v1',
  headers: {
    'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY,
  },
});

// OpenAI API functions
export const openai = {
  async chatCompletion(messages: any[]) {
    try {
      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });
      return response.data;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  },
};

// arXiv API functions
export const arxiv = {
  async searchPapers(query: string, maxResults: number = 10) {
    try {
      const response = await arxivApi.get('', {
        params: {
          search_query: query,
          start: 0,
          max_results: maxResults,
          sortBy: 'relevance',
          sortOrder: 'descending',
        },
      });
      return response.data;
    } catch (error) {
      console.error('arXiv API error:', error);
      throw error;
    }
  },
};

// Semantic Scholar API functions
export const semanticScholar = {
  async searchPapers(query: string, limit: number = 10) {
    try {
      const response = await semanticScholarApi.get('/paper/search', {
        params: {
          query,
          limit,
          fields: 'title,abstract,authors,year,venue,citations',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Semantic Scholar API error:', error);
      throw error;
    }
  },

  async getPaperDetails(paperId: string) {
    try {
      const response = await semanticScholarApi.get(`/paper/${paperId}`, {
        params: {
          fields: 'title,abstract,authors,year,venue,citations,references',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Semantic Scholar API error:', error);
      throw error;
    }
  },
}; 