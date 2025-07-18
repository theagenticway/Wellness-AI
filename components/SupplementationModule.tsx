import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User } from '../types/user';
import { Pill, Clock, CheckCircle, ShoppingCart, AlertTriangle } from 'lucide-react';

interface SupplementationModuleProps {
  user: User;
}

export function SupplementationModule({ user }: SupplementationModuleProps) {
  const supplements = [
    { name: 'Omega-3', dosage: '1000mg', timing: 'Morning', status: 'taken', priority: 'essential' },
    { name: 'Vitamin D3', dosage: '2000 IU', timing: 'Morning', status: 'taken', priority: 'essential' },
    { name: 'Probiotics', dosage: '50B CFU', timing: 'Evening', status: 'pending', priority: 'essential' },
    { name: 'Magnesium', dosage: '400mg', timing: 'Bedtime', status: 'pending', priority: 'recommended' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplementation Module</h1>
          <p className="text-slate-600">AI-driven supplement recommendations based on GMRP protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supplements.map((supplement, index) => (
          <Card key={index} className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{supplement.name}</h3>
                <Badge variant={supplement.priority === 'essential' ? 'default' : 'secondary'}>
                  {supplement.priority}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">{supplement.dosage} • {supplement.timing}</p>
              <div className="flex items-center justify-between">
                <Badge variant={supplement.status === 'taken' ? 'default' : 'outline'}>
                  {supplement.status === 'taken' ? 'Taken' : 'Pending'}
                </Badge>
                {supplement.status === 'pending' && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Taken
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}