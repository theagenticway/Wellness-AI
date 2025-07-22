'use client';

import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';
import { Layout, WellnessCard, ClientCard } from '@/components';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const ContentSection = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SubTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: ${theme.spacing.xl};
`;

const LoadingSpinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${theme.colors.surface};
  border-top: 4px solid ${theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${LoadingSpinner} 1s linear infinite;
  margin-bottom: ${theme.spacing.lg};
`;

const LoadingTitle = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const LoadingSubtitle = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text.secondary};
  max-width: 400px;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.danger};
  background-color: ${theme.colors.danger}1a;
  border: 1px solid ${theme.colors.danger};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing.lg};
`;

export default function Home() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const { user } = useAuth();
  const [planStatus, setPlanStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [dailyPlan, setDailyPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const pollStatus = async () => {
      try {
        const response = await api.get('/user/ai-status');
        const { status: newStatus } = response.data;

        if (newStatus === 'completed') {
          setPlanStatus('completed');
          fetchPlan();
        } else if (newStatus === 'failed') {
          setPlanStatus('failed');
          setError('There was an issue creating your plan. Please try again later.');
        }
      } catch (err) {
        setPlanStatus('failed');
        setError('Could not connect to the server. Please check your connection.');
      }
    };

    const fetchPlan = async () => {
      try {
        const response = await api.get('/wellness/daily-plan');
        setDailyPlan(response.data.data);
      } catch (err) {
        setPlanStatus('failed');
        setError('Failed to fetch your daily plan.');
      }
    };

    const intervalId = setInterval(pollStatus, 3000); // Poll every 3 seconds

    // Initial check
    pollStatus();

    return () => clearInterval(intervalId);
  }, [user]);

  const renderContent = () => {
    if (planStatus === 'pending') {
      return (
        <LoadingContainer>
          <Spinner />
          <LoadingTitle>Creating Your Personalized Plan</LoadingTitle>
          <LoadingSubtitle>
            Our AI is analyzing your responses to build the perfect wellness journey for you. This may take a moment.
          </LoadingSubtitle>
        </LoadingContainer>
      );
    }

    if (planStatus === 'failed') {
      return (
        <LoadingContainer>
          <LoadingTitle>Something Went Wrong</LoadingTitle>
          <LoadingSubtitle>We encountered an error while creating your plan.</LoadingSubtitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoadingContainer>
      );
    }

    if (planStatus === 'completed' && dailyPlan) {
      switch (activeNav) {
        case 'clients':
          return (
            <ContentSection>
              <SectionTitle>Clients</SectionTitle>
              <CardGrid>
                {/* Replace with actual client data */}
              </CardGrid>
            </ContentSection>
          );
        
        default:
          return (
            <ContentSection>
              <SubTitle>Today</SubTitle>
              <CardGrid>
                {dailyPlan.dailyPlan.map((activity: any, index: number) => (
                  <WellnessCard
                    key={index}
                    category={activity.category}
                    title={activity.title}
                    subtitle={activity.description}
                    status={activity.completed ? 'completed' : 'pending'}
                    onClick={() => console.log(`Clicked ${activity.title}`)}
                  />
                ))}
              </CardGrid>
            </ContentSection>
          );
      }
    }

    return null; // Should not be reached
  };

  return (
    <ProtectedRoute>
      <Layout 
        activeNavItem={activeNav} 
        onNavItemClick={setActiveNav}
      >
        {renderContent()}
      </Layout>
    </ProtectedRoute>
  );
}
