import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types/user';
import { Users, MessageSquare, Trophy, Heart, Plus, TrendingUp } from 'lucide-react';

interface CommunityModuleProps {
  user: User;
}

export function CommunityModule({ user }: CommunityModuleProps) {
  const challenges = [
    { name: '30-Day Fiber Challenge', participants: 156, status: 'active', progress: 67 },
    { name: 'Mindful Eating Week', participants: 89, status: 'starting_soon', progress: 0 },
    { name: 'Hydration Heroes', participants: 203, status: 'completed', progress: 100 }
  ];

  const forumPosts = [
    { author: 'Sarah M.', title: 'Tips for Phase 1 meal prep?', replies: 12, time: '2h ago' },
    { author: 'Mike C.', title: 'Feeling amazing after week 3!', replies: 8, time: '4h ago' },
    { author: 'Emma D.', title: 'Best supplements for gut health?', replies: 15, time: '6h ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community</h1>
          <p className="text-slate-600">Connect with fellow wellness warriors</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Active Challenges */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Active Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challenges.map((challenge, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{challenge.name}</h4>
                  <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                    {challenge.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Recent Discussions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forumPosts.map((post, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{post.title}</h4>
                  <span className="text-xs text-slate-500">{post.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>by {post.author}</span>
                  <span>•</span>
                  <span>{post.replies} replies</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}