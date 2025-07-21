import { User } from '../types/user';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search } from 'lucide-react';

const clients = [
  { id: '1', name: 'Ethan Carter', progress: 75, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Olivia Bennett', progress: 60, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Noah Thompson', progress: 80, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Ava Martinez', progress: 90, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Liam Harper', progress: 50, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

export function ClientsScreen() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search clients"
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        {clients.map((client) => (
          <Card key={client.id} className="p-4 flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <p className="text-sm text-slate-500">Progress: {client.progress}%</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
