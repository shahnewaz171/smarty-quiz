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
import { useQuery } from '@tanstack/react-query';

import { fetchQuizzes } from '@/features/api/quiz';
import { difficultyColors } from '@/features/admin/helpers';
import { QuizCardSkeleton } from '@/components/loader/skeletons';
import EmptyState from '@/components/ui/EmptyState';
import type { Difficulty, QuizListProps, QuizListResponse } from '@/types/Quiz';

const QuizList = ({ searchQuery, selectedDifficulty, selectedCategory }: QuizListProps) => {
  const navigate = useNavigate();

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

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
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
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Start Quiz
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default QuizList;
