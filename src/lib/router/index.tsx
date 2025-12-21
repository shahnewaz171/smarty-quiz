import { createBrowserRouter, Navigate } from 'react-router';

// core
import lazyRoutes from '@/lib/router/lazy-routes';
import { AdminGuard, UserGuard } from '@/lib/auth/role-and-permission';
import AppErrorFallback from '@/lib/error-boundary';

// layouts
import AuthenticatePublicGuard from '@/lib/auth/role-and-permission/AuthenticatePublicGuard';
import AdminLayout from '@/layouts/admin';
import UserLayout from '@/layouts/user';
import PublicLayout from '@/layouts/PublicLayout';

// pages
const {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound,
  AdminDashboard,
  AdminQuizzes,
  AdminUsers,
  AdminStatistics,
  UserQuizzes,
  UserHistory,
  TakeQuizPage,
  ResultPage
} = lazyRoutes;

const router = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: AppErrorFallback,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        path: '/admin',
        element: (
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        ),
        children: [
          {
            index: true,
            Component: AdminDashboard
          },
          {
            path: 'quizzes',
            Component: AdminQuizzes
          },
          {
            path: 'users',
            Component: AdminUsers
          },
          {
            path: 'statistics',
            Component: AdminStatistics
          },
          { path: '*', Component: NotFound }
        ]
      },
      {
        path: '/history',
        element: (
          <UserGuard>
            <UserLayout />
          </UserGuard>
        ),
        children: [
          {
            index: true,
            Component: UserHistory
          }
        ]
      },
      {
        path: '/quiz',
        element: (
          <UserGuard>
            <UserLayout />
          </UserGuard>
        ),
        children: [
          {
            index: true,
            Component: UserQuizzes
          },
          {
            path: ':quizId',
            Component: TakeQuizPage
          },
          {
            path: ':quizId/result/:resultId',
            Component: ResultPage
          }
        ]
      },
      {
        element: (
          <AuthenticatePublicGuard>
            <PublicLayout />
          </AuthenticatePublicGuard>
        ),
        children: [
          { path: 'login', Component: Login },
          { path: 'register', Component: Register },
          { path: 'forgot-password', Component: ForgotPassword },
          { path: 'reset-password', Component: ResetPassword },
          { path: '*', Component: NotFound }
        ]
      }
    ]
  }
]);

export default router;
