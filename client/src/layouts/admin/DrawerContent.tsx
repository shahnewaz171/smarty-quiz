import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import type { useLocation } from 'react-router';
import Logo from '@/components/icons/Logo';

interface DrawerContentProps {
  location: ReturnType<typeof useLocation>;
  onNavigate: (path: string) => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Quizzes', icon: <QuizIcon />, path: '/admin/quizzes' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Statistics', icon: <BarChartIcon />, path: '/admin/statistics' }
];

const DrawerContent = ({ location, onNavigate }: DrawerContentProps) => (
  <Box>
    <Toolbar>
      <Logo sx={{ mr: 1, fontSize: 28 }} />
      <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
        Smarty Quiz
      </Typography>
    </Toolbar>
    <Divider />
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => onNavigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default DrawerContent;
