// types/user.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: 'member' | 'professional';
  
  // Profile Information
  age?: number;
  gender?: 'male' | 'female' | 'non-binary' | 'not-specified';
  dateOfBirth?: string;
  
  // GMRP Program Details
  currentPhase: 'phase1' | 'phase2' | 'phase3';
  startDate?: string;
  programGoals: string[];
  healthGoals?: string[];
  
  // Health Information
  healthConditions?: string[];
  medications?: string[];
  allergies?: string[];
  
  // Preferences
  dietaryPreferences?: string[];
  exercisePreferences?: string[];
  communicationPreferences?: {
    frequency: 'daily' | 'weekly' | 'bi-weekly';
    style: 'detailed' | 'concise' | 'motivational';
    preferredTime: 'morning' | 'afternoon' | 'evening';
  };
  
  // Progress Tracking
  metrics?: {
    weight?: number;
    height?: number;
    bmi?: number;
    bodyFat?: number;
  };
  
  // App Settings
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  
  // Professional-specific fields
  credentials?: string[];
  specializations?: string[];
  clientIds?: string[];
  
  // Timestamps
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