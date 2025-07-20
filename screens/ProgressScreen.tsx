import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { Settings } from 'lucide-react';
import { ProgressTracker } from '../components/ProgressTracker';
import { wellnessAPI, apiCall, API_CONFIG } from '../src/config/api';

interface ProgressScreenProps {
  user: User;
}

interface ProgressData {
  title: string;
  value: number;
  max: number;
}

export function ProgressScreen({ user }: ProgressScreenProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Assuming assessProgress takes user and some activity/metrics data
        // For now, we'll pass an empty object for activity/metrics
        const progress = await wellnessAPI.assessProgress(user, [], {});
        setProgressData(progress);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, [user]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <Settings className="h-6 w-6 text-slate-600" />
      </div>

      {progressData.length > 0 ? (
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <ProgressTracker
              key={index}
              progress={{
                title: item.title,
                value: item.value,
                max: item.max,
              }}
            />
          ))}
        </div>
      ) : (
        <p>Loading progress...</p>
      )}
    </div>
  );
}
