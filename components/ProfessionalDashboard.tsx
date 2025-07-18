import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types/user';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface ProfessionalDashboardProps {
  user: User;
}

export function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Mock client data
  const clients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phase: 'phase2',
      progress: 85,
      alerts: ['Missed supplement'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.c@email.com',
      phase: 'phase1',
      progress: 72,
      alerts: [],
      status: 'active'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      phase: 'phase3',
      progress: 94,
      alerts: ['High stress levels'],
      status: 'needs_attention'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const overviewStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    needsAttention: clients.filter(c => c.alerts.length > 0).length,
    avgProgress: Math.round(clients.reduce((acc, c) => acc + c.progress, 0) / clients.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Professional Dashboard</h1>
            <p className="text-purple-100 mb-4">Welcome back, Dr. {user.lastName}</p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {overviewStats.totalClients} Total Clients
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {overviewStats.needsAttention} Need Attention
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Clients</p>
                <p className="text-2xl font-bold text-slate-900">{overviewStats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Today</p>
                <p className="text-2xl font-bold text-green-600">{overviewStats.activeClients}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{overviewStats.needsAttention}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{overviewStats.avgProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Client Roster</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedClient === client.id 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={client.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{client.name}</h3>
                          <Badge variant="outline" className={getStatusColor(client.status)}>
                            {client.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">{client.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge variant="secondary" className="bg-blue-500 text-white mb-1">
                        {client.phase.toUpperCase().replace('PHASE', 'Phase ')}
                      </Badge>
                      <p className="text-sm font-medium">{client.progress}%</p>
                      
                      {client.alerts.length > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600">{client.alerts.length} alert(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {client.alerts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex flex-wrap gap-2">
                        {client.alerts.map((alert, index) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Actions */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Group Session
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Broadcast Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            
            {selectedClient && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Selected Client Actions</h4>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Client
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}