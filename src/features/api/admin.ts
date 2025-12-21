import { fetchJson } from '@/lib/fetch/client';
import type { Quiz, QuizListFilters, CreateQuizRequest, UpdateQuizRequest } from '@/types/Quiz';
import type { User, DashboardStats, UserStats, QuizStats } from '@/types/User';

const ADMIN_STATS_BASE = '/api/admin/statistics';
const ADMIN_QUIZ_BASE = '/api/admin/quizzes';
const ADMIN_USER_BASE = '/api/admin/users';

// quiz
export const fetchAdminQuizzes = (filters?: QuizListFilters): Promise<Quiz[]> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = queryString ? `${ADMIN_QUIZ_BASE}?${queryString}` : ADMIN_QUIZ_BASE;
  return fetchJson<Quiz[]>(url);
};

export const createQuiz = (quiz: CreateQuizRequest): Promise<Quiz> =>
  fetchJson<Quiz>(ADMIN_QUIZ_BASE, {
    method: 'POST',
    body: JSON.stringify(quiz)
  });

export const updateQuiz = (quizId: string, quiz: UpdateQuizRequest): Promise<Quiz> =>
  fetchJson<Quiz>(`${ADMIN_QUIZ_BASE}/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(quiz)
  });

export const deleteQuiz = (quizId: string): Promise<void> =>
  fetchJson(`${ADMIN_QUIZ_BASE}/${quizId}`, { method: 'DELETE' });

export const togglePublishQuiz = (quizId: string, isPublished: boolean): Promise<Quiz> => {
  const payload = {
    isPublished,
    updatedAt: new Date().toISOString()
  };
  return fetchJson<Quiz>(`${ADMIN_QUIZ_BASE}/${quizId}/publish`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
};

export const fetchAllUsers = (): Promise<User[]> => fetchJson<User[]>(ADMIN_USER_BASE);

// admin stats
export const fetchDashboardStats = (): Promise<DashboardStats> =>
  fetchJson<DashboardStats>(`${ADMIN_STATS_BASE}`);

export const fetchUserStats = (): Promise<UserStats> =>
  fetchJson<UserStats>(`${ADMIN_STATS_BASE}/users`);

export const fetchQuizStats = (): Promise<QuizStats> =>
  fetchJson<QuizStats>(`${ADMIN_STATS_BASE}/quizzes`);
