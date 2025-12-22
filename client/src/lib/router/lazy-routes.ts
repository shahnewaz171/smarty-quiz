import { lazy } from 'react';

const lazyRoutes = {
  AdminDashboard: lazy(() => import('@/pages/admin/Dashboard')),
  AdminQuizzes: lazy(() => import('@/pages/admin/Quizzes')),
  AdminUsers: lazy(() => import('@/pages/admin/Users')),
  AdminStatistics: lazy(() => import('@/pages/admin/Statistics')),

  UserQuizzes: lazy(() => import('@/pages/quiz/Quizzes')),
  UserHistory: lazy(() => import('@/pages/quiz/History')),
  TakeQuizPage: lazy(() => import('@/pages/quiz/TakeQuiz')),
  ResultPage: lazy(() => import('@/pages/quiz/Result')),

  Login: lazy(() => import('@/pages/Login')),
  Register: lazy(() => import('@/pages/Register')),
  ForgotPassword: lazy(() => import('@/pages/ForgotPassword')),
  ResetPassword: lazy(() => import('@/pages/ResetPassword')),
  NotFound: lazy(() => import('@/pages/NotFound'))
};

export default lazyRoutes;
