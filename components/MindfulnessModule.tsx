import { Card } from './ui/card';

interface MindfulnessModuleProps {
  plan: {
    title: string;
    description: string;
    duration: string;
  };
}

export function MindfulnessModule({ plan }: MindfulnessModuleProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{plan.title}</h3>
      <p className="text-sm text-slate-500">{plan.description}</p>
      <p className="text-sm text-slate-500 mt-1">{plan.duration}</p>
    </Card>
  );
}
