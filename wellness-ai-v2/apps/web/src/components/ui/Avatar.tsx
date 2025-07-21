'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
  className?: string;
}

const avatarSizes = {
  sm: '32px',
  md: '40px',
  lg: '56px',
  xl: '80px',
};

const StyledAvatar = styled.div<{ size: AvatarProps['size'] }>`
  width: ${({ size = 'md' }) => avatarSizes[size]};
  height: ${({ size = 'md' }) => avatarSizes[size]};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitials = styled.span<{ size: AvatarProps['size'] }>`
  font-size: ${({ size = 'md' }) => {
    const fontSizeMap = {
      sm: theme.fontSize.xs,
      md: theme.fontSize.sm,
      lg: theme.fontSize.base,
      xl: theme.fontSize.lg,
    };
    return fontSizeMap[size];
  }};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
  text-transform: uppercase;
`;

const AvatarFallback = styled.div<{ size: AvatarProps['size'] }>`
  width: ${({ size = 'md' }) => avatarSizes[size]};
  height: ${({ size = 'md' }) => avatarSizes[size]};
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${AvatarInitials} {
    color: white;
  }
`;

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  initials,
  className,
}) => {
  const getInitials = (name?: string) => {
    if (initials) return initials;
    if (!alt) return '?';
    
    return alt
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('');
  };

  if (src) {
    return (
      <StyledAvatar size={size} className={className}>
        <AvatarImage src={src} alt={alt} />
      </StyledAvatar>
    );
  }

  return (
    <AvatarFallback size={size} className={className}>
      <AvatarInitials size={size}>
        {getInitials(alt)}
      </AvatarInitials>
    </AvatarFallback>
  );
};