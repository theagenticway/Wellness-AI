'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface DailyTask {
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  status: string;
  category?: 'nutrition' | 'exercise' | 'mindfulness' | 'hydration' | 'supplements';
  behavioralStrategy?: string;
  estimatedTime?: string;
}

interface WellnessInsight {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'tip';
}

interface BehavioralNudge {
  type: 'habit_stack' | 'implementation_intention' | 'social_proof' | 'loss_aversion' | 'info' | 'warning' | 'success' | 'tip';
  message: string;
  trigger?: string;
}

interface DashboardData {
  greeting?: string;
  phaseGuidance?: string;
  dailyPlan?: DailyTask[];
  recommendations?: string[];
  insights?: WellnessInsight[];
  nextSteps?: string[];
  behavioralNudges?: BehavioralNudge[];
  aiPersona?: {
    motivationalStyle: string;
    communicationTone: string;
    focusAreas: string[];
    personalizedInsights: string[];
    phaseStrategy: string;
  };
}

export default function DashboardStitchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'pending' | 'completed' | 'failed'>('pending');

  // Mock data for demonstration - this will be replaced with real AI data
  const mockDashboardData: DashboardData = {
    greeting: `Good morning, ${session?.user?.name?.split(' ')[0] || 'there'}! Ready to achieve your wellness goals today?`,
    phaseGuidance: "🌱 Foundation Building Phase: Focus on building sustainable habits. Your journey starts with small, consistent actions that align with your motivation style.",
    dailyPlan: [
      {
        title: "Morning Hydration Boost",
        priority: 'high',
        completed: false,
        status: 'pending',
        category: 'hydration',
        behavioralStrategy: 'Implementation intention: "After I wake up, I will drink a glass of water"',
        estimatedTime: '2 minutes'
      },
      {
        title: "Mindful Check-in",
        priority: 'medium',
        completed: false,
        status: 'pending',
        category: 'mindfulness',
        behavioralStrategy: 'Use your morning peak energy time',
        estimatedTime: '5 minutes'
      },
      {
        title: "Beginner Movement Session",
        priority: 'high',
        completed: false,
        status: 'pending',
        category: 'exercise',
        behavioralStrategy: 'Habit stacking: Pair with your morning coffee routine',
        estimatedTime: '15 minutes'
      },
      {
        title: "Nutrition Goal Focus",
        priority: 'medium',
        completed: false,
        status: 'pending',
        category: 'nutrition',
        behavioralStrategy: 'Pre-commitment: Plan your healthy snacks now',
        estimatedTime: '10 minutes'
      }
    ],
    recommendations: [
      "Based on your intrinsic motivation, focus on personal satisfaction over external rewards",
      "Your optimal performance time is morning - schedule important tasks then",
      "Small consistent actions build lasting habits better than big sporadic efforts"
    ],
    insights: [
      {
        title: 'Behavioral Pattern',
        message: 'Your encouraging communication preference creates positive reinforcement loops',
        type: 'info'
      },
      {
        title: 'Progress Tip',
        message: 'Focus on consistency over perfection - 80% completion beats 100% burnout',
        type: 'tip'
      },
      {
        title: 'Energy Optimization',
        message: 'Use morning hours for your most challenging wellness tasks',
        type: 'success'
      }
    ],
    nextSteps: [
      "Start with 2-minute rule: Begin with the smallest possible version of your goal",
      "Set up environmental cues for success in your space",
      "Use morning energy for highest-priority wellness activities"
    ],
    behavioralNudges: [
      {
        type: 'implementation_intention',
        message: "When I feel stressed, I will take 3 deep breaths and remind myself of my wellness goals"
      },
      {
        type: 'habit_stack',
        message: "Stack your new habits with existing morning routine"
      }
    ]
  };

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // For now, use mock data - this will be replaced with real API calls
      setTimeout(() => {
        setDashboardData(mockDashboardData);
        setAiStatus('completed');
        setLoading(false);
      }, 1000);
    }
  }, [status, session]);

  const toggleTaskCompletion = (index: number) => {
    if (!dashboardData?.dailyPlan) return;
    
    const updatedPlan = [...dashboardData.dailyPlan];
    updatedPlan[index].completed = !updatedPlan[index].completed;
    updatedPlan[index].status = updatedPlan[index].completed ? 'completed' : 'pending';
    
    setDashboardData({
      ...dashboardData,
      dailyPlan: updatedPlan
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      case 'mindfulness': return '🧘';
      case 'hydration': return '💧';
      case 'supplements': return '💊';
      default: return '✨';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'info': return '💡';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'tip': return '💫';
      default: return '📝';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b2d0e5] mx-auto mb-4"></div>
            <p className="text-[#121516] font-medium">Loading your personalized wellness plan...</p>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (error) {
    return (
      <>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#b2d0e5] text-[#121516] rounded-full font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      
      <div className="min-h-screen bg-white" style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'}}>
        {/* Header */}
        <div className="bg-white border-b border-[#f1f2f4] px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-[#121516] text-2xl font-bold leading-tight">
                  {dashboardData?.greeting || `Welcome, ${session.user?.name?.split(' ')[0]}`}
                </h1>
                <p className="text-[#6a7781] text-sm mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[#121516] text-sm font-medium">AI Status</p>
                  <p className={`text-xs ${aiStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {aiStatus === 'completed' ? '✅ Ready' : '⏳ Generating'}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase Guidance */}
            {dashboardData?.phaseGuidance && (
              <div className="bg-[#f8f9ff] border border-[#e1e5f7] rounded-xl p-4">
                <p className="text-[#121516] text-sm leading-relaxed">
                  {dashboardData.phaseGuidance}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Daily Plan */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
                <div className="p-6 border-b border-[#f1f2f4]">
                  <h2 className="text-[#121516] text-lg font-semibold">Today's Wellness Plan</h2>
                  <p className="text-[#6a7781] text-sm mt-1">
                    {dashboardData?.dailyPlan?.filter(task => task.completed).length || 0} of{' '}
                    {dashboardData?.dailyPlan?.length || 0} tasks completed
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  {dashboardData?.dailyPlan?.map((task, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        task.completed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-[#f1f2f4] bg-white hover:border-[#b2d0e5]'
                      }`}
                      onClick={() => toggleTaskCompletion(index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {}}
                              className="w-5 h-5 text-[#b2d0e5] rounded focus:ring-0"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getCategoryIcon(task.category)}</span>
                              <h3 className={`text-[#121516] font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                                {task.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            {task.behavioralStrategy && (
                              <p className="text-[#6a7781] text-sm mb-2 italic">
                                💡 {task.behavioralStrategy}
                              </p>
                            )}
                            
                            {task.estimatedTime && (
                              <div className="flex items-center gap-4 text-xs text-[#6a7781]">
                                <span>⏱️ {task.estimatedTime}</span>
                                <span className="capitalize">📂 {task.category}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Insights */}
              <div className="bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
                <div className="p-4 border-b border-[#f1f2f4]">
                  <h3 className="text-[#121516] font-semibold">Personal Insights</h3>
                </div>
                <div className="p-4 space-y-3">
                  {dashboardData?.insights?.map((insight, index) => (
                    <div key={index} className="p-3 bg-[#f8f9ff] rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{getInsightIcon(insight.type)}</span>
                        <div className="flex-1">
                          <h4 className="text-[#121516] text-sm font-medium mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-[#6a7781] text-xs leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
                <div className="p-4 border-b border-[#f1f2f4]">
                  <h3 className="text-[#121516] font-semibold">AI Recommendations</h3>
                </div>
                <div className="p-4 space-y-2">
                  {dashboardData?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#b2d0e5] text-lg leading-none">•</span>
                      <p className="text-[#121516] text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
                <div className="p-4 border-b border-[#f1f2f4]">
                  <h3 className="text-[#121516] font-semibold">Next Steps</h3>
                </div>
                <div className="p-4 space-y-2">
                  {dashboardData?.nextSteps?.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#1fdf92] font-bold text-sm leading-none">{index + 1}.</span>
                      <p className="text-[#121516] text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f1f2f4] px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <a className="flex flex-1 flex-col items-center justify-end gap-1 text-[#121516] hover:text-[#b2d0e5] transition-colors" href="/dashboard-stitch">
                <div className="flex h-8 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                  </svg>
                </div>
                <p className="text-xs font-medium">Dashboard</p>
              </a>
              <a className="flex flex-1 flex-col items-center justify-end gap-1 text-[#6a7781] hover:text-[#121516] transition-colors" href="/clients">
                <div className="flex h-8 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Zm87.91-.15a95.87,95.87,0,0,0-47.13-37.56A60,60,0,0,0,144.7,54.59a4,4,0,0,0-1.33,6A75.83,75.83,0,0,1,147,150.53a4,4,0,0,0,1.07,5.53,112.32,112.32,0,0,1,29.85,30.83,23.92,23.92,0,0,1,3.65,16.47,4,4,0,0,0,3.95,4.64h60.3a8,8,0,0,0,7.73-5.93A8.22,8.22,0,0,0,252.38,195.48Z"></path>
                  </svg>
                </div>
                <p className="text-xs font-medium">Clients</p>
              </a>
              <a className="flex flex-1 flex-col items-center justify-end gap-1 text-[#6a7781] hover:text-[#121516] transition-colors" href="#">
                <div className="flex h-8 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88a8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                  </svg>
                </div>
                <p className="text-xs font-medium">Settings</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}