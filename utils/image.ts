const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getImageUrl = (pathname: string) => {
  if (!pathname) return '/images/placeholder-property.jpg';
  if (pathname.startsWith('http')) return pathname;
  return `${API_URL}/uploads/${pathname}`;
};
