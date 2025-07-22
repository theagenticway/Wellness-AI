'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button, Card, Input } from '@/components';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.accent}10);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${theme.spacing['2xl']};
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
  margin-bottom: ${theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}10;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}20;
  font-size: ${theme.fontSize.sm};
`;

const SuccessMessage = styled.div`
  background: ${theme.colors.status.success}10;
  color: ${theme.colors.status.success};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.success}20;
  font-size: ${theme.fontSize.sm};
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: ${theme.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    auth: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    personalInfo: {
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleAuthChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        [field]: e.target.value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic validation for step 1
    if (currentStep === 1) {
      if (formData.auth.password !== formData.auth.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      if (formData.auth.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
      
      nextStep();
      setIsLoading(false);
      return;
    }

    // Final submission - atomic user creation with full profile
    if (currentStep === 6) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register-complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth: formData.auth,
            personalInfo: {
              firstName: formData.auth.firstName,
              lastName: formData.auth.lastName,
              email: formData.auth.email,
              age: formData.personalInfo.age,
              gender: formData.personalInfo.gender
            },
            healthInfo: formData.healthInfo,
            behaviorProfile: formData.behaviorProfile,
            lifestyle: formData.lifestyle,
            preferences: formData.preferences
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess('Account created successfully! Signing you in...');
          
          // Automatically sign in the user after registration
          const signInResult = await signIn('credentials', {
            email: formData.auth.email,
            password: formData.auth.password,
            redirect: false,
          });

          if (signInResult?.error) {
            setError('Account created but sign-in failed. Please try signing in manually.');
          } else {
            // Redirect directly to dashboard - user is fully onboarded
            router.push('/dashboard');
          }
        } else {
          setError(result.message || 'Failed to create account. Please try again.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      nextStep();
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Join WellnessAI</Title>
        <Subtitle>{currentStep === 1 ? 'Create your account and personalize your wellness journey' : 'Let\'s personalize your wellness journey'}</Subtitle>
        
        {currentStep > 1 && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill $progress={((currentStep - 1) / 5) * 100} />
            </ProgressBar>
            <StepText>Step {currentStep - 1} of 5</StepText>
          </ProgressContainer>
        )}
        
        <Form onSubmit={handleSubmit}>
          {/* Step 1: Basic Registration */}
          {currentStep === 1 && (
            <FormSection>
              <FormRow>
                <Input
                  label="First Name"
                  type="text"
                  value={formData.auth.firstName}
                  onChange={handleAuthChange('firstName')}
                  placeholder="First name"
                  required
                  fullWidth
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={formData.auth.lastName}
                  onChange={handleAuthChange('lastName')}
                  placeholder="Last name"
                  required
                  fullWidth
                />
              </FormRow>
              
              <Input
                label="Email"
                type="email"
                value={formData.auth.email}
                onChange={handleAuthChange('email')}
                placeholder="Enter your email"
                required
                fullWidth
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.auth.password}
                onChange={handleAuthChange('password')}
                placeholder="Create a password"
                required
                fullWidth
              />
              
              <Input
                label="Confirm Password"
                type="password"
                value={formData.auth.confirmPassword}
                onChange={handleAuthChange('confirmPassword')}
                placeholder="Confirm your password"
                required
                fullWidth
              />
            </FormSection>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <FormSection>
              <StepTitle>Personal Information</StepTitle>
              
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

          {/* Step 3: Health Goals */}
          {currentStep === 3 && (
            <FormSection>
              <StepTitle>Health Goals</StepTitle>
              
              <FormGroup>
                <Label>Primary Goals (select all that apply)</Label>
                <CheckboxGroup>
                  {['Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Management', 'More Energy', 'Better Nutrition'].map(goal => (
                    <CheckboxLabel key={goal}>
                      <StyledCheckbox
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
                      />
                      <span>{goal}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>Current Phase</Label>
                <StyledSelect
                  value={formData.healthInfo.currentPhase}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    healthInfo: { ...prev.healthInfo, currentPhase: e.target.value as any }
                  }))}
                >
                  <option value="phase1">Phase 1 - Foundation Building</option>
                  <option value="phase2">Phase 2 - Habit Optimization</option>
                  <option value="phase3">Phase 3 - Advanced Integration</option>
                </StyledSelect>
              </FormGroup>
            </FormSection>
          )}

          {/* Step 4: Lifestyle */}
          {currentStep === 4 && (
            <FormSection>
              <StepTitle>Lifestyle & Preferences</StepTitle>
              
              <FormGroup>
                <Label>Exercise Experience</Label>
                <StyledSelect
                  value={formData.lifestyle.exerciseExperience}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lifestyle: { ...prev.lifestyle, exerciseExperience: e.target.value }
                  }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </StyledSelect>
              </FormGroup>

              <FormGroup>
                <Label>Time Availability (minutes per day)</Label>
                <StyledSelect
                  value={formData.lifestyle.timeAvailability}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lifestyle: { ...prev.lifestyle, timeAvailability: e.target.value }
                  }))}
                >
                  <option value="5-10">5-10 minutes</option>
                  <option value="15-30">15-30 minutes</option>
                  <option value="30-60">30-60 minutes</option>
                  <option value="60+">60+ minutes</option>
                </StyledSelect>
              </FormGroup>

              <SliderGroup>
                <SliderLabel>
                  <Label>Current Stress Level</Label>
                  <SliderValue>{formData.lifestyle.stressLevel}/10</SliderValue>
                </SliderLabel>
                <StyledSlider
                  type="range"
                  min="1"
                  max="10"
                  value={formData.lifestyle.stressLevel}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lifestyle: { ...prev.lifestyle, stressLevel: parseInt(e.target.value) }
                  }))}
                />
              </SliderGroup>
            </FormSection>
          )}

          {/* Step 5: Behavior Profile */}
          {currentStep === 5 && (
            <FormSection>
              <StepTitle>Behavior Profile</StepTitle>
              
              <FormGroup>
                <Label>Motivation Type</Label>
                <StyledSelect
                  value={formData.behaviorProfile.motivationType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    behaviorProfile: { ...prev.behaviorProfile, motivationType: e.target.value as any }
                  }))}
                >
                  <option value="intrinsic">Intrinsic (Self-motivated)</option>
                  <option value="extrinsic">Extrinsic (External rewards)</option>
                  <option value="balanced">Balanced</option>
                </StyledSelect>
              </FormGroup>

              <FormGroup>
                <Label>Best Performance Time</Label>
                <CheckboxGroup>
                  {['Early Morning (5-7 AM)', 'Morning (7-10 AM)', 'Late Morning (10-12 PM)', 'Early Afternoon (12-3 PM)', 'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'].map(time => (
                    <CheckboxLabel key={time}>
                      <StyledCheckbox
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
                      />
                      <span>{time}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>Communication Style</Label>
                <StyledSelect
                  value={formData.preferences.communicationStyle}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, communicationStyle: e.target.value }
                  }))}
                >
                  <option value="encouraging">Encouraging</option>
                  <option value="direct">Direct</option>
                  <option value="gentle">Gentle</option>
                  <option value="motivational">Motivational</option>
                </StyledSelect>
              </FormGroup>
            </FormSection>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <FormSection>
              <StepTitle>Complete Your Registration</StepTitle>
              <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg }}>Ready to create your personalized wellness plan? Click below to complete your registration and start your journey!</p>
            </FormSection>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <ButtonContainer>
            {currentStep > 1 && (
              <StyledButton type="button" onClick={prevStep} $variant="secondary">
                Previous
              </StyledButton>
            )}
            
            <StyledButton 
              type="submit" 
              disabled={isLoading} 
              $variant="primary" 
              style={{ marginLeft: currentStep === 1 ? 'auto' : undefined }}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span style={{ marginLeft: '8px' }}>
                    {currentStep === 6 ? 'Creating account...' : 'Next'}
                  </span>
                </>
              ) : (
                currentStep === 6 ? 'Complete Registration' : (currentStep === 1 ? 'Continue' : 'Next')
              )}
            </StyledButton>
          </ButtonContainer>
        </Form>
        
        <LinkText>
          Already have an account? <a href="/auth/login">Sign in</a>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
}