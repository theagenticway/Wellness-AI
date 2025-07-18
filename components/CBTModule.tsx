import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { User } from '../types/user';
import { Brain, MessageCircle, Target, Clock, CheckCircle } from 'lucide-react';

interface CBTModuleProps {
  user: User;
}

export function CBTModule({ user }: CBTModuleProps) {
  const sessions = [
    { title: 'Understanding Cravings', type: 'craving_management', progress: 100, status: 'completed' },
    { title: 'Building Healthy Habits', type: 'habit_formation', progress: 75, status: 'in_progress' },
    { title: 'Intermittent Fasting Education', type: 'if_education', progress: 0, status: 'locked' },
    { title: 'Stress Management', type: 'stress_management', progress: 0, status: 'available' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CBT Sessions</h1>
          <p className="text-slate-600">AI-powered cognitive behavioral therapy sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session, index) => (
          <Card key={index} className={`glass-effect ${session.status === 'locked' ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{session.title}</h3>
                <Badge variant={
                  session.status === 'completed' ? 'default' :
                  session.status === 'in_progress' ? 'secondary' :
                  session.status === 'locked' ? 'outline' : 'secondary'
                }>
                  {session.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{session.progress}%</span>
                </div>
                <Progress value={session.progress} className="h-2" />
              </div>
              <Button 
                className="w-full" 
                variant={session.status === 'completed' ? 'outline' : 'default'}
                disabled={session.status === 'locked'}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {session.status === 'completed' ? 'Review Session' : 
                 session.status === 'in_progress' ? 'Continue' :
                 session.status === 'locked' ? 'Locked' : 'Start Session'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}