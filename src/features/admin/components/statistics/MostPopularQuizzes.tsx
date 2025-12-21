import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import type { MostPopularQuizzesProps } from '@/features/types';

const MostPopularQuizzes = ({ mostPopularQuizzes }: MostPopularQuizzesProps) => {
  if (mostPopularQuizzes.length === 0) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Most Popular Quizzes
        </Typography>
        <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
          {mostPopularQuizzes.map((quiz, index) => (
            <Box
              key={quiz.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label={`#${index + 1}`} size="small" color="primary" />
                <Typography variant="body1">{quiz.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {quiz.attempts} attempts
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MostPopularQuizzes;
