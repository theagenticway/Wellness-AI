// apps/backend/src/services/behavioralAI.ts
import { PrismaClient } from '@prisma/client';
import { llmGateway } from './llmGateway';

const prisma = new PrismaClient();

interface BehavioralContext {
  user: any;
  behaviorProfile: any;
  recentHabits: any[];
  currentStreaks: any[];
  timeOfDay: string;
  dayOfWeek: string;
  environmentalContext: any;
  recentPerformance: any;
}

interface PersonalizedContent {
  nutrition: any;
  exercise: any;
  meditation: any;
  nudges: any[];
  habitStacks: any[];
  implementationIntentions: any[];
}

class BehavioralAI {
  
  /**
   * Generate completely personalized daily content based on behavioral economics
   */
  async generatePersonalizedDailyContent(userId: string): Promise<PersonalizedContent> {
    const context = await this.gatherBehavioralContext(userId);
    
    // Generate each component with behavioral personalization
    const [nutrition, exercise, meditation, nudges] = await Promise.all([
      this.generateBehavioralNutrition(context),
      this.generateBehavioralExercise(context),
      this.generateBehavioralMeditation(context),
      this.generatePersonalizedNudges(context)
    ]);

    // Generate behavioral strategies
    const habitStacks = await this.generateHabitStacks(context);
    const implementationIntentions = await this.generateImplementationIntentions(context);

    return {
      nutrition,
      exercise,
      meditation,
      nudges,
      habitStacks,
      implementationIntentions
    };
  }

  /**
   * Gather comprehensive behavioral context for personalization
   */
  private async gatherBehavioralContext(userId: string): Promise<BehavioralContext> {
    const [user, behaviorProfile, recentHabits, currentStreaks, recentPerformance] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { healthProfile: true }
      }),
      prisma.behaviorProfile.findUnique({
        where: { userId }
      }),
      prisma.habitLog.findMany({
        where: { userId },
        take: 30,
        orderBy: { date: 'desc' },
        include: { habit: true }
      }),
      prisma.streak.findMany({
        where: { userId, isActive: true }
      }),
      this.analyzeRecentPerformance(userId)
    ]);

    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      user,
      behaviorProfile,
      recentHabits,
      currentStreaks,
      timeOfDay,
      dayOfWeek,
      environmentalContext: await this.getEnvironmentalContext(userId),
      recentPerformance
    };
  }

  /**
   * Generate behavioral economics-driven nutrition plan
   */
  async generateBehavioralNutrition(context: BehavioralContext): Promise<any> {
    const prompt = `
You are a behavioral economics expert creating a personalized nutrition plan.

BEHAVIORAL PROFILE:
- Motivation Type: ${context.behaviorProfile?.motivationType || 'BALANCED'}
- Loss Aversion: ${context.behaviorProfile?.lossAversion || 2.5}/5.0 (higher = more loss averse)
- Present Bias: ${context.behaviorProfile?.presentBias || 0.7}/1.0 (lower = more present-focused)
- Social Influence: ${context.behaviorProfile?.socialInfluence || 0.5}/1.0
- Gamification Response: ${context.behaviorProfile?.gamificationResponse || 0.6}/1.0

CURRENT CONTEXT:
- Time: ${context.timeOfDay}
- Day: ${context.dayOfWeek}
- Phase: ${context.user.currentPhase}
- Recent Performance: ${JSON.stringify(context.recentPerformance)}
- Active Streaks: ${context.currentStreaks.map(s => `${s.streakType}: ${s.currentCount} days`).join(', ')}

HABIT FORMATION PRINCIPLES TO APPLY:
1. 2-Minute Rule: Start with tiny versions
2. Habit Stacking: Link to existing habits
3. Implementation Intentions: Create if-then plans
4. Temptation Bundling: Pair with pleasant activities
5. Social Proof: Reference community behavior
6. Loss Aversion: Protect existing streaks
7. Fresh Start Effect: Leverage natural timing
8. Environment Design: Optimize for success

Create a personalized nutrition plan that includes:

1. EASY WINS (2-minute rule applications):
   - Tiny nutrition habits they can't fail at
   - Build on existing successful patterns

2. HABIT STACKING OPPORTUNITIES:
   - Link new nutrition habits to established routines
   - "After I [existing habit], I will [new nutrition habit]"

3. IMPLEMENTATION INTENTIONS:
   - Specific if-then plans for challenging situations
   - "If X happens, then I will Y"

4. TEMPTATION BUNDLING:
   - Pair healthy foods with enjoyable activities
   - Make nutritious choices more appealing

5. SOCIAL PROOF ELEMENTS:
   - Reference what similar users are doing
   - Community-validated choices

6. LOSS AVERSION APPLICATIONS:
   - Protect existing nutrition streaks
   - Frame choices to avoid losses

7. ENVIRONMENTAL DESIGN:
   - Optimize kitchen/shopping for success
   - Remove friction from good choices

GMRP PHASE REQUIREMENTS:
- Phase 1: Focus on microbiome, 30-50g fiber, NO fasting, build foundation habits
- Phase 2: Introduce 12:12 IF, maintain gut healing, habit progression
- Phase 3: Flexible sustainable approach, advanced habit mastery

Return as JSON with this structure:
{
  "personalizedMeals": {
    "breakfast": {
      "suggestion": "specific meal",
      "behavioralStrategy": "why this works for their profile",
      "easyWin": "2-minute version",
      "habitStack": "connection to existing habit"
    },
    "lunch": { /* same structure */ },
    "dinner": { /* same structure */ }
  },
  "habitStacks": [
    {
      "trigger": "existing habit",
      "newHabit": "nutrition habit",
      "implementation": "specific if-then plan"
    }
  ],
  "temptationBundling": [
    {
      "healthyChoice": "nutritious food/habit",
      "pleasurableActivity": "enjoyable pairing",
      "strategy": "how to combine them"
    }
  ],
  "socialProof": [
    {
      "statistic": "community behavior stat",
      "relevance": "why this matters to user"
    }
  ],
  "implementationIntentions": [
    {
      "situation": "if condition",
      "response": "then action",
      "purpose": "what problem this solves"
    }
  ],
  "environmentalDesign": {
    "kitchenOptimization": "specific changes",
    "shoppingStrategy": "behavioral shopping approach",
    "mealPrepHacks": "friction-reducing strategies"
  },
  "progressProtection": {
    "streakMaintenance": "how to protect current streaks",
    "lossFraming": "loss aversion applications"
  }
}`;

    try {
      const model = llmGateway.getModelForAgent('nutritionAgent');
      const response = await model.invoke([{ role: 'user', content: prompt }]);
      const aiContent = response.content || response.text || response.toString();
      
      return this.parseAIResponse(aiContent, 'nutrition');
    } catch (error) {
      console.error('Behavioral nutrition AI error:', error);
      return this.getFallbackBehavioralNutrition(context);
    }
  }

  /**
   * Generate behavioral economics-driven exercise plan
   */
  private async generateBehavioralExercise(context: BehavioralContext): Promise<any> {
    const prompt = `
You are a behavioral psychology expert designing personalized exercise habits.

BEHAVIORAL PROFILE:
- Motivation: ${context.behaviorProfile?.motivationType || 'BALANCED'}
- Loss Aversion: ${context.behaviorProfile?.lossAversion || 2.5}/5.0
- Willpower Pattern: ${JSON.stringify(context.behaviorProfile?.willpowerPattern || {})}
- Best Performance Time: ${context.behaviorProfile?.bestPerformanceTime || ['MORNING']}
- Social Influence Response: ${context.behaviorProfile?.socialInfluence || 0.5}/1.0

CONTEXT:
- Current Time: ${context.timeOfDay}
- Recent Exercise Performance: ${this.getExercisePerformance(context.recentHabits)}
- Available Equipment: ${context.environmentalContext?.availableEquipment || 'basic'}
- Energy Level Patterns: ${context.recentPerformance?.energyPatterns || 'unknown'}

Apply these behavioral principles:
1. Start ridiculously small (2-minute rule)
2. Remove all friction
3. Stack with established habits
4. Create implementation intentions
5. Use social accountability
6. Protect existing momentum
7. Design environment for success

Create exercise plan with:
- Minimum viable workout (can't fail version)
- Habit stacking opportunities
- Friction removal strategies
- Social accountability elements
- Progress protection strategies
- Implementation intentions for obstacles

Return as JSON with comprehensive behavioral strategies.`;

    try {
      const model = llmGateway.getModelForAgent('wellnessAgent');
      const response = await model.invoke([{ role: 'user', content: prompt }]);
      const aiContent = response.content || response.text || response.toString();
      
      return this.parseAIResponse(aiContent, 'exercise');
    } catch (error) {
      console.error('Behavioral exercise AI error:', error);
      return this.getFallbackBehavioralExercise(context);
    }
  }

  /**
   * Generate behavioral economics-driven meditation plan
   */
  private async generateBehavioralMeditation(context: BehavioralContext): Promise<any> {
    const meditationHistory = context.recentHabits.filter(h => h.habit.category === 'MEDITATION');
    const successRate = this.calculateSuccessRate(meditationHistory);

    const prompt = `
You are a behavioral psychology expert designing meditation habits.

PROFILE & CONTEXT:
- Meditation Success Rate: ${successRate}% (last 30 days)
- Stress Patterns: ${context.recentPerformance?.stressPatterns || 'unknown'}
- Preferred Times: ${context.behaviorProfile?.bestPerformanceTime || ['MORNING']}
- Motivation Type: ${context.behaviorProfile?.motivationType || 'BALANCED'}

BEHAVIORAL CHALLENGES:
- Present bias: ${context.behaviorProfile?.presentBias || 0.7} (lower = wants immediate results)
- Willpower depletion: ${context.recentPerformance?.averageWillpower || 5}/10

Design meditation approach that:
1. Starts impossibly small (literally 1 breath if needed)
2. Links to strongest existing habit
3. Provides immediate benefits they can feel
4. Has backup plans for low-willpower days
5. Uses environmental cues
6. Includes social elements if helpful

Focus on habit formation over meditation perfection.

Return JSON with behavioral meditation strategy.`;

    try {
      const model = llmGateway.getModelForAgent('wellnessAgent');
      const response = await model.invoke([{ role: 'user', content: prompt }]);
      const aiContent = response.content || response.text || response.toString();
      
      return this.parseAIResponse(aiContent, 'meditation');
    } catch (error) {
      console.error('Behavioral meditation AI error:', error);
      return this.getFallbackBehavioralMeditation(context);
    }
  }

  /**
   * Generate personalized nudges based on behavioral patterns
   */
  private async generatePersonalizedNudges(context: BehavioralContext): Promise<any[]> {
    // Analyze when user typically fails/succeeds
    const riskTimes = await this.identifyRiskTimes(context.userId);
    const motivationPatterns = await this.analyzeMotivationPatterns(context.userId);
    
    const nudges = [];

    // Generate different types of nudges based on behavioral profile
    if (context.behaviorProfile?.socialInfluence > 0.6) {
      nudges.push(await this.generateSocialProofNudge(context));
    }

    if (context.behaviorProfile?.lossAversion > 3.0) {
      nudges.push(await this.generateLossAversionNudge(context));
    }

    // Time-based nudges for identified risk periods
    for (const riskTime of riskTimes) {
      nudges.push(await this.generatePreventiveNudge(context, riskTime));
    }

    // Implementation intention nudges
    nudges.push(await this.generateImplementationIntentionNudge(context));

    return nudges.filter(n => n !== null);
  }

  /**
   * Generate habit stacking opportunities
   */
  private async generateHabitStacks(context: BehavioralContext): Promise<any[]> {
    // Find user's most reliable existing habits
    const reliableHabits = context.recentHabits
      .filter(h => this.calculateHabitReliability(h.habit.id, context.recentHabits) > 0.8)
      .map(h => h.habit);

    const stacks = [];

    for (const anchorHabit of reliableHabits) {
      // Find complementary new habits that could stack
      const stackableHabits = await this.findStackableHabits(anchorHabit, context);
      
      for (const newHabit of stackableHabits) {
        stacks.push({
          anchorHabit: anchorHabit.name,
          anchorCue: anchorHabit.cue,
          newHabit: newHabit.name,
          stackingPhrase: `After I ${anchorHabit.routine}, I will ${newHabit.routine}`,
          behavioralRationale: newHabit.rationale,
          difficultyLevel: newHabit.difficulty,
          expectedSuccess: newHabit.successProbability
        });
      }
    }

    return stacks.sort((a, b) => b.expectedSuccess - a.expectedSuccess).slice(0, 3);
  }

  /**
   * Generate implementation intentions for common failure points
   */
  private async generateImplementationIntentions(context: BehavioralContext): Promise<any[]> {
    // Analyze user's failure patterns
    const failurePatterns = await this.analyzeFailurePatterns(context.userId);
    const intentions = [];

    for (const pattern of failurePatterns) {
      const intention = await this.createImplementationIntention(pattern, context);
      if (intention) {
        intentions.push(intention);
      }
    }

    // Add proactive implementation intentions for new challenges
    const proactiveIntentions = await this.generateProactiveIntentions(context);
    intentions.push(...proactiveIntentions);

    return intentions;
  }

  /**
   * Advanced behavioral analysis methods
   */
  private async analyzeRecentPerformance(userId: string): Promise<any> {
    const recentLogs = await prisma.habitLog.findMany({
      where: { userId },
      take: 30,
      orderBy: { date: 'desc' }
    });

    const metrics = await prisma.behaviorMetric.findMany({
      where: { userId },
      take: 14,
      orderBy: { date: 'desc' }
    });

    return {
      overallCompletionRate: this.calculateCompletionRate(recentLogs),
      consistencyScore: this.calculateConsistency(recentLogs),
      averageWillpower: this.calculateAverageWillpower(metrics),
      energyPatterns: this.analyzeEnergyPatterns(recentLogs),
      stressPatterns: this.analyzeStressPatterns(metrics),
      motivationTrends: this.analyzeMotivationTrends(metrics),
      timeOfDayPerformance: this.analyzeTimePerformance(recentLogs)
    };
  }

  private async identifyRiskTimes(userId: string): Promise<any[]> {
    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        logs: {
          take: 30,
          orderBy: { date: 'desc' }
        }
      }
    });

    const riskTimes = [];

    for (const habit of habits) {
      const failures = habit.logs.filter(log => !log.completed);
      const failureTimePatterns = this.analyzeFailureTimePatterns(failures);
      
      if (failureTimePatterns.length > 0) {
        riskTimes.push({
          habitId: habit.id,
          habitName: habit.name,
          riskTimes: failureTimePatterns,
          failureRate: failures.length / habit.logs.length
        });
      }
    }

    return riskTimes;
  }

  private async generateSocialProofNudge(context: BehavioralContext): Promise<any> {
    // Generate social proof based on community data
    const communityStats = await this.getCommunityStats(context.user.currentPhase);
    
    return {
      type: 'SOCIAL_PROOF',
      title: 'Your Community is Crushing It! 🌟',
      message: `${communityStats.percentageActive}% of ${context.user.currentPhase} members completed their nutrition goals yesterday. Join them!`,
      actionRequired: 'Complete today\'s nutrition plan',
      triggerType: 'TIME_TRIGGER',
      scheduledFor: this.calculateOptimalNudgeTime(context, 'nutrition'),
      personalizedContent: this.customizeForBehaviorProfile(context, 'social_proof')
    };
  }

  private async generateLossAversionNudge(context: BehavioralContext): Promise<any> {
    const longestStreak = Math.max(...context.currentStreaks.map(s => s.currentCount));
    
    if (longestStreak > 3) {
      return {
        type: 'LOSS_AVERSION',
        title: `Don't Break Your ${longestStreak}-Day Streak! 🔥`,
        message: `You've built amazing momentum. It takes just 2 minutes to keep your streak alive.`,
        actionRequired: 'Complete minimum version of today\'s habits',
        triggerType: 'TIME_TRIGGER',
        scheduledFor: this.calculateRiskTime(context),
        personalizedContent: `Your ${longestStreak}-day streak represents ${longestStreak * 15} minutes of consistent effort. Protect that investment!`
      };
    }
    
    return null;
  }

  /**
   * Utility methods for behavioral analysis
   */
  private calculateCompletionRate(logs: any[]): number {
    if (logs.length === 0) return 0;
    return logs.filter(log => log.completed).length / logs.length;
  }

  private calculateConsistency(logs: any[]): number {
    // Calculate consistency score based on streaks and gaps
    const days = logs.map(log => log.date.toDateString());
    const uniqueDays = [...new Set(days)];
    return uniqueDays.length / 30; // 30-day consistency
  }

  private calculateAverageWillpower(metrics: any[]): number {
    if (metrics.length === 0) return 5.0;
    const willpowerValues = metrics
      .map(m => m.willpowerUsed)
      .filter(w => w !== null);
    return willpowerValues.reduce((a, b) => a + b, 0) / willpowerValues.length;
  }

  private analyzeEnergyPatterns(logs: any[]): any {
    const energyByTime = {};
    logs.forEach(log => {
      const timeKey = log.timeOfDay;
      if (!energyByTime[timeKey]) energyByTime[timeKey] = [];
      if (log.energyLevel) energyByTime[timeKey].push(log.energyLevel);
    });

    const patterns = {};
    for (const [time, values] of Object.entries(energyByTime)) {
      patterns[time] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    }

    return patterns;
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 7) return 'EARLY_MORNING';
    if (hour < 10) return 'MORNING';
    if (hour < 12) return 'LATE_MORNING';
    if (hour < 15) return 'EARLY_AFTERNOON';
    if (hour < 18) return 'LATE_AFTERNOON';
    if (hour < 20) return 'EARLY_EVENING';
    if (hour < 22) return 'EVENING';
    return 'NIGHT';
  }

  private parseAIResponse(content: string, type: string): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error(`Failed to parse ${type} AI response:`, error);
    }
    
    return this.getFallbackContent(type);
  }

  private getFallbackContent(type: string): any {
    const fallbacks = {
      nutrition: {
        personalizedMeals: {
          breakfast: {
            suggestion: "Overnight oats with berries and nuts",
            behavioralStrategy: "Easy to prepare the night before, removing morning friction",
            easyWin: "Just add berries to existing oatmeal",
            habitStack: "After I pour my coffee, I will add berries to my oats"
          }
        },
        habitStacks: [
          {
            trigger: "making morning coffee",
            newHabit: "drink 16oz water",
            implementation: "After I start the coffee maker, I will drink a full glass of water"
          }
        ]
      },
      exercise: {
        minimumViableWorkout: {
          name: "2-Minute Movement",
          description: "One minute of gentle stretching",
          rationale: "Builds the neural pathway without overwhelming"
        }
      },
      meditation: {
        tinyStart: {
          practice: "Three conscious breaths",
          trigger: "After I sit down at my desk",
          rationale: "Impossible to fail, builds mindfulness habit"
        }
      }
    };

    return fallbacks[type] || {};
  }

  // Additional helper methods would be implemented here...
  private async getEnvironmentalContext(userId: string): Promise<any> {
    // Implementation for environmental context
    return { availableEquipment: 'basic', homeSetup: 'standard' };
  }

  private getExercisePerformance(recentHabits: any[]): string {
    // Implementation for exercise performance analysis
    return 'moderate';
  }

  private calculateSuccessRate(habits: any[]): number {
    if (habits.length === 0) return 0;
    return (habits.filter(h => h.completed).length / habits.length) * 100;
  }

  // ... other helper methods
}

export const behavioralAI = new BehavioralAI();
