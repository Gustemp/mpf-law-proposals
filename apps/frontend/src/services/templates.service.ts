import api from './api';

export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  content: string;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  content?: string;
  isActive?: boolean;
}

class TemplatesService {
  async getAll(): Promise<Template[]> {
    const response = await api.get('/templates');
    return response.data;
  }

  async getById(id: string): Promise<Template> {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  }

  async create(data: CreateTemplateDto): Promise<Template> {
    const response = await api.post('/templates', data);
    return response.data;
  }

  async update(id: string, data: UpdateTemplateDto): Promise<Template> {
    const response = await api.patch(`/templates/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/templates/${id}`);
  }
}

export const templatesService = new TemplatesService();
export default templatesService;
