import { useState, useTransition } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Container,
  Button
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';

import { useAuth, useRole } from '@/lib/auth/better-auth/hooks';
import { signOut } from '@/lib/auth/better-auth/client';
import Logo from '@/components/icons/Logo';
import UserMenu from '@/layouts/user/UserMenu';

interface NavigationButtonsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NavigationButtons = ({ currentPath, onNavigate }: NavigationButtonsProps) => {
  const { hasRole } = useRole();

  return (
    <>
      {hasRole('admin') && (
        <Button
          color="inherit"
          startIcon={<AdminPanelSettingsIcon />}
          onClick={() => onNavigate('/admin')}
          aria-label="View available quizzes"
          aria-current={currentPath === '/admin' ? 'page' : undefined}
          sx={{
            mr: 2,
            bgcolor: currentPath === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
        >
          Go to Admin Panel
        </Button>
      )}
      <Button
        color="inherit"
        startIcon={<HistoryIcon />}
        onClick={() => onNavigate('/history')}
        aria-label="View quiz history"
        aria-current={currentPath === '/history' ? 'page' : undefined}
        sx={{
          mr: 2,
          bgcolor: currentPath === '/history' ? 'rgba(255,255,255,0.1)' : 'transparent'
        }}
      >
        History
      </Button>
    </>
  );
};

const UserLayout = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            handleMenuClose();
          },
          onError: (error) => {
            console.error('Sign out failed:', error);
          }
        }
      });
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" component="header">
        <Toolbar>
          <Logo sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Smarty Quiz
          </Typography>

          <NavigationButtons currentPath={location.pathname} onNavigate={handleNavigate} />

          <IconButton
            onClick={handleMenuOpen}
            sx={{ p: 0 }}
            aria-label="Open user menu"
            aria-controls={anchorEl ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            <Avatar alt={user?.name || 'User'} sx={{ bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <UserMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onLogout={handleLogout}
            userName={user?.name}
            isPending={isPending}
          />
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Smarty Quiz. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default UserLayout;
