import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../types/user';
import { Heart, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type: 'member' as 'member' | 'professional'
  });

  const handleComplete = () => {
    const user: User = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      type: formData.type,
      createdAt: new Date(),
      currentPhase: 'phase1' as const
    };
    onComplete(user);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <Heart className="h-16 w-16 text-blue-600 mx-auto" />
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
          <CardTitle className="text-2xl text-gradient mb-2">Welcome to WellnessAI</CardTitle>
          <p className="text-slate-600">Your comprehensive wellness platform</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleComplete}
              disabled={!isFormValid}
              className="w-full button-primary"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}