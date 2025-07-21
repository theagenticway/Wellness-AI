import { User } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Calendar,
  BarChart3
} from 'lucide-react';

interface ProfessionalDashboardProps {
  user: User;
}

export function ProfessionalDashboard({ user }: ProfessionalDashboardProps) {
  const clients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phase: 'Phase 2',
      progress: 85,
      alerts: ['Missed supplement'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.c@email.com',
      phase: 'Phase 1',
      progress: 72,
      alerts: [],
      status: 'active'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      phase: 'Phase 3',
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Professional Dashboard</h1>
        <p className="text-purple-100 mb-4">Welcome back, Dr. {user.lastName}</p>
        <div className="flex items-center space-x-6">
          <div className="bg-white/20 rounded-lg p-3">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-purple-100">Total Clients</p>
            <p className="text-2xl font-bold">{overviewStats.totalClients}</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-blue-600">{overviewStats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-green-600">{overviewStats.activeClients}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{overviewStats.needsAttention}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{overviewStats.avgProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Roster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {client.phase}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                          {client.status === 'needs_attention' ? 'Needs Attention' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{client.progress}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                    {client.alerts.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        <span className="text-xs text-yellow-600">{client.alerts.length} alert(s)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Add New Client
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Today's Insights</h4>
              <p className="text-sm text-blue-700">
                2 clients completed their weekly goals. 1 client needs follow-up on supplement compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}