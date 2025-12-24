import { useNavigate } from 'react-router';
import { Box, Paper, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NoActiveSessionPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          No Active Quiz Session
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You need to start a quiz session before you can take the quiz. Please go back to the quiz
          list and click &quot;Start Quiz&quot; to begin.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/quizzes')}
        >
          Back to Quizzes
        </Button>
      </Paper>
    </Box>
  );
};

export default NoActiveSessionPage;
