import { useSession } from '@/lib/auth/better-auth/client';
import type { UserWithRole } from '@/lib/auth/better-auth/types';

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  return {
    user: (session?.user as UserWithRole | undefined) || null,
    session: session || null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error
  };
}

export function useRole() {
  const { user } = useAuth();

  const hasRole = (role: 'user' | 'admin') => {
    if (!user || !user.role) return false;
    return user.role.includes(role);
  };

  const isAdmin = () => hasRole('admin');
  const isUser = () => hasRole('user');

  return {
    role: user?.role ?? null,
    hasRole,
    isAdmin,
    isUser
  };
}
