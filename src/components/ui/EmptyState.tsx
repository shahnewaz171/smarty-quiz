import { Box, Button, Typography, Paper } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      p: 3
    }}
  >
    <Paper
      sx={{
        p: 4,
        maxWidth: 500,
        textAlign: 'center',
        bgcolor: 'background.default'
      }}
      elevation={0}
    >
      <Box sx={{ mb: 2 }}>
        {icon || <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
      </Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  </Box>
);

export default EmptyState;
