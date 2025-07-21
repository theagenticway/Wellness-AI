// apps/backend/src/services/enhancedLLMGateway.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemInstruction?: string;
}

interface UserProfile {
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

interface HealthMetrics {
  weight?: number;
  bmi?: number;
  sleepHours?: number;
  stressLevel?: number;
  energyLevel?: number;
  digestiveHealth?: number;
  adherenceRate?: number;
}

export class EnhancedLLMGateway {
  private gemini: GoogleGenerativeAI;
  private configs: Record<string, GeminiConfig>;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }
    
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Specialized configurations for different agents
    this.configs = {
      wellness: {
        model: "gemini-2.0-flash-exp",
        temperature: 0.3,
        maxTokens: 2048,
        systemInstruction: this.getWellnessSystemPrompt()
      },
      nutrition: {
        model: "gemini-2.0-flash-exp", 
        temperature: 0.2,
        maxTokens: 3048,
        systemInstruction: this.getNutritionSystemPrompt()
      },
      cbt: {
        model: "gemini-2.0-flash-exp",
        temperature: 0.4,
        maxTokens: 2048,
        systemInstruction: this.getCBTSystemPrompt()
      }
    };
  }

  async generateResponse(
    agentType: 'wellness' | 'nutrition' | 'cbt',
    prompt: string,
    context?: any
  ): Promise<string> {
    const config = this.configs[agentType];
    const model = this.gemini.getGenerativeModel({
      model: config.model,
      systemInstruction: config.systemInstruction,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      }
    });

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error(`Error with ${agentType} agent:`, error);
      throw new Error(`Failed to generate ${agentType} response: ${error.message}`);
    }
  }

  async generateWellnessPlan(
    userProfile: UserProfile,
    healthMetrics: HealthMetrics,
    professionalOverride?: string
  ): Promise<any> {
    const prompt = this.buildWellnessPrompt(userProfile, healthMetrics, professionalOverride);
    
    try {
      const response = await this.generateResponse('wellness', prompt);
      return this.parseWellnessResponse(response);
    } catch (error) {
      console.error('Wellness Plan Generation Error:', error);
      return this.getFallbackWellnessPlan(userProfile);
    }
  }

  async generateNutritionPlan(
    userProfile: UserProfile,
    dietaryPreferences: string[],
    professionalOverride?: string
  ): Promise<any> {
    const prompt = this.buildNutritionPrompt(userProfile, dietaryPreferences, professionalOverride);
    
    try {
      const response = await this.generateResponse('nutrition', prompt);
      return this.parseNutritionResponse(response);
    } catch (error) {
      console.error('Nutrition Plan Generation Error:', error);
      return this.getFallbackNutritionPlan(userProfile);
    }
  }

  private buildWellnessPrompt(
    profile: UserProfile,
    metrics: HealthMetrics,
    override?: string
  ): string {
    const daysInProgram = this.calculateDaysInProgram(profile.startDate);
    
    return `
ANALYZE USER PROFILE AND PROVIDE GMRP GUIDANCE:

USER PROFILE:
- Age: ${profile.age}, Gender: ${profile.gender}
- Current GMRP Phase: ${profile.currentPhase}
- Days in Program: ${daysInProgram}
- Health Goals: ${profile.healthGoals.join(', ')}
- Health Conditions: ${profile.healthConditions?.join(', ') || 'None reported'}
- Medications: ${profile.medications?.join(', ') || 'None reported'}

CURRENT METRICS:
- Weight: ${metrics.weight || 'Not provided'}
- Sleep: ${metrics.sleepHours || 'Not tracked'} hours
- Stress Level: ${metrics.stressLevel || 'Not assessed'}/10
- Energy Level: ${metrics.energyLevel || 'Not assessed'}/10
- Digestive Health: ${metrics.digestiveHealth || 'Not assessed'}/10
- GMRP Adherence: ${metrics.adherenceRate || 'Not calculated'}%

PROFESSIONAL OVERRIDE: ${override || 'None'}

PROVIDE a comprehensive response including:
1. Personalized greeting with encouragement
2. Today's specific GMRP recommendations for ${profile.currentPhase}
3. Phase-appropriate activities and milestones
4. Safety considerations and professional consultation needs
5. Progress assessment and motivation
6. Next steps for phase advancement

Format as a structured response with clear sections and actionable guidance.`;
  }

  private buildNutritionPrompt(
    profile: UserProfile,
    preferences: string[],
    override?: string
  ): string {
    return `
GENERATE GMRP ${profile.currentPhase.toUpperCase()} NUTRITION PROTOCOL:

USER DETAILS:
- Age: ${profile.age}, Activity Level: Moderate
- Dietary Preferences: ${preferences.join(', ')}
- Allergies/Restrictions: ${profile.preferences.dietary.join(', ')}
- Current Phase: ${profile.currentPhase}

GMRP PHASE REQUIREMENTS:
${this.getPhaseRequirements(profile.currentPhase)}

PROFESSIONAL OVERRIDE: ${override || 'None - follow standard protocol'}

PROVIDE DETAILED:
1. Today's meal suggestions with GMRP compliance
2. Fiber target breakdown (specific foods)
3. Anti-inflammatory focus areas
4. Supplement protocol for this phase
5. ${profile.currentPhase === 'phase2' || profile.currentPhase === 'phase3' ? 'Intermittent fasting guidance' : 'Meal timing optimization'}
6. Shopping list for next 3 days
7. Quick meal prep suggestions

Ensure all recommendations are evidence-based, culturally appropriate, and budget-conscious.`;
  }

  private getWellnessSystemPrompt(): string {
    return `You are a GMRP (Gut-Mind Reset Program) Wellness Agent. 

CORE RESPONSIBILITIES:
- Guide users through the 3-phase GMRP protocol
- Provide evidence-based wellness recommendations
- Ensure safety and encourage professional consultation
- Personalize advice based on user health profile

GMRP PHASES:
- Phase 1 (Months 1-3): Microbiome reset, no IF, nutrient repletion
- Phase 2 (Months 4-9): Introduce 12:12 IF once weekly, habit formation  
- Phase 3 (Months 10-18): Maintenance IF, long-term sustainability

SAFETY GUIDELINES:
- Always include medical disclaimers
- Recommend professional consultation for health concerns
- Never diagnose or treat medical conditions
- Focus on general wellness education

RESPONSE FORMAT:
- Be empathetic and encouraging
- Provide actionable, specific guidance
- Include scientific rationale when appropriate
- Keep responses concise but comprehensive`;
  }

  private getNutritionSystemPrompt(): string {
    return `You are a GMRP Nutrition Specialist Agent.

EXPERTISE AREAS:
- Anti-inflammatory nutrition protocols
- Gut microbiome optimization
- Intermittent fasting guidance (GMRP phases)
- Supplement recommendations based on GMRP protocols

GMRP NUTRITION PRINCIPLES:
- Phase 1: 100% whole foods, 30-50g fiber/day, no IF
- Phase 2: 80/20 diet, introduce 12:12 IF once weekly
- Phase 3: Regenerative diet, flexible IF maintenance

SUPPLEMENT PROTOCOLS:
- Phase 1: Multi-strain probiotics, B-complex, D3+K2, magnesium
- Phase 2: Maintenance probiotics, psyllium, L-theanine
- Phase 3: Minimal supplementation, seasonal adjustments

SAFETY REQUIREMENTS:
- Always recommend professional consultation
- Check for contraindications (pregnancy, eating disorders)
- Provide evidence-based recommendations only
- Include food safety and allergy considerations`;
  }

  private getCBTSystemPrompt(): string {
    return `You are a GMRP CBT (Cognitive Behavioral Therapy) Agent.

SPECIALIZATION:
- GMRP-specific behavioral interventions
- Craving management during gut reset
- Habit formation for wellness protocols
- Stress management for gut-brain axis

CBT TECHNIQUES:
- Cognitive restructuring for food relationships
- Behavioral activation for wellness habits
- Mindfulness integration with GMRP phases
- Exposure therapy for food fears/restrictions

GMRP CBT INTEGRATION:
- Phase 1: Daily 10-min sessions for craving management
- Phase 2: Biweekly sessions with IF education
- Phase 3: Monthly check-ins for lifestyle maintenance

SAFETY PROTOCOLS:
- Screen for mental health risk factors
- Escalate concerning responses to professionals
- Never provide clinical therapy or diagnosis
- Focus on wellness education and coping strategies

RESPONSE STYLE:
- Empathetic and non-judgmental
- Solution-focused and practical
- Encourage self-reflection and awareness
- Provide homework/practice suggestions`;
  }

  private getPhaseRequirements(phase: string): string {
    const requirements = {
      phase1: `
        - NO intermittent fasting
        - 100% whole foods, 30-50g fiber/day, no IF
        - Anti-inflammatory focus (turmeric, ginger, leafy greens)
        - Gut-healing nutrients (bone broth, fermented foods)
        - 2-3L water daily with electrolytes`,
      
      phase2: `
        - Introduce 12:12 IF once weekly (e.g., Wed 7pm-7am)
        - 80/20 whole foods approach
        - 35-45g fiber daily
        - High-protein, high-fiber meals in eating windows
        - Continue anti-inflammatory focus
        - Flexible meal timing on non-fasting days`,
      
      phase3: `
        - Flexible IF: 2x weekly 14:10 or 16:8
        - Regenerative diet with <10% processed foods
        - 30-40g fiber daily
        - Intuitive eating with GMRP principles
        - Social flexibility for meals
        - Long-term sustainability focus`
    };
    
    return requirements[phase as keyof typeof requirements] || requirements.phase1;
  }

  private calculateDaysInProgram(startDate: Date): number {
    return Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  private parseWellnessResponse(response: string): any {
    try {
      // Try to extract JSON if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Otherwise structure the text response
      return {
        greeting: this.extractSection(response, 'greeting') || 'Welcome to your GMRP journey!',
        dailyPlan: this.extractDailyPlan(response),
        recommendations: this.extractRecommendations(response),
        nextSteps: this.extractNextSteps(response),
        safetyAlerts: this.extractSafetyAlerts(response),
        phaseGuidance: this.extractSection(response, 'phase guidance')
      };
    } catch (error) {
      console.error('Error parsing wellness response:', error);
      return this.getFallbackWellnessPlan({ currentPhase: 'phase1' } as UserProfile);
    }
  }

  private parseNutritionResponse(response: string): any {
    try {
      return {
        mealPlan: this.extractMealPlan(response),
        shoppingList: this.extractShoppingList(response),
        supplementProtocol: this.extractSupplementProtocol(response),
        fastingSchedule: this.extractFastingSchedule(response),
        fiberBreakdown: this.extractSection(response, 'fiber')
      };
    } catch (error) {
      console.error('Error parsing nutrition response:', error);
      return this.getFallbackNutritionPlan({ currentPhase: 'phase1' } as UserProfile);
    }
  }

  // Helper extraction methods
  private extractSection(text: string, sectionName: string): string {
    const patterns = [
      new RegExp(`${sectionName}:?\\s*([^\\n]+)`, 'i'),
      new RegExp(`\\*\\*${sectionName}\\*\\*:?\\s*([^\\n]+)`, 'i'),
      new RegExp(`# ${sectionName}\\s*\\n([^#]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  }

  private extractDailyPlan(response: string): any[] {
    const tasks = [];
    const taskPattern = /[-•]\s*(.+?)(?=\n|$)/g;
    let match;
    
    while ((match = taskPattern.exec(response)) !== null) {
      tasks.push({
        title: match[1].trim(),
        completed: false,
        status: 'pending'
      });
    }
    
    return tasks.slice(0, 5); // Limit to 5 tasks
  }

  private extractRecommendations(response: string): string[] {
    const recommendations = [];
    const recPattern = /recommendation[s]?:?\s*\n((?:[-•]\s*.+\n?)+)/i;
    const match = response.match(recPattern);
    
    if (match) {
      const items = match[1].match(/[-•]\s*(.+)/g);
      if (items) {
        recommendations.push(...items.map(item => item.replace(/[-•]\s*/, '').trim()));
      }
    }
    
    return recommendations;
  }

  private extractNextSteps(response: string): string[] {
    const steps = [];
    const stepPattern = /next\s+steps?:?\s*\n((?:[-•]\s*.+\n?)+)/i;
    const match = response.match(stepPattern);
    
    if (match) {
      const items = match[1].match(/[-•]\s*(.+)/g);
      if (items) {
        steps.push(...items.map(item => item.replace(/[-•]\s*/, '').trim()));
      }
    }
    
    return steps;
  }

  private extractSafetyAlerts(response: string): string[] {
    const alerts = [];
    const safetyPattern = /safety|caution|warning|alert/i;
    
    if (safetyPattern.test(response)) {
      alerts.push('Please consult with your healthcare provider before making significant changes to your wellness routine.');
    }
    
    return alerts;
  }

  private extractMealPlan(response: string): any {
    return {
      breakfast: this.extractSection(response, 'breakfast'),
      lunch: this.extractSection(response, 'lunch'),
      dinner: this.extractSection(response, 'dinner'),
      snacks: this.extractSection(response, 'snacks')
    };
  }

  private extractShoppingList(response: string): string[] {
    const list = [];
    const listPattern = /shopping\s+list:?\s*\n((?:[-•]\s*.+\n?)+)/i;
    const match = response.match(listPattern);
    
    if (match) {
      const items = match[1].match(/[-•]\s*(.+)/g);
      if (items) {
        list.push(...items.map(item => item.replace(/[-•]\s*/, '').trim()));
      }
    }
    
    return list;
  }

  private extractSupplementProtocol(response: string): any {
    return {
      morning: this.extractSection(response, 'morning supplements'),
      evening: this.extractSection(response, 'evening supplements'),
      notes: this.extractSection(response, 'supplement notes')
    };
  }

  private extractFastingSchedule(response: string): any {
    return {
      schedule: this.extractSection(response, 'fasting schedule'),
      guidelines: this.extractSection(response, 'fasting guidelines')
    };
  }

  // Fallback methods for error handling
  private getFallbackWellnessPlan(profile: UserProfile): any {
    return {
      greeting: `Welcome to your GMRP ${profile.currentPhase} journey!`,
      dailyPlan: [
        { title: 'Start your day with 16oz of water', completed: false, status: 'pending' },
        { title: 'Take your morning supplements', completed: false, status: 'pending' },
        { title: 'Eat a fiber-rich breakfast', completed: false, status: 'pending' },
        { title: '10 minutes of mindfulness', completed: false, status: 'pending' }
      ],
      recommendations: ['Focus on whole foods today', 'Stay hydrated throughout the day'],
      nextSteps: ['Continue with current phase protocols'],
      safetyAlerts: ['Consult your healthcare provider for any concerns'],
      phaseGuidance: `You're doing great in ${profile.currentPhase}! Keep following the protocol.`
    };
  }

  private getFallbackNutritionPlan(profile: UserProfile): any {
    return {
      mealPlan: {
        breakfast: 'Oatmeal with berries and nuts',
        lunch: 'Large salad with lean protein',
        dinner: 'Grilled fish with roasted vegetables',
        snacks: 'Apple with almond butter'
      },
      shoppingList: ['Organic vegetables', 'Lean proteins', 'Whole grains'],
      supplementProtocol: {
        morning: 'Probiotic, Vitamin D',
        evening: 'Magnesium',
        notes: 'Take with meals'
      },
      fiberBreakdown: 'Aim for 30-50g daily from diverse sources'
    };
  }
}

export const enhancedLLMGateway = new EnhancedLLMGateway();