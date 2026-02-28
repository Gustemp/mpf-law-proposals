import api from './api';

export interface CrewAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  llmProvider: string;
  llmModel: string;
  verbose: boolean;
  allowDelegation: boolean;
  maxIter: number;
  memory: boolean;
  isActive: boolean;
  createdAt: string;
  tools?: { tool: CrewTool }[];
  _count?: { tasks: number; crewAgents: number };
}

export interface CrewTool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
}

export interface CreateCrewAgentData {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  llmProvider?: string;
  llmModel?: string;
  verbose?: boolean;
  allowDelegation?: boolean;
  maxIter?: number;
  memory?: boolean;
  toolIds?: string[];
}

export const crewAgentsService = {
  async findAll(): Promise<CrewAgent[]> {
    const response = await api.get<CrewAgent[]>('/crew-agents');
    return response.data;
  },

  async findOne(id: string): Promise<CrewAgent> {
    const response = await api.get<CrewAgent>(`/crew-agents/${id}`);
    return response.data;
  },

  async create(data: CreateCrewAgentData): Promise<CrewAgent> {
    const response = await api.post<CrewAgent>('/crew-agents', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateCrewAgentData>): Promise<CrewAgent> {
    const response = await api.patch<CrewAgent>(`/crew-agents/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/crew-agents/${id}`);
  },
};

export default crewAgentsService;
