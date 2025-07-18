import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User } from '../types/user';
import { Lotus, Play, Clock, Heart, TrendingUp } from 'lucide-react';

interface MindfulnessModuleProps {
  user: User;
}

export function MindfulnessModule({ user }: MindfulnessModuleProps) {
  const sessions = [
    { title: 'Morning Mindfulness', duration: 10, type: 'mindfulness', completed: true },
    { title: 'Stress Relief Breathing', duration: 5, type: 'breathing', completed: false },
    { title: 'Body Scan Meditation', duration: 15, type: 'body_scan', completed: false },
    { title: 'Sleep Preparation', duration: 20, type: 'sleep', completed: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mindfulness & Meditation</h1>
          <p className="text-slate-600">Guided meditation sessions with AI recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session, index) => (
          <Card key={index} className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{session.title}</h3>
                <Badge variant={session.completed ? 'default' : 'outline'}>
                  {session.completed ? 'Completed' : 'Available'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-3 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{session.duration} minutes</span>
                <span>•</span>
                <span className="capitalize">{session.type.replace('_', ' ')}</span>
              </div>
              <Button className="w-full" variant={session.completed ? 'outline' : 'default'}>
                <Play className="h-4 w-4 mr-2" />
                {session.completed ? 'Play Again' : 'Start Session'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}