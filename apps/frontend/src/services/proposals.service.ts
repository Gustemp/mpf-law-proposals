import api from './api';

export interface Proposal {
  id: string;
  title: string;
  content?: string;
  status: 'DRAFT' | 'BRIEFING' | 'REVIEW' | 'STYLING' | 'LAYOUT' | 'COMPLETED';
  briefingId?: string;
  templateId?: string;
  styleId?: string;
  layoutId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalDto {
  title: string;
  content?: string;
  briefingId?: string;
  templateId?: string;
  styleId?: string;
  layoutId?: string;
}

export interface UpdateProposalDto {
  title?: string;
  content?: string;
  templateId?: string;
  styleId?: string;
  layoutId?: string;
}

class ProposalsService {
  async getAll(): Promise<Proposal[]> {
    const response = await api.get('/proposals');
    return response.data;
  }

  async getById(id: string): Promise<Proposal> {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  }

  async create(data: CreateProposalDto): Promise<Proposal> {
    const response = await api.post('/proposals', data);
    return response.data;
  }

  async update(id: string, data: UpdateProposalDto): Promise<Proposal> {
    const response = await api.patch(`/proposals/${id}`, data);
    return response.data;
  }

  async updateStatus(id: string, status: Proposal['status']): Promise<Proposal> {
    const response = await api.patch(`/proposals/${id}/status`, { status });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/proposals/${id}`);
  }
}

export const proposalsService = new ProposalsService();
export default proposalsService;
