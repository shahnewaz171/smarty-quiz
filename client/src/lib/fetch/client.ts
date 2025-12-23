import { API_BASE_URL } from '@/utils/env';

export const fetchJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const fullUrl = `${API_BASE_URL}${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
};
