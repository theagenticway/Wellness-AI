import { User } from '../types/user';
import { Card } from './ui/card';
import { Pill, Plus } from 'lucide-react';

interface SupplementationModuleProps {
  user: User;
}

export function SupplementationModule({ user }: SupplementationModuleProps) {
  return (
    <div className="p-4 relative min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplements</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Daily Supplements</h2>
          <div className="space-y-2">
            <SupplementItem name="Vitamin D" dosage="1 capsule" />
            <SupplementItem name="Omega-3" dosage="2 capsules" />
            <SupplementItem name="Multivitamin" dosage="1 tablet" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Tracked Supplements</h2>
          <div className="space-y-2">
            <SupplementItem name="Probiotic" dosage="1 capsule" />
            <SupplementItem name="Magnesium" dosage="1 tablet" />
          </div>
        </div>
      </div>

      <button className="absolute bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

function SupplementItem({ name, dosage }: { name: string, dosage: string }) {
  return (
    <Card className="p-4 flex items-center">
      <div className="bg-slate-100 p-3 rounded-full mr-4">
        <Pill className="h-6 w-6 text-slate-600" />
      </div>
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-slate-500">{dosage}</p>
      </div>
    </Card>
  );
}
