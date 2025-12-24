import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Drawer, useTheme, useMediaQuery, Button, Toolbar } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';

import { useRole } from '@/lib/auth/better-auth/hooks';
import TopBar from '@/layouts/TopBar';
import DrawerContent from '@/layouts/admin/DrawerContent';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useRole();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar
        title="Admin Dashboard"
        position="fixed"
        showLogo={false}
        showMenuIcon={true}
        onMenuIconClick={handleDrawerToggle}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        {hasRole('user') && (
          <Button
            color="inherit"
            startIcon={<QuizIcon />}
            onClick={() => navigate('/quiz')}
            aria-label="View available quizzes"
            aria-current={location.pathname === '/quiz' ? 'page' : undefined}
            sx={{
              mr: 2,
              bgcolor: location.pathname === '/quiz' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Go to Quiz Panel
          </Button>
        )}
      </TopBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          <DrawerContent location={location} onNavigate={handleNavigate} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          <DrawerContent location={location} onNavigate={handleNavigate} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
