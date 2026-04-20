import apiClient from './client';

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data.posts;
};

export const getPostBySlug = async (slug: string) => {
  const response = await apiClient.get(`/posts/${slug}`);
  return response.data.post;
};

export const createPost = async (data: any) => {
  const response = await apiClient.post('/posts', data);
  return response.data;
};

export const updatePost = async (id: string, data: any) => {
  const response = await apiClient.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};
