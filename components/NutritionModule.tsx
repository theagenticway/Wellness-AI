import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { User } from '../types/user';
import { Apple, Clock, ShoppingCart, Calendar, TrendingUp, Target } from 'lucide-react';

interface NutritionModuleProps {
  user: User;
}

export function NutritionModule({ user }: NutritionModuleProps) {
  const todaysMacros = {
    calories: { consumed: 1450, target: 1800 },
    protein: { consumed: 85, target: 120 },
    carbs: { consumed: 120, target: 180 },
    fat: { consumed: 55, target: 70 },
    fiber: { consumed: 18, target: 25 }
  };

  const currentPhase = user.currentPhase || 'phase1';
  const phaseInfo = {
    phase1: { name: 'Gut Reset', description: 'Focus on healing and reducing inflammation' },
    phase2: { name: 'Reintroduction', description: 'Gradually adding foods back' },
    phase3: { name: 'Maintenance', description: 'Sustainable long-term eating' }
  };

  const todaysMeals = [
    {
      type: 'Breakfast',
      name: 'Green Smoothie Bowl',
      calories: 320,
      time: '8:00 AM',
      status: 'completed'
    },
    {
      type: 'Lunch',
      name: 'Quinoa Buddha Bowl',
      calories: 480,
      time: '12:30 PM',
      status: 'completed'
    },
    {
      type: 'Snack',
      name: 'Almond & Berry Mix',
      calories: 150,
      time: '3:00 PM',
      status: 'completed'
    },
    {
      type: 'Dinner',
      name: 'Grilled Salmon & Vegetables',
      calories: 520,
      time: '7:00 PM',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nutrition Module</h1>
          <p className="text-slate-600">GMRP-driven personalized meal plans</p>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          {phaseInfo[currentPhase].name} Phase
        </Badge>
      </div>

      {/* Daily Macros */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span>Today's Nutrition</span>
          </CardTitle>
          <CardDescription>{phaseInfo[currentPhase].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(todaysMacros).map(([key, data]) => (
              <div key={key} className="text-center">
                <h4 className="font-medium capitalize text-sm text-slate-700 mb-2">{key}</h4>
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-200" />
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" 
                      strokeDasharray={`${(data.consumed / data.target) * 88} 88`} 
                      className={key === 'calories' ? 'text-orange-500' : 
                                key === 'protein' ? 'text-red-500' :
                                key === 'carbs' ? 'text-blue-500' :
                                key === 'fat' ? 'text-yellow-500' : 'text-green-500'} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">{Math.round((data.consumed / data.target) * 100)}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600">{data.consumed}/{data.target}{key === 'calories' ? '' : 'g'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Apple className="h-5 w-5 text-green-600" />
            <span>Today's Meal Plan</span>
          </CardTitle>
          <CardDescription>Your personalized GMRP meal schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysMeals.map((meal, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                meal.status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      meal.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <p className="text-sm text-slate-600">{meal.type} • {meal.calories} calories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{meal.time}</p>
                    <Badge variant={meal.status === 'completed' ? 'default' : 'secondary'}>
                      {meal.status === 'completed' ? 'Logged' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Generate Grocery List
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Plan Next Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-slate-600">Meal Plan Adherence</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">6/7</p>
            <p className="text-sm text-slate-600">Days on Track</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Apple className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-slate-600">Recipes Tried</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Information */}
      <Card className="glass-effect bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">GMRP {phaseInfo[currentPhase].name} Phase</CardTitle>
          <CardDescription className="text-orange-700">{phaseInfo[currentPhase].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Phase Focus:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Anti-inflammatory foods</li>
                <li>• Gut healing nutrients</li>
                <li>• Elimination of triggers</li>
                <li>• Microbiome support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Duration:</h4>
              <p className="text-sm text-orange-700">4-6 weeks typical phase length</p>
              <Button variant="outline" size="sm" className="mt-2 border-orange-300 text-orange-700">
                Learn More About GMRP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}