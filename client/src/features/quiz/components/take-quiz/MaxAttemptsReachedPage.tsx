import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

interface MaxAttemptsReachedPageProps {
  attemptCount: number;
  redirectPath?: string;
}

const MaxAttemptsReachedPage = ({
  attemptCount,
  redirectPath = '/quizzes'
}: MaxAttemptsReachedPageProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Maximum Attempts Reached
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You have already attempted this quiz {attemptCount} times. You cannot take this quiz
        anymore.
      </Typography>
      <Button variant="contained" onClick={() => navigate(redirectPath)}>
        Go Back
      </Button>
    </Box>
  );
};

export default MaxAttemptsReachedPage;
