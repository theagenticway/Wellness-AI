import { User } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Target, 
  TrendingUp, 
  Activity,
  Apple,
  Dumbbell,
  Brain,
  Users
} from 'lucide-react';

interface MemberDashboardProps {
  user: User;
}

export function MemberDashboard({ user }: MemberDashboardProps) {
  const todaysTasks = [
    { id: 1, title: 'Morning meditation', completed: true, category: 'mindfulness' },
    { id: 2, title: 'Drink 8 glasses of water', completed: false, category: 'nutrition' },
    { id: 3, title: '30 min walk', completed: false, category: 'exercise' },
    { id: 4, title: 'Take supplements', completed: true, category: 'health' }
  ];

  const progressData = {
    nutrition: 85,
    exercise: 70,
    mindfulness: 90,
    overall: 82
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBg = (value: number) => {
    if (value >= 80) return 'bg-green-100';
    if (value >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
        <p className="text-blue-100 mb-4">Here's your wellness journey for today</p>
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg p-3">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Overall Wellness Score</p>
            <p className="text-2xl font-bold">{progressData.overall}%</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nutrition</p>
                <p className={`text-2xl font-bold ${getProgressColor(progressData.nutrition)}`}>
                  {progressData.nutrition}%
                </p>
              </div>
              <div className={`p-2 rounded-lg ${getProgressBg(progressData.nutrition)}`}>
                <Apple className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exercise</p>
                <p className={`text-2xl font-bold ${getProgressColor(progressData.exercise)}`}>
                  {progressData.exercise}%
                </p>
              </div>
              <div className={`p-2 rounded-lg ${getProgressBg(progressData.exercise)}`}>
                <Dumbbell className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mindfulness</p>
                <p className={`text-2xl font-bold ${getProgressColor(progressData.mindfulness)}`}>
                  {progressData.mindfulness}%
                </p>
              </div>
              <div className={`p-2 rounded-lg ${getProgressBg(progressData.mindfulness)}`}>
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Community</p>
                <p className="text-2xl font-bold text-blue-600">Active</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                    {task.title}
                  </span>
                </div>
                <Badge variant={task.completed ? 'secondary' : 'outline'}>
                  {task.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Great Progress!</h4>
              <p className="text-sm text-blue-700">
                Your mindfulness practice is showing excellent consistency. Keep up the great work!
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Hydration Reminder</h4>
              <p className="text-sm text-yellow-700">
                You're behind on your water intake today. Try to drink a glass now!
              </p>
            </div>
            
            <Button className="w-full" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}