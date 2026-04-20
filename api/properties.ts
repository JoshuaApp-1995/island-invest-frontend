import apiClient from './client';

export const getProperties = async () => {
  const response = await apiClient.get('/properties');
  return response.data.listings;
};

export const getProperty = async (id: string) => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data.listing;
};

export const createProperty = async (data: any) => {
  const response = await apiClient.post('/properties', data);
  return response.data.listing;
};

export const updateProperty = async (id: string, data: any) => {
  const response = await apiClient.put(`/properties/${id}`, data);
  return response.data.listing;
};

export const deleteProperty = async (id: string) => {
  const response = await apiClient.delete(`/properties/${id}`);
  return response.data;
};
