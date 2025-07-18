// apps/backend/src/agents/wellnessAgent.ts
import { enhancedLLMGateway } from '../services/enhancedLLMGateway';

export interface UserProfile {
  id: string;
  age: number;
  gender: string;
  healthGoals: string[];
  currentPhase: 'phase1' | 'phase2' | 'phase3';
  startDate: Date;
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
}

export interface WellnessPlanResponse {
  greeting: string;
  dailyPlan: Array<{
    title: string;
    completed: boolean;
    status: string;
    priority?: 'high' | 'medium' | 'low';
  }>;
  recommendations: string[];
  nextSteps: string[];
  safetyAlerts: string[];
  phaseGuidance: string;
  insights: Array<{
    title: string;
    message: string;
    action?: string;
    type: 'info' | 'warning' | 'success' | 'tip';
  }>;
  progressAssessment: {
    currentScore: number;
    areas: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
  };
}

export class WellnessAgent {
  async generatePersonalizedPlan(
    userProfile: UserProfile,
    healthMetrics: HealthMetrics,
    professionalOverride?: string
  ): Promise<WellnessPlanResponse> {
    console.log(`🏥 Generating GMRP ${userProfile.currentPhase} plan for ${userProfile.id}`);
    
    try {
      const response = await enhancedLLMGateway.generateWellnessPlan(
        userProfile,
        healthMetrics,
        professionalOverride
      );
      
      return this.enhanceResponse(response, userProfile, healthMetrics);
    } catch (error) {
      console.error('❌ Wellness Agent Error:', error);
      return this.getFallbackPlan(userProfile, healthMetrics);
    }
  }

  async assessProgress(
    userProfile: UserProfile,
    recentActivities: any[],
    healthMetrics: HealthMetrics
  ): Promise<any> {
    const prompt = this.buildProgressAssessmentPrompt(userProfile, recentActivities, healthMetrics);
    
    try {
      const response = await enhancedLLMGateway.generateResponse('wellness', prompt);
      return this.parseProgressAssessment(response);
    } catch (error) {
      console.error('❌ Progress Assessment Error:', error);
      return this.getFallbackProgressAssessment(userProfile);
    }
  }

  async generatePhaseTransitionGuidance(
    userProfile: UserProfile,
    readinessScore: number
  ): Promise<any> {
    const prompt = this.buildPhaseTransitionPrompt(userProfile, readinessScore);
    
    try {
      const response = await enhancedLLMGateway.generateResponse('wellness', prompt);
      return this.parsePhaseTransitionGuidance(response);
    } catch (error) {
      console.error('❌ Phase Transition Error:', error);
      return this.getFallbackPhaseTransition(userProfile);
    }
  }

  private buildProgressAssessmentPrompt(
    profile: UserProfile,
    activities: any[],
    metrics: HealthMetrics
  ): string {
    return `
ASSESS GMRP PROGRESS FOR USER:

USER PROFILE:
- Current Phase: ${profile.currentPhase}
- Days in Program: ${this.calculateDaysInProgram(profile.startDate)}
- Health Goals: ${profile.healthGoals.join(', ')}

RECENT ACTIVITIES (Last 7 days):
${activities.map(activity => `- ${activity.type}: ${activity.description} (${activity.date})`).join('\n')}

CURRENT METRICS:
- Sleep Quality: ${metrics.sleepHours || 'Not tracked'} hours
- Energy Level: ${metrics.energyLevel || 'Not assessed'}/10
- Digestive Health: ${metrics.digestiveHealth || 'Not assessed'}/10
- Stress Level: ${metrics.stressLevel || 'Not assessed'}/10

PROVIDE:
1. Overall progress score (0-100)
2. Specific areas of improvement and concern
3. Recommendations for next week
4. Phase advancement readiness assessment
5. Motivational feedback with concrete achievements

Be encouraging but honest about areas needing attention.`;
  }

  private buildPhaseTransitionPrompt(
    profile: UserProfile,
    readinessScore: number
  ): string {
    const nextPhase = this.getNextPhase(profile.currentPhase);
    
    return `
EVALUATE GMRP PHASE TRANSITION READINESS:

CURRENT STATUS:
- Current Phase: ${profile.currentPhase}
- Days in Current Phase: ${this.calculateDaysInProgram(profile.startDate)}
- Readiness Score: ${readinessScore}/100
- Next Phase: ${nextPhase}

TRANSITION CRITERIA:
${this.getPhaseTransitionCriteria(profile.currentPhase)}

PROVIDE:
1. Readiness assessment (Ready/Not Ready/Almost Ready)
2. Missing criteria that need to be met
3. Estimated timeline for readiness
4. Preparation steps for next phase
5. What to expect in ${nextPhase}

Focus on building confidence while ensuring proper preparation.`;
  }

  private enhanceResponse(
    response: any,
    profile: UserProfile,
    metrics: HealthMetrics
  ): WellnessPlanResponse {
    // Add personalized insights based on user data
    const insights = this.generatePersonalizedInsights(profile, metrics, response);
    
    // Enhance daily plan with priorities
    const enhancedDailyPlan = response.dailyPlan.map((task: any, index: number) => ({
      ...task,
      priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low'
    }));

    return {
      ...response,
      dailyPlan: enhancedDailyPlan,
      insights,
      progressAssessment: this.calculateProgressScore(metrics)
    };
  }

  private generatePersonalizedInsights(
    profile: UserProfile,
    metrics: HealthMetrics,
    response: any
  ): Array<{ title: string; message: string; action?: string; type: 'info' | 'warning' | 'success' | 'tip' }> {
    const insights = [];
    
    // Phase-specific insights
    if (profile.currentPhase === 'phase1') {
      insights.push({
        title: 'Microbiome Reset Focus',
        message: 'Your gut is adapting to the new nutrition protocol. Some digestive changes are normal during the first 2-4 weeks.',
        type: 'info' as const
      });
    }

    // Metrics-based insights
    if (metrics.sleepHours && metrics.sleepHours < 7) {
      insights.push({
        title: 'Sleep Optimization',
        message: 'Improving sleep quality will significantly boost your GMRP results. Aim for 7-9 hours nightly.',
        action: 'View Sleep Tips',
        type: 'warning' as const
      });
    }

    if (metrics.stressLevel && metrics.stressLevel > 7) {
      insights.push({
        title: 'Stress Management',
        message: 'High stress levels can impact gut health. Consider adding more mindfulness practices to your routine.',
        action: 'Try CBT Session',
        type: 'warning' as const
      });
    }

    // Progress celebration
    if (metrics.adherenceRate && metrics.adherenceRate > 80) {
      insights.push({
        title: 'Excellent Adherence!',
        message: `You're maintaining ${metrics.adherenceRate}% adherence to your GMRP protocol. Keep up the fantastic work!`,
        type: 'success' as const
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  }

  private calculateProgressScore(metrics: HealthMetrics): any {
    const areas = [
      {
        name: 'Nutrition',
        score: this.calculateNutritionScore(metrics),
        feedback: 'Based on meal logging and adherence'
      },
      {
        name: 'Sleep',
        score: this.calculateSleepScore(metrics),
        feedback: 'Quality and duration tracking'
      },
      {
        name: 'Energy',
        score: (metrics.energyLevel || 5) * 10,
        feedback: 'Self-reported energy levels'
      },
      {
        name: 'Digestive Health',
        score: (metrics.digestiveHealth || 5) * 10,
        feedback: 'Gut health improvements'
      }
    ];

    const currentScore = Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length);

    return {
      currentScore,
      areas
    };
  }

  private calculateNutritionScore(metrics: HealthMetrics): number {
    // Simple calculation based on adherence rate
    return Math.min((metrics.adherenceRate || 50), 100);
  }

  private calculateSleepScore(metrics: HealthMetrics): number {
    if (!metrics.sleepHours) return 50;
    
    // Optimal sleep is 7-9 hours
    if (metrics.sleepHours >= 7 && metrics.sleepHours <= 9) {
      return 100;
    } else if (metrics.sleepHours >= 6 && metrics.sleepHours <= 10) {
      return 75;
    } else {
      return 40;
    }
  }

  private calculateDaysInProgram(startDate: Date): number {
    return Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getNextPhase(currentPhase: string): string {
    const phaseMap = {
      'phase1': 'phase2',
      'phase2': 'phase3',
      'phase3': 'maintenance'
    };
    return phaseMap[currentPhase as keyof typeof phaseMap] || 'maintenance';
  }

  private getPhaseTransitionCriteria(currentPhase: string): string {
    const criteria = {
      phase1: `
        - Completed 90+ days in Phase 1
        - Digestive health score >7/10
        - 80%+ adherence to nutrition protocol
        - Stable energy levels
        - No ongoing gut distress`,
      
      phase2: `
        - Completed 180+ days in Phase 2
        - Successfully practicing 12:12 IF weekly
        - Maintaining 75%+ whole foods diet
        - Stress management techniques in place
        - Ready for more flexibility`,
      
      phase3: `
        - Completed 300+ days total
        - Confident with flexible IF patterns
        - Intuitive eating skills developed
        - Long-term lifestyle integration
        - Ready for independent maintenance`
    };
    
    return criteria[currentPhase as keyof typeof criteria] || 'Continue current phase protocols';
  }

  private parseProgressAssessment(response: string): any {
    return {
      overallScore: this.extractScore(response),
      improvements: this.extractImprovements(response),
      concerns: this.extractConcerns(response),
      recommendations: this.extractRecommendations(response),
      readinessAssessment: this.extractReadiness(response)
    };
  }

  private parsePhaseTransitionGuidance(response: string): any {
    return {
      readiness: this.extractReadinessStatus(response),
      missingCriteria: this.extractMissingCriteria(response),
      timeline: this.extractTimeline(response),
      preparationSteps: this.extractPreparationSteps(response),
      nextPhaseExpectations: this.extractExpectations(response)
    };
  }

  // Helper extraction methods
  private extractScore(text: string): number {
    const scoreMatch = text.match(/(\d+)\/100|(\d+)%/);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 75;
  }

  private extractImprovements(text: string): string[] {
    return this.extractBulletPoints(text, /improvements?|progress|achievements?/i);
  }

  private extractConcerns(text: string): string[] {
    return this.extractBulletPoints(text, /concerns?|issues?|challenges?/i);
  }

  private extractRecommendations(text: string): string[] {
    return this.extractBulletPoints(text, /recommendations?|suggestions?|next\s+week/i);
  }

  private extractReadiness(text: string): string {
    const readinessMatch = text.match(/readiness:?\s*([^.\n]+)/i);
    return readinessMatch ? readinessMatch[1].trim() : 'Continue current phase';
  }

  private extractReadinessStatus(text: string): 'Ready' | 'Not Ready' | 'Almost Ready' {
    if (/ready/i.test(text) && !/not\s+ready|almost/i.test(text)) return 'Ready';
    if (/almost\s+ready/i.test(text)) return 'Almost Ready';
    return 'Not Ready';
  }

  private extractMissingCriteria(text: string): string[] {
    return this.extractBulletPoints(text, /missing|criteria|still\s+need/i);
  }

  private extractTimeline(text: string): string {
    const timelineMatch = text.match(/timeline:?\s*([^.\n]+)/i);
    return timelineMatch ? timelineMatch[1].trim() : '2-4 weeks';
  }

  private extractPreparationSteps(text: string): string[] {
    return this.extractBulletPoints(text, /preparation|steps|prepare/i);
  }

  private extractExpectations(text: string): string {
    const expectMatch = text.match(/expect:?\s*([^.\n]+)/i);
    return expectMatch ? expectMatch[1].trim() : 'Continued wellness journey';
  }

  private extractBulletPoints(text: string, sectionRegex: RegExp): string[] {
    const sectionMatch = text.match(new RegExp(`${sectionRegex.source}:?\\s*\\n((?:[-•]\\s*.+\\n?)+)`, 'i'));
    if (!sectionMatch) return [];
    
    const items = sectionMatch[1].match(/[-•]\s*(.+)/g);
    return items ? items.map(item => item.replace(/[-•]\s*/, '').trim()) : [];
  }

  // Fallback methods
  private getFallbackPlan(profile: UserProfile, metrics: HealthMetrics): WellnessPlanResponse {
    const phaseMessages = {
      phase1: 'Focus on microbiome reset and whole foods',
      phase2: 'Continue building habits with flexible nutrition',
      phase3: 'Maintain your healthy lifestyle with confidence'
    };

    return {
      greeting: `Good morning! Welcome to day ${this.calculateDaysInProgram(profile.startDate)} of your GMRP journey! ✨`,
      phaseGuidance: phaseMessages[profile.currentPhase],
      dailyPlan: [
        { title: 'Start with 16oz of filtered water', completed: false, status: 'pending', priority: 'high' },
        { title: 'Take morning supplements as prescribed', completed: false, status: 'pending', priority: 'high' },
        { title: 'Prepare fiber-rich breakfast', completed: false, status: 'pending', priority: 'medium' },
        { title: '10-minute mindfulness session', completed: false, status: 'pending', priority: 'medium' },
        { title: 'Log meals and symptoms', completed: false, status: 'pending', priority: 'low' }
      ],
      recommendations: [
        'Focus on getting 30-50g of fiber today',
        'Stay hydrated with 2-3L of water',
        'Practice stress management techniques'
      ],
      nextSteps: [
        `Continue ${profile.currentPhase} protocols`,
        'Track your progress daily',
        'Prepare for tomorrow\'s activities'
      ],
      safetyAlerts: [
        'Consult your healthcare provider for any concerning symptoms'
      ],
      insights: [
        {
          title: 'GMRP Journey',
          message: `You're in ${profile.currentPhase} of the Gut-Mind Reset Program. Every day counts!`,
          type: 'info'
        }
      ],
      progressAssessment: this.calculateProgressScore(metrics)
    };
  }

  private getFallbackProgressAssessment(profile: UserProfile): any {
    return {
      overallScore: 75,
      improvements: ['Maintaining consistent routine', 'Good hydration habits'],
      concerns: ['Need more data for accurate assessment'],
      recommendations: ['Continue current protocols', 'Track more metrics'],
      readinessAssessment: 'Continue current phase for more data'
    };
  }

  private getFallbackPhaseTransition(profile: UserProfile): any {
    return {
      readiness: 'Not Ready' as const,
      missingCriteria: ['More time in current phase needed', 'Additional health metrics required'],
      timeline: '4-6 weeks',
      preparationSteps: ['Focus on current phase mastery', 'Track all recommended metrics'],
      nextPhaseExpectations: 'Continued health improvements with new protocols'
    };
  }
}

export const wellnessAgent = new WellnessAgent();