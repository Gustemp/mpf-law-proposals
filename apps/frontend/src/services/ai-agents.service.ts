import api from './api';

export interface AgentConfig {
  provider?: 'openai' | 'anthropic';
  model?: string;
  temperature?: number;
  maxTokens?: number;
  templateId?: string;
  styleId?: string;
  layoutId?: string;
}

export interface AgentContext {
  userId?: string;
  proposalId?: string;
  briefingId?: string;
  previousOutputs?: Record<string, string>;
}

export interface AgentRequest {
  input: string;
  config?: AgentConfig;
  context?: AgentContext;
}

export interface AgentResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  agentType: 'briefing' | 'draft' | 'style' | 'layout';
  output?: string;
  error?: string;
  metadata?: {
    tokensUsed: number;
    processingTime: number;
    provider: string;
    model: string;
  };
}

export interface PipelineResult {
  briefing: string;
  draft: string;
  styled: string;
  layout: string;
}

const AI_AGENTS_URL = process.env.NEXT_PUBLIC_AI_AGENTS_URL || 'http://localhost:3002';

class AIAgentsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AI_AGENTS_URL;
  }

  async generateBriefing(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/briefing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Briefing generation failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async generateDraft(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Draft generation failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async applyStyle(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/style`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Style application failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async applyLayout(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/layout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Layout application failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async runPipeline(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Pipeline execution failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getJobStatus(jobId: string): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/agents/status/${jobId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const aiAgentsService = new AIAgentsService();
export default aiAgentsService;
