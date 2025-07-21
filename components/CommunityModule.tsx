import { useState } from 'react';
import { User } from '../types/user';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MessageCircle, Plus } from 'lucide-react';

interface CommunityModuleProps {
  user: User;
}

const communityPosts = [
  {
    id: '1',
    author: 'Sophia Bennett',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    time: '2h ago',
    content: "I've been focusing on mindfulness and meditation this week. It's been helping me manage stress and stay present. Anyone else have tips for staying present?",
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    author: 'Ethan Carter',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    time: '4h ago',
    content: "Just completed a 5k run! Feeling energized and ready to tackle the day. What's your favorite way to get your heart rate up?",
    likes: 25,
    comments: 8,
  },
];

export function CommunityModule({ user }: CommunityModuleProps) {
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Community</h1>
        <Plus className="h-6 w-6 text-slate-600" />
      </div>

      <div className="flex border-b mb-4">
        <TabButton
          label="Feed"
          isActive={activeTab === 'Feed'}
          onClick={() => setActiveTab('Feed')}
        />
        <TabButton
          label="Groups"
          isActive={activeTab === 'Groups'}
          onClick={() => setActiveTab('Groups')}
        />
        <TabButton
          label="Messages"
          isActive={activeTab === 'Messages'}
          onClick={() => setActiveTab('Messages')}
        />
      </div>

      <div>
        {activeTab === 'Feed' && <Feed />}
        {/* Add other tab content here */}
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium ${
        isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function Feed() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="https://randomuser.me/api/portraits/women/4.jpg" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">Post an update</p>
            <p className="text-sm text-slate-500">Share your wellness journey</p>
          </div>
        </div>
      </Card>
      <h2 className="text-lg font-semibold">Today</h2>
      {communityPosts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex items-start">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.avatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{post.author}</p>
                <p className="text-xs text-slate-500">{post.time}</p>
              </div>
              <p className="text-sm mt-1">{post.content}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-slate-500">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
