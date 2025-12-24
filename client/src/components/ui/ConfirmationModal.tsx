import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  subTitle?: string;
  closeLabel?: string;
  actionLabel?: string;
  variant?: 'text' | 'outlined' | 'contained';
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title = '',
  subTitle = '',
  closeLabel = 'Cancel',
  actionLabel = 'Delete',
  variant = 'contained',
  onClose,
  onConfirm,
  isLoading
}: ConfirmationModalProps) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{subTitle}</Typography>
    </DialogContent>
    <DialogActions>
      {closeLabel && (
        <Button disabled={isLoading} onClick={onClose}>
          {closeLabel}
        </Button>
      )}
      <Button onClick={onConfirm} color="error" variant={variant} disabled={isLoading}>
        {`${actionLabel} ${isLoading ? '...' : ''}`}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;
