import api from './api';

export interface Layout {
  id: string;
  name: string;
  description?: string;
  config: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLayoutDto {
  name: string;
  description?: string;
  config: Record<string, unknown>;
}

export interface UpdateLayoutDto {
  name?: string;
  description?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
}

class LayoutsService {
  async getAll(): Promise<Layout[]> {
    const response = await api.get('/layouts');
    return response.data;
  }

  async getById(id: string): Promise<Layout> {
    const response = await api.get(`/layouts/${id}`);
    return response.data;
  }

  async create(data: CreateLayoutDto): Promise<Layout> {
    const response = await api.post('/layouts', data);
    return response.data;
  }

  async update(id: string, data: UpdateLayoutDto): Promise<Layout> {
    const response = await api.patch(`/layouts/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/layouts/${id}`);
  }
}

export const layoutsService = new LayoutsService();
export default layoutsService;
