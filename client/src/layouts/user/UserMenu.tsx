import { Menu, MenuItem, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
  isPending?: boolean;
}

const UserMenu = ({ anchorEl, onClose, onLogout, userName, isPending }: UserMenuProps) => (
  <Menu
    id="user-menu"
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
  >
    <MenuItem disabled>
      <AccountCircleIcon sx={{ mr: 1 }} />
      {userName || 'User'}
    </MenuItem>
    <Divider />
    <MenuItem onClick={onLogout} disabled={isPending}>
      <LogoutIcon sx={{ mr: 1 }} />
      Logout
    </MenuItem>
  </Menu>
);

export default UserMenu;
