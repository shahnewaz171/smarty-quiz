import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

import { Button } from '@/components/ui/Button';

const InvalidTokenMessage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.50',
      py: 4
    }}
  >
    <Card sx={{ maxWidth: 440, width: '100%', mx: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Invalid Token
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          The password reset link is invalid or has expired. Please request a new password reset.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/forgot-password">
            <Button variant="contained">Request New Reset Link</Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

export default InvalidTokenMessage;
