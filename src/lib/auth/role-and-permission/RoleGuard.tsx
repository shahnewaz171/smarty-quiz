import { Navigate } from 'react-router';

import { useAuth, useRole } from '@/lib/auth/better-auth/hooks';
import type { RoleGuardProps } from '@/lib/auth/role-and-permission/types';
import { AppInitialLoading } from '@/components/loader';

const RoleGuard = ({ children, allowedRoles, redirectTo = '/' }: RoleGuardProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { hasRole } = useRole();

  if (isLoading) {
    return <AppInitialLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some((allowedRole) => hasRole(allowedRole));

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleGuard;
