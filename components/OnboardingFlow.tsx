import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../types/user';
import { Progress } from './ui/progress';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleSubmit = () => {
    const user: User = {
      id: '1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      type: 'member',
      currentPhase: 'phase1',
      programGoals: [formData.goal],
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en',
      },
    };
    onComplete(user);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome</h1>
            <p className="text-slate-600 mb-6">
              To tailor your wellness journey, we'll start with a quick health quiz. This will help us understand your needs and preferences.
            </p>
            <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Start Quiz
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Set your wellness goals</h1>
            <p className="text-slate-600 mb-6">
              What do you want to achieve? Set personalized wellness objectives to guide your journey.
            </p>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Enter your primary goal"
            />
            <Button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Next
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">You're all set!</h1>
            <p className="text-slate-600 mb-6">
              Your personalized wellness plan is ready. Let's start your journey to a healthier you.
            </p>
            <Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Get Started
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} />
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
