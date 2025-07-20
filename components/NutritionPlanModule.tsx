import { Card } from './ui/card';

interface NutritionPlanModuleProps {
  plan: {
    title: string;
    description: string;
  };
}

export function NutritionPlanModule({ plan }: NutritionPlanModuleProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{plan.title}</h3>
      <p className="text-sm text-slate-500">{plan.description}</p>
    </Card>
  );
}
