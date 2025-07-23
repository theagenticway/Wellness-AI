'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
  wellnessScore: number;
  status: 'active' | 'inactive' | 'new';
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'new'>('all');

  // Mock data for development - replace with actual API call
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // TODO: Replace with actual API call to /api/clients
        setTimeout(() => {
          setClients([
            {
              id: '1',
              name: 'Sophia Bennett',
              email: 'sophia.bennett@email.com',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRFr6mhHhgbnsRL45ca2d7Kyw6AmcCbX-JBgsl8WNI39_qng7eANEtuHJfvb9LBmZKltYGF1UdShGATPK5xmGPRXC-ccDUfuUb-oZ5j966fye26lNuuO-rT8o_-ZTiuVfogKnffBLDEM_hPnToOpaXgTrvPLEgDIvYOx9RMRHLRb7aaL_TJDGvy4jhwfGETegcpTUDt2G1CUk9oPpKak4xpRWS48Y5kjzc9Q2muqHC68Y-aLQqzw2-qIkwVEYlvtJu3UM78ZbfHA',
              joinedDate: '2023',
              lastActive: '2 days ago',
              wellnessScore: 75,
              status: 'active'
            },
            {
              id: '2',
              name: 'Marcus Chen',
              email: 'marcus.chen@email.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              joinedDate: '2024',
              lastActive: '1 hour ago',
              wellnessScore: 85,
              status: 'active'
            },
            {
              id: '3',
              name: 'Isabella Rodriguez',
              email: 'isabella.rodriguez@email.com',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e50c?w=150&h=150&fit=crop&crop=face',
              joinedDate: '2024',
              lastActive: '5 minutes ago',
              wellnessScore: 92,
              status: 'new'
            },
            {
              id: '4',
              name: 'David Thompson',
              email: 'david.thompson@email.com',
              joinedDate: '2023',
              lastActive: '2 weeks ago',
              wellnessScore: 45,
              status: 'inactive'
            },
            {
              id: '5',
              name: 'Emma Wilson',
              email: 'emma.wilson@email.com',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
              joinedDate: '2024',
              lastActive: '3 days ago',
              wellnessScore: 68,
              status: 'active'
            }
          ]);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to load clients:', err);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#07882c] text-white';
      case 'inactive': return 'bg-[#e72e08] text-white';
      case 'new': return 'bg-[#1fdf92] text-[#111715]';
      default: return 'bg-[#648779] text-white';
    }
  };

  const getWellnessScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#07882c]';
    if (score >= 60) return 'text-[#111715]';
    return 'text-[#e72e08]';
  };

  if (loading) {
    return (
      <>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading clients...</p>
          </div>
        </div>
      </>
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
              onClick={() => router.push('/dashboard')}
              className="text-[#111715] flex size-12 shrink-0 items-center hover:bg-gray-100 rounded-lg"
              data-icon="ArrowLeft" 
              data-size="24px" 
              data-weight="regular"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h2 className="text-[#111715] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Clients</h2>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div
                  className="text-[#648779] flex border-none bg-[#f0f4f3] items-center justify-center pl-4 rounded-l-lg border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Search clients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111715] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] focus:border-none h-full placeholder:text-[#648779] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>

          {/* Client List */}
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-[#648779] text-lg">No clients found</p>
              <p className="text-[#648779] text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div>
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                    style={{backgroundImage: client.avatar ? `url("${client.avatar}")` : 'none'}}
                  >
                    {!client.avatar && (
                      <div className="w-14 h-14 rounded-full bg-[#dce5e1] flex items-center justify-center">
                        <span className="text-[#648779] text-lg font-semibold">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111715] text-base font-medium leading-normal line-clamp-1">{client.name}</p>
                    <p className="text-[#648779] text-sm font-normal leading-normal line-clamp-2">Progress: {client.wellnessScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div>
          <div className="flex gap-2 border-t border-[#f0f4f3] bg-white px-4 pb-3 pt-2">
            <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779] hover:text-[#111715] transition-colors" href="/dashboard">
              <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="House" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                </svg>
              </div>
              <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Dashboard</p>
            </a>
            <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779]" href="#">
              <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="ListBullets" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
                </svg>
              </div>
              <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Modules</p>
            </a>
            <a className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#111715]" href="/clients">
              <div className="text-[#111715] flex h-8 items-center justify-center" data-icon="Users" data-size="24px" data-weight="fill">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Zm87.91-.15a95.87,95.87,0,0,0-47.13-37.56A60,60,0,0,0,144.7,54.59a4,4,0,0,0-1.33,6A75.83,75.83,0,0,1,147,150.53a4,4,0,0,0,1.07,5.53,112.32,112.32,0,0,1,29.85,30.83,23.92,23.92,0,0,1,3.65,16.47,4,4,0,0,0,3.95,4.64h60.3a8,8,0,0,0,7.73-5.93A8.22,8.22,0,0,0,252.38,195.48Z"></path>
                </svg>
              </div>
              <p className="text-[#111715] text-xs font-medium leading-normal tracking-[0.015em]">Clients</p>
            </a>
            <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#648779]" href="#">
              <div className="text-[#648779] flex h-8 items-center justify-center" data-icon="Gear" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88a8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                </svg>
              </div>
              <p className="text-[#648779] text-xs font-medium leading-normal tracking-[0.015em]">Settings</p>
            </a>
          </div>
          <div className="h-5 bg-white"></div>
        </div>
      </div>
    </>
  );
}