import apiClient from './client';

export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data.users;
};

export const updateUserRole = async (id: string, role: string) => {
  const response = await apiClient.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data.stats;
};

export const getPendingPayments = async () => {
  const response = await apiClient.get('/admin/pending-payments');
  return response.data.listings;
};

export const processPayment = async (id: string, action: 'approve' | 'reject') => {
  const response = await apiClient.post(`/admin/payments/${id}`, { action });
  return response.data;
};
