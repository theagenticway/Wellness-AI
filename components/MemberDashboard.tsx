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
  TrendingUp
} from 'lucide-react';

interface MemberDashboardProps {
  user: User;
}

export function MemberDashboard({ user }: MemberDashboardProps) {
  const currentPhase = user.currentPhase || 'phase1';
  const phaseInfo = {
    phase1: { name: 'Foundation', description: 'Building healthy habits' },
    phase2: { name: 'Transformation', description: 'Accelerating progress' },
    phase3: { name: 'Optimization', description: 'Fine-tuning wellness' }
  };

  const quickActions = [
    { icon: Dumbbell, label: 'Start Workout', color: 'bg-green-50 text-green-700 border-green-200' },
    { icon: Apple, label: 'Log Meal', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { icon: Lotus, label: 'Meditate', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { icon: Pill, label: 'Supplements', color: 'bg-purple-50 text-purple-700 border-purple-200' }
  ];

  const metrics = [
    { icon: Activity, label: 'Steps', value: '8,234', target: '10,000', color: 'text-blue-600' },
    { icon: Target, label: 'Calories', value: '324', target: '500', color: 'text-orange-600' },
    { icon: Heart, label: 'Heart Rate', value: '72', target: 'bpm', color: 'text-red-600' },
    { icon: TrendingUp, label: 'Progress', value: '85%', target: 'weekly', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good morning, {user.firstName}! ✨</h1>
            <p className="text-blue-100 mb-4">You're in {phaseInfo[currentPhase].name} phase - {phaseInfo[currentPhase].description}</p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Day 23 of wellness journey
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Current Phase: {phaseInfo[currentPhase].name}
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className={`cursor-pointer card-hover border-2 ${action.color}`}>
            <CardContent className="p-4 text-center">
              <action.icon className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{action.label}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                  <p className="text-xs text-slate-500">Target: {metric.target}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Today's Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Morning Workout</span>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Lunch - Quinoa Bowl</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Evening Meditation</span>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Great Progress!</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Your consistency this week is excellent. You're 85% on track with your wellness goals.
                </p>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                  View Details
                </Button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Recommendation</h4>
                <p className="text-sm text-green-700 mb-3">
                  Consider adding 5 more minutes to your meditation sessions for better sleep quality.
                </p>
                <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                  Apply Suggestion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}