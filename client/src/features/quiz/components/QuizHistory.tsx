import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Chip, Alert, Paper, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchUserQuizAttempts } from '@/features/api/quiz';
import { useAuth } from '@/lib/auth/better-auth/hooks';
import { formatDate } from '@/utils/date';
import LoadingSpinner from '@/components/loader/LoadingSpinner';
import APIErrorAlert from '@/layouts/APIErrorAlert';

const QuizHistory = () => {
  const navigate = useNavigate();

  // user info
  const { user } = useAuth();

  const {
    data: attempts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quiz-attempts', 'user', user?.id],
    queryFn: ({ queryKey }) => fetchUserQuizAttempts(queryKey[2] as string),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000
  });

  const handleViewResult = (quizId: string, attemptId: string) => {
    navigate(`/quiz/${quizId}/result/${attemptId}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading quiz history..." />;
  }

  if (error) {
    return <APIErrorAlert message="Failed to load quiz history. Please try again." />;
  }

  if (!attempts || attempts.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Quiz History
        </Typography>
        <Alert severity="info">You haven&apos;t taken any quizzes yet.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quiz History
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View your past quiz attempts and results
      </Typography>

      <Stack spacing={2}>
        {attempts?.map((attempt) => {
          const { id, score, quizId, completedAt, correctAnswers, totalQuestions, quiz } = attempt;
          const passed = score >= 70;

          return (
            <Card
              key={id}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleViewResult(quizId, id)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {quiz?.title || 'Untitled Quiz'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed on {formatDate(completedAt)}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        minWidth: 100,
                        bgcolor: passed ? 'success.light' : 'error.light',
                        color: passed ? 'success.contrastText' : 'error.contrastText'
                      }}
                    >
                      <Typography variant="h4">{score?.toFixed(0)}%</Typography>
                      <Typography variant="caption">Score</Typography>
                    </Paper>

                    <Box>
                      <Chip
                        icon={passed ? <CheckCircleIcon /> : <CancelIcon />}
                        label={passed ? 'Passed' : 'Failed'}
                        color={passed ? 'success' : 'error'}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {correctAnswers} / {totalQuestions} correct
                      </Typography>
                    </Box>

                    <Chip
                      icon={<VisibilityIcon />}
                      label="View Details"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default QuizHistory;
