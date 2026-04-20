import apiClient from './client';

export const getBookings = async () => {
  const response = await apiClient.get('/bookings');
  return response.data.bookings;
};

export const createBooking = async (data: any) => {
  const response = await apiClient.post('/bookings', data);
  return response.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await apiClient.delete(`/bookings/${id}`);
  return response.data;
};
