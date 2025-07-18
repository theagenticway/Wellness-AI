export type UserType = 'member' | 'professional';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: UserType;
  createdAt: Date;
  // Member specific fields
  age?: number;
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoals?: string[];
  dietaryPreferences?: string[];
  healthConditions?: string[];
  currentPhase?: 'phase1' | 'phase2' | 'phase3';
  // Professional specific fields
  licenseNumber?: string;
  specialties?: string[];
  clients?: string[];
}

export interface HealthMetrics {
  date: Date;
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  sleepHours?: number;
  stressLevel?: number;
  mood?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  videoUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number; // seconds for time-based exercises
  restTime: number; // seconds
  equipment?: string[];
  targetMuscles: string[];
  instructions: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  phase: 'phase1' | 'phase2' | 'phase3';
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // minutes
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories: number;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string[];
  reason: string;
  phase: 'phase1' | 'phase2' | 'phase3';
  priority: 'essential' | 'recommended' | 'optional';
}

export interface MeditationSession {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'mindfulness' | 'breathing' | 'body_scan' | 'loving_kindness' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  description: string;
}

export interface CBTSession {
  id: string;
  title: string;
  type: 'craving_management' | 'habit_formation' | 'if_education' | 'stress_management';
  completed: boolean;
  progress: number; // 0-100
  exercises: CBTExercise[];
}

export interface CBTExercise {
  id: string;
  type: 'thought_record' | 'behavior_tracking' | 'goal_setting' | 'reflection';
  question: string;
  response?: string;
  completed: boolean;
}