export interface WellnessGraphState {
  userId: string;
  userProfile: Record<string, any>;
  apiData: {
    fitbit?: Record<string, any>;
    viome?: Record<string, any>;
  };
  professionalOverride?: string;
  // The final, combined plan for the user
  dailyPlan?: Record<string, any>;
  // Intermediate outputs from specialist agents
  nutritionPlan?: Record<string, any>;
  cbtTask?: Record<string, any>;
  // Used to control the flow of the graph
  nextAgent?: 'nutrition' | 'cbt' | 'finalize' | 'END';
}
