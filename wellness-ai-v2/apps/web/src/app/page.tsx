'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Layout, WellnessCard, ClientCard } from '@/components';
import { useState } from 'react';

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

export default function Home() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const todayActivities = [
    {
      category: 'Workout',
      title: 'Morning Yoga',
      subtitle: '30 minutes',
      status: 'pending' as const,
    },
    {
      category: 'Nutrition',
      title: 'Breakfast',
      subtitle: 'Logged 3 items',
      status: 'completed' as const,
    },
    {
      category: 'Mindfulness',
      title: 'Meditation',
      subtitle: '15 minutes',
      status: 'pending' as const,
    },
    {
      category: 'CBT',
      title: 'Thought Journal',
      subtitle: 'Completed',
      status: 'completed' as const,
    },
  ];

  const clients = [
    { name: 'Ethan Carter', progress: 75 },
    { name: 'Olivia Bennett', progress: 60 },
    { name: 'Noah Thompson', progress: 80 },
    { name: 'Ava Martinez', progress: 90 },
    { name: 'Liam Harper', progress: 50 },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'clients':
        return (
          <ContentSection>
            <SectionTitle>Clients</SectionTitle>
            <CardGrid>
              {clients.map((client, index) => (
                <ClientCard
                  key={index}
                  name={client.name}
                  progress={client.progress}
                  onClick={() => console.log(`Clicked ${client.name}`)}
                />
              ))}
            </CardGrid>
          </ContentSection>
        );
      
      default:
        return (
          <ContentSection>
            <SubTitle>Today</SubTitle>
            <CardGrid>
              {todayActivities.map((activity, index) => (
                <WellnessCard
                  key={index}
                  category={activity.category}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  status={activity.status}
                  onClick={() => console.log(`Clicked ${activity.title}`)}
                />
              ))}
            </CardGrid>
          </ContentSection>
        );
    }
  };

  return (
    <Layout 
      activeNavItem={activeNav} 
      onNavItemClick={setActiveNav}
    >
      {renderContent()}
    </Layout>
  );
}
