import { Navigate } from 'react-router';

import { useAuth } from '@/lib/auth/better-auth/hooks';
import { AppInitialLoading } from '@/components/loader';
import type { ReactNodeProps } from '@/types';

const AuthenticatePublicGuard = ({ children }: ReactNodeProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <AppInitialLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/quiz" replace />;
  }

  return children;
};

export default AuthenticatePublicGuard;
