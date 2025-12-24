import { useState, useTransition } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '@/lib/auth/better-auth/hooks';
import { signOut } from '@/lib/auth/better-auth/client';
import Logo from '@/components/icons/Logo';
import UserMenu from '@/layouts/user/UserMenu';
import { showNotification } from '@/lib/sonner';

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
  showMenuIcon?: boolean;
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  onMenuIconClick?: () => void;
  children?: React.ReactNode;
  sx?: object;
}

const TopBar = ({
  title = 'Smarty Quiz',
  showLogo = true,
  showMenuIcon = false,
  position = 'static',
  onMenuIconClick,
  children,
  sx
}: TopBarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              handleMenuClose();
            },
            onError: (error) => {
              showNotification(error instanceof Error ? error.message : 'Sign out failed', 'error');
            }
          }
        });
      } catch {
        showNotification('An unexpected error occurred. Please try again.', 'error');
      }
    });
  };

  return (
    <AppBar position={position} component="header" sx={sx}>
      <Toolbar>
        {showMenuIcon && (
          <IconButton
            color="inherit"
            aria-label="Toggle navigation menu"
            edge="start"
            onClick={onMenuIconClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {showLogo && <Logo sx={{ mr: 2, fontSize: 32 }} />}
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {title}
        </Typography>

        {children}

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
  );
};

export default TopBar;
