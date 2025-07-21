'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Progress } from './ui/Progress';

interface ClientCardProps {
  name: string;
  avatar?: string;
  progress: number;
  onClick?: () => void;
}

const ClientCardContainer = styled(Card)`
  padding: ${theme.spacing.lg};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const ProgressSection = styled.div`
  margin-top: ${theme.spacing.sm};
`;

export const ClientCard: React.FC<ClientCardProps> = ({
  name,
  avatar,
  progress,
  onClick,
}) => {
  return (
    <ClientCardContainer hover onClick={onClick}>
      <ClientHeader>
        <Avatar 
          src={avatar} 
          alt={name} 
          size="lg" 
        />
        <ClientInfo>
          <ClientName>{name}</ClientName>
        </ClientInfo>
      </ClientHeader>
      <ProgressSection>
        <Progress 
          value={progress} 
          showLabel 
          label="Progress" 
          color={progress >= 80 ? 'success' : progress >= 50 ? 'primary' : 'warning'}
        />
      </ProgressSection>
    </ClientCardContainer>
  );
};