'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['padding', 'hover'].includes(prop),
})<CardProps>`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s ease-in-out;
  
  ${({ padding = 'md' }) => {
    const paddingMap = {
      sm: theme.spacing.md,
      md: theme.spacing.lg,
      lg: theme.spacing.xl,
    };
    return `padding: ${paddingMap[padding]};`;
  }}
  
  ${({ hover, onClick }) => hover && css`
    cursor: ${onClick ? 'pointer' : 'default'};
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: ${theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const CardDescription = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
`;

const CardContent = styled.div`
  /* Content styling */
`;

const CardFooter = styled.div`
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  
  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;