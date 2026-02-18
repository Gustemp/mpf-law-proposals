import api from './api';

export interface Style {
  id: string;
  name: string;
  description?: string;
  config: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStyleDto {
  name: string;
  description?: string;
  config: Record<string, unknown>;
}

export interface UpdateStyleDto {
  name?: string;
  description?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
}

class StylesService {
  async getAll(): Promise<Style[]> {
    const response = await api.get('/styles');
    return response.data;
  }

  async getById(id: string): Promise<Style> {
    const response = await api.get(`/styles/${id}`);
    return response.data;
  }

  async create(data: CreateStyleDto): Promise<Style> {
    const response = await api.post('/styles', data);
    return response.data;
  }

  async update(id: string, data: UpdateStyleDto): Promise<Style> {
    const response = await api.patch(`/styles/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/styles/${id}`);
  }
}

export const stylesService = new StylesService();
export default stylesService;
