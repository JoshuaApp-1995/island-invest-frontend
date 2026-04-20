import apiClient from './client';

export const getSettings = async () => {
  const response = await apiClient.get('/settings');
  return response.data.settings;
};

export const updateSettings = async (data: any) => {
  const response = await apiClient.put('/settings', data);
  return response.data;
};
