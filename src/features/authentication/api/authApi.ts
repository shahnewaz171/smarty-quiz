/**
 * Authentication API Service
 * Handles authentication using Better Auth with database storage
 */

import { fetchJson } from '@/lib/fetch/client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/Auth';
import type { User } from '@/types/User';

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return fetchJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  return fetchJson<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

/**
 * Logout user
 */
export const logout = async (): Promise<{ message: string }> => {
  return fetchJson<{ message: string }>('/api/auth/logout', { method: 'POST' });
};

/**
 * Get current session
 */
export const getSession = async (): Promise<{ user: User | null; authenticated: boolean }> => {
  return fetchJson<{ user: User | null; authenticated: boolean }>('/api/auth/session');
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  return fetchJson<User>('/api/users/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, profileData: Partial<User>): Promise<User> => {
  return fetchJson<User>(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const authApi = {
  login,
  register,
  logout,
  getSession,
  getCurrentUser,
  updateProfile
};
