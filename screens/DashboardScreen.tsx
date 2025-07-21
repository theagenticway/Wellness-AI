import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { Settings } from 'lucide-react';
import { WellnessTip } from '../components/WellnessTip';
import { DailyPlanModule } from '../components/DailyPlanModule';
import { NutritionPlanModule } from '../components/NutritionPlanModule';
import { ExerciseModule } from '../components/ExerciseModule';
import { CBTModule } from '../components/CBTModule';
import { MindfulnessModule } from '../components/MindfulnessModule';
import { wellnessAPI, apiCall, API_CONFIG } from '../src/config/api';

interface DashboardScreenProps {
  user: User;
}

interface WellnessTipData {
  title: string;
  description: string;
  category: string;
}

interface PlanData {
  title: string;
  description: string;
  duration?: string; // For Exercise and Mindfulness
}

export function DashboardScreen({ user }: DashboardScreenProps) {
  const [wellnessTips, setWellnessTips] = useState<WellnessTipData[]>([]);
  const [dailyPlan, setDailyPlan] = useState<PlanData | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<PlanData | null>(null);
  const [exercisePlan, setExercisePlan] = useState<PlanData | null>(null);
  const [cbtPlan, setCbtPlan] = useState<PlanData | null>(null);
  const [mindfulnessPlan, setMindfulnessPlan] = useState<PlanData | null>(null);

  useEffect(() => {
    const fetchWellnessData = async () => {
      try {
        // Fetch wellness tips
        const tips = await apiCall(API_CONFIG.ENDPOINTS.WELLNESS.TIPS);
        setWellnessTips(tips);

        // Fetch daily plan
        const daily = await wellnessAPI.getDailyPlan(user, {});
        setDailyPlan(daily);

        // Fetch nutrition plan
        const nutrition = await wellnessAPI.getNutritionPlan(user);
        setNutritionPlan(nutrition);

        // Fetch exercise plan
        const exercise = await wellnessAPI.getExercisePlan(user);
        setExercisePlan(exercise);

        // Fetch CBT plan
        const cbt = await wellnessAPI.getCBPlan(user);
        setCbtPlan(cbt);

        // Fetch mindfulness plan
        const mindfulness = await wellnessAPI.getMindfulnessPlan(user);
        setMindfulnessPlan(mindfulness);

      } catch (error) {
        console.error('Error fetching wellness data:', error);
      }
    };

    fetchWellnessData();
  }, [user]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Settings className="h-6 w-6 text-slate-600" />
      </div>

      {dailyPlan && (
        <>
          <h2 className="text-lg font-semibold mb-2">Your Daily Plan</h2>
          <DailyPlanModule plan={dailyPlan} />
        </>
      )}

      {nutritionPlan && (
        <>
          <h2 className="text-lg font-semibold my-4">Your Nutrition Plan</h2>
          <NutritionPlanModule plan={nutritionPlan} />
        </>
      )}

      {exercisePlan && (
        <>
          <h2 className="text-lg font-semibold my-4">Your Exercise Plan</h2>
          <ExerciseModule plan={exercisePlan} />
        </>
      )}

      {cbtPlan && (
        <>
          <h2 className="text-lg font-semibold my-4">Your CBT Plan</h2>
          <CBTModule plan={cbtPlan} />
        </>
      )}

      {mindfulnessPlan && (
        <>
          <h2 className="text-lg font-semibold my-4">Your Mindfulness Plan</h2>
          <MindfulnessModule plan={mindfulnessPlan} />
        </>
      )}

      <h2 className="text-lg font-semibold my-4">Today's Wellness Tips</h2>
      <div className="space-y-4">
        {wellnessTips.map((tip, index) => (
          <WellnessTip key={index} tip={tip} />
        ))}
      </div>
    </div>
  );
}
