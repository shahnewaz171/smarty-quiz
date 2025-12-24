import { fetchJson } from '@/lib/fetch/client';
import type { Quiz, QuizAttempt, QuizListFilters, SubmitQuizRequest } from '@/types/Quiz';

export const fetchQuizzes = (filters?: QuizListFilters): Promise<Quiz[]> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = queryString ? `/api/quizzes?${queryString}` : '/api/quizzes';

  return fetchJson<Quiz[]>(url);
};

export const fetchQuizCategories = (): Promise<string[]> =>
  fetchJson<string[]>('/api/quizzes/categories');

export const fetchQuizById = (quizId: string): Promise<Quiz> =>
  fetchJson<Quiz>(`/api/quizzes/${quizId}`);

export const submitQuiz = (quizId: string, data: SubmitQuizRequest): Promise<QuizAttempt> => {
  const payload = {
    answers: data.answers,
    startedAt: data.startedAt
  };

  return fetchJson<QuizAttempt>(`/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const fetchUserQuizAttempts = (userId: string): Promise<QuizAttempt[]> =>
  fetchJson<QuizAttempt[]>(`/api/quizzes/attempts/user/${userId}`);

export const fetchQuizAttemptById = (attemptId: string): Promise<QuizAttempt> =>
  fetchJson<QuizAttempt>(`/api/quizzes/attempt/${attemptId}`);

export const startQuizSession = (quizId: string) =>
  fetchJson<{
    id: string;
    startedAt: string;
    expiresAt: string;
    serverTime: string;
  }>(`/api/quizzes/${quizId}/start`, {
    method: 'POST'
  });
