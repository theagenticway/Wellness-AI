// screens/DashboardScreen.tsx - REPLACE EXISTING FILE
import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/providers/AuthProvider';
import { wellnessService } from '../src/services/wellnessService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { User } from '../types/user';
import { 
  Settings, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Target,
  Flame,
  Users,
  Brain,
  AlertCircle,
  Apple,
  Dumbbell,
  Heart
} from 'lucide-react';

interface DashboardScreenProps {
  user: User;
}

interface WellnessPlan {
  greeting: string;
  phaseGuidance: string;
  primaryFocus: string;
  tinyWins: Array<{
    action: string;
    time: string;
    benefit: string;
    completed?: boolean;
  }>;
  habitStack: Array<{
    trigger: string;
    newHabit: string;
    implementation: string;
  }>;
  communityStats: {
    phaseCompletion: number;
    popularChoices: string[];
    socialProof: string;
  };
  streakRisks: Array<{
    habitName: string;
    streakLength: number;
    riskLevel: string;
    protectionStrategy: string;
  }>;
  overallProgress: number;
  aiConfidence: number;
}

export function DashboardScreen({ user }: DashboardScreenProps) {
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const phaseInfo = {
    PHASE1: { 
      name: 'Foundation', 
      description: 'Microbiome reset & building healthy habits',
      color: 'from-green-500 to-emerald-600',
      icon: '🌱'
    },
    PHASE2: { 
      name: 'Transformation', 
      description: 'Introducing intermittent fasting & accelerating progress',
      color: 'from-blue-500 to-indigo-600',
      icon: '⚡'
    },
    PHASE3: { 
      name: 'Optimization', 
      description: 'Sustainable practices & lifestyle maintenance',
      color: 'from-purple-500 to-violet-600',
      icon: '🎯'
    }
  };

  const currentPhase = user?.currentPhase || 'PHASE1';
  const daysSinceStart = user?.startDate 
    ? Math.floor((Date.now() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Fetch personalized wellness plan
  const fetchWellnessPlan = async (force = false) => {
    try {
      if (force) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const plan = await wellnessService.getBehavioralDailyPlan(force);
      setWellnessPlan(plan);
      
      console.log('✅ Behavioral wellness plan loaded:', plan);
    } catch (err: any) {
      console.error('❌ Error fetching wellness plan:', err);
      setError(err.message || 'Failed to load wellness plan');
      
      // Fallback to mock data for demo purposes
      setWellnessPlan({
        greeting: `Good ${getTimeGreeting()}, ${user?.firstName || 'there'}! 🌟`,
        phaseGuidance: 'Building healthy habits with behavioral economics',
        primaryFocus: 'Stack fiber intake with morning coffee routine',
        tinyWins: [
          // Habit Stacking Opportunities - moved JSX outside array
        ],
        habitStackSection: wellnessPlan?.habitStack && wellnessPlan.habitStack.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span>Habit Stacking</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Link new habits to existing routines</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {wellnessPlan.habitStack.map((stack, index) => (
                <div key={index} className="p-3 rounded-lg border bg-indigo-50">
                  <p className="font-medium text-indigo-900 mb-1">
                    {stack.implementation}
                  </p>
                  <p className="text-sm text-indigo-700">
                    <span className="font-medium">Trigger:</span> {stack.trigger}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {wellnessPlan?.communityStats && (
          <div>
            {/* Social Proof */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Community Stats</h3>
                <p className="text-sm text-gray-600">
                  {wellnessPlan.communityStats.message}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
                  <p className="font-medium text-green-900">Community Insight</p>
                  <p className="text-green-700">{wellnessPlan.communityStats.socialProof}</p>
                  {wellnessPlan.communityStats.popularChoices.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {wellnessPlan.communityStats.popularChoices.map((choice, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                          {choice}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className={`h-16 flex-col space-y-1 ${action.color}`}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Confidence & Regenerate */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">AI Personalization</p>
                  <p className="text-sm text-gray-600">
                    {wellnessPlan?.aiConfidence 
                      ? `${Math.round(wellnessPlan.aiConfidence * 100)}% confidence in this plan`
                      : 'Plan customized for your behavioral profile'
                    }
                  </p>
                </div>
              </div>
              <Button
                onClick={() => fetchWellnessPlan(true)}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <span>New Plan</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Today's Progress</p>
                  <p className="text-sm text-gray-600">
                    {completedTasks.size} of {wellnessPlan?.tinyWins?.length || 0} tiny wins completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {wellnessPlan?.tinyWins?.length ? Math.round((completedTasks.size / wellnessPlan.tinyWins.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        {error && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Demo Mode Active</p>
                  <p className="text-yellow-700 text-sm">Showing fallback content. Check backend connection for live AI.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper function
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
} action: 'Add berries to breakfast', time: '30 seconds', benefit: 'Antioxidant boost' },
          { action: 'Take 3 deep breaths', time: '1 minute', benefit: 'Stress reduction' },
          { action: 'Drink 16oz water', time: '2 minutes', benefit: 'Hydration foundation' }
        ],
        habitStack: [
          { 
            trigger: 'After I start the coffee maker',
            newHabit: 'I will drink a glass of water',
            implementation: 'Place water glass next to coffee maker'
          }
        ],
        communityStats: {
          phaseCompletion: 78,
          popularChoices: ['morning hydration', 'fiber tracking', 'mindful eating'],
          socialProof: '78% of Phase 1 members completed their nutrition goals yesterday'
        },
        streakRisks: [
          {
            habitName: 'Morning hydration',
            streakLength: 12,
            riskLevel: 'medium',
            protectionStrategy: 'Just drink one glass to keep your 12-day streak alive!'
          }
        ],
        overallProgress: 75,
        aiConfidence: 0.85
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWellnessPlan();
    }
  }, [user]);

  const handleTaskComplete = async (taskIndex: number) => {
    const newCompleted = new Set(completedTasks);
    
    if (completedTasks.has(taskIndex)) {
      newCompleted.delete(taskIndex);
    } else {
      newCompleted.add(taskIndex);
      
      // Send completion to backend for behavioral learning
      try {
        await wellnessService.completeHabit(`task_${taskIndex}`, {
          quality: 8,
          effort: 6,
          enjoyment: 7,
          timeOfDay: new Date().getHours() < 12 ? 'MORNING' : 'AFTERNOON',
          automaticity: 6,
          notes: 'Completed via dashboard'
        });
      } catch (error) {
        console.error('Error recording habit completion:', error);
      }
    }
    
    setCompletedTasks(newCompleted);
  };

  const quickActions = [
    { 
      icon: Apple, 
      label: 'Log Meal', 
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      action: () => console.log('Log meal')
    },
    { 
      icon: Dumbbell, 
      label: 'Start Workout', 
      color: 'bg-green-50 text-green-700 border-green-200',
      action: () => console.log('Start workout')
    },
    { 
      icon: Heart, 
      label: 'Meditation', 
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => console.log('Meditate')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-medium text-gray-900">Generating your personalized plan...</p>
            <p className="text-sm text-gray-600 mt-1">Our AI is analyzing your behavioral profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              {phaseInfo[currentPhase].icon} {phaseInfo[currentPhase].name} • Day {daysSinceStart}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => fetchWellnessPlan(true)}
              disabled={refreshing}
              variant="ghost"
              size="sm"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* AI-Generated Welcome Header */}
        <div className={`bg-gradient-to-r ${phaseInfo[currentPhase].color} rounded-2xl p-6 text-white relative overflow-hidden`}>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">
              {wellnessPlan?.greeting || `Good ${getTimeGreeting()}, ${user?.firstName}! ✨`}
            </h2>
            <p className="text-white/90 mb-4">
              {wellnessPlan?.phaseGuidance || phaseInfo[currentPhase].description}
            </p>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                GMRP {phaseInfo[currentPhase].name}
              </Badge>
              {wellnessPlan?.overallProgress && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {wellnessPlan.overallProgress}% Progress
                </Badge>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        </div>

        {/* Primary Focus */}
        {wellnessPlan?.primaryFocus && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Today's Behavioral Focus</p>
                  <p className="text-blue-700">{wellnessPlan.primaryFocus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tiny Wins (2-Minute Rule) */}
        {wellnessPlan?.tinyWins && wellnessPlan.tinyWins.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Tiny Wins (2-Minute Rule)</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Small actions, big impact on habit formation</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {wellnessPlan.tinyWins.map((win, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => handleTaskComplete(index)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {completedTasks.has(index) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${completedTasks.has(index) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {win.action}
                    </p>
                    <p className="text-sm text-blue-600">{win.time} • {win.benefit}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Streak Protection */}
        {wellnessPlan?.streakRisks && wellnessPlan.streakRisks.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Flame className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium text-orange-900">Protect Your Streaks!</h3>
              </div>
              {wellnessPlan.streakRisks.map((risk, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <p className="text-orange-800 font-medium">
                    🔥 {risk.streakLength}-day {risk.habitName} streak
                  </p>
                  <p className="text-orange-700 text-sm">{risk.protectionStrategy}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {