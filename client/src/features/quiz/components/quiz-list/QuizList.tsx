import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimerIcon from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchQuizzes, startQuizSession } from '@/features/api/quiz';
import { showNotification } from '@/lib/sonner';
import { difficultyColors } from '@/features/admin/helpers';
import useQuizAttempts from '@/features/quiz/hooks/useQuizAttempts';

import { QuizCardSkeleton } from '@/components/loader/skeletons';
import EmptyState from '@/components/ui/EmptyState';
import type { Difficulty, QuizListProps, QuizListResponse, Quiz } from '@/types/Quiz';
import { MaxAttemptsModal, StartQuizModal } from '@/features/quiz/components/modals/quiz';

const QuizList = ({ searchQuery, selectedDifficulty, selectedCategory }: QuizListProps) => {
  const [startQuizInfo, setStartQuizInfo] = useState<Quiz | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    id: startQuizId,
    title: startQuizTitle,
    questions: startQuizQuestions,
    timeLimit: startQuizTimeLimit
  } = startQuizInfo || {};

  const { canAttempt, isMaxAttemptsReached, attemptsRemaining, attemptCount } =
    useQuizAttempts(startQuizInfo);

  //  query filters
  const filters = {
    search: searchQuery || undefined,
    difficulty: (selectedDifficulty as Difficulty) || undefined,
    category: selectedCategory || undefined
  };

  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['quizzes', 'list', filters] as const,
    queryFn: ({ queryKey }) => fetchQuizzes(queryKey[2]),
    staleTime: 5 * 60 * 1000
  });
  const { data: quizzes = [], meta_data } = (quizzesData as QuizListResponse) || {};
  const { total_rows } = meta_data || {};

  // start quiz session mutation
  const startQuizMutation = useMutation({
    mutationFn: (id: string) => startQuizSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'detail', startQuizId] });
      showNotification('Quiz started successfully!', 'success');
      navigate(`/quiz/${startQuizId}`);
    },
    onError: (err: Error) => {
      const message = err.message || 'Failed to start quiz';
      showNotification(message, 'error');

      if (message.includes('Maximum attempts')) {
        setStartQuizInfo(null);
      }
    }
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <QuizCardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (total_rows === 0) {
    return (
      <EmptyState
        title="No Quizzes Found"
        description="There are no quizzes available at the moment. Please check back later."
        icon={<QuizIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
      />
    );
  }

  const handleOpenStartQuizModal = (quiz: Quiz | null) => {
    setStartQuizInfo(quiz);
  };

  const handleStartQuiz = () => {
    if (startQuizId) {
      startQuizMutation.mutate(startQuizId);
    }
  };

  return (
    <>
      {quizzes.length === 0 ? (
        <EmptyState
          title="No Quizzes Found"
          description="There are no quizzes matching your filters. Please try adjusting your search criteria."
          icon={<QuizIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3
          }}
        >
          {quizzes.map((quiz) => {
            const { id, category, difficulty, title, description, questions, timeLimit } = quiz;

            return (
              <Card
                key={id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={category} size="small" color="primary" />
                    <Chip
                      label={difficulty}
                      size="small"
                      color={difficultyColors[quiz.difficulty]}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {description}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <QuizIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {questions?.length} questions
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimerIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {timeLimit} min
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                {/* start quiz button */}
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleOpenStartQuizModal(quiz)}
                  >
                    Start Quiz
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}

      {/* modals */}
      <MaxAttemptsModal
        isOpen={isMaxAttemptsReached && !!startQuizId}
        attemptCount={attemptCount}
        onClose={() => handleOpenStartQuizModal(null)}
      />

      <StartQuizModal
        isOpen={!!startQuizId && canAttempt}
        quizTitle={startQuizTitle || ''}
        questionCount={startQuizQuestions?.length || 0}
        timeLimit={startQuizTimeLimit || 0}
        attemptsRemaining={attemptsRemaining}
        isLoading={startQuizMutation.isPending}
        onClose={() => handleOpenStartQuizModal(null)}
        onConfirm={handleStartQuiz}
      />
    </>
  );
};

export default QuizList;
