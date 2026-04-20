import apiClient from './client';

export const getPlugins = async () => {
  const response = await apiClient.get('/plugins-manage');
  return response.data.plugins;
};

export const togglePlugin = async (id: string, enabled: boolean) => {
  const response = await apiClient.put(`/plugins-manage/${id}/toggle`, { enabled });
  return response.data;
};
