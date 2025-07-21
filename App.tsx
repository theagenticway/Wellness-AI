import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingFlow } from './components/OnboardingFlow';
import { User } from './types/user';
import { BottomNavBar } from './components/BottomNavBar';
import { ProgressScreen } from './screens/ProgressScreen';
import { CommunityModule } from './components/CommunityModule';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupplementationModule } from './components/SupplementationModule';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    // Check for existing user session
    try {
      const savedUser = localStorage.getItem('wellnessAppUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Error loading saved user:', error);
      localStorage.removeItem('wellnessAppUser');
    }
  }, []);

  const handleOnboardingComplete = (user: User) => {
    setCurrentUser(user);
    setIsOnboardingComplete(true);
    try {
      localStorage.setItem('wellnessAppUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsOnboardingComplete(false);
    localStorage.removeItem('wellnessAppUser');
  };

  if (!currentUser || !isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<DashboardScreen user={currentUser} />} />
            <Route path="/progress" element={<ProgressScreen user={currentUser} />} />
            <Route path="/community" element={<CommunityModule user={currentUser} />} />
            <Route path="/clients" element={<ClientsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/supplements" element={<SupplementationModule user={currentUser} />} />
            {/* Define other routes here as components are created */}
          </Routes>
        </main>
        <BottomNavBar />
      </div>
    </Router>
  );
}
