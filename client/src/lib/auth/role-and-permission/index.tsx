import RoleGuard from '@/lib/auth/role-and-permission/RoleGuard';
import type { ReactNodeProps } from '@/types';

export function AdminGuard({ children }: ReactNodeProps) {
  return (
    <RoleGuard allowedRoles={['admin']} redirectTo="/">
      {children}
    </RoleGuard>
  );
}

export function UserGuard({ children }: ReactNodeProps) {
  return (
    <RoleGuard allowedRoles={['user']} redirectTo="/admin">
      {children}
    </RoleGuard>
  );
}

export function AuthenticatedGuard({ children }: ReactNodeProps) {
  return <RoleGuard allowedRoles={['admin', 'user']}>{children}</RoleGuard>;
}
