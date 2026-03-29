// API clients for external services
import axios from 'axios';

// ArXiv API client
export const arxiv = {
  search: async (query: string, maxResults: number = 10) => {
    try {
      const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`);
      return response.data;
    } catch (error) {
      console.error('ArXiv API error:', error);
      return null;
    }
  }
};

// Semantic Scholar API client
export const semanticScholar = {
  search: async (query: string, limit: number = 10) => {
    try {
      const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search`, {
        params: {
          query: query,
          limit: limit,
          fields: 'title,abstract,authors,year,citationCount,url'
        },
        headers: {
          'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Semantic Scholar API error:', error);
      return null;
    }
  },
  
  getPaper: async (paperId: string) => {
    try {
      const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/${paperId}`, {
        params: {
          fields: 'title,abstract,authors,year,citationCount,url,references,citations'
        },
        headers: {
          'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Semantic Scholar API error:', error);
      return null;
    }
  }
};

// Together.ai API client
export const togetherAI = {
  generate: async (prompt: string, model: string = 'meta-llama/Llama-2-70b-chat-hf') => {
    try {
      const response = await axios.post('https://api.together.xyz/v1/completions', {
        model: model,
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Together.ai API error:', error);
      return null;
    }
  }
};

// DeepSeek API client
export const deepSeek = {
  generate: async (messages: any[], model: string = 'deepseek-chat') => {
    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      return null;
    }
  }
}; 