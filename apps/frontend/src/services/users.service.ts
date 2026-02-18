import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'COLLABORATOR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'COLLABORATOR';
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'COLLABORATOR';
  isActive?: boolean;
}

class UsersService {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export const usersService = new UsersService();
export default usersService;
