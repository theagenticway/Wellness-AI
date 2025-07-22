'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from './ui/Card';

interface WellnessCardProps {
  category: string;
  title: string;
  subtitle: string;
  image?: string;
  status?: 'pending' | 'completed' | 'in-progress';
  onClick?: () => void;
}

const WellnessCardContainer = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})<{ status?: WellnessCardProps['status'] }>`
  padding: ${theme.spacing.lg};
  cursor: pointer;
  position: relative;
  border-left: 4px solid ${({ status }) => {
    switch (status) {
      case 'completed': return theme.colors.status.success;
      case 'in-progress': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const ContentSection = styled.div`
  flex: 1;
`;

const Category = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.muted};
  text-transform: uppercase;
  font-weight: ${theme.fontWeight.medium};
  letter-spacing: 0.5px;
`;

const Title = styled.h3`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.xs} 0;
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const ImageContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  flex-shrink: 0;
  background: ${theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WellnessImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusIndicator = styled.div<{ status?: WellnessCardProps['status'] }>`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  width: 12px;
  height: 12px;
  border-radius: ${theme.borderRadius.full};
  background: ${({ status }) => {
    switch (status) {
      case 'completed': return theme.colors.status.success;
      case 'in-progress': return theme.colors.primary;
      default: return theme.colors.text.muted;
    }
  }};
`;

const PlaceholderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.lg};
`;

export const WellnessCard: React.FC<WellnessCardProps> = ({
  category,
  title,
  subtitle,
  image,
  status,
  onClick,
}) => {
  return (
    <WellnessCardContainer 
      status={status} 
      hover 
      onClick={onClick}
    >
      <StatusIndicator status={status} />
      <CardHeader>
        <ContentSection>
          <Category>{category}</Category>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </ContentSection>
        <ImageContainer>
          {image ? (
            <WellnessImage src={image} alt={title} />
          ) : (
            <PlaceholderIcon>
              {category === 'Workout' && '🏃'}
              {category === 'Nutrition' && '🍽️'}
              {category === 'Mindfulness' && '🧘'}
              {category === 'CBT' && '📝'}
              {!['Workout', 'Nutrition', 'Mindfulness', 'CBT'].includes(category) && '📋'}
            </PlaceholderIcon>
          )}
        </ImageContainer>
      </CardHeader>
    </WellnessCardContainer>
  );
};