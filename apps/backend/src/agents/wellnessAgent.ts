// apps/backend/src/agents/wellnessAgent.ts
import { enhancedLLMGateway } from '../services/enhancedLLMGateway';
import { behavioralAI } from '../services/behavioralAI';
import { nutritionAgent } from './nutritionAgent';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age: number;
  gender: string;
  healthGoals: string[];
  currentPhase: 'phase1' | 'phase2' | 'phase3';
  startDate?: Date;
  healthConditions?: string[];
  medications?: string[];
  preferences: {
    dietary: string[];
    exercise: string[];
    communication: string;
  };
}

export interface HealthMetrics {
  weight?: number;
  bmi?: number;
  sleepHours?: number;
  stressLevel?: number;
  energyLevel?: number;
  digestiveHealth?: number;
  adherenceRate?: number;
  lastAssessment?: Date;
}

export interface WellnessPlan {
  greeting: string;
  phaseGuidance: string;
  dailyPlan: Array<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    status: string;
    category?: 'nutrition' | 'exercise' | 'mindfulness' | 'hydration' | 'supplements';
    behavioralStrategy?: string;
    estimatedTime?: string;
  }>;
  recommendations: string[];
  insights: Array<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'tip';
  }>;
  nextSteps: string[];
  progressAssessment?: {
    currentScore: number;
    summary: string;
    improvements: string[];
  };
  safetyAlerts?: string[];
  behavioralNudges?: Array<{
    type: 'habit_stack' | 'implementation_intention' | 'social_proof' | 'loss_aversion';
    message: string;
    trigger?: string;
  }>;
}

export class WellnessAgent {
  
  async generatePersonalizedPlan(
    userProfile: UserProfile,
    healthMetrics: HealthMetrics,
    professionalOverride?: string
  ): Promise<WellnessPlan> {
    try {
      // Validate input
      this.validateUserProfile(userProfile);
      
      // Check for safety concerns first
      const safetyAlerts = this.checkSafetyAlerts(userProfile, healthMetrics);
      
      // Generate behavioral context for enhanced personalization
      const behavioralContext = await this.createBehavioralContext(userProfile, healthMetrics);
      
      // Generate core wellness plan using enhanced LLM
      const aiPlan = await enhancedLLMGateway.generateWellnessPlan(
        userProfile,
        healthMetrics,
        professionalOverride
      );
      
      // Enhance with behavioral AI insights
      const behavioralEnhancements = await behavioralAI.generateBehavioralNutrition(behavioralContext);
      
      // Integrate GMRP-specific protocols
      const enhancedPlan = this.enhanceWithGMRPProtocols(aiPlan, userProfile);
      
      // Add behavioral nudges and strategies
      const finalPlan = this.addBehavioralStrategies(enhancedPlan, behavioralEnhancements, userProfile);
      
      // Add safety alerts if any
      if (safetyAlerts.length > 0) {
        finalPlan.safetyAlerts = safetyAlerts;
      }
      
      return finalPlan;
      
    } catch (error: any) {
      console.error('Wellness Agent Error:', error);
      return this.getFallbackPlan(userProfile, healthMetrics);
    }
  }

  async generateComprehensiveNutritionPlan(
    userProfile: UserProfile,
    healthMetrics: HealthMetrics,
    dietaryRestrictions?: string[]
  ): Promise<any> {
    try {
      // Use the existing nutrition agent with enhanced prompting
      const nutritionPlan = await nutritionAgent.generateMealPlan(
        userProfile,
        dietaryRestrictions || [],
        undefined // professionalOverride
      );

      // Enhance with behavioral AI insights
      const behavioralContext = await this.createBehavioralContext(userProfile, healthMetrics);
      const behavioralNutrition = await behavioralAI.generateBehavioralNutrition(behavioralContext);

      // Combine both approaches
      return {
        ...nutritionPlan,
        behavioralStrategies: behavioralNutrition,
        phaseSpecificGuidance: this.getPhaseNutritionGuidance(userProfile.currentPhase),
        gmrpCompliance: this.validateGMRPCompliance(nutritionPlan, userProfile.currentPhase)
      };

    } catch (error: any) {
      console.error('Comprehensive nutrition plan error:', error);
      return this.getFallbackNutritionPlan(userProfile);
    }
  }

  async generateCBTSession(
    userProfile: UserProfile,
    currentChallenges: string[],
    moodLevel: number,
    recentStressors?: string[]
  ): Promise<any> {
    try {
      const prompt = this.buildCBTPrompt(userProfile, currentChallenges, moodLevel, recentStressors);
      const response = await enhancedLLMGateway.generateResponse('cbt', prompt);
      
      return this.parseCBTResponse(response, userProfile);
    } catch (error) {
      console.error('CBT session generation failed:', error);
      return this.getFallbackCBTSession(userProfile);
    }
  }

  // Private helper methods
  private validateUserProfile(profile: UserProfile): void {
    if (!profile.id || !profile.age || !profile.currentPhase) {
      throw new Error('Invalid user profile: missing required fields');
    }
    
    if (profile.age < 18 || profile.age > 120) {
      throw new Error('Invalid age range');
    }
    
    if (!['phase1', 'phase2', 'phase3'].includes(profile.currentPhase)) {
      throw new Error('Invalid GMRP phase');
    }
  }

  private checkSafetyAlerts(profile: UserProfile, metrics: HealthMetrics): string[] {
    const alerts: string[] = [];
    
    // Age-based alerts
    if (profile.age < 18) {
      alerts.push('Consult pediatrician before starting any wellness program');
    }
    
    if (profile.age > 65) {
      alerts.push('Consult physician before making significant dietary or exercise changes');
    }
    
    // Health condition alerts
    if (profile.healthConditions?.includes('diabetes')) {
      alerts.push('Monitor blood sugar closely and consult endocrinologist');
    }
    
    if (profile.healthConditions?.includes('heart_disease')) {
      alerts.push('Consult cardiologist before starting exercise program');
    }
    
    if (profile.healthConditions?.includes('eating_disorder')) {
      alerts.push('Work with mental health professional familiar with eating disorders');
    }
    
    if (profile.medications?.length) {
      alerts.push('Consult pharmacist about supplement interactions with current medications');
    }
    
    // Metrics-based alerts
    if (metrics.stressLevel && metrics.stressLevel >= 8) {
      alerts.push('High stress levels detected - consider speaking with a mental health professional');
    }
    
    if (metrics.sleepHours && metrics.sleepHours < 5) {
      alerts.push('Severe sleep deprivation detected - prioritize sleep hygiene and consult physician');
    }

    // GMRP Phase-specific alerts
    if (profile.currentPhase === 'phase2' && metrics.energyLevel && metrics.energyLevel < 4) {
      alerts.push('Low energy detected - may need to delay intermittent fasting introduction');
    }
    
    return alerts;
  }

  private async createBehavioralContext(profile: UserProfile, metrics: HealthMetrics): Promise<any> {
    // Create behavioral context for the behavioral AI system
    return {
      userId: profile.id,
      user: {
        currentPhase: profile.currentPhase,
        age: profile.age,
        healthGoals: profile.healthGoals,
        preferences: profile.preferences
      },
      timeOfDay: this.getCurrentTimeOfDay(),
      dayOfWeek: this.getCurrentDayOfWeek(),
      recentPerformance: {
        energyLevel: metrics.energyLevel || 5,
        adherenceRate: metrics.adherenceRate || 0.7,
        stressLevel: metrics.stressLevel || 5
      },
      currentStreaks: [], // Would be populated from database
      recentHabits: [], // Would be populated from database
      behaviorProfile: this.createDefaultBehaviorProfile(profile),
      environmentalContext: {
        availableEquipment: 'basic'
      }
    };
  }

  private createDefaultBehaviorProfile(profile: UserProfile): any {
    return {
      motivationType: 'BALANCED',
      lossAversion: 2.5,
      presentBias: 0.7,
      socialInfluence: 0.5,
      gamificationResponse: 0.6,
      bestPerformanceTime: ['MORNING'],
      willpowerPattern: {
        morning: 8,
        afternoon: 6,
        evening: 4
      }
    };
  }

  private enhanceWithGMRPProtocols(aiPlan: any, profile: UserProfile): WellnessPlan {
    // Ensure GMRP Phase compliance
    if (profile.currentPhase === 'phase1') {
      // Add Phase 1 specific tasks if missing
      const phase1Tasks = [
        {
          title: "Morning Hydration Protocol",
          priority: "high" as const,
          completed: false,
          status: "Drink 16-20oz water with electrolytes within 30 minutes of waking",
          category: "hydration" as const,
          estimatedTime: "2 minutes"
        },
        {
          title: "Fiber Target Achievement",
          priority: "high" as const,
          completed: false,
          status: "Consume 30-50g fiber from diverse whole food sources throughout the day",
          category: "nutrition" as const,
          estimatedTime: "Plan with meals"
        },
        {
          title: "Microbiome Support",
          priority: "medium" as const,
          completed: false,
          status: "Include fermented foods or take probiotic supplement as directed",
          category: "supplements" as const,
          estimatedTime: "5 minutes"
        },
        {
          title: "Stress Assessment",
          priority: "medium" as const,
          completed: false,
          status: "Complete 5-minute mindfulness check-in and stress level assessment",
          category: "mindfulness" as const,
          estimatedTime: "5 minutes"
        }
      ];

      // Merge with existing tasks, avoiding duplicates
      const existingTitles = aiPlan.dailyPlan?.map((task: any) => task.title.toLowerCase()) || [];
      const newTasks = phase1Tasks.filter(task => 
        !existingTitles.some(title => title.includes(task.title.toLowerCase().split(' ')[0]))
      );

      aiPlan.dailyPlan = [...(aiPlan.dailyPlan || []), ...newTasks];
    }

    // Add GMRP-specific insights
    const gmrpInsights = this.getGMRPInsights(profile);
    aiPlan.insights = [...(aiPlan.insights || []), ...gmrpInsights];

    // Add phase-specific guidance
    aiPlan.phaseGuidance = this.getPhaseGuidance(profile.currentPhase);

    return aiPlan;
  }

  private addBehavioralStrategies(plan: WellnessPlan, behavioralData: any, profile: UserProfile): WellnessPlan {
    // Add behavioral nudges to daily tasks
    if (plan.dailyPlan && behavioralData?.habitStacks) {
      plan.dailyPlan = plan.dailyPlan.map(task => ({
        ...task,
        behavioralStrategy: this.findRelevantBehavioralStrategy(task, behavioralData)
      }));
    }

    // Add behavioral nudges
    plan.behavioralNudges = this.createBehavioralNudges(behavioralData, profile);

    return plan;
  }

  private findRelevantBehavioralStrategy(task: any, behavioralData: any): string {
    // Match task with behavioral strategies
    if (task.category === 'nutrition' && behavioralData?.habitStacks) {
      const relevantStack = behavioralData.habitStacks.find((stack: any) => 
        stack.newHabit.toLowerCase().includes('nutrition') || 
        stack.newHabit.toLowerCase().includes('meal')
      );
      return relevantStack ? `Habit Stack: ${relevantStack.implementation}` : '';
    }
    
    return '';
  }

  private createBehavioralNudges(behavioralData: any, profile: UserProfile): Array<{type: string, message: string, trigger?: string}> {
    const nudges = [];

    if (behavioralData?.implementationIntentions) {
      nudges.push({
        type: 'implementation_intention',
        message: `If you feel hungry between meals, then you will drink 16oz of water and wait 10 minutes before eating`,
        trigger: 'hunger_craving'
      });
    }

    if (behavioralData?.socialProof) {
      nudges.push({
        type: 'social_proof',
        message: `85% of GMRP Phase 1 participants who track their fiber intake see improvements in energy within 2 weeks`,
      });
    }

    return nudges;
  }

  private getGMRPInsights(profile: UserProfile): Array<{title: string, message: string, type: string}> {
    const insights = [];

    switch (profile.currentPhase) {
      case 'phase1':
        insights.push({
          title: "Microbiome Reset Priority",
          message: "Phase 1 focuses on gut healing through whole foods and fiber. No intermittent fasting yet - your microbiome needs nutrients to repair and rebalance.",
          type: "info"
        });
        
        if (profile.healthGoals.includes('weight_loss')) {
          insights.push({
            title: "Sustainable Weight Loss",
            message: "Focus on gut health first. Sustainable weight loss will naturally follow as your microbiome balances and inflammation reduces.",
            type: "tip"
          });
        }
        break;
        
      case 'phase2':
        insights.push({
          title: "IF Introduction Ready",
          message: "Your microbiome is ready for gentle intermittent fasting. Start with 12:12 once weekly and monitor your energy and mood carefully.",
          type: "success"
        });
        break;
        
      case 'phase3':
        insights.push({
          title: "Optimization Phase",
          message: "Focus on fine-tuning your protocols based on how your body responds. This is about long-term sustainability and advanced optimization.",
          type: "info"
        });
        break;
    }

    return insights;
  }

  private getPhaseGuidance(phase: string): string {
    switch (phase) {
      case 'phase1':
        return 'GMRP Phase 1: Microbiome Reset - Focus on gut healing with whole foods, 30-50g daily fiber, and complete nutrient repletion. No intermittent fasting during this foundational phase.';
      case 'phase2':
        return 'GMRP Phase 2: Gentle IF Introduction - Maintain gut health protocols while carefully introducing 12:12 intermittent fasting once weekly. Monitor energy and mood closely.';
      case 'phase3':
        return 'GMRP Phase 3: Advanced Optimization - Personalize protocols based on your body\'s response, biomarker feedback, and long-term sustainability goals.';
      default:
        return 'Follow your personalized GMRP protocol as directed by your wellness plan.';
    }
  }

  private getPhaseNutritionGuidance(phase: string): any {
    const guidance = {
      phase1: {
        focus: 'Microbiome restoration and nutrient repletion',
        fiberTarget: '30-50g daily from diverse sources',
        hydration: '2-3L water with electrolytes',
        fasting: 'NO intermittent fasting - focus on healing',
        supplements: 'Probiotics, prebiotics, B-complex, Vitamin D3+K2, magnesium'
      },
      phase2: {
        focus: 'Gentle IF introduction while maintaining gut health',
        fiberTarget: '40-50g daily',
        hydration: '2-3L water, extra during fasting windows',
        fasting: '12:12 IF once weekly, monitor response carefully',
        supplements: 'Continue Phase 1 supplements, add electrolytes for fasting'
      },
      phase3: {
        focus: 'Personalized optimization based on response',
        fiberTarget: 'Individualized based on tolerance and results',
        hydration: 'Maintain 2-3L daily, adjust for activity',
        fasting: 'Flexible IF schedule based on lifestyle and response',
        supplements: 'Customized based on testing and individual needs'
      }
    };

    return guidance[phase as keyof typeof guidance] || guidance.phase1;
  }

  private validateGMRPCompliance(nutritionPlan: any, phase: string): any {
    const compliance = {
      phaseAppropriate: true,
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    if (phase === 'phase1') {
      // Check for IF in Phase 1 (should not be present)
      if (nutritionPlan.fastingSchedule) {
        compliance.phaseAppropriate = false;
        compliance.warnings.push('Intermittent fasting detected in Phase 1 - should focus on nutrient repletion only');
      }

      // Verify fiber targets
      if (nutritionPlan.fiberBreakdown?.target < 30) {
        compliance.warnings.push('Fiber target below Phase 1 minimum of 30g daily');
      }
    }

    return compliance;
  }

  private buildCBTPrompt(profile: UserProfile, challenges: string[], mood: number, stressors?: string[]): string {
    return `Design a personalized CBT session for a GMRP ${profile.currentPhase} participant.

PARTICIPANT PROFILE:
- Phase: ${profile.currentPhase}
- Age: ${profile.age}
- Communication Style: ${profile.preferences.communication}
- Health Goals: ${profile.healthGoals.join(', ')}

CURRENT SESSION CONTEXT:
- Mood Level: ${mood}/10
- Challenges: ${challenges.join(', ')}
- Recent Stressors: ${stressors?.join(', ') || 'None reported'}

SESSION OBJECTIVES:
1. Address current challenges with cognitive reframing techniques
2. Provide coping strategies specific to wellness journey obstacles  
3. Reinforce GMRP commitment and build motivation for ${profile.currentPhase}
4. Include practical exercises for immediate stress relief
5. Set behavioral goals aligned with current phase requirements

PHASE-SPECIFIC FOCUS:
${this.getCBTPhaseGuidance(profile.currentPhase)}

Keep tone ${profile.preferences.communication} and provide actionable takeaways.`;
  }

  private getCBTPhaseGuidance(phase: string): string {
    switch (phase) {
      case 'phase1':
        return 'Focus on building sustainable habits, managing potential detox symptoms, and developing a positive relationship with whole foods nutrition.';
      case 'phase2':
        return 'Address any anxiety about intermittent fasting, reinforce body awareness, and manage expectations during the transition.';
      case 'phase3':
        return 'Support long-term adherence, address perfectionism, and develop flexible coping strategies for life challenges.';
      default:
        return 'Provide general wellness and habit formation support.';
    }
  }

  private parseCBTResponse(response: string, profile: UserProfile): any {
    try {
      return JSON.parse(response);
    } catch {
      return this.getFallbackCBTSession(profile);
    }
  }

  // Utility methods
  private getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'MORNING';
    if (hour < 17) return 'AFTERNOON';
    return 'EVENING';
  }

  private getCurrentDayOfWeek(): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()];
  }

  // Fallback methods
  private getFallbackPlan(profile: UserProfile, metrics: HealthMetrics): WellnessPlan {
    return {
      greeting: `Hello ${profile.firstName || 'there'}! Ready to continue your GMRP ${profile.currentPhase} journey today?`,
      phaseGuidance: this.getPhaseGuidance(profile.currentPhase),
      dailyPlan: [
        {
          title: "Morning Hydration",
          priority: "high",
          completed: false,
          status: "Start with 16-20oz water + electrolytes",
          category: "hydration",
          estimatedTime: "2 minutes"
        },
        {
          title: "Fiber-Rich Nutrition",
          priority: "high", 
          completed: false,
          status: "Focus on 30-50g fiber from whole foods",
          category: "nutrition",
          estimatedTime: "Plan with meals"
        },
        {
          title: "Gentle Movement",
          priority: "medium",
          completed: false,
          status: "20-30 minutes of preferred activity",
          category: "exercise",
          estimatedTime: "20-30 minutes"
        },
        {
          title: "Mindful Check-in",
          priority: "medium",
          completed: false,
          status: "5-minute stress and energy assessment",
          category: "mindfulness",
          estimatedTime: "5 minutes"
        }
      ],
      recommendations: [
        "Prioritize whole, unprocessed foods today",
        "Track your fiber intake to reach daily targets",
        "Stay hydrated with electrolyte-rich water",
        "Listen to your body's hunger and energy signals"
      ],
      insights: this.getGMRPInsights(profile),
      nextSteps: [
        "Continue consistent daily habits",
        "Monitor energy and digestive improvements",
        "Track adherence to GMRP protocols"
      ],
      progressAssessment: {
        currentScore: 75,
        summary: "Making steady progress with foundational habits",
        improvements: ["Consistency with hydration", "Whole foods focus", "Stress management"]
      }
    };
  }

  private getFallbackNutritionPlan(profile: UserProfile): any {
    return {
      mealPlan: {
        breakfast: "High-fiber smoothie with chia seeds and berries",
        lunch: "Large colorful salad with diverse vegetables",
        dinner: "Grilled protein with roasted vegetables and quinoa",
        snacks: ["Apple with almond butter", "Raw vegetables with hummus"]
      },
      shoppingList: ["Organic vegetables", "Wild-caught fish", "Nuts and seeds", "Fermented foods"],
      supplementProtocol: {
        morning: ["Probiotic", "Vitamin D3+K2"],
        evening: ["Magnesium"],
        notes: "Take with meals for best absorption"
      },
      phaseSpecificGuidance: this.getPhaseNutritionGuidance(profile.currentPhase)
    };
  }

  private getFallbackCBTSession(profile: UserProfile): any {
    return {
      sessionTitle: `GMRP ${profile.currentPhase} Wellness Support`,
      duration: "15-20 minutes",
      techniques: [
        {
          name: "Cognitive Reframing",
          description: "Challenge negative thoughts about your wellness journey",
          exercise: "Write down one limiting belief about your health, then list 3 evidence-based positive reframes"
        },
        {
          name: "Implementation Intentions",
          description: "Create specific if-then plans for challenges",
          exercise: "Complete: 'If I feel overwhelmed by my wellness plan, then I will focus on just one small habit for today'"
        }
      ],
      homework: [
        "Practice the 2-minute rule: make any new habit so small it takes less than 2 minutes",
        "Use the implementation intention format for one challenging situation this week"
      ]
    };
  }
}

export const wellnessAgent = new WellnessAgent();