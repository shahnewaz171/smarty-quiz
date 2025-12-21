import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/Auth';
import type { User } from '@/types/User';

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const login = (credentials: LoginRequest): Promise<LoginResponse> =>
  fetchJson<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

export const register = (userData: RegisterRequest): Promise<RegisterResponse> =>
  fetchJson<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

export const logout = (): Promise<{ message: string }> =>
  fetchJson<{ message: string }>('/auth/logout', { method: 'POST' });

export const getSession = (): Promise<{ user: User | null; authenticated: boolean }> =>
  fetchJson<{ user: User | null; authenticated: boolean }>('/auth/session');

export const getCurrentUser = (): Promise<User> => fetchJson<User>('/users/me');

export const updateProfile = (userId: string, data: Partial<User>): Promise<User> =>
  fetchJson<User>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const authApi = {
  login,
  register,
  logout,
  getSession,
  getCurrentUser,
  updateProfile
};
