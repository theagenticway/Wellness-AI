// src/services/authService.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'MEMBER' | 'PROFESSIONAL' | 'ADMIN';
  currentPhase: 'PHASE1' | 'PHASE2' | 'PHASE3';
  healthGoals: string[];
  startDate: string;
  healthProfile?: {
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    sleepGoal?: number;
    stressLevel?: number;
    energyLevel?: number;
    digestiveHealth?: number;
    fastingExperience?: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  type?: 'MEMBER' | 'PROFESSIONAL' | 'ADMIN';
  age?: number;
  gender?: string;
  healthGoals?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on init
    this.token = localStorage.getItem('wellness_token');
    const savedUser = localStorage.getItem('wellness_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.clearAuth();
      }
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const result = await response.json();
      
      // Store auth data
      this.token = result.data.token;
      this.user = result.data.user;
      
      localStorage.setItem('wellness_token', this.token);
      localStorage.setItem('wellness_user', JSON.stringify(this.user));

      return result.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const result = await response.json();
      
      // Store auth data
      this.token = result.data.token;
      this.user = result.data.user;
      
      localStorage.setItem('wellness_token', this.token);
      localStorage.setItem('wellness_user', JSON.stringify(this.user));

      return result.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const result = await response.json();
      this.user = result.data;
      localStorage.setItem('wellness_user', JSON.stringify(this.user));
      
      return this.user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      this.clearAuth();
      throw error;
    }
  }

  async updateProfile(updateData: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profile update failed');
      }

      const result = await response.json();
      this.user = result.data;
      localStorage.setItem('wellness_user', JSON.stringify(this.user));
      
      return this.user;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  logout(): void {
    this.clearAuth();
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('wellness_token');
    localStorage.removeItem('wellness_user');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  isProfessional(): boolean {
    return this.user?.type === 'PROFESSIONAL' || this.user?.type === 'ADMIN';
  }

  // API helper with authentication
  async apiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      this.clearAuth();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }
}

export const authService = new AuthService();

// src/services/wellnessService.ts
import { authService } from './authService';

export interface WellnessPlan {
  greeting: string;
  phaseGuidance: string;
  dailyPlan: Array<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    status: string;
  }>;
  recommendations: string[];
  insights: Array<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'tip';
  }>;
  nextSteps: string[];
  progressAssessment?: {
    currentScore: number;
    summary: string;
  };
}

export interface NutritionPlan {
  mealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  shoppingList: string[];
  supplementProtocol: {
    morning: string[];
    evening: string[];
    notes: string;
  };
  phaseGuidance: string;
  fiberBreakdown: {
    target: number;
    sources: Array<{
      food: string;
      amount: string;
      fiber: string;
    }>;
  };
  fastingSchedule?: any;
}

class WellnessService {
  async getDailyPlan(healthMetrics?: any): Promise<WellnessPlan> {
    try {
      const result = await authService.apiRequest('/api/wellness/daily-plan', {
        method: 'POST',
        body: JSON.stringify({
          healthMetrics: healthMetrics || {}
        }),
      });

      return result.data;
    } catch (error: any) {
      console.error('Failed to fetch wellness plan:', error);
      throw error;
    }
  }

  async getNutritionPlan(): Promise<NutritionPlan> {
    try {
      const result = await authService.apiRequest('/api/wellness/nutrition-plan', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      return result.data;
    } catch (error: any) {
      console.error('Failed to fetch nutrition plan:', error);
      throw error;
    }
  }

  async getProgress(timeframe: string = '30'): Promise<any> {
    try {
      const result = await authService.apiRequest(`/api/progress/${timeframe}`);
      return result.data;
    } catch (error: any) {
      console.error('Failed to fetch progress:', error);
      throw error;
    }
  }

  async createOverride(overrideData: {
    clientId: string;
    overrideType: string;
    originalValue: any;
    newValue: any;
    reason: string;
    urgency?: string;
  }): Promise<any> {
    try {
      const result = await authService.apiRequest('/api/professional/override', {
        method: 'POST',
        body: JSON.stringify(overrideData),
      });

      return result.data;
    } catch (error: any) {
      console.error('Failed to create override:', error);
      throw error;
    }
  }
}

export const wellnessService = new WellnessService();

// src/components/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const { user } = await authService.register(data);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
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

// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthProvider';
import { AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register({
          email,
          password,
          firstName,
          lastName,
          type: 'MEMBER',
        });
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            {isRegister ? 'Join WellnessAI' : 'Welcome Back'}
          </CardTitle>
          <p className="text-slate-600">
            {isRegister ? 'Start your GMRP journey today' : 'Sign in to your account'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Updated src/App.tsx to use real authentication
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { MemberDashboard } from './components/MemberDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ExerciseModule } from './components/ExerciseModule';
import { NutritionModule } from './components/NutritionModule';
import { SupplementationModule } from './components/SupplementationModule';
import { MindfulnessModule } from './components/MindfulnessModule';
import { CBTModule } from './components/CBTModule';
import { CommunityModule } from './components/CommunityModule';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading WellnessAI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return user.type === 'MEMBER' ? 
          <MemberDashboard user={user} /> : 
          <ProfessionalDashboard user={user} />;
      case 'exercise':
        return <ExerciseModule user={user} />;
      case 'nutrition':
        return <NutritionModule user={user} />;
      case 'supplementation':
        return <SupplementationModule user={user} />;
      case 'mindfulness':
        return <MindfulnessModule user={user} />;
      case 'cbt':
        return <CBTModule user={user} />;
      case 'community':
        return <CommunityModule user={user} />;
      default:
        return user.type === 'MEMBER' ? 
          <MemberDashboard user={user} /> : 
          <ProfessionalDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Your existing navigation and layout code */}
      {renderModule()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}