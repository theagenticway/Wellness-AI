import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User } from '../types/user';
import { 
  Activity, 
  Apple, 
  Dumbbell, 
  Heart, 
  Lotus, 
  Pill,
  Target,
  TrendingUp,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Brain
} from 'lucide-react';

interface MemberDashboardProps {
  user: User;
}

interface WellnessPlan {
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
    action?: string;
  }>;
  nextSteps: string[];
  progressAssessment?: {
    currentScore: number;
    summary: string;
  };
}

interface NutritionPlan {
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
}

export function MemberDashboard({ user }: MemberDashboardProps) {
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPhase = user.currentPhase || 'phase1';
  const phaseInfo = {
    phase1: { name: 'Foundation', description: 'Microbiome reset & building healthy habits', color: 'from-green-500 to-emerald-600' },
    phase2: { name: 'Transformation', description: 'Introducing intermittent fasting & accelerating progress', color: 'from-blue-500 to-indigo-600' },
    phase3: { name: 'Optimization', description: 'Sustainable practices & lifestyle maintenance', color: 'from-purple-500 to-violet-600' }
  };

  // Fetch personalized wellness plan from real AI
  const fetchWellnessPlan = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/wellness/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userProfile: {
            ...user,
            age: user.age || 35,
            gender: user.gender || 'not-specified',
            healthGoals: user.healthGoals || ['improve-gut-health'],
            currentPhase: currentPhase,
            startDate: user.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            preferences: {
              dietary: user.dietaryPreferences || [],
              exercise: user.exercisePreferences || [],
              communication: 'detailed'
            }
          },
          healthMetrics: {
            sleepHours: 7,
            energyLevel: 6,
            stressLevel: 5,
            digestiveHealth: 6,
            adherenceRate: 80
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWellnessPlan(result.data);
        console.log('✅ Real AI wellness plan loaded:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch wellness plan');
      }
    } catch (err: any) {
      console.error('❌ Error fetching wellness plan:', err);
      setError(`Failed to load AI wellness plan: ${err.message}`);
      
      // Fallback plan
      setWellnessPlan({
        greeting: `Good morning, ${user.firstName}! ✨`,
        phaseGuidance: phaseInfo[currentPhase].description,
        dailyPlan: [
          { title: 'Start with 16oz of filtered water', priority: 'high', completed: false, status: 'pending' },
          { title: 'Take morning supplements', priority: 'high', completed: false, status: 'pending' },
          { title: 'Eat fiber-rich breakfast', priority: 'medium', completed: false, status: 'pending' },
          { title: '10 minutes of mindfulness', priority: 'medium', completed: false, status: 'pending' }
        ],
        recommendations: ['Focus on whole foods today', 'Stay hydrated'],
        insights: [
          { title: 'GMRP Journey', message: `You're in ${currentPhase} - every healthy choice counts!`, type: 'info' }
        ],
        nextSteps: ['Complete today\'s tasks', 'Track your progress']
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch nutrition plan from real AI
  const fetchNutritionPlan = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/wellness/nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...user,
            currentPhase: currentPhase,
            age: user.age || 35
          },
          dietaryPreferences: user.dietaryPreferences || []
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNutritionPlan(result.data);
        console.log('✅ Real AI nutrition plan loaded:', result.data);
      }
    } catch (err) {
      console.error('❌ Error fetching nutrition plan:', err);
    }
  };

  useEffect(() => {
    fetchWellnessPlan();
    fetchNutritionPlan();
  }, [user, currentPhase]);

  const quickActions = [
    { icon: Dumbbell, label: 'Start Workout', color: 'bg-green-50 text-green-700 border-green-200', action: () => console.log('Start workout') },
    { icon: Apple, label: 'Log Meal', color: 'bg-orange-50 text-orange-700 border-orange-200', action: () => console.log('Log meal') },
    { icon: Lotus, label: 'Meditate', color: 'bg-blue-50 text-blue-700 border-blue-200', action: () => console.log('Meditate') },
    { icon: Pill, label: 'Supplements', color: 'bg-purple-50 text-purple-700 border-purple-200', action: () => console.log('Supplements') }
  ];

  const metrics = [
    { icon: Activity, label: 'Progress', value: wellnessPlan?.progressAssessment?.currentScore || '75', target: '%', color: 'text-blue-600' },
    { icon: Target, label: 'Phase Days', value: '30', target: `${currentPhase}`, color: 'text-orange-600' },
    { icon: Heart, label: 'Wellness', value: '8.2', target: '/10', color: 'text-red-600' },
    { icon: TrendingUp, label: 'Streak', value: '7', target: 'days', color: 'text-green-600' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle2;
      case 'tip': return Sparkles;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'from-orange-50 to-red-50 border-orange-200';
      case 'success': return 'from-green-50 to-emerald-50 border-green-200';
      case 'tip': return 'from-purple-50 to-pink-50 border-purple-200';
      default: return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Generating your personalized GMRP plan...</p>
          <p className="text-sm text-gray-600 mt-2">Our AI is analyzing your profile and creating today's recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI-Generated Welcome Header */}
      <div className={`bg-gradient-to-r ${phaseInfo[currentPhase].color} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                {wellnessPlan?.greeting || `Good morning, ${user.firstName}! ✨`}
              </h1>
              <p className="text-blue-100 mb-4">
                {wellnessPlan?.phaseGuidance || phaseInfo[currentPhase].description}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  GMRP {phaseInfo[currentPhase].name}
                </Badge>
                {wellnessPlan?.progressAssessment && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {wellnessPlan.progressAssessment.currentScore}% Progress
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={() => fetchWellnessPlan(false)}
              disabled={refreshing}
              variant="secondary" 
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh AI Plan'}
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {wellnessPlan?.insights && wellnessPlan.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wellnessPlan.insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <Card key={index} className={`bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={action.action}
            className={`h-20 flex-col space-y-2 ${action.color} hover:shadow-md transition-all duration-200`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">{metric.target}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI-Generated Daily Plan & Nutrition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's GMRP Plan */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Today's GMRP Plan</span>
              <Badge variant="outline" className="ml-auto">AI Generated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wellnessPlan?.dailyPlan?.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={task.completed}
                      onChange={() => {
                        // Update task completion
                        const updatedPlan = { ...wellnessPlan };
                        updatedPlan.dailyPlan[index].completed = !task.completed;
                        setWellnessPlan(updatedPlan);
                      }}
                    />
                    <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            
            {wellnessPlan?.recommendations && wellnessPlan.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">AI Recommendations:</h4>
                <ul className="space-y-1">
                  {wellnessPlan.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Nutrition Plan */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Apple className="h-5 w-5 text-green-600" />
              <span>Today's Nutrition</span>
              <Badge variant="outline" className="ml-auto">AI Generated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nutritionPlan ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Breakfast</p>
                  <p className="text-sm text-gray-900">{nutritionPlan.mealPlan.breakfast}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Lunch</p>
                  <p className="text-sm text-gray-900">{nutritionPlan.mealPlan.lunch}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Dinner</p>
                  <p className="text-sm text-gray-900">{nutritionPlan.mealPlan.dinner}</p>
                </div>
                
                {nutritionPlan.fiberBreakdown && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Fiber Target: {nutritionPlan.fiberBreakdown.target}g daily
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {nutritionPlan.fiberBreakdown.sources.slice(0, 4).map((source, index) => (
                        <div key={index} className="text-xs bg-green-50 p-2 rounded">
                          <p className="font-medium">{source.food}</p>
                          <p className="text-gray-600">{source.amount} = {source.fiber}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button variant="outline" size="sm" className="w-full">
                  View Full Nutrition Plan
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Loading AI nutrition plan...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      {wellnessPlan?.nextSteps && wellnessPlan.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wellnessPlan.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-purple-900">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}