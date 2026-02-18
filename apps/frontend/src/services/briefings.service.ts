import api from './api';

export interface Briefing {
  id: string;
  title: string;
  content: string;
  rawInput?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBriefingDto {
  title: string;
  content: string;
  rawInput?: string;
}

export interface UpdateBriefingDto {
  title?: string;
  content?: string;
}

class BriefingsService {
  async getAll(): Promise<Briefing[]> {
    const response = await api.get('/briefings');
    return response.data;
  }

  async getById(id: string): Promise<Briefing> {
    const response = await api.get(`/briefings/${id}`);
    return response.data;
  }

  async create(data: CreateBriefingDto): Promise<Briefing> {
    const response = await api.post('/briefings', data);
    return response.data;
  }

  async update(id: string, data: UpdateBriefingDto): Promise<Briefing> {
    const response = await api.patch(`/briefings/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/briefings/${id}`);
  }
}

export const briefingsService = new BriefingsService();
export default briefingsService;
