'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ClientAPI } from '@/lib/client-api';

// Main container for the page
const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// The card holding the form content
const OnboardingCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing['2xl']};
  width: 100%;
  max-width: 700px; // Increased width for more complex steps
`;

// Main title
const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm};
`;

// Subtitle below the main title
const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

// Progress bar container
const ProgressContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{
  $progress: number;
}>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  width: ${({ $progress }) => $progress}%;
  transition: width 0.4s ease-in-out;
  border-radius: ${theme.borderRadius.full};
`;

const StepText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.muted};
  text-align: center;
  margin-top: ${theme.spacing.sm};
`;

// Container for each step in the form
const StepContent = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const StepTitle = styled.h2`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

// Grid for form elements
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

// Group for a label and its input
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

// Styled input field
const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}30;
  }
`;

// Styled select dropdown
const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}30;
  }
`;

// Checkbox group styling
const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.secondary};
  }

  input:checked + & {
    background-color: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
  }
`;

const StyledCheckbox = styled.input`
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xs};
  background-color: ${theme.colors.surface};
  display: inline-block;
  position: relative;
  cursor: pointer;

  &:checked {
    background-color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }

  &:checked::after {
    content: '\2713'; // Checkmark character
    font-size: 12px;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Slider group styling
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

// Container for navigation buttons
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

// Styled button
const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-width: 120px;
  font-size: ${theme.fontSize.md};
  
  ${({ $variant }) => $variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;
    &:hover { background: ${theme.colors.primaryHover}; }
  ` : `
    background: ${theme.colors.surface};
    color: ${theme.colors.text.primary};
    border-color: ${theme.colors.border};
    &:hover { background: ${theme.colors.secondary}; }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  margin-top: ${theme.spacing.md};
`;

const TOTAL_STEPS = 8;

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // IMPORTANT: This formData structure is PRESERVED to match the backend API contract.
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

  const handleFieldChange = (section: string, field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement; // Cast to HTMLInputElement for checkbox type
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleMultiSelectChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[section][field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [section]: { ...prev[section], [field]: newArray }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep < TOTAL_STEPS) {
      // Add validation for current step here if needed
      nextStep();
      return;
    }

    // Final submission
    setIsSubmitting(true);
    try {
      await ClientAPI.submitOnboarding(formData);
      
      await update({
        ...session,
        user: {
          ...session?.user,
          requiresOnboarding: false,
        }
      });
      
      router.push('/onboarding/creating-plan');
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.response?.data?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!session) {
    return (
      <OnboardingContainer>
        <OnboardingCard style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Title style={{ fontSize: theme.fontSize['2xl'] }}>Please log in to continue</Title>
          <Button $variant="primary" onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </OnboardingCard>
      </OnboardingContainer>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <StepTitle>Welcome to WellnessAI</StepTitle>
            <p className="text-center text-gray-600 mb-6">Let's get to know you better to create your personalized wellness plan.</p>
          </StepContent>
        );
      case 2:
        return (
          <StepContent>
            <StepTitle>Personal Information</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" value={formData.personalInfo.firstName} onChange={handleFieldChange('personalInfo', 'firstName')} placeholder="John" required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" value={formData.personalInfo.lastName} onChange={handleFieldChange('personalInfo', 'lastName')} placeholder="Doe" required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={formData.personalInfo.age} onChange={handleFieldChange('personalInfo', 'age')} min="18" max="100" required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" value={formData.personalInfo.gender} onChange={handleFieldChange('personalInfo', 'gender')} required>
                  <option value="other">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </StepContent>
        );
      case 3:
        return (
          <StepContent>
            <StepTitle>Health Background & Goals</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Primary Goals (select all that apply)</Label>
                <CheckboxGroup>
                  {['Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Management', 'More Energy', 'Better Nutrition', 'Improved Digestion', 'Reduced Inflammation'].map(goal => (
                    <CheckboxLabel key={goal}>
                      <StyledCheckbox
                        type="checkbox"
                        checked={formData.healthInfo.primaryGoals.includes(goal)}
                        onChange={() => handleMultiSelectChange('healthInfo', 'primaryGoals', goal)}
                      />
                      <span>{goal}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Current Phase</Label>
                <Select value={formData.healthInfo.currentPhase} onChange={handleFieldChange('healthInfo', 'currentPhase')} required>
                  <option value="phase1">Phase 1 - Foundation Building</option>
                  <option value="phase2">Phase 2 - Habit Optimization</option>
                  <option value="phase3">Phase 3 - Advanced Integration</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Health Conditions (e.g., Diabetes, Hypertension)</Label>
                <Input type="text" value={formData.healthInfo.healthConditions.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, healthInfo: { ...prev.healthInfo, healthConditions: e.target.value.split(', ').map(s => s.trim()) } }))} placeholder="None" />
              </FormGroup>
              <FormGroup>
                <Label>Medications (e.g., Metformin, Lisinopril)</Label>
                <Input type="text" value={formData.healthInfo.medications.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, healthInfo: { ...prev.healthInfo, medications: e.target.value.split(', ').map(s => s.trim()) } }))} placeholder="None" />
              </FormGroup>
              <FormGroup>
                <Label>Allergies (e.g., Peanuts, Gluten)</Label>
                <Input type="text" value={formData.healthInfo.allergies.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, healthInfo: { ...prev.healthInfo, allergies: e.target.value.split(', ').map(s => s.trim()) } }))} placeholder="None" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
                <Input id="currentWeight" type="number" value={formData.healthInfo.currentWeight || ''} onChange={handleFieldChange('healthInfo', 'currentWeight')} placeholder="e.g., 150" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                <Input id="targetWeight" type="number" value={formData.healthInfo.targetWeight || ''} onChange={handleFieldChange('healthInfo', 'targetWeight')} placeholder="e.g., 130" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="height">Height (inches)</Label>
                <Input id="height" type="number" value={formData.healthInfo.height || ''} onChange={handleFieldChange('healthInfo', 'height')} placeholder="e.g., 68" />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );
      case 4:
        return (
          <StepContent>
            <StepTitle>Behavioral Preferences</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Motivation Type</Label>
                <Select value={formData.behaviorProfile.motivationType} onChange={handleFieldChange('behaviorProfile', 'motivationType')} required>
                  <option value="intrinsic">Intrinsic (Self-motivated)</option>
                  <option value="extrinsic">Extrinsic (External rewards)</option>
                  <option value="balanced">Balanced</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Loss Aversion (1-10, higher = more averse to losing)</Label>
                <Input type="number" value={formData.behaviorProfile.lossAversion} onChange={handleFieldChange('behaviorProfile', 'lossAversion')} min="1" max="10" />
              </FormGroup>
              <FormGroup>
                <Label>Present Bias (1-10, higher = prefer immediate rewards)</Label>
                <Input type="number" value={formData.behaviorProfile.presentBias} onChange={handleFieldChange('behaviorProfile', 'presentBias')} min="1" max="10" />
              </FormGroup>
              <FormGroup>
                <Label>Social Influence (1-10, higher = more influenced by peers)</Label>
                <Input type="number" value={formData.behaviorProfile.socialInfluence} onChange={handleFieldChange('behaviorProfile', 'socialInfluence')} min="1" max="10" />
              </FormGroup>
              <FormGroup>
                <Label>Gamification Response (1-10, higher = responds well to points/badges)</Label>
                <Input type="number" value={formData.behaviorProfile.gamificationResponse} onChange={handleFieldChange('behaviorProfile', 'gamificationResponse')} min="1" max="10" />
              </FormGroup>
              <FormGroup>
                <Label>Best Performance Time (select all that apply)</Label>
                <CheckboxGroup>
                  {['Early Morning (5-7 AM)', 'Morning (7-10 AM)', 'Late Morning (10-12 PM)', 'Early Afternoon (12-3 PM)', 'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'].map(time => (
                    <CheckboxLabel key={time}>
                      <StyledCheckbox
                        type="checkbox"
                        checked={formData.behaviorProfile.bestPerformanceTime.includes(time)}
                        onChange={() => handleMultiSelectChange('behaviorProfile', 'bestPerformanceTime', time)}
                      />
                      <span>{time}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Willpower Pattern</Label>
                <Select value={formData.behaviorProfile.willpowerPattern} onChange={handleFieldChange('behaviorProfile', 'willpowerPattern')} required>
                  <option value="steady">Steady throughout day</option>
                  <option value="declining">Declines throughout day</option>
                  <option value="fluctuating">Fluctuates</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Public Commitments</Label>
                <CheckboxLabel>
                  <StyledCheckbox type="checkbox" checked={formData.behaviorProfile.publicCommitments} onChange={handleFieldChange('behaviorProfile', 'publicCommitments')} />
                  <span>I am motivated by making public commitments.</span>
                </CheckboxLabel>
              </FormGroup>
              <FormGroup>
                <Label>Social Accountability</Label>
                <CheckboxLabel>
                  <StyledCheckbox type="checkbox" checked={formData.behaviorProfile.socialAccountability} onChange={handleFieldChange('behaviorProfile', 'socialAccountability')} />
                  <span>I am motivated by social accountability.</span>
                </CheckboxLabel>
              </FormGroup>
              <FormGroup>
                <Label>Reminder Frequency</Label>
                <Select value={formData.behaviorProfile.reminderFrequency} onChange={handleFieldChange('behaviorProfile', 'reminderFrequency')} required>
                  <option value="minimal">Minimal</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="intensive">Intensive</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Nudge Style</Label>
                <Select value={formData.behaviorProfile.nudgeStyle} onChange={handleFieldChange('behaviorProfile', 'nudgeStyle')} required>
                  <option value="gentle">Gentle</option>
                  <option value="encouraging">Encouraging</option>
                  <option value="motivational">Motivational</option>
                  <option value="playful">Playful</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </StepContent>
        );
      case 5:
        return (
          <StepContent>
            <StepTitle>Current Lifestyle</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Current Diet</Label>
                <Select value={formData.lifestyle.currentDiet} onChange={handleFieldChange('lifestyle', 'currentDiet')} required>
                  <option value="standard">Standard</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Exercise Experience</Label>
                <Select value={formData.lifestyle.exerciseExperience} onChange={handleFieldChange('lifestyle', 'exerciseExperience')} required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Sleep Schedule - Bedtime</Label>
                <Input type="time" value={formData.lifestyle.sleepSchedule.bedtime} onChange={(e) => setFormData(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, sleepSchedule: { ...prev.lifestyle.sleepSchedule, bedtime: e.target.value } } }))} required />
              </FormGroup>
              <FormGroup>
                <Label>Sleep Schedule - Wake Time</Label>
                <Input type="time" value={formData.lifestyle.sleepSchedule.wakeTime} onChange={(e) => setFormData(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, sleepSchedule: { ...prev.lifestyle.sleepSchedule, wakeTime: e.target.value } } }))} required />
              </FormGroup>
              <FormGroup>
                <Label>Average Sleep Hours</Label>
                <Input type="number" value={formData.lifestyle.sleepSchedule.avgSleepHours} onChange={(e) => setFormData(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, sleepSchedule: { ...prev.lifestyle.sleepSchedule, avgSleepHours: parseInt(e.target.value) } } }))} min="0" max="24" required />
              </FormGroup>
              <SliderGroup>
                <SliderLabel>
                  <Label>Current Stress Level</Label>
                  <SliderValue>{formData.lifestyle.stressLevel}/10</SliderValue>
                </SliderLabel>
                <StyledSlider type="range" min="1" max="10" value={formData.lifestyle.stressLevel} onChange={handleFieldChange('lifestyle', 'stressLevel')} />
              </SliderGroup>
            </FormGrid>
          </StepContent>
        );
      case 6:
        return (
          <StepContent>
            <StepTitle>Challenges & Time Availability</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Main Challenges (select all that apply)</Label>
                <CheckboxGroup>
                  {['Lack of time', 'Lack of motivation', 'Inconsistent schedule', 'Past failures/discouragement', 'Lack of support system', 'Emotional eating', 'Cravings', 'Stress', 'Sleep issues', 'Digestive issues'].map(challenge => (
                    <CheckboxLabel key={challenge}>
                      <StyledCheckbox
                        type="checkbox"
                        checked={formData.lifestyle.mainChallenges.includes(challenge)}
                        onChange={() => handleMultiSelectChange('lifestyle', 'mainChallenges', challenge)}
                      />
                      <span>{challenge}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Time Availability (minutes per day for wellness activities)</Label>
                <Select value={formData.lifestyle.timeAvailability} onChange={handleFieldChange('lifestyle', 'timeAvailability')} required>
                  <option value="5-10">5-10 minutes</option>
                  <option value="15-30">15-30 minutes</option>
                  <option value="30-60">30-60 minutes</option>
                  <option value="60+">60+ minutes</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </StepContent>
        );
      case 7:
        return (
          <StepContent>
            <StepTitle>Support & Communication Preferences</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Communication Style</Label>
                <Select value={formData.preferences.communicationStyle} onChange={handleFieldChange('preferences', 'communicationStyle')} required>
                  <option value="encouraging">Encouraging</option>
                  <option value="direct">Direct</option>
                  <option value="gentle">Gentle</option>
                  <option value="motivational">Motivational</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Accountability Preference</Label>
                <Select value={formData.preferences.accountabilityPreference} onChange={handleFieldChange('preferences', 'accountabilityPreference')} required>
                  <option value="self-directed">Self-directed</option>
                  <option value="peer-accountability">Peer Accountability</option>
                  <option value="professional-guidance">Professional Guidance</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Reward Preference (select all that apply)</Label>
                <CheckboxGroup>
                  {['Earning points, badges, or rewards', 'Feeling a sense of accomplishment', 'Positive feedback from others', 'Improved health metrics', 'Increased energy', 'Better mood'].map(reward => (
                    <CheckboxLabel key={reward}>
                      <StyledCheckbox
                        type="checkbox"
                        checked={formData.preferences.rewardPreference.includes(reward)}
                        onChange={() => handleMultiSelectChange('preferences', 'rewardPreference', reward)}
                      />
                      <span>{reward}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Specific Goals (Optional - provide details)</Label>
                <textarea
                  value={JSON.stringify(formData.preferences.specificGoals, null, 2)}
                  onChange={(e) => {
                    try {
                      setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, specificGoals: JSON.parse(e.target.value) } }));
                    } catch (err) {
                      // Handle invalid JSON input gracefully
                      console.error("Invalid JSON for specific goals", err);
                    }
                  }}
                  rows={5}
                  style={{ width: '100%', padding: theme.spacing.md, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.background, color: theme.colors.text.primary }}
                  placeholder="e.g., { \"weight\": { \"target\": 130, \"timeline\": \"3 months\" } }"
                />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );
      case 8:
        return (
          <StepContent>
            <StepTitle>Assessment Complete!</StepTitle>
            <p className="text-center text-gray-600 mb-6">Thank you for completing the assessment. We have all the information needed to create your personalized wellness plan.</p>
            <p className="text-center text-gray-600">Click 'Create My Plan' to finalize your onboarding and see your tailored recommendations!</p>
          </StepContent>
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <Title>Welcome to WellnessAI!</Title>
        <Subtitle>Let's personalize your wellness journey</Subtitle>
        
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill $progress={(currentStep / TOTAL_STEPS) * 100} />
          </ProgressBar>
          <StepText>Step {currentStep} of {TOTAL_STEPS}</StepText>
        </ProgressContainer>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonContainer>
            <Button type="button" onClick={prevStep} $variant="secondary" disabled={currentStep === 1}>
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting} $variant="primary">
              {isSubmitting ? 'Creating Plan...' : (currentStep === TOTAL_STEPS ? 'Create My Plan' : 'Next')}
            </Button>
          </ButtonContainer>
        </form>
      </OnboardingCard>
    </OnboardingContainer>
  );
}