import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';

import { showNotification } from '@/lib/sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/form/Input';
import InvalidTokenMessage from '@/features/authentication/components/reset-password/InvalidTokenMessage';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showNotification('Invalid or missing reset token', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Call Better Auth reset password endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPassword: data.password,
          revokeOtherSessions: true,
          token
        }),
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Password has been reset successfully!', 'success');
        navigate('/login', {
          state: { message: 'Password reset successful. Please login with your new password.' }
        });
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <InvalidTokenMessage />;
  }

  return (
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
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Enter your new password below.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" fullWidth size="large" disabled={isLoading || !token}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight="medium">
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
