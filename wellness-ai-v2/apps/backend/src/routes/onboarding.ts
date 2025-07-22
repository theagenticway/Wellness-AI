import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
  };
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
  behaviorProfile: {
    motivationType: 'intrinsic' | 'extrinsic' | 'balanced';
    lossAversion: number;
    presentBias: number;
    socialInfluence: number;
    gamificationResponse: number;
    bestPerformanceTime: string[];
    willpowerPattern: string;
    publicCommitments: boolean;
    socialAccountability: boolean;
    reminderFrequency: 'minimal' | 'low' | 'moderate' | 'high';
    nudgeStyle: 'gentle' | 'encouraging' | 'motivational' | 'playful';
  };
  lifestyle: {
    currentDiet: string;
    exerciseExperience: string;
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
      avgSleepHours: number;
    };
    stressLevel: number;
    timeAvailability: string;
    mainChallenges: string[];
  };
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

// Submit onboarding data and update existing authenticated user profile
router.post('/submit', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const onboardingData: OnboardingData = req.body;
    
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for onboarding'
      });
    }
    
    // Update existing user with onboarding info
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName: onboardingData.personalInfo.firstName,
        lastName: onboardingData.personalInfo.lastName,
        currentPhase: onboardingData.healthInfo.currentPhase.toUpperCase() as any,
        healthGoals: onboardingData.healthInfo.primaryGoals,
        // Mark onboarding as completed
        onboardingCompleted: true,
        updatedAt: new Date()
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        currentPhase: true,
        onboardingCompleted: true,
      }
    });

    // Create or update health profile
    await prisma.healthProfile.upsert({
      where: { userId: user.id },
      update: {
        age: onboardingData.personalInfo.age,
        gender: onboardingData.personalInfo.gender,
        weight: onboardingData.healthInfo.currentWeight,
        height: onboardingData.healthInfo.height,
        healthConditions: onboardingData.healthInfo.healthConditions,
        medications: onboardingData.healthInfo.medications,
        allergies: onboardingData.healthInfo.allergies,
      },
      create: {
        userId: user.id,
        age: onboardingData.personalInfo.age,
        gender: onboardingData.personalInfo.gender,
        weight: onboardingData.healthInfo.currentWeight,
        height: onboardingData.healthInfo.height,
        healthConditions: onboardingData.healthInfo.healthConditions,
        medications: onboardingData.healthInfo.medications,
        allergies: onboardingData.healthInfo.allergies,
      }
    });

    // Map motivation type
    const motivationTypeMap = {
      'intrinsic': 'INTRINSIC',
      'extrinsic': 'EXTRINSIC', 
      'balanced': 'BALANCED'
    } as const;

    // Map time of day
    const timeOfDayMap: { [key: string]: string } = {
      'Early Morning (5-7 AM)': 'EARLY_MORNING',
      'Morning (7-10 AM)': 'MORNING',
      'Late Morning (10-12 PM)': 'LATE_MORNING',
      'Early Afternoon (12-3 PM)': 'EARLY_AFTERNOON',
      'Late Afternoon (3-6 PM)': 'LATE_AFTERNOON',
      'Evening (6-9 PM)': 'EARLY_EVENING',
      'Night (9 PM+)': 'NIGHT'
    };

    const mappedTimeOfDay = onboardingData.behaviorProfile.bestPerformanceTime
      .map(time => timeOfDayMap[time])
      .filter(Boolean);

    // Create or update behavior profile
    await prisma.behaviorProfile.upsert({
      where: { userId: user.id },
      update: {
        motivationType: motivationTypeMap[onboardingData.behaviorProfile.motivationType],
        lossAversion: onboardingData.behaviorProfile.lossAversion,
        presentBias: onboardingData.behaviorProfile.presentBias / 10, // Normalize to 0-1
        socialInfluence: onboardingData.behaviorProfile.socialInfluence / 10, // Normalize to 0-1
        gamificationResponse: onboardingData.behaviorProfile.gamificationResponse / 10, // Normalize to 0-1
        bestPerformanceTime: mappedTimeOfDay as any[],
        worstPerformanceTime: [], // Could be inferred
        averageWillpower: 5.0, // Default, will be learned
        willpowerPattern: {
          pattern: onboardingData.behaviorProfile.willpowerPattern,
          timeAvailability: onboardingData.lifestyle.timeAvailability
        },
        publicCommitments: onboardingData.behaviorProfile.publicCommitments,
        socialAccountability: onboardingData.behaviorProfile.socialAccountability,
        reminderFrequency: onboardingData.behaviorProfile.reminderFrequency.toUpperCase() as any,
        nudgeStyle: onboardingData.behaviorProfile.nudgeStyle.toUpperCase() as any,
        personalTriggers: onboardingData.lifestyle.mainChallenges,
      },
      create: {
        userId: user.id,
        motivationType: motivationTypeMap[onboardingData.behaviorProfile.motivationType],
        lossAversion: onboardingData.behaviorProfile.lossAversion,
        presentBias: onboardingData.behaviorProfile.presentBias / 10,
        socialInfluence: onboardingData.behaviorProfile.socialInfluence / 10,
        gamificationResponse: onboardingData.behaviorProfile.gamificationResponse / 10,
        bestPerformanceTime: mappedTimeOfDay as any[],
        worstPerformanceTime: [],
        averageWillpower: 5.0,
        willpowerPattern: {
          pattern: onboardingData.behaviorProfile.willpowerPattern,
          timeAvailability: onboardingData.lifestyle.timeAvailability
        },
        publicCommitments: onboardingData.behaviorProfile.publicCommitments,
        socialAccountability: onboardingData.behaviorProfile.socialAccountability,
        reminderFrequency: onboardingData.behaviorProfile.reminderFrequency.toUpperCase() as any,
        nudgeStyle: onboardingData.behaviorProfile.nudgeStyle.toUpperCase() as any,
        personalTriggers: onboardingData.lifestyle.mainChallenges,
      }
    });

    // Generate AI persona based on responses
    const aiPersona = await generateAIPersona(onboardingData);

    // Create initial daily plan
    await createInitialDailyPlan(user.id, onboardingData, aiPersona);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentPhase: user.currentPhase,
        onboardingCompleted: user.onboardingCompleted,
      },
      aiPersona,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('Onboarding submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// AI Persona Generation
async function generateAIPersona(data: OnboardingData) {
  const persona = {
    userType: determineUserType(data),
    motivationalStyle: data.behaviorProfile.motivationType,
    changeReadiness: calculateChangeReadiness(data),
    habitFormationStyle: determineHabitFormationStyle(data),
    communicationPreferences: {
      style: data.preferences.communicationStyle,
      frequency: data.behaviorProfile.reminderFrequency,
      nudgeStyle: data.behaviorProfile.nudgeStyle,
    },
    riskFactors: identifyRiskFactors(data),
    strengths: identifyStrengths(data),
    recommendedApproach: recommendApproach(data),
    customizationNotes: generateCustomizationNotes(data)
  };

  return persona;
}

function determineUserType(data: OnboardingData): string {
  const { exerciseExperience, timeAvailability, mainChallenges } = data.lifestyle;
  
  if (exerciseExperience === 'beginner' && timeAvailability === '5-10') {
    return 'gradual-starter';
  } else if (exerciseExperience === 'advanced' && timeAvailability === '60+') {
    return 'high-performer';
  } else if (mainChallenges.includes('Lack of time')) {
    return 'time-constrained';
  } else if (mainChallenges.includes('Lack of motivation')) {
    return 'motivation-focused';
  }
  return 'balanced-approach';
}

function calculateChangeReadiness(data: OnboardingData): number {
  let score = 5; // Base score
  
  // Positive factors
  if (data.behaviorProfile.motivationType === 'intrinsic') score += 2;
  if (data.behaviorProfile.socialAccountability) score += 1;
  if (data.lifestyle.timeAvailability !== '5-10') score += 1;
  
  // Negative factors
  if (data.lifestyle.mainChallenges.includes('Past failures/discouragement')) score -= 2;
  if (data.lifestyle.stressLevel > 7) score -= 1;
  if (data.lifestyle.mainChallenges.includes('Lack of time')) score -= 1;
  
  return Math.max(1, Math.min(10, score));
}

function determineHabitFormationStyle(data: OnboardingData): string {
  if (data.behaviorProfile.lossAversion > 7) {
    return 'streak-focused';
  } else if (data.behaviorProfile.socialInfluence > 7) {
    return 'social-driven';
  } else if (data.preferences.rewardPreference.includes('Earning points, badges, or rewards')) {
    return 'gamification-responsive';
  } else if (data.behaviorProfile.motivationType === 'intrinsic') {
    return 'intrinsic-motivated';
  }
  return 'balanced-formation';
}

function identifyRiskFactors(data: OnboardingData): string[] {
  const risks: string[] = [];
  
  if (data.lifestyle.stressLevel > 7) risks.push('high-stress');
  if (data.lifestyle.mainChallenges.includes('Inconsistent schedule')) risks.push('schedule-variability');
  if (data.lifestyle.mainChallenges.includes('Past failures/discouragement')) risks.push('past-failures');
  if (data.lifestyle.mainChallenges.includes('Lack of support system')) risks.push('social-isolation');
  if (data.behaviorProfile.presentBias > 7) risks.push('present-bias');
  
  return risks;
}

function identifyStrengths(data: OnboardingData): string[] {
  const strengths: string[] = [];
  
  if (data.behaviorProfile.motivationType === 'intrinsic') strengths.push('self-motivated');
  if (data.behaviorProfile.socialAccountability) strengths.push('accountability-responsive');
  if (data.behaviorProfile.lossAversion > 6) strengths.push('loss-aversion-driven');
  if (data.lifestyle.exerciseExperience !== 'beginner') strengths.push('exercise-experienced');
  if (data.behaviorProfile.bestPerformanceTime.length > 0) strengths.push('time-awareness');
  
  return strengths;
}

function recommendApproach(data: OnboardingData): {
  startingIntensity: string;
  habitStackingOpportunities: string[];
  primaryFocus: string;
  secondaryFocus: string;
} {
  const timeAvail = data.lifestyle.timeAvailability;
  const experience = data.lifestyle.exerciseExperience;
  const goals = data.healthInfo.primaryGoals;
  
  let startingIntensity = 'moderate';
  if (timeAvail === '5-10' || experience === 'beginner') {
    startingIntensity = 'tiny-habits';
  } else if (timeAvail === '60+' && experience === 'advanced') {
    startingIntensity = 'intensive';
  }
  
  const primaryFocus = goals[0] || 'general-wellness';
  const secondaryFocus = goals[1] || 'habit-formation';
  
  return {
    startingIntensity,
    habitStackingOpportunities: generateHabitStackingIdeas(data),
    primaryFocus,
    secondaryFocus
  };
}

function generateHabitStackingIdeas(data: OnboardingData): string[] {
  const ideas: string[] = [];
  
  if (data.lifestyle.sleepSchedule.wakeTime) {
    ideas.push(`After I wake up at ${data.lifestyle.sleepSchedule.wakeTime}, I will...`);
  }
  if (data.lifestyle.sleepSchedule.bedtime) {
    ideas.push(`Before I go to bed at ${data.lifestyle.sleepSchedule.bedtime}, I will...`);
  }
  if (data.lifestyle.currentDiet !== 'standard') {
    ideas.push('After I prepare my meal, I will...');
  }
  
  return ideas;
}

function generateCustomizationNotes(data: OnboardingData): string {
  const notes: string[] = [];
  
  if (data.behaviorProfile.motivationType === 'extrinsic') {
    notes.push('Focus on external rewards, tracking, and social recognition');
  }
  if (data.lifestyle.stressLevel > 6) {
    notes.push('Prioritize stress management and gentle progression');
  }
  if (data.lifestyle.mainChallenges.includes('Lack of time')) {
    notes.push('Emphasize micro-habits and efficient routines');
  }
  
  return notes.join('. ');
}

// Create initial daily plan based on persona
async function createInitialDailyPlan(userId: string, data: OnboardingData, persona: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  await prisma.dailyPlan.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      phase: data.healthInfo.currentPhase.toUpperCase() as any,
      greeting: generatePersonalizedGreeting(data, persona),
      phaseGuidance: generatePhaseGuidance(data.healthInfo.currentPhase, persona),
      primaryFocus: persona.recommendedApproach.primaryFocus,
      tinyWins: generateTinyWins(data, persona),
      habitStack: generateHabitStackSuggestions(data),
      implementation: generateImplementationIntentions(data),
      scheduledNudges: generateInitialNudges(data, persona),
      contextualCues: generateContextualCues(data),
      aiConfidence: 0.7 // Initial confidence
    },
    create: {
      userId,
      date: today,
      phase: data.healthInfo.currentPhase.toUpperCase() as any,
      greeting: generatePersonalizedGreeting(data, persona),
      phaseGuidance: generatePhaseGuidance(data.healthInfo.currentPhase, persona),
      primaryFocus: persona.recommendedApproach.primaryFocus,
      tinyWins: generateTinyWins(data, persona),
      habitStack: generateHabitStackSuggestions(data),
      implementation: generateImplementationIntentions(data),
      scheduledNudges: generateInitialNudges(data, persona),
      contextualCues: generateContextualCues(data),
      aiConfidence: 0.7 // Initial confidence
    }
  });
}

function generatePersonalizedGreeting(data: OnboardingData, persona: any): string {
  const { firstName } = data.personalInfo;
  const { changeReadiness } = persona;
  
  if (changeReadiness >= 8) {
    return `Good morning, ${firstName}! Your commitment to change is inspiring. Let's make today amazing!`;
  } else if (changeReadiness >= 6) {
    return `Hello ${firstName}! Ready to take small steps toward your wellness goals today?`;
  } else {
    return `Hi ${firstName}! Remember, every small step counts. You've got this!`;
  }
}

function generatePhaseGuidance(phase: string, persona: any): string {
  const guidance = {
    'phase1': 'Focus on building foundation habits. Start small and be consistent.',
    'phase2': 'Time to optimize and add complexity to your routine.',
    'phase3': 'Advanced integration and long-term sustainability focus.'
  };
  
  return guidance[phase as keyof typeof guidance] || guidance['phase1'];
}

function generateTinyWins(data: OnboardingData, persona: any): any {
  const timeAvail = data.lifestyle.timeAvailability;
  const wins = [];
  
  if (timeAvail === '5-10') {
    wins.push({ task: 'Drink one glass of water', duration: '1 min' });
    wins.push({ task: 'Take 5 deep breaths', duration: '2 min' });
  } else {
    wins.push({ task: 'Do 10 jumping jacks', duration: '2 min' });
    wins.push({ task: 'Plan tomorrow\'s meals', duration: '5 min' });
  }
  
  return wins;
}

function generateHabitStackSuggestions(data: OnboardingData): any {
  return {
    morning: `After I ${data.lifestyle.sleepSchedule.wakeTime ? 'wake up' : 'brush my teeth'}, I will do my wellness routine`,
    evening: `Before I ${data.lifestyle.sleepSchedule.bedtime ? 'go to bed' : 'watch TV'}, I will reflect on my day`
  };
}

function generateImplementationIntentions(data: OnboardingData): any {
  const intentions = [];
  
  if (data.healthInfo.primaryGoals.includes('Better Sleep')) {
    intentions.push({
      situation: 'When it\'s 30 minutes before bedtime',
      action: 'I will start my wind-down routine'
    });
  }
  
  if (data.healthInfo.primaryGoals.includes('Regular Exercise')) {
    intentions.push({
      situation: 'When I feel like skipping exercise',
      action: 'I will do just 2 minutes of movement'
    });
  }
  
  return intentions;
}

function generateInitialNudges(data: OnboardingData, persona: any): any {
  const nudges = [];
  const bestTimes = data.behaviorProfile.bestPerformanceTime;
  
  if (bestTimes.includes('Morning (7-10 AM)')) {
    nudges.push({
      time: '08:00',
      message: 'Good morning! Time for your wellness routine 🌟',
      type: 'encouragement'
    });
  }
  
  return nudges;
}

function generateContextualCues(data: OnboardingData): any {
  const cues = [];
  
  if (data.lifestyle.mainChallenges.includes('Lack of motivation')) {
    cues.push({
      context: 'low_motivation',
      cue: 'Remember your why: ' + data.healthInfo.primaryGoals.join(', ')
    });
  }
  
  return cues;
}

export default router;