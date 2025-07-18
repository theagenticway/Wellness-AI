import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MemberDashboard } from './components/MemberDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ExerciseModule } from './components/ExerciseModule';
import { NutritionModule } from './components/NutritionModule';
import { SupplementationModule } from './components/SupplementationModule';
import { MindfulnessModule } from './components/MindfulnessModule';
import { CBTModule } from './components/CBTModule';
import { CommunityModule } from './components/CommunityModule';
import { User } from './types/user';
import { 
  Activity, 
  Brain, 
  Heart, 
  Home, 
  Settings, 
  Users, 
  Dumbbell, 
  Apple, 
  Pill, 
  Lotus,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setActiveModule('dashboard');
  };

  if (!currentUser || !isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return currentUser.type === 'member' ? 
          <MemberDashboard user={currentUser} /> : 
          <ProfessionalDashboard user={currentUser} />;
      case 'exercise':
        return <ExerciseModule user={currentUser} />;
      case 'nutrition':
        return <NutritionModule user={currentUser} />;
      case 'supplementation':
        return <SupplementationModule user={currentUser} />;
      case 'mindfulness':
        return <MindfulnessModule user={currentUser} />;
      case 'cbt':
        return <CBTModule user={currentUser} />;
      case 'community':
        return <CommunityModule user={currentUser} />;
      default:
        return currentUser.type === 'member' ? 
          <MemberDashboard user={currentUser} /> : 
          <ProfessionalDashboard user={currentUser} />;
    }
  };

  const navigationItems = currentUser.type === 'member' ? [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell, badge: null },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, badge: '3' },
    { id: 'supplementation', label: 'Supplements', icon: Pill, badge: null },
    { id: 'mindfulness', label: 'Mindfulness', icon: Lotus, badge: null },
    { id: 'cbt', label: 'CBT Sessions', icon: Brain, badge: '1' },
    { id: 'community', label: 'Community', icon: Users, badge: null },
  ] : [
    { id: 'dashboard', label: 'Client Roster', icon: Users, badge: '5' },
    { id: 'analytics', label: 'Analytics', icon: Activity, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center ml-2 lg:ml-0">
                <div className="relative">
                  <Heart className="h-9 w-9 text-blue-600" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    WellnessAI
                  </h1>
                  <p className="text-xs text-slate-500 leading-none">Your AI Wellness Companion</p>
                </div>
              </div>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search wellness content..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
              </button>

              {/* Phase Badge (for members) */}
              {currentUser.type === 'member' && currentUser.currentPhase && (
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                  {currentUser.currentPhase.toUpperCase().replace('PHASE', 'Phase ')}
                </Badge>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {currentUser.type === 'professional' ? 'Healthcare Professional' : 'Member'}
                  </p>
                </div>
                
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                  <AvatarImage src="" alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </AvatarFallback>
                </Avatar>

                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-slate-900">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <nav className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/90 backdrop-blur-md border-r border-slate-200/60 transition-transform duration-300 ease-in-out lg:transition-none`}>
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Navigation</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {currentUser.type === 'member' ? 'Your wellness journey' : 'Professional tools'}
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-2 overflow-y-auto h-full">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200/50'
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="ml-3 font-medium">{item.label}</span>
                  </div>
                  
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="bg-red-100 text-red-700 text-xs px-2 py-1 min-w-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Powered by AI</p>
              <div className="flex justify-center space-x-1">
                <div className="h-1 w-1 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="h-1 w-1 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
                <div className="h-1 w-1 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}