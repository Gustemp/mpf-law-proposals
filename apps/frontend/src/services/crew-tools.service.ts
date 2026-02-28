import api from './api';

export interface CrewTool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  parameters?: unknown;
  code?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCrewToolData {
  name: string;
  displayName: string;
  description: string;
  type?: string;
  parameters?: unknown;
  code?: string;
}

export const crewToolsService = {
  async findAll(): Promise<CrewTool[]> {
    const response = await api.get<CrewTool[]>('/crew-tools');
    return response.data;
  },

  async findOne(id: string): Promise<CrewTool> {
    const response = await api.get<CrewTool>(`/crew-tools/${id}`);
    return response.data;
  },

  async create(data: CreateCrewToolData): Promise<CrewTool> {
    const response = await api.post<CrewTool>('/crew-tools', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateCrewToolData>): Promise<CrewTool> {
    const response = await api.patch<CrewTool>(`/crew-tools/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/crew-tools/${id}`);
  },
};

export default crewToolsService;
