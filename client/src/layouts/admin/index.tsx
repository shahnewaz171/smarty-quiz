import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Drawer, useTheme, useMediaQuery, Button, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';

import { useRole } from '@/lib/auth/better-auth/hooks';
import TopBar from '@/layouts/TopBar';
import DrawerContent from '@/layouts/DrawerContent';
import Footer from '@/layouts/Footer';

const drawerWidth = 240;

const getMenuItems = (isMobile: boolean) => [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Quizzes', icon: <QuizIcon />, path: '/admin/quizzes' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Statistics', icon: <BarChartIcon />, path: '/admin/statistics' },
  { text: 'User Panel', icon: <PeopleAltIcon />, path: '/quiz', isShow: isMobile }
];

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        ml: { md: `${drawerWidth}px` }
      }}
    >
      <TopBar
        title="Admin Panel"
        position="fixed"
        showLogo={false}
        showMenuIcon={true}
        onMenuIconClick={handleDrawerToggle}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        {hasRole('user') && !isMobile && (
          <Button
            color="inherit"
            startIcon={<PeopleAltIcon />}
            onClick={() => navigate('/quiz')}
            aria-label="View available quizzes"
            aria-current={location.pathname === '/quiz' ? 'page' : undefined}
            sx={{
              mr: 2,
              bgcolor: location.pathname === '/quiz' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            User Panel
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
          <DrawerContent
            location={location}
            menuItems={getMenuItems(isMobile)}
            onNavigate={handleNavigate}
          />
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
          <DrawerContent
            location={location}
            menuItems={getMenuItems(isMobile)}
            onNavigate={handleNavigate}
          />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default AdminLayout;
