// App.tsx - REPLACE EXISTING FILE
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { CommunityModule } from './components/CommunityModule';
import { ClientsScreen } from './screens/ClientsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupplementationModule } from './components/SupplementationModule';
import { BottomNavBar } from './components/BottomNavBar';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-medium text-gray-900">Loading WellnessAI...</p>
            <p className="text-sm text-gray-600">Connecting to behavioral AI system</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  // Render different dashboards based on user type
  const renderDashboard = () => {
    if (user.type === 'PROFESSIONAL' || user.type === 'ADMIN') {
      return <ProfessionalDashboard user={user} />;
    }
    return <DashboardScreen user={user} />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={renderDashboard()} />
            <Route path="/progress" element={<ProgressScreen user={user} />} />
            <Route path="/community" element={<CommunityModule user={user} />} />
            <Route path="/clients" element={<ClientsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/supplements" element={<SupplementationModule user={user} />} />
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