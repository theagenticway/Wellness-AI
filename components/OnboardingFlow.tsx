import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../types/user';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface OnboardingFlowProps {
  onComplete: (user: User, onboardingData: OnboardingData) => void;
}

interface OnboardingData {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
  };
  // Health & Goals
  healthInfo: {
    currentPhase: 'phase1' | 'phase2' | 'phase3';
    primaryGoals: string[];
    healthConditions: string[];
    medications: string[];
    allergies: string[];
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
  };
  // Behavioral Profile
  behaviorProfile: {
    motivationType: 'intrinsic' | 'extrinsic' | 'balanced';
    lossAversion: number; // 1-10 scale
    presentBias: number; // 1-10 scale
    socialInfluence: number; // 1-10 scale
    gamificationResponse: number; // 1-10 scale
    bestPerformanceTime: string[];
    willpowerPattern: string;
    publicCommitments: boolean;
    socialAccountability: boolean;
    reminderFrequency: 'minimal' | 'low' | 'moderate' | 'high';
    nudgeStyle: 'gentle' | 'encouraging' | 'motivational' | 'playful';
  };
  // Lifestyle & Preferences
  lifestyle: {
    currentDiet: string;
    exerciseExperience: string;
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
      avgSleepHours: number;
    };
    stressLevel: number; // 1-10
    timeAvailability: string;
    mainChallenges: string[];
  };
  // Habit & Goal Preferences
  preferences: {
    communicationStyle: string;
    accountabilityPreference: string;
    rewardPreference: string[];
    specificGoals: {
      weight?: { target: number; timeline: string };
      exercise?: { type: string; frequency: number };
      nutrition?: { focus: string[]; restrictions: string[] };
      stress?: { techniques: string[]; frequency: number };
      sleep?: { targetHours: number; improvements: string[] };
    };
  };
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      gender: '',
    },
    healthInfo: {
      currentPhase: 'phase1',
      primaryGoals: [],
      healthConditions: [],
      medications: [],
      allergies: [],
    },
    behaviorProfile: {
      motivationType: 'balanced',
      lossAversion: 5,
      presentBias: 5,
      socialInfluence: 5,
      gamificationResponse: 5,
      bestPerformanceTime: [],
      willpowerPattern: 'steady',
      publicCommitments: false,
      socialAccountability: true,
      reminderFrequency: 'moderate',
      nudgeStyle: 'encouraging',
    },
    lifestyle: {
      currentDiet: '',
      exerciseExperience: '',
      sleepSchedule: {
        bedtime: '',
        wakeTime: '',
        avgSleepHours: 8,
      },
      stressLevel: 5,
      timeAvailability: '',
      mainChallenges: [],
    },
    preferences: {
      communicationStyle: '',
      accountabilityPreference: '',
      rewardPreference: [],
      specificGoals: {},
    },
  });

  const totalSteps = 8;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleSubmit = () => {
    const user: User = {
      id: Date.now().toString(), // Temporary ID generation
      firstName: formData.personalInfo.firstName,
      lastName: formData.personalInfo.lastName,
      email: formData.personalInfo.email,
      type: 'member',
      currentPhase: formData.healthInfo.currentPhase,
      programGoals: formData.healthInfo.primaryGoals,
      age: formData.personalInfo.age,
      gender: formData.personalInfo.gender,
      healthGoals: formData.healthInfo.primaryGoals,
      healthConditions: formData.healthInfo.healthConditions,
      medications: formData.healthInfo.medications,
      allergies: formData.healthInfo.allergies,
      metrics: {
        weight: formData.healthInfo.currentWeight,
        height: formData.healthInfo.height,
      },
      preferences: {
        dietary: [],
        exercise: [],
        communication: formData.preferences.communicationStyle,
      },
      communicationPreferences: {
        frequency: 'daily',
        style: formData.preferences.communicationStyle as any,
        preferredTime: formData.behaviorProfile.bestPerformanceTime[0] as any || 'morning',
      },
      appSettings: {
        notifications: true,
        darkMode: false,
        language: 'en',
      },
    };
    onComplete(user, formData);
  };

  const updateFormData = (section: keyof OnboardingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome to Your Wellness Journey!</CardTitle>
              <p className="text-slate-600 text-center">
                Let's create a personalized plan that works specifically for you. This comprehensive assessment will help us understand your unique needs, preferences, and behavioral patterns.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-500 space-y-2">
                <p>• Personal information and health background</p>
                <p>• Wellness goals and current challenges</p>
                <p>• Behavioral preferences for lasting change</p>
                <p>• Lifestyle factors and time availability</p>
              </div>
              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <p className="text-slate-600">Tell us about yourself so we can personalize your experience.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => updateFormData('personalInfo', { firstName: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => updateFormData('personalInfo', { lastName: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => updateFormData('personalInfo', { email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.personalInfo.age || ''}
                    onChange={(e) => updateFormData('personalInfo', { age: parseInt(e.target.value) || 0 })}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select onValueChange={(value) => updateFormData('personalInfo', { gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Health Background & Goals</CardTitle>
              <p className="text-slate-600">Help us understand your current health status and primary wellness objectives.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">What are your primary wellness goals? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Weight Management', 'Stress Reduction', 'Better Sleep', 'Increased Energy', 'Improved Nutrition', 'Regular Exercise', 'Mental Clarity', 'Digestive Health'].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.healthInfo.primaryGoals.includes(goal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('healthInfo', {
                              primaryGoals: [...formData.healthInfo.primaryGoals, goal]
                            });
                          } else {
                            updateFormData('healthInfo', {
                              primaryGoals: formData.healthInfo.primaryGoals.filter(g => g !== goal)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={formData.healthInfo.currentWeight || ''}
                    onChange={(e) => updateFormData('healthInfo', { currentWeight: parseFloat(e.target.value) || undefined })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="targetWeight">Goal Weight (lbs)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    value={formData.healthInfo.targetWeight || ''}
                    onChange={(e) => updateFormData('healthInfo', { targetWeight: parseFloat(e.target.value) || undefined })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.healthInfo.height || ''}
                    onChange={(e) => updateFormData('healthInfo', { height: parseFloat(e.target.value) || undefined })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Do you have any health conditions? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Arthritis', 'Anxiety/Depression', 'Thyroid Issues', 'Digestive Issues', 'None'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.healthInfo.healthConditions.includes(condition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('healthInfo', {
                              healthConditions: [...formData.healthInfo.healthConditions, condition]
                            });
                          } else {
                            updateFormData('healthInfo', {
                              healthConditions: formData.healthInfo.healthConditions.filter(c => c !== condition)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={condition} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Preferences</CardTitle>
              <p className="text-slate-600">Understanding how you're motivated helps us design habits that stick.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">What motivates you most?</Label>
                <RadioGroup
                  value={formData.behaviorProfile.motivationType}
                  onValueChange={(value: any) => updateFormData('behaviorProfile', { motivationType: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intrinsic" id="intrinsic" />
                    <Label htmlFor="intrinsic">Personal satisfaction and internal drive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extrinsic" id="extrinsic" />
                    <Label htmlFor="extrinsic">External rewards, recognition, and accountability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced">A mix of both internal and external motivation</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">When do you perform best? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Early Morning (5-7 AM)', 'Morning (7-10 AM)', 'Late Morning (10-12 PM)', 'Early Afternoon (12-3 PM)', 'Late Afternoon (3-6 PM)', 'Evening (6-9 PM)', 'Night (9 PM+)'].map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.behaviorProfile.bestPerformanceTime.includes(time)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('behaviorProfile', {
                              bestPerformanceTime: [...formData.behaviorProfile.bestPerformanceTime, time]
                            });
                          } else {
                            updateFormData('behaviorProfile', {
                              bestPerformanceTime: formData.behaviorProfile.bestPerformanceTime.filter(t => t !== time)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={time} className="text-sm">{time}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">How do you respond to losing progress? (1 = doesn't bother me, 10 = very motivating to avoid)</Label>
                <Slider
                  value={[formData.behaviorProfile.lossAversion]}
                  onValueChange={(value) => updateFormData('behaviorProfile', { lossAversion: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Doesn't motivate me</span>
                  <span>Current: {formData.behaviorProfile.lossAversion}</span>
                  <span>Highly motivating</span>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">How much do others' actions influence your habits? (1 = not at all, 10 = very much)</Label>
                <Slider
                  value={[formData.behaviorProfile.socialInfluence]}
                  onValueChange={(value) => updateFormData('behaviorProfile', { socialInfluence: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Independent</span>
                  <span>Current: {formData.behaviorProfile.socialInfluence}</span>
                  <span>Social influence strong</span>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Current Lifestyle</CardTitle>
              <p className="text-slate-600">Tell us about your current habits and daily routine.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">How would you describe your current diet?</Label>
                <Select onValueChange={(value) => updateFormData('lifestyle', { currentDiet: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your current diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard American Diet</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="intermittent-fasting">Intermittent Fasting</SelectItem>
                    <SelectItem value="other">Other/Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">What's your exercise experience?</Label>
                <RadioGroup
                  value={formData.lifestyle.exerciseExperience}
                  onValueChange={(value) => updateFormData('lifestyle', { exerciseExperience: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner - Little to no regular exercise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id="some" />
                    <Label htmlFor="some">Some experience - Exercise occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Regular exerciser - 2-3 times per week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced - Daily exercise routine</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedtime">Typical Bedtime</Label>
                  <Input
                    id="bedtime"
                    type="time"
                    value={formData.lifestyle.sleepSchedule.bedtime}
                    onChange={(e) => updateFormData('lifestyle', {
                      sleepSchedule: { ...formData.lifestyle.sleepSchedule, bedtime: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="wakeTime">Typical Wake Time</Label>
                  <Input
                    id="wakeTime"
                    type="time"
                    value={formData.lifestyle.sleepSchedule.wakeTime}
                    onChange={(e) => updateFormData('lifestyle', {
                      sleepSchedule: { ...formData.lifestyle.sleepSchedule, wakeTime: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Average stress level (1 = very calm, 10 = very stressed)</Label>
                <Slider
                  value={[formData.lifestyle.stressLevel]}
                  onValueChange={(value) => updateFormData('lifestyle', { stressLevel: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Very calm</span>
                  <span>Current: {formData.lifestyle.stressLevel}</span>
                  <span>Very stressed</span>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Challenges & Availability</CardTitle>
              <p className="text-slate-600">Help us understand your constraints so we can design realistic plans.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">What are your main challenges with wellness goals? (Select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Lack of time',
                    'Lack of motivation',
                    'Inconsistent schedule',
                    'Social pressures (family, work)',
                    'Don\'t know where to start',
                    'Past failures/discouragement',
                    'Financial constraints',
                    'Physical limitations',
                    'Stress and overwhelm',
                    'Lack of support system'
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.lifestyle.mainChallenges.includes(challenge)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('lifestyle', {
                              mainChallenges: [...formData.lifestyle.mainChallenges, challenge]
                            });
                          } else {
                            updateFormData('lifestyle', {
                              mainChallenges: formData.lifestyle.mainChallenges.filter(c => c !== challenge)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={challenge} className="text-sm">{challenge}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">How much time can you realistically dedicate to wellness activities daily?</Label>
                <RadioGroup
                  value={formData.lifestyle.timeAvailability}
                  onValueChange={(value) => updateFormData('lifestyle', { timeAvailability: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5-10" id="5-10" />
                    <Label htmlFor="5-10">5-10 minutes (just getting started)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15-30" id="15-30" />
                    <Label htmlFor="15-30">15-30 minutes (manageable commitment)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30-60" id="30-60" />
                    <Label htmlFor="30-60">30-60 minutes (moderate investment)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60+" id="60+" />
                    <Label htmlFor="60+">60+ minutes (high commitment)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Support & Communication Preferences</CardTitle>
              <p className="text-slate-600">Let's customize how the app supports and communicates with you.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">What communication style works best for you?</Label>
                <RadioGroup
                  value={formData.preferences.communicationStyle}
                  onValueChange={(value) => updateFormData('preferences', { communicationStyle: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct and to-the-point</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="encouraging" id="encouraging" />
                    <Label htmlFor="encouraging">Encouraging and supportive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="detailed" />
                    <Label htmlFor="detailed">Detailed explanations and science-based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual and friendly</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">What type of accountability helps you most?</Label>
                <RadioGroup
                  value={formData.preferences.accountabilityPreference}
                  onValueChange={(value) => updateFormData('preferences', { accountabilityPreference: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self">Self-tracking and personal reflection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="app" />
                    <Label htmlFor="app">App notifications and reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="community" id="community" />
                    <Label htmlFor="community">Community support and sharing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional guidance and check-ins</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">How often would you like reminders and nudges?</Label>
                <RadioGroup
                  value={formData.behaviorProfile.reminderFrequency}
                  onValueChange={(value: any) => updateFormData('behaviorProfile', { reminderFrequency: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">Minimal - Only important updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low - Weekly check-ins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate - Few times per week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High - Daily reminders and motivation</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">What motivates you to make positive changes? (Select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Tracking progress and seeing results',
                    'Earning points, badges, or rewards',
                    'Competing with others',
                    'Supporting a cause or charity',
                    'Building streaks and consistency',
                    'Learning new information',
                    'Connecting with like-minded people',
                    'Professional recognition'
                  ].map((reward) => (
                    <div key={reward} className="flex items-center space-x-2">
                      <Checkbox
                        id={reward}
                        checked={formData.preferences.rewardPreference.includes(reward)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('preferences', {
                              rewardPreference: [...formData.preferences.rewardPreference, reward]
                            });
                          } else {
                            updateFormData('preferences', {
                              rewardPreference: formData.preferences.rewardPreference.filter(r => r !== reward)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={reward} className="text-sm">{reward}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Complete!</CardTitle>
              <p className="text-slate-600">
                Perfect! We now have everything we need to create your personalized wellness plan.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Personalized Plan Will Include:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Behavioral habits designed for your motivation style</li>
                  <li>• Micro-routines that fit your available time</li>
                  <li>• Personalized nutrition recommendations</li>
                  <li>• Exercise plans matched to your experience level</li>
                  <li>• Stress management techniques</li>
                  <li>• Smart reminders based on your preferences</li>
                  <li>• Progress tracking that motivates you</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">AI-Powered Personalization:</h3>
                <p className="text-sm text-blue-700">
                  Our AI will continuously learn from your responses and behaviors to optimize your plan, 
                  making it more effective over time while adapting to your changing needs.
                </p>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Create My Wellness Plan
              </Button>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
