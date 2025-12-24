import { useState, useEffect, useRef, useEffectEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';

import { fetchQuizById, submitQuiz } from '@/features/api/quiz';
import { showNotification } from '@/lib/sonner';
import getProgressCalculation from '@/features/quiz/helpers/getProgressCalculation';
import QuizQuestionProgress from '@/features/quiz/components/take-quiz/QuizQuestionProgress';
import useQuizTimer from '@/features/quiz/hooks/useQuizTimer';
import useQuizAttempts from '@/features/quiz/hooks/useQuizAttempts';
import LoadingSpinner from '@/components/loader/LoadingSpinner';
import APIErrorAlert from '@/layouts/APIErrorAlert';
import type { Answer, QuizResult, SubmitQuizRequest } from '@/types/Quiz';
import NoActiveSessionPage from '@/features/quiz/components/take-quiz/NoActiveSessionPage';
import MaxAttemptsReachedPage from '@/features/quiz/components/take-quiz/MaxAttemptsReachedPage';
import { QuizHeader } from '@/features/quiz/components/take-quiz/QuizHeader';
import { QuizQuestionCard } from '@/features/quiz/components/take-quiz/QuizQuestionCard';

const QuizTaking = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const autoSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const navigate = useNavigate();

  // query client
  const queryClient = useQueryClient();

  // quiz details
  const {
    data: quiz,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quizzes', 'detail', quizId],
    queryFn: ({ queryKey }) => fetchQuizById(queryKey[2] as string),
    enabled: !!quizId
  });

  const { id: quiz_id, title, timeLimit, questions = [], activeSession } = quiz || {};
  const { id: sessionId, startedAt, expiresAt } = activeSession || {};
  const { isMaxAttemptsReached, attemptCount } = useQuizAttempts(quiz);

  const hasActiveSession = !!activeSession;

  // web worker timer
  const { timeRemaining, formattedTime, startTimer, isRunning, isTimeUp } = useQuizTimer({
    timeLimitInMinutes: timeLimit || 5,
    expiresAt,
    serverTime: sessionId ? new Date().toISOString() : null
  });

  // submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async ({ quizId: id, data }: { quizId: string; data: SubmitQuizRequest }) => {
      const attempt = await submitQuiz(id, data);

      if (!attempt.quiz) {
        throw new Error('Quiz data not included in response');
      }

      return {
        ...attempt,
        quiz: attempt.quiz,
        percentage: attempt.score,
        passed: attempt.passed
      } as QuizResult;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'detail', quizId] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'quizzes' &&
          query.queryKey[1] === 'list'
      });
      queryClient.invalidateQueries({ queryKey: ['quiz-results', result.id] });
    },
    onError: (err) => {
      showNotification(`Error submitting quiz: ${err.message}`, 'error');
    }
  });
  const { isPending: isSubmitting } = submitQuizMutation;

  const onAutoSubmit = useEffectEvent(() => {
    if (!quiz_id || !startedAt || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    submitQuizMutation.mutate(
      {
        quizId: quiz_id,
        data: { answers, startedAt }
      },
      {
        onSuccess: (result) => {
          isSubmittingRef.current = false;
          navigate(`/quiz/${quiz_id}/result/${result.id}`);
        },
        onError: () => {
          isSubmittingRef.current = false;
        }
      }
    );
  });

  // submit quiz
  const handleSubmitQuiz = () => {
    if (!quiz_id || !startedAt || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    submitQuizMutation.mutate(
      {
        quizId: quiz_id,
        data: { answers, startedAt }
      },
      {
        onSuccess: (result) => {
          isSubmittingRef.current = false;
          navigate(`/quiz/${quiz_id}/result/${result.id}`);
        },
        onError: () => {
          isSubmittingRef.current = false;
        }
      }
    );
  };

  // timer management and auto-submit
  useEffect(() => {
    // start timer when session exists
    if (hasActiveSession && !isRunning && timeRemaining > 0 && !isTimeUp) {
      startTimer();
      return;
    }

    // auto submit on time up
    if (isTimeUp && hasActiveSession && !autoSubmittedRef.current && startedAt) {
      autoSubmittedRef.current = true;
      onAutoSubmit();
    }
  }, [hasActiveSession, isRunning, timeRemaining, isTimeUp, startedAt]);

  const handleAnswerChange = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedAnswer };
        return updated;
      }
      return [...prev, { questionId, selectedAnswer }];
    });
  };

  const handleNext = () => {
    if (quiz_id && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading quiz..." />;
  }

  if (error) {
    return <APIErrorAlert message="Failed to load quiz. Please try again." />;
  }

  if (isMaxAttemptsReached) {
    return <MaxAttemptsReachedPage attemptCount={attemptCount} />;
  }

  if (!hasActiveSession) {
    return <NoActiveSessionPage />;
  }

  // progress calculation
  const { isLastQuestion, progress, currentQuestion, currentAnswer } = getProgressCalculation({
    currentQuestionIndex,
    questions,
    answers
  });

  return (
    <Box>
      <QuizHeader
        title={title || ''}
        formattedTime={formattedTime}
        timeRemaining={timeRemaining}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        progress={progress}
      />

      <QuizQuestionCard
        currentQuestion={currentQuestion}
        currentAnswer={currentAnswer}
        isLastQuestion={isLastQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isSubmitting={isSubmitting}
        onAnswerChange={handleAnswerChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmitQuiz}
      />

      {/* question progress */}
      <QuizQuestionProgress
        questions={questions}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </Box>
  );
};

export default QuizTaking;
