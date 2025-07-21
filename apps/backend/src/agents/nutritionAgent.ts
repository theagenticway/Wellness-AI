// apps/backend/src/agents/nutritionAgent.ts
import { enhancedLLMGateway } from '../services/enhancedLLMGateway';
import { UserProfile } from '@app_types/user';

export interface NutritionPlanResponse {
  mealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  shoppingList: string[];
  supplementProtocol: {
    morning: string[];
    evening: string[];
    notes: string;
  };
  fastingSchedule?: {
    schedule: string;
    guidelines: string[];
  };
  fiberBreakdown: {
    target: number;
    sources: Array<{ food: string; amount: string; fiber: string }>;
  };
  weeklyMealPrep: {
    prepDay: string;
    tasks: string[];
    storageInstructions: string[];
  };
  nutritionEducation: {
    phaseGoals: string[];
    keyNutrients: string[];
    antiInflammatoryFoods: string[];
  };
}

export class NutritionAgent {
  async generateMealPlan(
    userProfile: UserProfile,
    dietaryPreferences: string[],
    professionalOverride?: string
  ): Promise<NutritionPlanResponse> {
    console.log(`🥗 Generating GMRP ${userProfile.currentPhase} nutrition plan for ${userProfile.id}`);
    
    try {
      const response = await enhancedLLMGateway.generateNutritionPlan(
        userProfile,
        dietaryPreferences,
        professionalOverride
      );
      
      return this.enhanceNutritionResponse(response, userProfile, dietaryPreferences);
    } catch (error) {
      console.error('❌ Nutrition Agent Error:', error);
      return this.getFallbackNutritionPlan(userProfile, dietaryPreferences);
    }
  }

  async generateShoppingList(
    userProfile: UserProfile,
    mealPlan: any,
    householdSize: number = 1
  ): Promise<{ categorizedList: any; estimatedCost: number; budgetTips: string[] }> {
    const prompt = this.buildShoppingListPrompt(userProfile, mealPlan, householdSize);
    
    try {
      const response = await enhancedLLMGateway.generateResponse('nutrition', prompt);
      return this.parseShoppingListResponse(response);
    } catch (error) {
      console.error('❌ Shopping List Error:', error);
      return this.getFallbackShoppingList(userProfile);
    }
  }

  async assessNutritionalNeeds(
    userProfile: UserProfile,
    recentMeals: any[],
    symptoms: string[]
  ): Promise<any> {
    const prompt = this.buildNutritionalAssessmentPrompt(userProfile, recentMeals, symptoms);
    
    try {
      const response = await enhancedLLMGateway.generateResponse('nutrition', prompt);
      return this.parseNutritionalAssessment(response);
    } catch (error) {
      console.error('❌ Nutritional Assessment Error:', error);
      return this.getFallbackNutritionalAssessment(userProfile);
    }
  }

  async generateSupplementGuidance(
    userProfile: UserProfile,
    currentSupplements: string[],
    healthMetrics: any
  ): Promise<any> {
    const prompt = this.buildSupplementPrompt(userProfile, currentSupplements, healthMetrics);
    
    try {
      const response = await enhancedLLMGateway.generateResponse('nutrition', prompt);
      return this.parseSupplementGuidance(response);
    } catch (error) {
      console.error('❌ Supplement Guidance Error:', error);
      return this.getFallbackSupplementGuidance(userProfile);
    }
  }

  private buildShoppingListPrompt(
    profile: UserProfile,
    mealPlan: any,
    householdSize: number
  ): string {
    return `
GENERATE GMRP SHOPPING LIST:

USER PROFILE:
- Phase: ${profile.currentPhase}
- Dietary Preferences: ${profile.preferences.dietary.join(', ')}
- Household Size: ${householdSize}

MEAL PLAN:
${JSON.stringify(mealPlan, null, 2)}

PROVIDE:
1. Categorized shopping list (proteins, vegetables, fruits, pantry staples)
2. Estimated cost breakdown
3. Budget-friendly alternatives
4. Bulk buying recommendations
5. Storage and prep tips

Focus on organic, whole foods within budget constraints.`;
  }

  private buildNutritionalAssessmentPrompt(
    profile: UserProfile,
    recentMeals: any[],
    symptoms: string[]
  ): string {
    return `
ASSESS NUTRITIONAL STATUS AND NEEDS:

USER PROFILE:
- Phase: ${profile.currentPhase}
- Age: ${profile.age}, Gender: ${profile.gender}
- Health Goals: ${profile.healthGoals.join(', ')}
- Health Conditions: ${profile.healthConditions?.join(', ') || 'None'}

RECENT MEALS (Last 3 days):
${recentMeals.map(meal => `${meal.date}: ${meal.description} (${meal.type})`).join('\n')}

REPORTED SYMPTOMS:
${symptoms.join(', ')}

ANALYZE:
1. Nutritional gaps and deficiencies
2. GMRP protocol adherence
3. Symptom-food correlations
4. Fiber intake assessment
5. Hydration status
6. Supplement effectiveness

PROVIDE SPECIFIC RECOMMENDATIONS for improvement.`;
  }

  private buildSupplementPrompt(
    profile: UserProfile,
    currentSupplements: string[],
    healthMetrics: any
  ): string {
    return `
EVALUATE SUPPLEMENT PROTOCOL:

USER PROFILE:
- Phase: ${profile.currentPhase}
- Current Supplements: ${currentSupplements.join(', ')}
- Age: ${profile.age}
- Health Conditions: ${profile.healthConditions?.join(', ') || 'None'}

HEALTH METRICS:
- Digestive Health: ${healthMetrics.digestiveHealth || 'Not assessed'}/10
- Energy Level: ${healthMetrics.energyLevel || 'Not assessed'}/10
- Sleep Quality: ${healthMetrics.sleepHours || 'Not tracked'} hours

GMRP SUPPLEMENT PROTOCOL for ${profile.currentPhase}:
${this.getPhaseSupplementProtocol(profile.currentPhase)}

PROVIDE:
1. Current protocol assessment
2. Missing supplements for this phase
3. Dosage recommendations
4. Timing optimization
5. Potential interactions
6. Quality brand suggestions
7. Cost-effective alternatives

Always include safety disclaimers and professional consultation recommendations.`;
  }

  private enhanceNutritionResponse(
    response: any,
    profile: UserProfile,
    preferences: string[]
  ): NutritionPlanResponse {
    return {
      ...response,
      fiberBreakdown: this.calculateFiberBreakdown(profile.currentPhase),
      weeklyMealPrep: this.generateMealPrepGuidance(profile.currentPhase),
      nutritionEducation: this.getPhaseNutritionEducation(profile.currentPhase)
    };
  }

  private calculateFiberBreakdown(phase: string): any {
    const fiberTargets = {
      phase1: 45,
      phase2: 40,
      phase3: 35
    };

    const fiberSources = [
      { food: 'Chia seeds', amount: '2 tbsp', fiber: '10g' },
      { food: 'Artichoke', amount: '1 medium', fiber: '10g' },
      { food: 'Black beans', amount: '1/2 cup', fiber: '8g' },
      { food: 'Avocado', amount: '1 medium', fiber: '7g' },
      { food: 'Broccoli', amount: '1 cup', fiber: '5g' },
      { food: 'Apple with skin', amount: '1 medium', fiber: '4g' }
    ];

    return {
      target: fiberTargets[phase as keyof typeof fiberTargets] || 40,
      sources: fiberSources
    };
  }

  private generateMealPrepGuidance(phase: string): any {
    const prepTasks = {
      phase1: [
        'Wash and chop vegetables for the week',
        'Cook quinoa and brown rice in batches',
        'Prepare bone broth in slow cooker',
        'Soak nuts and seeds for easier digestion'
      ],
      phase2: [
        'Batch cook proteins for quick assembly',
        'Prepare mason jar salads',
        'Make energy balls with whole ingredients',
        'Pre-portion intermittent fasting meals'
      ],
      phase3: [
        'Flexible prep based on weekly schedule',
        'Prepare versatile base ingredients',
        'Make freezer-friendly backup meals',
        'Stock healthy convenient options'
      ]
    };

    return {
      prepDay: 'Sunday',
      tasks: prepTasks[phase as keyof typeof prepTasks] || prepTasks.phase1,
      storageInstructions: [
        'Use glass containers for food safety',
        'Label with dates and contents',
        'Store cut vegetables with paper towels',
        'Freeze proteins in meal-sized portions'
      ]
    };
  }

  private getPhaseNutritionEducation(phase: string): any {
    const education = {
      phase1: {
        phaseGoals: [
          'Reset gut microbiome with diverse fiber',
          'Eliminate inflammatory foods completely',
          'Support digestive healing processes',
          'Establish consistent meal timing'
        ],
        keyNutrients: [
          'Soluble and insoluble fiber (30-50g daily)',
          'Omega-3 fatty acids for inflammation',
          'Probiotics from fermented foods',
          'Polyphenols from colorful vegetables'
        ],
        antiInflammatoryFoods: [
          'Turmeric with black pepper',
          'Ginger and garlic',
          'Leafy greens (kale, spinach)',
          'Fatty fish (salmon, sardines)',
          'Berries and cherries'
        ]
      },
      phase2: {
        phaseGoals: [
          'Introduce 12:12 intermittent fasting',
          'Maintain 80/20 whole foods approach',
          'Build sustainable eating habits',
          'Optimize nutrient timing'
        ],
        keyNutrients: [
          'High-quality proteins for satiety',
          'Complex carbohydrates for energy',
          'Healthy fats for hormone balance',
          'Continued fiber emphasis (35-45g)'
        ],
        antiInflammatoryFoods: [
          'Green tea and matcha',
          'Extra virgin olive oil',
          'Nuts and seeds',
          'Cruciferous vegetables',
          'Dark chocolate (85%+ cacao)'
        ]
      },
      phase3: {
        phaseGoals: [
          'Flexible intermittent fasting practice',
          'Intuitive eating with GMRP principles',
          'Social eating flexibility',
          'Long-term lifestyle maintenance'
        ],
        keyNutrients: [
          'Balanced macronutrient ratios',
          'Seasonal whole foods focus',
          'Mindful eating practices',
          'Adequate fiber (30-40g daily)'
        ],
        antiInflammatoryFoods: [
          'Variety of colorful vegetables',
          'Fermented foods regularly',
          'Herbs and spices daily',
          'Quality proteins and fats',
          'Seasonal fruits and vegetables'
        ]
      }
    };

    return education[phase as keyof typeof education] || education.phase1;
  }

  private getPhaseSupplementProtocol(phase: string): string {
    const protocols = {
      phase1: `
        MORNING:
        - Multi-strain probiotic (50+ billion CFU)
        - Vitamin D3 with K2 (2000-4000 IU)
        - B-Complex (high potency)
        - Omega-3 EPA/DHA (1000mg)
        
        EVENING:
        - Magnesium glycinate (200-400mg)
        - Zinc picolinate (15-30mg)
        - L-Glutamine (5g on empty stomach)`,
      
      phase2: `
        MORNING:
        - Maintenance probiotic (25-50 billion CFU)
        - Vitamin D3 with K2 (2000 IU)
        - B-Complex (moderate dose)
        
        EVENING:
        - Magnesium glycinate (200mg)
        - L-Theanine (100-200mg)
        - Psyllium husk (if needed for fiber)`,
      
      phase3: `
        SEASONAL APPROACH:
        - High-quality multivitamin
        - Vitamin D3 (winter months)
        - Omega-3 (2-3x weekly)
        - Probiotic (as needed)
        - Individual nutrients based on testing`
    };

    return protocols[phase as keyof typeof protocols] || protocols.phase1;
  }

  // Parsing methods
  private parseShoppingListResponse(response: string): any {
    return {
      categorizedList: this.extractCategorizedList(response),
      estimatedCost: this.extractCost(response),
      budgetTips: this.extractBudgetTips(response)
    };
  }

  private parseNutritionalAssessment(response: string): any {
    return {
      nutritionalGaps: this.extractGaps(response),
      adherenceScore: this.extractAdherenceScore(response),
      symptomCorrelations: this.extractCorrelations(response),
      recommendations: this.extractRecommendations(response)
    };
  }

  private parseSupplementGuidance(response: string): any {
    return {
      currentAssessment: this.extractAssessment(response),
      missingSupplements: this.extractMissing(response),
      dosageRecommendations: this.extractDosages(response),
      timing: this.extractTiming(response),
      brandSuggestions: this.extractBrands(response)
    };
  }

  // Helper extraction methods
  private extractCategorizedList(text: string): any {
    return {
      proteins: this.extractSection(text, 'proteins?'),
      vegetables: this.extractSection(text, 'vegetables?'),
      fruits: this.extractSection(text, 'fruits?'),
      pantryStaples: this.extractSection(text, 'pantry|staples')
    };
  }

  private extractCost(text: string): number {
    const costMatch = text.match(/\$(\d+(?:\.\d{2})?)/);
    return costMatch ? parseFloat(costMatch[1]) : 150;
  }

  private extractBudgetTips(text: string): string[] {
    return this.extractBulletPoints(text, /budget|cost|save|affordable/i);
  }

  private extractGaps(text: string): string[] {
    return this.extractBulletPoints(text, /gaps?|deficiencies|lacking/i);
  }

  private extractAdherenceScore(text: string): number {
    const scoreMatch = text.match(/(\d+)%.*adherence|adherence.*(\d+)%/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 75;
  }

  private extractCorrelations(text: string): string[] {
    return this.extractBulletPoints(text, /correlations?|connections?|related/i);
  }

  private extractRecommendations(text: string): string[] {
    return this.extractBulletPoints(text, /recommendations?|suggest|improve/i);
  }

  private extractAssessment(text: string): string {
    const assessMatch = text.match(/assessment:?\s*([^.\n]+)/i);
    return assessMatch ? assessMatch[1].trim() : 'Current protocol is adequate';
  }

  private extractMissing(text: string): string[] {
    return this.extractBulletPoints(text, /missing|add|include|consider/i);
  }

  private extractDosages(text: string): string[] {
    return this.extractBulletPoints(text, /dosage|dose|amount|mg|iu/i);
  }

  private extractTiming(text: string): string {
    const timingMatch = text.match(/timing:?\s*([^.\n]+)/i);
    return timingMatch ? timingMatch[1].trim() : 'Follow package instructions';
  }

  private extractBrands(text: string): string[] {
    return this.extractBulletPoints(text, /brands?|quality|manufacturers?/i);
  }

  private extractSection(text: string, sectionRegex: string): string[] {
    const regex = new RegExp(`${sectionRegex}:?\\s*\\n((?:[-•]\\s*.+\\n?)+)`, 'i');
    const match = text.match(regex);
    
    if (match) {
      const items = match[1].match(/[-•]\s*(.+)/g);
      return items ? items.map(item => item.replace(/[-•]\s*/, '').trim()) : [];
    }
    
    return [];
  }

  private extractBulletPoints(text: string, sectionRegex: RegExp): string[] {
    const sectionMatch = text.match(new RegExp(`${sectionRegex.source}:?\\s*\\n((?:[-•]\\s*.+\\n?)+)`, 'i'));
    if (!sectionMatch) return [];
    
    const items = sectionMatch[1].match(/[-•]\s*(.+)/g);
    return items ? items.map(item => item.replace(/[-•]\s*/, '').trim()) : [];
  }

  // Fallback methods
  private getFallbackNutritionPlan(profile: UserProfile, preferences: string[]): NutritionPlanResponse {
    const phaseMeals = this.getPhaseDefaultMeals(profile.currentPhase);
    
    return {
      mealPlan: phaseMeals,
      shoppingList: [
        'Organic vegetables (variety of colors)',
        'Grass-fed proteins',
        'Wild-caught fish',
        'Nuts and seeds',
        'Whole grains',
        'Fermented foods'
      ],
      supplementProtocol: {
        morning: ['Probiotic', 'Vitamin D3', 'B-Complex'],
        evening: ['Magnesium', 'Omega-3'],
        notes: 'Take with meals unless otherwise specified'
      },
      fiberBreakdown: this.calculateFiberBreakdown(profile.currentPhase),
      weeklyMealPrep: this.generateMealPrepGuidance(profile.currentPhase),
      nutritionEducation: this.getPhaseNutritionEducation(profile.currentPhase)
    };
  }

  private getPhaseDefaultMeals(phase: string): any {
    const meals = {
      phase1: {
        breakfast: 'Chia pudding with berries and almond butter',
        lunch: 'Large salad with grilled chicken and avocado',
        dinner: 'Baked salmon with roasted vegetables and quinoa',
        snacks: ['Apple with raw almonds', 'Vegetable sticks with hummus']
      },
      phase2: {
        breakfast: 'Green smoothie with protein powder',
        lunch: 'Buddha bowl with mixed vegetables and tahini',
        dinner: 'Grass-fed beef with sweet potato and sauerkraut',
        snacks: ['Mixed berries', 'Raw vegetables with guacamole']
      },
      phase3: {
        breakfast: 'Oatmeal with nuts, seeds, and seasonal fruit',
        lunch: 'Flexible whole foods meal',
        dinner: 'Family-style meal with GMRP principles',
        snacks: ['Seasonal fruits', 'Nuts and seeds']
      }
    };

    return meals[phase as keyof typeof meals] || meals.phase1;
  }

  private getFallbackShoppingList(profile: UserProfile): any {
    return {
      categorizedList: {
        proteins: ['Wild salmon', 'Organic chicken', 'Grass-fed beef'],
        vegetables: ['Organic spinach', 'Broccoli', 'Sweet potatoes'],
        fruits: ['Berries', 'Apples', 'Avocados'],
        pantryStaples: ['Quinoa', 'Chia seeds', 'Extra virgin olive oil']
      },
      estimatedCost: 150,
      budgetTips: ['Buy seasonal produce', 'Purchase proteins in bulk', 'Use frozen vegetables']
    };
  }

  private getFallbackNutritionalAssessment(profile: UserProfile): any {
    return {
      nutritionalGaps: ['Need more fiber tracking data'],
      adherenceScore: 75,
      symptomCorrelations: ['Insufficient data for correlations'],
      recommendations: ['Continue current GMRP protocol', 'Track meals more consistently']
    };
  }

  private getFallbackSupplementGuidance(profile: UserProfile): any {
    return {
      currentAssessment: 'Standard GMRP protocol appropriate',
      missingSupplements: [],
      dosageRecommendations: ['Follow standard GMRP dosing'],
      timing: 'Take supplements with meals',
      brandSuggestions: ['Consult healthcare provider for specific brands']
    };
  }
}

export const nutritionAgent = new NutritionAgent();
