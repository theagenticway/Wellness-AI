
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';
import { Layout } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

const CreatingPlanContainer = styled.div`
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

const Title = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const Subtitle = styled.p`
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

export default function CreatingPlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const pollStatus = async () => {
      try {
        const response = await api.get('/user/ai-status');
        const { status: newStatus } = response.data;

        if (newStatus === 'completed') {
          setStatus('completed');
          // Redirect to dashboard after a short delay
          setTimeout(() => router.push('/'), 1000);
        } else if (newStatus === 'failed') {
          setStatus('failed');
          setError('There was an issue creating your plan. Please try again later.');
        }
      } catch (err) {
        setStatus('failed');
        setError('Could not connect to the server. Please check your connection.');
      }
    };

    const intervalId = setInterval(pollStatus, 3000); // Poll every 3 seconds

    // Initial check
    pollStatus();

    return () => clearInterval(intervalId);
  }, [user, router]);

  return (
    <Layout showNavigation={false}>
      <CreatingPlanContainer>
        {status === 'pending' && (
          <>
            <Spinner />
            <Title>Creating Your Personalized Plan</Title>
            <Subtitle>
              Our AI is analyzing your responses to build the perfect wellness journey for you. This may take a moment.
            </Subtitle>
          </>
        )}
        {status === 'completed' && (
          <>
            <Title>Your Plan is Ready!</Title>
            <Subtitle>Redirecting you to your dashboard...</Subtitle>
          </>
        )}
        {status === 'failed' && (
          <>
            <Title>Something Went Wrong</Title>
            <Subtitle>We encountered an error while creating your plan.</Subtitle>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </>
        )}
      </CreatingPlanContainer>
    </Layout>
  );
}
