'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  activeNavItem?: string;
  onNavItemClick?: (id: string) => void;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${theme.spacing.lg} ${theme.spacing.lg} 0;
  background: ${theme.colors.background};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${theme.spacing.md} 0;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${theme.colors.text.muted};
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Main = styled.main<{ hasNavigation?: boolean }>`
  flex: 1;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  padding-bottom: ${({ hasNavigation }) => hasNavigation ? '100px' : theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'modules', label: 'Modules', icon: '📋' },
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  activeNavItem = 'dashboard',
  onNavItemClick = () => {},
}) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>Dashboard</Title>
        <SettingsButton>⚙️</SettingsButton>
      </Header>
      
      <Main hasNavigation={showNavigation}>
        {children}
      </Main>
      
      {showNavigation && (
        <BottomNavigation
          items={navigationItems}
          activeItem={activeNavItem}
          onItemClick={onNavItemClick}
        />
      )}
    </LayoutContainer>
  );
};