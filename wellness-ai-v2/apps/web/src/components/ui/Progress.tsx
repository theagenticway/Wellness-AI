'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface ProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const progressSizes = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

const progressColors = {
  primary: theme.colors.primary,
  success: theme.colors.status.success,
  warning: theme.colors.status.warning,
  error: theme.colors.status.error,
};

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

const ProgressTrack = styled.div<{ size: ProgressProps['size'] }>`
  width: 100%;
  height: ${({ size = 'md' }) => progressSizes[size]};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div<{ 
  value: number; 
  color: ProgressProps['color'];
}>`
  width: ${({ value }) => Math.min(Math.max(value, 0), 100)}%;
  height: 100%;
  background: ${({ color = 'primary' }) => progressColors[color]};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease-in-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.fontSize.sm};
`;

const ProgressText = styled.span`
  color: ${theme.colors.text.secondary};
`;

const ProgressValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeight.medium};
`;

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <ProgressWrapper className={className}>
      {(showLabel || label) && (
        <ProgressLabel>
          <ProgressText>{label || 'Progress'}</ProgressText>
          <ProgressValue>{clampedValue}%</ProgressValue>
        </ProgressLabel>
      )}
      <ProgressTrack size={size}>
        <ProgressBar value={clampedValue} color={color} />
      </ProgressTrack>
    </ProgressWrapper>
  );
};