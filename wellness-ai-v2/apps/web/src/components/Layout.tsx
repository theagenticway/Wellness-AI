'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

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

const HeaderActions = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.sm};
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${theme.colors.text.muted};
  transition: color 0.2s ease-in-out;
  position: relative;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  min-width: 150px;
  z-index: ${theme.zIndex.dropdown};
  opacity: ${({ show }) => show ? 1 : 0};
  transform: ${({ show }) => show ? 'translateY(8px)' : 'translateY(4px)'};
  pointer-events: ${({ show }) => show ? 'auto' : 'none'};
  transition: all 0.2s ease-in-out;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.primary};
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background: ${theme.colors.surface};
  }
  
  &:first-child {
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
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
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <LayoutContainer>
      <Header>
        <Title>Dashboard</Title>
        <HeaderActions>
          <UserInfo>
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </UserInfo>
          <SettingsButton onClick={() => setShowDropdown(!showDropdown)}>
            ⚙️
          </SettingsButton>
          <DropdownMenu show={showDropdown}>
            <DropdownItem onClick={() => setShowDropdown(false)}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={logout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </HeaderActions>
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