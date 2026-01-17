import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/form/Input';
import { requestPasswordReset } from '@/lib/auth/better-auth/client';
import { showNotification } from '@/lib/sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setSuccess(false);

    startTransition(async () => {
      try {
        await requestPasswordReset(
          {
            email: data.email,
            redirectTo: `${window.location.origin}/reset-password`
          },
          {
            onSuccess() {
              setSuccess(true);
            },
            onError(err) {
              const { statusText, message } = err.error;
              showNotification(message || statusText || 'Failed to send reset email', 'error');
            }
          }
        );
      } catch {
        showNotification('An unexpected error occurred. Please try again.', 'error');
      }
    });
  };

  if (success) {
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
              Check Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              If this email address exists in our system, you’ll receive a password reset link in
              your inbox shortly.
            </Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" underline="hover" fontWeight="medium">
                Back to login
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
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
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Enter your email address and we&apos;ll send you a password reset link.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" fullWidth size="large" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
