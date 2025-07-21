'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasLeftIcon', 'hasRightIcon', 'error'].includes(prop),
})<{ hasLeftIcon?: boolean; hasRightIcon?: boolean; error?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  padding-left: ${({ hasLeftIcon }) => hasLeftIcon ? '40px' : theme.spacing.md};
  padding-right: ${({ hasRightIcon }) => hasRightIcon ? '40px' : theme.spacing.md};
  border: 1px solid ${({ error }) => error ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  background: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: all 0.2s ease-in-out;
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.status.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ error }) => error ? 
      `${theme.colors.status.error}20` : 
      `${theme.colors.primary}20`
    };
  }
  
  &:disabled {
    background: ${theme.colors.surface};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const IconContainer = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.muted};
  pointer-events: none;
  z-index: 1;
`;

const ErrorMessage = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.status.error};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <InputWrapper fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {leftIcon && (
          <IconContainer position="left">
            {leftIcon}
          </IconContainer>
        )}
        <StyledInput
          ref={ref}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon}
          error={!!error}
          {...props}
        />
        {rightIcon && (
          <IconContainer position="right">
            {rightIcon}
          </IconContainer>
        )}
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';