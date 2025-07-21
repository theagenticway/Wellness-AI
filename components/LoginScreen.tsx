import React, { useState } from 'react';
import { useAuth, getDemoCredentials } from '../src/providers/AuthProvider';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, User, Lock, Info } from 'lucide-react';

export function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try the demo accounts below.');
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const demoCredentials = getDemoCredentials();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WellnessAI</h1>
          <p className="text-gray-600">Sign in to your wellness journey</p>
        </div>

        {/* Demo Credentials Info */}
        {showDemoInfo && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Demo Accounts Available:</p>
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="text-sm">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials(cred.email, cred.password)}
                      className="text-blue-600 hover:text-blue-800 underline mr-2"
                    >
                      {cred.email}
                    </button>
                    <span className="text-gray-500">({cred.role})</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowDemoInfo(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                >
                  Hide demo info
                </button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Don't have an account?</p>
          <button 
            type="button"
            className="text-green-600 hover:text-green-800 font-medium"
            onClick={() => {
              // This would trigger the onboarding flow
              // For now, we'll just show instructions
              alert('Complete the onboarding quiz to create your account!');
            }}
          >
            Complete Wellness Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}