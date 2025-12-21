import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface AppModalProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  closeLabel?: string;
  actionLabel?: string;
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AppModal = ({
  children,
  open,
  title = '',
  maxWidth = 'md',
  closeLabel = 'Cancel',
  actionLabel = 'Confirm',
  variant = 'contained',
  disabled = false,
  onClose,
  onConfirm
}: AppModalProps) => (
  <Dialog open={open} maxWidth={maxWidth} fullWidth onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{closeLabel}</Button>
      <Button onClick={onConfirm} variant={variant} disabled={disabled}>
        {actionLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default AppModal;
