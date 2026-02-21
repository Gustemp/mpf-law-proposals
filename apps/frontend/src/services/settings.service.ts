import api from './api';

export interface UserSettings {
  openaiApiKey: string | null;
  anthropicApiKey: string | null;
  preferredModel: string;
  hasOpenaiKey: boolean;
  hasAnthropicKey: boolean;
}

export interface UpdateSettingsData {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  preferredModel?: string;
}

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>('/settings');
    return response.data;
  },

  async updateSettings(data: UpdateSettingsData): Promise<UserSettings> {
    const response = await api.patch<UserSettings>('/settings', data);
    return response.data;
  },
};

export default settingsService;
