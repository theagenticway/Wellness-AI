'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  onItemClick: (id: string) => void;
  activeItem?: string;
}

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.background};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.sm} 0;
  box-shadow: 0 -2px 10px ${theme.colors.shadow};
  z-index: ${theme.zIndex.modal};
`;

const NavigationList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};
`;

const NavigationItem = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: ${({ active }) => active ? theme.colors.primary : theme.colors.text.muted};
  min-width: 60px;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const IconContainer = styled.div<{ active?: boolean }>`
  font-size: 20px;
  transition: transform 0.2s ease-in-out;
  
  ${({ active }) => active && `
    transform: scale(1.1);
  `}
`;

const Label = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
`;

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  onItemClick,
  activeItem,
}) => {
  return (
    <NavigationContainer>
      <NavigationList>
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            active={activeItem === item.id}
            onClick={() => onItemClick(item.id)}
          >
            <IconContainer active={activeItem === item.id}>
              {item.icon}
            </IconContainer>
            <Label>{item.label}</Label>
          </NavigationItem>
        ))}
      </NavigationList>
    </NavigationContainer>
  );
};