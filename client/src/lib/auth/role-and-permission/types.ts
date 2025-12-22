export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'user')[];
  redirectTo?: string;
}
