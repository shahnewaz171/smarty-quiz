import { TextField, type TextFieldProps } from '@mui/material';
import { type VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/utils/cn';

const inputVariants = cva('', {
  variants: {
    inputSize: {
      small: 'text-sm',
      medium: '',
      large: 'text-lg'
    }
  },
  defaultVariants: {
    inputSize: 'medium'
  }
});

export interface InputProps
  extends Omit<TextFieldProps, 'size'>,
    VariantProps<typeof inputVariants> {
  inputSize?: 'small' | 'medium' | 'large';
}

const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ className, inputSize = 'medium', error, helperText, ...props }, ref) => {
    const muiSize = inputSize === 'large' ? 'medium' : inputSize;

    return (
      <TextField
        ref={ref}
        size={muiSize}
        error={error}
        helperText={helperText}
        className={cn(inputVariants({ inputSize }), className)}
        fullWidth
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
