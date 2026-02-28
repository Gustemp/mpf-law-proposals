import api from './api';
import { CrewAgent } from './crew-agents.service';
import { CrewTool } from './crew-tools.service';

export interface CrewTask {
  id: string;
  name: string;
  description: string;
  expectedOutput: string;
  agentId?: string;
  agent?: CrewAgent;
  asyncExecution: boolean;
  humanInput: boolean;
  outputFile?: string;
  isActive: boolean;
  createdAt: string;
  tools?: { tool: CrewTool }[];
  _count?: { crewTasks: number };
}

export interface CreateCrewTaskData {
  name: string;
  description: string;
  expectedOutput: string;
  agentId?: string;
  asyncExecution?: boolean;
  humanInput?: boolean;
  outputFile?: string;
  toolIds?: string[];
  contextTaskIds?: string[];
}

export const crewTasksService = {
  async findAll(): Promise<CrewTask[]> {
    const response = await api.get<CrewTask[]>('/crew-tasks');
    return response.data;
  },

  async findOne(id: string): Promise<CrewTask> {
    const response = await api.get<CrewTask>(`/crew-tasks/${id}`);
    return response.data;
  },

  async create(data: CreateCrewTaskData): Promise<CrewTask> {
    const response = await api.post<CrewTask>('/crew-tasks', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateCrewTaskData>): Promise<CrewTask> {
    const response = await api.patch<CrewTask>(`/crew-tasks/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/crew-tasks/${id}`);
  },
};

export default crewTasksService;
