import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { User } from '../types/user';
import { Dumbbell, Play, Clock, Target, Calendar, TrendingUp, Award, Zap } from 'lucide-react';

interface ExerciseModuleProps {
  user: User;
}

export function ExerciseModule({ user }: ExerciseModuleProps) {
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);

  useEffect(() => {
    // Fetch workout plan from backend
    const fetchWorkoutPlan = async () => {
      // Replace with actual API endpoint
      const response = await fetch('/api/generate-workout-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      const data = await response.json();
      setTodaysWorkout(data);
    };

    fetchWorkoutPlan();
  }, [user]);

  const weeklyStats = {
    workoutsCompleted: 4,
    workoutsPlanned: 5,
    totalMinutes: 180,
    caloriesBurned: 890
  };

  if (!todaysWorkout) {
    return <div>Loading workout plan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exercise Module</h1>
          <p className="text-slate-600">AI-powered workout plans tailored to your goals</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Week 4 of 12
        </Badge>
      </div>

      {/* Today's Workout */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dumbbell className="h-5 w-5 text-blue-600" />
            <span>Today's Workout</span>
          </CardTitle>
          <CardDescription>{todaysWorkout.name} • {todaysWorkout.duration} minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{todaysWorkout.difficulty}</Badge>
              <div className="flex items-center space-x-1 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{todaysWorkout.duration} min</span>
              </div>
            </div>
            <Button className="button-primary">
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todaysWorkout.exercises.map((exercise, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-slate-600">{exercise.sets} sets × {exercise.reps} reps</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{weeklyStats.workoutsCompleted}/{weeklyStats.workoutsPlanned}</p>
            <p className="text-sm text-slate-600">Workouts Complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{weeklyStats.totalMinutes}</p>
            <p className="text-sm text-slate-600">Minutes Exercised</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{weeklyStats.caloriesBurned}</p>
            <p className="text-sm text-slate-600">Calories Burned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-sm text-slate-600">Goal Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Workout Plans */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
          <CardDescription>Your personalized workout plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${index < 4 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="font-medium">{day}</span>
                  <span className="text-sm text-slate-600">
                    {index % 2 === 0 ? 'Strength Training' : index % 3 === 0 ? 'Cardio' : 'Rest Day'}
                  </span>
                </div>
                <Badge variant={index < 4 ? 'default' : 'secondary'}>
                  {index < 4 ? 'Completed' : 'Planned'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
