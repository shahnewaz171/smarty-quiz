import { Box, Card, CardContent, Typography } from '@mui/material';
import type { UserActivityProps } from '@/features/types';

const UserActivity = ({ activeUsers, totalUsers, recentAttempts }: UserActivityProps) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        User Activity
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Active Users
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {activeUsers}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Users
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {totalUsers}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Recent Attempts
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {recentAttempts}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default UserActivity;
