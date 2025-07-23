'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';

interface ClientData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
  wellnessScore: number;
  metrics: {
    weight: { value: string; change: string; trend: 'positive' | 'negative' };
    sleep: { value: string; change: string; trend: 'positive' | 'negative' };
    activity: { value: string; change: string; trend: 'positive' | 'negative' };
  };
  recentActivity: Array<{
    id: string;
    type: 'completed' | 'adjusted' | 'started';
    title: string;
    date: string;
    icon: 'Check' | 'Moon' | 'BowlFood';
  }>;
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'plan' | 'messages' | 'notes'>('progress');

  // Mock data for development - replace with actual API call
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // TODO: Replace with actual API call to /api/clients/${clientId}
        setTimeout(() => {
          setClientData({
            id: clientId,
            name: 'Sophia Bennett',
            email: 'sophia.bennett@email.com',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRFr6mhHhgbnsRL45ca2d7Kyw6AmcCbX-JBgsl8WNI39_qng7eANEtuHJfvb9LBmZKltYGF1UdShGATPK5xmGPRXC-ccDUfuUb-oZ5j966fye26lNuuO-rT8o_-ZTiuVfogKnffBLDEM_hPnToOpaXgTrvPLEgDIvYOx9RMRHLRb7aaL_TJDGvy4jhwfGETegcpTUDt2G1CUk9oPpKak4xpRWS48Y5kjzc9Q2muqHC68Y-aLQqzw2-qIkwVEYlvtJu3UM78ZbfHA',
            joinedDate: '2023',
            lastActive: '2 days ago',
            wellnessScore: 75,
            metrics: {
              weight: { value: '-2 lbs', change: '-2%', trend: 'negative' },
              sleep: { value: '+1 hr', change: '+10%', trend: 'positive' },
              activity: { value: '+20%', change: '+20%', trend: 'positive' }
            },
            recentActivity: [
              {
                id: '1',
                type: 'completed',
                title: 'Completed Week 3 of plan',
                date: '2 days ago',
                icon: 'Check'
              },
              {
                id: '2',
                type: 'adjusted',
                title: 'Adjusted sleep goals',
                date: '1 week ago',
                icon: 'Moon'
              },
              {
                id: '3',
                type: 'started',
                title: 'Started new nutrition plan',
                date: '2 weeks ago',
                icon: 'BowlFood'
              }
            ]
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load client data');
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleBack = () => {
    router.push('/clients');
  };

  const getIconSvg = (icon: string) => {
    switch (icon) {
      case 'Check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        );
      case 'Moon':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56A104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
          </svg>
        );
      case 'BowlFood':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,104h-8.37a88,88,0,0,0-175.26,0H32a8,8,0,0,0-8,8,104.35,104.35,0,0,0,56,92.28V208a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16v-3.72A104.35,104.35,0,0,0,232,112,8,8,0,0,0,224,104Zm-24.46,0H148.12a71.84,71.84,0,0,1,41.27-29.57A71.45,71.45,0,0,1,199.54,104ZM173.48,56.23q2.75,2.25,5.27,4.75a87.92,87.92,0,0,0-49.15,43H100.1A72.26,72.26,0,0,1,168,56C169.83,56,171.66,56.09,173.48,56.23ZM128,40a71.87,71.87,0,0,1,19,2.57A88.36,88.36,0,0,0,83.33,104H56.46A72.08,72.08,0,0,1,128,40Zm36.66,152A8,8,0,0,0,160,199.3V208H96v-8.7A8,8,0,0,0,91.34,192a88.29,88.29,0,0,1-51-72H215.63A88.29,88.29,0,0,1,164.66,192Z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Client not found'}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      
      <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
        <div>
          {/* Header */}
          <div className="flex items-center bg-white p-4 pb-2 justify-between">
            <button 
              onClick={handleBack}
              className="text-[#111715] flex size-12 shrink-0 items-center hover:bg-gray-100 rounded-lg"
              data-icon="ArrowLeft" 
              data-size="24px" 
              data-weight="regular"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h2 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Client Details</h2>
          </div>

          {/* Client Profile */}
          <div className="flex p-4 @container">
            <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
              <div className="flex gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                  style={{backgroundImage: `url("${clientData.avatar}")`}}
                ></div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#111715] text-[22px] font-bold leading-tight tracking-[-0.015em]">{clientData.name}</p>
                  <p className="text-[#648779] text-base font-normal leading-normal">Client since {clientData.joinedDate}</p>
                  <p className="text-[#648779] text-base font-normal leading-normal">Last active: {clientData.lastActive}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pb-3">
            <div className="flex border-b border-[#dce5e1] px-4 gap-8">
              {[
                { key: 'progress', label: 'Progress' },
                { key: 'plan', label: 'Plan' },
                { key: 'messages', label: 'Messages' },
                { key: 'notes', label: 'Notes' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === tab.key 
                      ? 'border-b-[#111715] text-[#111715]' 
                      : 'border-b-transparent text-[#648779] hover:text-[#111715]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Tab Content */}
          {activeTab === 'progress' && (
            <>
              <h3 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Overall Progress</h3>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-6 justify-between">
                  <p className="text-[#111715] text-base font-medium leading-normal">Wellness Score</p>
                  <p className="text-[#111715] text-sm font-normal leading-normal">{clientData.wellnessScore}/100</p>
                </div>
                <div className="rounded bg-[#dce5e1]">
                  <div className="h-2 rounded bg-[#111715]" style={{width: `${clientData.wellnessScore}%`}}></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 p-4">
                {Object.entries(clientData.metrics).map(([key, metric]) => (
                  <div key={key} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#dce5e1]">
                    <p className="text-[#111715] text-base font-medium leading-normal capitalize">{key}</p>
                    <p className="text-[#111715] tracking-light text-2xl font-bold leading-tight">{metric.value}</p>
                    <p className={`text-base font-medium leading-normal ${
                      metric.trend === 'positive' ? 'text-[#07882c]' : 'text-[#e72e08]'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Recent Activity</h3>
              <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
                {clientData.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="contents">
                    <div className="flex flex-col items-center gap-1 pt-3">
                      <div className="text-[#111715]" data-icon={activity.icon} data-size="24px" data-weight="regular">
                        {getIconSvg(activity.icon)}
                      </div>
                      {index < clientData.recentActivity.length - 1 && (
                        <div className="w-[1.5px] bg-[#dce5e1] h-2 grow"></div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col py-3">
                      <p className="text-[#111715] text-base font-medium leading-normal">{activity.title}</p>
                      <p className="text-[#648779] text-base font-normal leading-normal">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Other Tab Content Placeholders */}
          {activeTab !== 'progress' && (
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-[#648779] text-lg font-medium">
                  {activeTab === 'plan' && 'Client wellness plan content will be displayed here.'}
                  {activeTab === 'messages' && 'Message history with client will be displayed here.'}
                  {activeTab === 'notes' && 'Professional notes about client will be displayed here.'}
                </p>
                <p className="text-[#648779] text-sm mt-2">Coming soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div>
          <div className="flex justify-end overflow-hidden px-5 pb-5">
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-[#1fdf92] text-[#111715] text-base font-bold leading-normal tracking-[0.015em] min-w-0 px-2 gap-4 pl-4 pr-6 hover:bg-[#1bc77e] transition-colors"
              onClick={() => {/* TODO: Add edit functionality */}}
            >
              <div className="text-[#111715]" data-icon="PencilSimple" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                </svg>
              </div>
              <span>Edit Plan</span>
            </button>
          </div>
          <div className="h-5 bg-white"></div>
        </div>
      </div>
    </>
  );
}