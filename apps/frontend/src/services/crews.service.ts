import api from './api';
import { CrewAgent } from './crew-agents.service';
import { CrewTask } from './crew-tasks.service';

export interface Crew {
  id: string;
  name: string;
  description?: string;
  process: string;
  verbose: boolean;
  memory: boolean;
  managerLlm?: string;
  maxRpm?: number;
  variables?: unknown;
  flowData?: unknown;
  isActive: boolean;
  createdAt: string;
  agents?: { agent: CrewAgent; order: number }[];
  tasks?: { task: CrewTask; order: number }[];
  _count?: { executions: number };
}

export interface CreateCrewData {
  name: string;
  description?: string;
  process?: string;
  verbose?: boolean;
  memory?: boolean;
  managerLlm?: string;
  maxRpm?: number;
  variables?: unknown;
  flowData?: unknown;
  agentIds?: string[];
  taskIds?: string[];
}

export const crewsService = {
  async findAll(): Promise<Crew[]> {
    const response = await api.get<Crew[]>('/crews');
    return response.data;
  },

  async findOne(id: string): Promise<Crew> {
    const response = await api.get<Crew>(`/crews/${id}`);
    return response.data;
  },

  async create(data: CreateCrewData): Promise<Crew> {
    const response = await api.post<Crew>('/crews', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateCrewData>): Promise<Crew> {
    const response = await api.patch<Crew>(`/crews/${id}`, data);
    return response.data;
  },

  async updateFlow(id: string, flowData: unknown): Promise<Crew> {
    const response = await api.patch<Crew>(`/crews/${id}/flow`, { flowData });
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/crews/${id}`);
  },
};

export default crewsService;
