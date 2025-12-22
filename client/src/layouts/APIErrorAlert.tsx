import { Box, Typography, Button, Alert } from '@mui/material';

const APIErrorAlert = ({ message }: { message: string }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Quiz Management
    </Typography>
    <Alert
      severity="error"
      sx={{ mb: 3 }}
      action={
        <Button color="inherit" size="small" onClick={() => window.location.reload()}>
          Retry
        </Button>
      }
    >
      <Typography variant="body2">{message}</Typography>
    </Alert>
  </Box>
);

export default APIErrorAlert;
