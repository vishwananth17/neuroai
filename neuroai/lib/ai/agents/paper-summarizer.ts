import { BaseAgent } from './base-agent';
import { AgentTask, ResearchPaper, Insight, InsightType } from '../types';

export class PaperSummarizerAgent extends BaseAgent {
  constructor() {
    super(
      'paper-summarizer-001',
      'Paper Summarizer',
      'paper_summarizer',
      ['text_generation', 'text_analysis'],
      'quick_responder'
    );
  }

  async processTask(task: AgentTask): Promise<AgentTask> {
    try {
      switch (task.type) {
        case 'summarize_paper':
          return await this.summarizePaper(task);
        case 'generate_insights':
          return await this.generateInsights(task);
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
    } catch (error) {
      return this.createTaskResponse(
        task.id,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Generate a comprehensive summary of a research paper
   */
  private async summarizePaper(task: AgentTask): Promise<AgentTask> {
    const paper = task.input.paper as ResearchPaper;
    const summaryLength = task.input.summaryLength || 'medium';
    
    this.validateInput({ paper }, ['paper']);

    const prompt = `
      Please provide a comprehensive summary of this research paper:
      
      Title: ${paper.title}
      Authors: ${paper.authors.join(', ')}
      Year: ${paper.year}
      Abstract: ${paper.abstract}
      
      Please structure your summary as follows:
      
      1. **Key Findings** (2-3 main points)
      2. **Methodology** (approach used)
      3. **Results** (main outcomes)
      4. **Significance** (why this matters)
      5. **Limitations** (what the study doesn't address)
      6. **Future Work** (what could be done next)
      
      ${this.getLengthInstruction(summaryLength)}
      
      Make the summary accessible to researchers in related fields while maintaining technical accuracy.
    `;

    const summary = await this.executeTask(prompt, { temperature: 0.3 });

    return this.createTaskResponse(task.id, 'completed', { summary });
  }

  /**
   * Generate insights from a research paper
   */
  private async generateInsights(task: AgentTask): Promise<AgentTask> {
    const paper = task.input.paper as ResearchPaper;
    const insightTypes = task.input.insightTypes || ['trend', 'gap', 'methodology'];
    
    this.validateInput({ paper }, ['paper']);

    const insights: Insight[] = [];

    for (const type of insightTypes) {
      const insight = await this.generateInsightByType(paper, type);
      if (insight) {
        insights.push(insight);
      }
    }

    return this.createTaskResponse(task.id, 'completed', { insights });
  }

  /**
   * Generate a specific type of insight
   */
  private async generateInsightByType(paper: ResearchPaper, type: InsightType): Promise<Insight | null> {
    const prompts = {
      trend: `
        Analyze this paper for emerging research trends:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        Year: ${paper.year}
        
        Identify what trend this paper represents or contributes to. Consider:
        - Is this part of a larger research movement?
        - What broader trend does this work support?
        - How does this fit into the current research landscape?
        
        Provide a concise insight about the trend this paper represents.
      `,
      
      gap: `
        Analyze this paper for research gaps it reveals:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        
        Identify what research gaps this paper either:
        1. Addresses (what was missing before this work)
        2. Reveals (what new gaps does this work create)
        3. Highlights (what areas still need work)
        
        Provide a concise insight about the research gap.
      `,
      
      methodology: `
        Analyze the methodology of this paper:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        
        Identify:
        1. What methodological approach is used?
        2. What are the strengths of this methodology?
        3. What are potential limitations?
        4. How could this methodology be applied to other problems?
        
        Provide a concise insight about the methodology.
      `,
      
      application: `
        Analyze this paper for practical applications:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        
        Identify:
        1. What are the practical applications of this research?
        2. What industries or fields could benefit?
        3. What real-world problems could this solve?
        4. What implementation challenges might exist?
        
        Provide a concise insight about applications.
      `,
      
      limitation: `
        Analyze the limitations of this paper:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        
        Identify:
        1. What are the main limitations of this work?
        2. What assumptions are made?
        3. What scenarios might this not apply to?
        4. What could invalidate the results?
        
        Provide a concise insight about limitations.
      `,
      
      future_direction: `
        Analyze this paper for future research directions:
        
        Title: ${paper.title}
        Abstract: ${paper.abstract}
        
        Identify:
        1. What natural next steps would follow this work?
        2. What questions remain unanswered?
        3. What extensions or improvements could be made?
        4. What new research areas does this open up?
        
        Provide a concise insight about future directions.
      `
    };

    const prompt = prompts[type];
    if (!prompt) return null;

    const content = await this.executeTask(prompt, { temperature: 0.4 });
    
    // Calculate confidence based on content quality
    const confidence = this.calculateConfidence(content);

    return {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: content.trim(),
      confidence,
      related_papers: [paper.id],
      generated_by: this.id,
      created_at: new Date(),
    };
  }

  /**
   * Calculate confidence score for an insight
   */
  private calculateConfidence(content: string): number {
    let confidence = 0.5; // Base confidence

    // Length factor
    if (content.length > 100) confidence += 0.1;
    if (content.length > 200) confidence += 0.1;

    // Structure factor
    if (content.includes('1.') || content.includes('•')) confidence += 0.1;
    if (content.includes('because') || content.includes('due to')) confidence += 0.1;

    // Specificity factor
    const specificTerms = ['method', 'approach', 'technique', 'algorithm', 'framework', 'model'];
    specificTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) confidence += 0.05;
    });

    return Math.min(confidence, 1.0);
  }

  /**
   * Get length instruction based on requested summary length
   */
  private getLengthInstruction(length: string): string {
    switch (length) {
      case 'short':
        return 'Keep the summary concise (100-150 words).';
      case 'long':
        return 'Provide a detailed summary (300-400 words).';
      default:
        return 'Provide a medium-length summary (200-250 words).';
    }
  }

  /**
   * Generate a structured summary with key sections
   */
  public async generateStructuredSummary(paper: ResearchPaper): Promise<{
    summary: string;
    key_points: string[];
    methodology: string;
    results: string;
    implications: string;
  }> {
    const prompt = `
      Create a structured summary of this research paper:
      
      Title: ${paper.title}
      Authors: ${paper.authors.join(', ')}
      Year: ${paper.year}
      Abstract: ${paper.abstract}
      
      Please provide:
      
      SUMMARY: A comprehensive overview (200-250 words)
      KEY POINTS: 3-5 main findings or contributions
      METHODOLOGY: The approach and methods used
      RESULTS: The main outcomes and findings
      IMPLICATIONS: Why this research matters and its impact
      
      Format each section clearly with headers.
    `;

    const response = await this.executeTask(prompt, { temperature: 0.3 });
    
    // Parse the structured response
    const sections = this.parseStructuredResponse(response);
    
    return {
      summary: sections.summary || '',
      key_points: sections.key_points || [],
      methodology: sections.methodology || '',
      results: sections.results || '',
      implications: sections.implications || '',
    };
  }

  /**
   * Parse structured response into sections
   */
  private parseStructuredResponse(response: string): Record<string, any> {
    const sections: Record<string, any> = {};
    const lines = response.split('\n');
    
    let currentSection = '';
    let currentContent: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^(SUMMARY|KEY POINTS|METHODOLOGY|RESULTS|IMPLICATIONS):/i)) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections[currentSection.toLowerCase()] = currentSection === 'key_points' 
            ? currentContent 
            : currentContent.join('\n').trim();
        }
        
        // Start new section
        currentSection = trimmedLine.split(':')[0].toLowerCase();
        currentContent = [];
      } else if (trimmedLine && currentSection) {
        currentContent.push(trimmedLine);
      }
    }
    
    // Save last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentSection === 'key_points' 
        ? currentContent 
        : currentContent.join('\n').trim();
    }
    
    return sections;
  }
} 