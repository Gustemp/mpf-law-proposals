import axios from 'axios';

const EXECUTOR_URL = process.env.NEXT_PUBLIC_CREW_EXECUTOR_URL || 'http://localhost:3003';

export interface CrewAIAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory?: string;
  llmProvider: string;
  llmModel: string;
  tools: string[];
}

export interface CrewAITask {
  id: string;
  name: string;
  description: string;
  expectedOutput: string;
  agentId: string | null;
  contextTaskIds: string[];
  order: number;
}

export interface CrewAIFlow {
  crew: {
    name: string;
    process: string;
    verbose: boolean;
  };
  agents: CrewAIAgent[];
  tasks: CrewAITask[];
  tools: string[];
}

export interface ExecuteRequest {
  crew: {
    name: string;
    process: string;
    verbose: boolean;
  };
  agents: CrewAIAgent[];
  tasks: CrewAITask[];
  tools: string[];
  inputs: Record<string, unknown>;
  apiKeys?: {
    openai?: string;
    anthropic?: string;
  };
}

export interface ExecuteResponse {
  status: 'completed' | 'failed';
  output?: string;
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
  error?: string;
  executionTime?: number;
}

export const crewExecutorService = {
  async healthCheck(): Promise<{ status: string }> {
    const response = await axios.get(`${EXECUTOR_URL}/health`);
    return response.data;
  },

  async execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    const response = await axios.post<ExecuteResponse>(
      `${EXECUTOR_URL}/execute`,
      request,
      {
        timeout: 300000, // 5 minutes timeout for long executions
      }
    );
    return response.data;
  },
};

export default crewExecutorService;
