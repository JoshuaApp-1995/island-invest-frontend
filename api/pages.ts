import apiClient from './client';

export const getPages = async () => {
  const response = await apiClient.get('/pages');
  return response.data.pages;
};

export const getPageBySlug = async (slug: string) => {
  const response = await apiClient.get(`/pages/${slug}`);
  return response.data.page;
};

export const createPage = async (data: any) => {
  const response = await apiClient.post('/pages', data);
  return response.data;
};

export const updatePage = async (id: string, data: any) => {
  const response = await apiClient.put(`/pages/${id}`, data);
  return response.data;
};

export const deletePage = async (id: string) => {
  const response = await apiClient.delete(`/pages/${id}`);
  return response.data;
};
