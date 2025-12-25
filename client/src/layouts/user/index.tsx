import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Drawer, useTheme, useMediaQuery, Button, Toolbar } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QuizIcon from '@mui/icons-material/Quiz';
import BarChartIcon from '@mui/icons-material/BarChart';

import { useRole } from '@/lib/auth/better-auth/hooks';
import TopBar from '@/layouts/TopBar';
import DrawerContent from '@/layouts/DrawerContent';
import Footer from '@/layouts/Footer';

const drawerWidth = 240;

const getMenuItems = (isShowAdminPanel: boolean) => [
  { text: 'Quiz', icon: <QuizIcon />, path: '/quiz' },
  { text: 'History', icon: <BarChartIcon />, path: '/history' },
  {
    text: 'Admin Panel',
    icon: <AdminPanelSettingsIcon />,
    path: '/admin',
    isShow: isShowAdminPanel
  }
];

const UserLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useRole();

  const isShowAdminPanel = hasRole('admin') && isMobile;

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
        title="User Panel"
        position="fixed"
        showLogo={false}
        showMenuIcon={true}
        onMenuIconClick={handleDrawerToggle}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        {hasRole('admin') && !isMobile && (
          <Button
            color="inherit"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate('/admin')}
            aria-label="View admin panel"
            aria-current={location.pathname === '/admin' ? 'page' : undefined}
            sx={{
              mr: 2,
              bgcolor: location.pathname === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Admin Panel
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
            isMobile={isMobile}
            menuItems={getMenuItems(isShowAdminPanel)}
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
            menuItems={getMenuItems(isShowAdminPanel)}
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

export default UserLayout;
