import { Box, Card, CardContent, Typography } from '@mui/material';
import type { QuizStatusProps } from '@/features/types';

const QuizStatus = ({ publishedQuizzes, unpublishedQuizzes, totalQuizzes }: QuizStatusProps) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Quiz Status
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Published Quizzes
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {publishedQuizzes}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Unpublished Quizzes
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {unpublishedQuizzes}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Total Quizzes
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {totalQuizzes}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default QuizStatus;
