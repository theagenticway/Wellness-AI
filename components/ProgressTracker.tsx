import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface ProgressTrackerProps {
  progress: {
    title: string;
    value: number;
    max: number;
  };
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{progress.title}</h3>
      <Progress value={progress.value} max={progress.max} className="my-2" />
      <p className="text-sm text-slate-500">{progress.value} / {progress.max}</p>
    </Card>
  );
}
