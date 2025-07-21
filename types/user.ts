// types/user.ts
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age: number;
  gender: string;
  healthGoals: string[];
  currentPhase: 'phase1' | 'phase2' | 'phase3';
  startDate?: string;
  healthConditions?: string[];
  medications?: string[];
  preferences: {
    dietary: string[];
    exercise: string[];
    communication: string;
  };
}

export interface User extends UserProfile {
  type: 'member' | 'professional';
  dateOfBirth?: string;
  programGoals: string[];
  allergies?: string[];
  communicationPreferences?: {
    frequency: 'daily' | 'weekly' | 'bi-weekly';
    style: 'detailed' | 'concise' | 'motivational';
    preferredTime: 'morning' | 'afternoon' | 'evening';
  };
  metrics?: {
    weight?: number;
    height?: number;
    bmi?: number;
    bodyFat?: number;
  };
  appSettings: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  credentials?: string[];
  specializations?: string[];
  clientIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface HealthMetrics {
  date: string;
  weight?: number;
  sleepHours?: number;
  sleepQuality?: number; // 1-10 scale
  energyLevel?: number; // 1-10 scale
  stressLevel?: number; // 1-10 scale
  digestiveHealth?: number; // 1-10 scale
  moodRating?: number; // 1-10 scale
  adherenceRate?: number; // percentage
  symptoms?: string[];
  notes?: string;
}

export interface UserProgress {
  userId: string;
  phase: 'phase1' | 'phase2' | 'phase3';
  weekNumber: number;
  progressScore: number;
  completedTasks: number;
  totalTasks: number;
  metrics: HealthMetrics;
  milestones: string[];
  challenges: string[];
  recommendations: string[];
  nextPhaseReadiness?: number; // percentage
}

export interface UserGoal {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'mindfulness' | 'sleep' | 'stress';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
}

// Form interfaces for onboarding
export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
  };
  healthInfo: {
    currentPhase: 'phase1' | 'phase2' | 'phase3';
    healthGoals: string[];
    healthConditions: string[];
    medications: string[];
    allergies: string[];
  };
  lifestyle: {
    dietaryPreferences: string[];
    exercisePreferences: string[];
    sleepSchedule: {
      bedtime: string;
      wakeTime: string;
    };
    stressLevel: number;
  };
  preferences: {
    communicationStyle: string;
    notificationPreferences: {
      daily: boolean;
      weekly: boolean;
      reminders: boolean;
    };
  };
}
