export interface User {
  id: string;
  name: string;
  email: string;
  role: Array<'user' | 'admin'>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalQuizzes: number;
  totalUsers: number;
  totalAttempts: number;
  averageScore: number;
  publishedQuizzes: number;
  unpublishedQuizzes: number;
  activeUsers: number;
  recentAttempts: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    admin: number;
    user: number;
  };
}

export interface QuizStats {
  totalQuizzes: number;
  publishedQuizzes: number;
  unpublishedQuizzes: number;
  quizzesByCategory: Record<string, number>;
  quizzesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  averageAttemptsPerQuiz: number;
  mostPopularQuizzes: Array<{
    id: string;
    title: string;
    attempts: number;
  }>;
}
