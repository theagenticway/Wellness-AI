'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ClientAPI } from '@/lib/client-api';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OnboardingCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing['2xl']};
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const ProgressContainer = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease;
  border-radius: ${theme.borderRadius.full};
`;

const StepText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.muted};
  text-align: center;
`;

const StepTitle = styled.h2`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
  
  ${({ $variant }) => $variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${theme.colors.primaryHover};
    }
  ` : `
    background: ${theme.colors.secondary};
    color: ${theme.colors.text.secondary};
    
    &:hover {
      background: ${theme.colors.border};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const StyledInput = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

const StyledSelect = styled.select`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.md} 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const StyledCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${theme.colors.primary};
`;

const SliderGroup = styled.div`
  margin: ${theme.spacing.md} 0;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xs};
`;

const SliderValue = styled.span`
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.primary};
`;

const StyledSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.border};
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: session?.user?.name?.split(' ')[0] || '',
      lastName: session?.user?.name?.split(' ')[1] || '',
      email: session?.user?.email || '',
      age: 30,
      gender: 'other'
    },
    healthInfo: {
      currentPhase: 'phase1' as const,
      primaryGoals: [] as string[],
      healthConditions: [] as string[],
      medications: [] as string[],
      allergies: [] as string[],
      currentWeight: undefined,
      targetWeight: undefined,
      height: undefined
    },
    behaviorProfile: {
      motivationType: 'balanced' as const,
      lossAversion: 5,
      presentBias: 5,
      socialInfluence: 5,
      gamificationResponse: 5,
      bestPerformanceTime: [] as string[],
      willpowerPattern: 'steady',
      publicCommitments: false,
      socialAccountability: false,
      reminderFrequency: 'moderate' as const,
      nudgeStyle: 'encouraging' as const
    },
    lifestyle: {
      currentDiet: 'standard',
      exerciseExperience: 'beginner',
      sleepSchedule: {
        bedtime: '22:00',
        wakeTime: '07:00',
        avgSleepHours: 8
      },
      stressLevel: 5,
      timeAvailability: '15-30',
      mainChallenges: [] as string[]
    },
    preferences: {
      communicationStyle: 'encouraging',
      accountabilityPreference: 'self-directed',
      rewardPreference: [] as string[],
      specificGoals: {}
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the unified ClientAPI for cleaner authentication handling
      await ClientAPI.submitOnboarding(formData);
      
      // Update the session to reflect onboarding completion
      await update({
        ...session,
        user: {
          ...session?.user,
          requiresOnboarding: false,
        }
      });
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      alert(`Onboarding failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!session) {
    return (
      <OnboardingContainer>
        <OnboardingCard style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Title style={{ fontSize: theme.fontSize['2xl'] }}>Please log in to continue</Title>
          <StyledButton onClick={() => router.push('/auth/login')} $variant="primary">
            Go to Login
          </StyledButton>
        </OnboardingCard>
      </OnboardingContainer>
    );
  }

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <Title>Welcome to WellnessAI!</Title>
        <Subtitle>Let's personalize your wellness journey</Subtitle>
        
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill $progress={(currentStep / 4) * 100} />
          </ProgressBar>
          <StepText>Step {currentStep} of 4</StepText>
        </ProgressContainer>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <FormSection>
                <StepTitle>Personal Information</StepTitle>
                
                <FormGrid>
                  <FormGroup>
                    <Label>First Name</Label>
                    <StyledInput
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                      placeholder="Enter your first name"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <StyledInput
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                      placeholder="Enter your last name"
                      required
                    />
                  </FormGroup>
                </FormGrid>

                <FormGrid>
                  <FormGroup>
                    <Label>Age</Label>
                    <StyledInput
                      type="number"
                      min="18"
                      max="100"
                      value={formData.personalInfo.age}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, age: parseInt(e.target.value) }
                      }))}
                      placeholder="Enter your age"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Gender</Label>
                    <StyledSelect
                      value={formData.personalInfo.gender}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, gender: e.target.value }
                      }))}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </StyledSelect>
                  </FormGroup>
                </FormGrid>
              </FormSection>
            )}

            {/* Step 2: Health Goals */}
            {currentStep === 2 && (
              <FormSection>
                <StepTitle>Health Goals</StepTitle>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Goals (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Management', 'More Energy', 'Better Nutrition'].map(goal => (
                      <label key={goal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.healthInfo.primaryGoals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                healthInfo: {
                                  ...prev.healthInfo,
                                  primaryGoals: [...prev.healthInfo.primaryGoals, goal]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                healthInfo: {
                                  ...prev.healthInfo,
                                  primaryGoals: prev.healthInfo.primaryGoals.filter(g => g !== goal)
                                }
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Phase</label>
                  <select
                    value={formData.healthInfo.currentPhase}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      healthInfo: { ...prev.healthInfo, currentPhase: e.target.value as any }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="phase1">Phase 1 - Foundation Building</option>
                    <option value="phase2">Phase 2 - Habit Optimization</option>
                    <option value="phase3">Phase 3 - Advanced Integration</option>
                  </select>
                </div>
              </FormSection>
            )}

            {/* Step 3: Lifestyle */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Lifestyle & Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Experience</label>
                  <select
                    value={formData.lifestyle.exerciseExperience}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, exerciseExperience: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Availability (minutes per day)</label>
                  <select
                    value={formData.lifestyle.timeAvailability}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, timeAvailability: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5-10">5-10 minutes</option>
                    <option value="15-30">15-30 minutes</option>
                    <option value="30-60">30-60 minutes</option>
                    <option value="60+">60+ minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Stress Level (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.lifestyle.stressLevel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, stressLevel: parseInt(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Current: {formData.lifestyle.stressLevel}</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Behavior Profile */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Behavior Profile</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Motivation Type</label>
                  <select
                    value={formData.behaviorProfile.motivationType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      behaviorProfile: { ...prev.behaviorProfile, motivationType: e.target.value as any }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="intrinsic">Intrinsic (Self-motivated)</option>
                    <option value="extrinsic">Extrinsic (External rewards)</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Best Performance Time</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Early Morning (5-7 AM)', 'Morning (7-10 AM)', 'Late Morning (10-12 PM)', 'Early Afternoon (12-3 PM)', 'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'].map(time => (
                      <label key={time} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.behaviorProfile.bestPerformanceTime.includes(time)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                behaviorProfile: {
                                  ...prev.behaviorProfile,
                                  bestPerformanceTime: [...prev.behaviorProfile.bestPerformanceTime, time]
                                }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                behaviorProfile: {
                                  ...prev.behaviorProfile,
                                  bestPerformanceTime: prev.behaviorProfile.bestPerformanceTime.filter(t => t !== time)
                                }
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Communication Style</label>
                  <select
                    value={formData.preferences.communicationStyle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, communicationStyle: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="encouraging">Encouraging</option>
                    <option value="direct">Direct</option>
                    <option value="gentle">Gentle</option>
                    <option value="motivational">Motivational</option>
                  </select>
                </div>
              </div>
            )}

            <ButtonContainer>
              {currentStep > 1 && (
                <StyledButton type="button" onClick={prevStep} $variant="secondary">
                  Previous
                </StyledButton>
              )}
              
              {currentStep < 4 ? (
                <StyledButton type="button" onClick={nextStep} $variant="primary" style={{ marginLeft: 'auto' }}>
                  Next
                </StyledButton>
              ) : (
                <StyledButton type="submit" disabled={isSubmitting} $variant="primary" style={{ marginLeft: 'auto' }}>
                  {isSubmitting ? 'Completing...' : 'Complete Onboarding'}
                </StyledButton>
              )}
            </ButtonContainer>
          </form>
      </OnboardingCard>
    </OnboardingContainer>
  );
}