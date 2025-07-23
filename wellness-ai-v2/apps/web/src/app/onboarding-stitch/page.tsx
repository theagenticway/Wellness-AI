'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { ClientAPI } from '@/lib/client-api';

export default function OnboardingStitchPage() {
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
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
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      alert(`Onboarding failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Welcome to WellnessAI';
      case 2: return 'Health Goals';
      case 3: return 'Lifestyle & Preferences';
      case 4: return 'Behavior Profile';
      case 5: return 'Complete Setup';
      default: return 'Welcome to WellnessAI';
    }
  };

  if (!session) {
    return (
      <>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to continue</h1>
            <button 
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-[#1fdf92] text-[#111715] font-bold rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      
      <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'}}>
        <div>
          {/* Header */}
          <div className="flex items-center bg-white p-4 pb-2 justify-between">
            {currentStep > 1 && (
              <button 
                onClick={prevStep}
                className="text-[#121516] flex size-12 shrink-0 items-center hover:bg-gray-100 rounded-lg"
                data-icon="ArrowLeft" 
                data-size="24px" 
                data-weight="regular"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
              </button>
            )}
            <h2 className="text-[#121516] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
              {getStepTitle()}
            </h2>
          </div>

          {/* Progress Bar */}
          {currentStep > 1 && (
            <div className="flex flex-col gap-3 p-4">
              <div className="rounded bg-[#dde1e3]">
                <div className="h-2 rounded bg-[#121516]" style={{width: `${((currentStep - 1) / 4) * 100}%`}}></div>
              </div>
              <p className="text-[#6a7781] text-sm text-center">Step {currentStep - 1} of 4</p>
            </div>
          )}

          {/* Hero Image for Step 1 */}
          {currentStep === 1 && (
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-80"
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5sPnt0hinHcU_nmWjy5LbKbv9GaACzPfGUXrgl2wtZ4SIrQ0PYjm0pKmBkBTLUtgPvsIzpo9bD2vBeq2Ze0dK5yjHGZ4PxRyqDCesOjmVrjPjGgL7w6i4owEjjdHZf-sHFFMdEAek8dFQVSiNe0RXU08HA2J1i7MKfzF26qEATOIZGf22iGHzl6SIDEBbxY2LhMW1g2dQK1cNSsz2IdC_8qq3uDZxZADvBzokAhpemBiLdx5XvG8e1UuMSpKt9seRcB7BURQwVw")'}}
                ></div>
              </div>
            </div>
          )}

          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Let's get to know you</h2>
              <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                To tailor your wellness journey, we'll start with a quick health quiz. This will help us understand your needs and preferences.
              </p>
            </div>
          )}

          {/* Step 2: Health Goals */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Health Goals</h2>
              <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                What do you want to achieve? Select all that apply.
              </p>

              <div className="px-4 py-3">
                <p className="text-[#121516] text-sm font-medium mb-3">Primary Goals</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Management', 'More Energy', 'Better Nutrition'].map(goal => (
                    <label key={goal} className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#f1f2f4] cursor-pointer">
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
                        className="w-4 h-4 text-[#121516] accent-[#b2d0e5]"
                      />
                      <span className="text-[#121516] text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#121516] text-sm font-medium mb-2">Current Phase</p>
                  <select
                    value={formData.healthInfo.currentPhase}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      healthInfo: { ...prev.healthInfo, currentPhase: e.target.value as any }
                    }))}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                  >
                    <option value="phase1">Phase 1 - Foundation Building</option>
                    <option value="phase2">Phase 2 - Habit Optimization</option>
                    <option value="phase3">Phase 3 - Advanced Integration</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Lifestyle & Preferences</h2>
              <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                Help us understand your current lifestyle and preferences.
              </p>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#121516] text-sm font-medium mb-2">Exercise Experience</p>
                  <select
                    value={formData.lifestyle.exerciseExperience}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, exerciseExperience: e.target.value }
                    }))}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
              </div>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#121516] text-sm font-medium mb-2">Time Availability (minutes per day)</p>
                  <select
                    value={formData.lifestyle.timeAvailability}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, timeAvailability: e.target.value }
                    }))}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                  >
                    <option value="5-10">5-10 minutes</option>
                    <option value="15-30">15-30 minutes</option>
                    <option value="30-60">30-60 minutes</option>
                    <option value="60+">60+ minutes</option>
                  </select>
                </label>
              </div>

              <div className="px-4 py-3">
                <label className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[#121516] text-sm font-medium">Current Stress Level</p>
                    <span className="text-[#121516] font-medium">{formData.lifestyle.stressLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.lifestyle.stressLevel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, stressLevel: parseInt(e.target.value) }
                    }))}
                    className="w-full h-2 bg-[#f1f2f4] rounded-lg appearance-none cursor-pointer slider"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Behavior Profile */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Behavior Profile</h2>
              <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                Help us understand how you prefer to be motivated and supported.
              </p>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#121516] text-sm font-medium mb-2">Motivation Type</p>
                  <select
                    value={formData.behaviorProfile.motivationType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      behaviorProfile: { ...prev.behaviorProfile, motivationType: e.target.value as any }
                    }))}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                  >
                    <option value="intrinsic">Intrinsic (Self-motivated)</option>
                    <option value="extrinsic">Extrinsic (External rewards)</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </label>
              </div>

              <div className="px-4 py-3">
                <p className="text-[#121516] text-sm font-medium mb-3">Best Performance Time</p>
                <div className="grid grid-cols-1 gap-2">
                  {['Early Morning (5-7 AM)', 'Morning (7-10 AM)', 'Late Morning (10-12 PM)', 'Early Afternoon (12-3 PM)', 'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'].map(time => (
                    <label key={time} className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#f1f2f4] cursor-pointer">
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
                        className="w-4 h-4 text-[#121516] accent-[#b2d0e5]"
                      />
                      <span className="text-[#121516] text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#121516] text-sm font-medium mb-2">Communication Style</p>
                  <select
                    value={formData.preferences.communicationStyle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, communicationStyle: e.target.value }
                    }))}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                  >
                    <option value="encouraging">Encouraging</option>
                    <option value="direct">Direct</option>
                    <option value="gentle">Gentle</option>
                    <option value="motivational">Motivational</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Complete Setup */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">You're all set!</h2>
              <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                Your personalized wellness plan is ready. Let's start your journey to a healthier you.
              </p>
            </div>
          )}

          {/* Navigation Button */}
          <div className="flex px-4 py-3">
            <button
              onClick={currentStep === 5 ? handleSubmit : nextStep}
              disabled={isSubmitting}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#b2d0e5] text-[#121516] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#9ac4dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">
                {currentStep === 1 ? 'Start Quiz' : currentStep === 5 ? (isSubmitting ? 'Setting up...' : 'Get Started') : 'Next'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Illustration Placeholder */}
        <div>
          <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-none flex items-center justify-center bg-gray-50" style={{aspectRatio: '390 / 320'}}>
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-[#1fdf92] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#111715" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V96a8,8,0,0,1,16,0v44h24A8,8,0,0,1,168,148Z"/>
                </svg>
              </div>
              <p className="text-[#648779] text-sm">
                {currentStep === 1 && 'Ready to start your wellness journey?'}
                {currentStep === 2 && 'Tell us about your wellness goals'}
                {currentStep === 3 && 'Share your lifestyle preferences'}
                {currentStep === 4 && 'How do you like to be motivated?'}
                {currentStep === 5 && 'Your plan is being prepared!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}