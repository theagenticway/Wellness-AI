import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { OnboardingFlow } from './components/OnboardingFlow';
import { LoginScreen } from './components/LoginScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { ProgressScreen } from './screens/ProgressScreen';
import { CommunityModule } from './components/CommunityModule';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupplementationModule } from './components/SupplementationModule';
import { Button } from './components/ui/button';
import { User, LogOut } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isLoading, logout, completeOnboarding } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WellnessAI...</p>
        </div>
      </div>
    );
  }

  // Show onboarding flow if user chooses to create account
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={(userData) => {
          completeOnboarding(userData);
          setShowOnboarding(false);
        }}
        onBack={() => setShowOnboarding(false)}
      />
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <LoginScreen />
        {/* Option to start onboarding */}
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowOnboarding(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <User className="mr-2 h-4 w-4" />
            New User? Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Main app for authenticated users
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Header with logout option */}
        <header className="bg-white shadow-sm border-b px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} • Phase {user?.currentPhase?.replace('phase', '')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </header>

        <main className="pb-20">
          <Routes>
            <Route path="/" element={<DashboardScreen user={user!} />} />
            <Route path="/progress" element={<ProgressScreen user={user!} />} />
            <Route path="/community" element={<CommunityModule user={user!} />} />
            <Route path="/clients" element={<ClientsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/supplements" element={<SupplementationModule user={user!} />} />
          </Routes>
        </main>
        <BottomNavBar />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}