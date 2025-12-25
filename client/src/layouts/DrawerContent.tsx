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
import type { useLocation } from 'react-router';
import Logo from '@/components/icons/Logo';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  isShow?: boolean;
}

interface DrawerContentProps {
  location: ReturnType<typeof useLocation>;
  isMobile?: boolean;
  menuItems: MenuItem[];
  onNavigate: (path: string) => void;
}

const DrawerContent = ({ location, menuItems, onNavigate }: DrawerContentProps) => (
  <Box>
    <Toolbar>
      <Logo sx={{ mr: 1, fontSize: 28 }} />
      <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
        Smarty Quiz
      </Typography>
    </Toolbar>
    <Divider />
    <List>
      {menuItems.map((item) => {
        const { text, icon, path, isShow = true } = item;

        if (!isShow) {
          return null;
        }
        return (
          <ListItem key={text} disablePadding>
            <ListItemButton selected={location.pathname === path} onClick={() => onNavigate(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  </Box>
);

export default DrawerContent;
