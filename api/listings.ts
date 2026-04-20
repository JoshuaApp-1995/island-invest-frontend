import apiClient from './client';

export const getListings = async (params: any = {}) => {
  const response = await apiClient.get('/listings', { params });
  return response.data.listings;
};

export const getListingById = async (id: string) => {
  const response = await apiClient.get(`/listings/${id}`);
  return response.data.listing;
};

export const createListing = async (data: any) => {
  const response = await apiClient.post('/listings', data);
  return response.data.listing;
};

export const updateListing = async (id: string, data: any) => {
  const response = await apiClient.put(`/listings/${id}`, data);
  return response.data;
};

export const deleteListing = async (id: string) => {
  const response = await apiClient.delete(`/listings/${id}`);
  return response.data;
};
