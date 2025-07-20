import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for testing
const DEMO_CREDENTIALS = [
  {
    email: 'demo@wellness.ai',
    password: 'demo123',
    user: {
      id: 'demo-user-1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@wellness.ai',
      currentPhase: 'phase1' as const,
      role: 'member' as const,
      healthProfile: {
        age: 30,
        gender: 'non-binary',
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        healthGoals: ['weight_loss', 'stress_reduction'],
        healthConditions: [],
        medications: [],
        allergies: []
      },
      preferences: {
        dietaryRestrictions: [],
        exercisePreferences: ['yoga', 'walking'],
        communicationStyle: 'supportive',
        notificationSettings: {
          daily: true,
          weekly: true,
          reminders: true
        }
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  },
  {
    email: 'professional@wellness.ai',
    password: 'prof123',
    user: {
      id: 'demo-professional-1',
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      email: 'professional@wellness.ai',
      currentPhase: 'phase1' as const,
      role: 'professional' as const,
      healthProfile: {
        age: 35,
        gender: 'female',
        height: 165,
        weight: 60,
        activityLevel: 'high',
        healthGoals: ['maintain_health'],
        healthConditions: [],
        medications: [],
        allergies: []
      },
      preferences: {
        dietaryRestrictions: [],
        exercisePreferences: ['running', 'strength_training'],
        communicationStyle: 'professional',
        notificationSettings: {
          daily: false,
          weekly: true,
          reminders: false
        }
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app start
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('wellnessAppUser');
        const authToken = localStorage.getItem('wellnessAppAuthToken');
        
        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading saved user session:', error);
        // Clear invalid data
        localStorage.removeItem('wellnessAppUser');
        localStorage.removeItem('wellnessAppAuthToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo credentials
      const demoAccount = DEMO_CREDENTIALS.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (demoAccount) {
        // Update last login
        const userWithUpdatedLogin = {
          ...demoAccount.user,
          lastLogin: new Date().toISOString()
        };
        
        setUser(userWithUpdatedLogin);
        
        // Save to localStorage
        localStorage.setItem('wellnessAppUser', JSON.stringify(userWithUpdatedLogin));
        localStorage.setItem('wellnessAppAuthToken', 'demo-auth-token-' + Date.now());
        
        setIsLoading(false);
        return true;
      }
      
      // If not demo credentials, you could add real authentication here
      setIsLoading(false);
      return false;
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wellnessAppUser');
    localStorage.removeItem('wellnessAppAuthToken');
  };

  const completeOnboarding = (userData: User) => {
    // This is called when a user completes the onboarding flow
    const userWithTimestamps = {
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    setUser(userWithTimestamps);
    localStorage.setItem('wellnessAppUser', JSON.stringify(userWithTimestamps));
    localStorage.setItem('wellnessAppAuthToken', 'onboarding-auth-token-' + Date.now());
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export demo credentials for testing
export const getDemoCredentials = () => DEMO_CREDENTIALS.map(cred => ({
  email: cred.email,
  password: cred.password,
  role: cred.user.role
}));