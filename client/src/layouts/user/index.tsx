import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Container, Button, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import QuizIcon from '@mui/icons-material/Quiz';

import { useRole } from '@/lib/auth/better-auth/hooks';
import TopBar from '@/layouts/TopBar';

interface NavigationButtonsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NavigationButtons = ({ currentPath, onNavigate }: NavigationButtonsProps) => {
  const { hasRole } = useRole();

  return (
    <>
      <Button
        color="inherit"
        startIcon={<QuizIcon />}
        onClick={() => onNavigate('/quiz')}
        aria-label="View available quizzes"
        aria-current={currentPath === '/quiz' ? 'page' : undefined}
        sx={{
          mr: 2,
          bgcolor: currentPath === '/quiz' ? 'rgba(255,255,255,0.1)' : 'transparent'
        }}
      >
        Quiz Panel
      </Button>
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar title="Smarty Quiz" showLogo>
        <NavigationButtons currentPath={location.pathname} onNavigate={handleNavigate} />
      </TopBar>

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
