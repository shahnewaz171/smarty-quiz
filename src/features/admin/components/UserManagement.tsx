import { Box, Card, CardContent, Typography, Chip, Alert, Stack, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '@/utils/date';
import { fetchAllUsers } from '@/features/api/admin';

import LoadingSpinner from '@/components/loader/LoadingSpinner';
import APIErrorAlert from '@/layouts/APIErrorAlert';

const UserManagement = () => {
  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['admin', 'users', 'list'],
    queryFn: fetchAllUsers
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return <APIErrorAlert message="Failed to load users. Please try again." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage registered users
        </Typography>
      </Box>

      {users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6">{user.name}</Typography>
                      <Chip
                        icon={
                          user.role.includes('admin') ? <AdminPanelSettingsIcon /> : <PersonIcon />
                        }
                        label={user.role.join(', ')}
                        size="small"
                        color={user.role.includes('admin') ? 'secondary' : 'default'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Joined {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                  <Stack direction="column" spacing={1} alignItems="flex-end">
                    <Typography variant="body2" color="text.secondary">
                      ID: {user.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Updated {formatDate(user.updatedAt)}
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserManagement;
