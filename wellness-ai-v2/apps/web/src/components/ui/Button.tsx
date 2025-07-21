'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const buttonVariants = {
  primary: css`
    background: ${theme.colors.primary};
    color: white;
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${theme.colors.surface};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.secondary};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.text.primary};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${theme.colors.surface};
    }
  `,
  outline: css`
    background: transparent;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary};
      color: white;
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
    height: 32px;
  `,
  md: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSize.base};
    height: 40px;
  `,
  lg: css`
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: ${theme.fontSize.lg};
    height: 48px;
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeight.medium};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  white-space: nowrap;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};