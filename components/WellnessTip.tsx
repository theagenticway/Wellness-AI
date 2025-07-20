import { Card } from './ui/card';

interface WellnessTipProps {
  tip: {
    title: string;
    description: string;
    category: string;
  };
}

export function WellnessTip({ tip }: WellnessTipProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{tip.title}</h3>
      <p className="text-sm text-slate-500">{tip.description}</p>
      <p className="text-xs text-slate-400 mt-2">{tip.category}</p>
    </Card>
  );
}
