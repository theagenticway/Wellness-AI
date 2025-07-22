'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  greeting?: string;
  phaseGuidance?: string;
  primaryFocus?: string;
  tinyWins?: string[];
  habitStack?: string[];
  implementation?: string[];
  scheduledNudges?: string[];
  aiPersona?: {
    motivationalStyle: string;
    communicationTone: string;
    focusAreas: string[];
    personalizedInsights: string[];
    phaseStrategy: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [aiMessage, setAiMessage] = useState('Generating your personalized wellness plan...');
  const [pollCount, setPollCount] = useState(0);

  // Check AI generation status
  const checkAiStatus = async () => {
    try {
      const response = await fetch('/api/user/ai-status');
      const result = await response.json();
      
      if (result.success) {
        setAiStatus(result.status);
        setAiMessage(result.message);
        
        // If AI generation is completed, fetch dashboard data
        if (result.status === 'completed') {
          await fetchDashboardData();
          return true; // Stop polling
        }
      }
      return false; // Continue polling
    } catch (err) {
      console.error('AI status check error:', err);
      return false;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message || 'Failed to load dashboard data');
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError('Unable to load your personalized dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and polling logic
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check AI status immediately
      checkAiStatus().then(completed => {
        if (!completed) {
          // Start polling every 5 seconds if AI is still generating
          const pollInterval = setInterval(async () => {
            setPollCount(prev => prev + 1);
            const isCompleted = await checkAiStatus();
            
            if (isCompleted) {
              clearInterval(pollInterval);
            }
            
            // Stop polling after 2 minutes (24 polls * 5 seconds)
            if (pollCount >= 24) {
              clearInterval(pollInterval);
              setAiStatus('failed');
              setAiMessage('AI generation is taking longer than expected. Please refresh the page.');
              setLoading(false);
            }
          }, 5000);

          // Cleanup interval on unmount
          return () => clearInterval(pollInterval);
        }
      });
    }
  }, [status, session, pollCount]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && aiStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">WellnessAI Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {session?.user?.name}</span>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* AI Generation Loading */}
        <main className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 Creating Your Personalized Plan</h2>
              <p className="text-lg text-gray-600 mb-4">{aiMessage}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Our AI is analyzing your responses and generating a customized wellness strategy based on behavioral science principles. This usually takes 30-60 seconds.
                </p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Analyzing preferences...</span>
                <span>{pollCount * 5}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(pollCount * 4, 90)}%` }}
                ></div>
              </div>
            </div>

            {pollCount > 10 && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Taking a bit longer than usual... Our AI is being extra thorough! 🎯</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }


  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <h2 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Dashboard</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#111715] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <div className="text-[#111715]" data-icon="Gear" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Today Section */}
        <h3 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Today</h3>
        
        {/* Workout Card */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#648779] text-sm font-normal leading-normal">Workout</p>
              <p className="text-[#111715] text-base font-bold leading-tight">
                {dashboardData?.tinyWins?.[0] || 'Morning Yoga'}
              </p>
              <p className="text-[#648779] text-sm font-normal leading-normal">30 minutes</p>
            </div>
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=320&q=80")'}}
            ></div>
          </div>
        </div>

        {/* Nutrition Card */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#648779] text-sm font-normal leading-normal">Nutrition</p>
              <p className="text-[#111715] text-base font-bold leading-tight">
                {dashboardData?.tinyWins?.[1] || 'Breakfast'}
              </p>
              <p className="text-[#648779] text-sm font-normal leading-normal">Logged 3 items</p>
            </div>
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=320&q=80")'}}
            ></div>
          </div>
        </div>

        {/* Mindfulness Card */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#648779] text-sm font-normal leading-normal">Mindfulness</p>
              <p className="text-[#111715] text-base font-bold leading-tight">
                {dashboardData?.tinyWins?.[2] || 'Meditation'}
              </p>
              <p className="text-[#648779] text-sm font-normal leading-normal">15 minutes</p>
            </div>
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=320&q=80")'}}
            ></div>
          </div>
        </div>

        {/* CBT Card */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-[#648779] text-sm font-normal leading-normal">CBT</p>
              <p className="text-[#111715] text-base font-bold leading-tight">Thought Journal</p>
              <p className="text-[#648779] text-sm font-normal leading-normal">
                {dashboardData?.implementation?.[0] ? 'Personalized' : 'Completed'}
              </p>
            </div>
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=320&q=80")'}}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div>
        <div className="flex gap-2 border-t border-[#f0f4f3] bg-white px-4 pb-3 pt-2">
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#111715]" href="#">
            <div className="text-[#111715] flex h-8 items-center justify-center" data-icon="House" data-size="24px" data-weight="fill">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
            </div>
            <p className="text-[#111715] text-xs font-medium leading-normal tracking-[0.015em]">Dashboard</p>
          </a>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779]" href="#">
            <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="GridFour" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"></path>
              </svg>
            </div>
            <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Modules</p>
          </a>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779]" href="#">
            <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="Users" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
              </svg>
            </div>
            <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Clients</p>
          </a>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779]" href="#">
            <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="Gear" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
            </div>
            <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Settings</p>
          </a>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
}