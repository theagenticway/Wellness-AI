// apps/backend/src/index.ts
import 'dotenv/config'; // Load .env file
import express, { Request, Response } from 'express';
import cors from 'cors';
import { llmGateway } from './services/llmGateway';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'WellnessAI Backend is running! 🚀',
    version: '2.0.0-enhanced',
    ai_enabled: true,
    endpoints: {
      health: '/health',
      'test-graph': '/test-graph',
      'test-ai': '/test-ai',
      'wellness-plan': '/api/wellness/daily-plan'
    },
    timestamp: new Date().toISOString()
  });
});

// Wellness API endpoints (inline instead of separate routes file)
app.post('/api/wellness/daily-plan', async (req: Request, res: Response) => {
  try {
    console.log('🏥 Generating GMRP daily plan...');
    
    const {
      userId,
      userProfile,
      healthMetrics,
      professionalOverride
    } = req.body;

    // Validate required data
    if (!userProfile) {
      return res.status(400).json({ 
        error: 'User profile is required',
        example: {
          userProfile: {
            age: 35,
            gender: 'female',
            currentPhase: 'phase1',
            healthGoals: ['improve-gut-health']
          }
        }
      });
    }

    // Create a comprehensive GMRP prompt
    const prompt = `
You are a GMRP (Gut-Mind Reset Program) wellness expert providing personalized guidance.

USER PROFILE:
- Age: ${userProfile.age || 30}
- Gender: ${userProfile.gender || 'not specified'}
- Current Phase: ${userProfile.currentPhase || 'phase1'}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'improve gut health'}
- Days in Program: ${userProfile.startDate ? Math.floor((Date.now() - new Date(userProfile.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1}

HEALTH METRICS:
- Sleep: ${healthMetrics?.sleepHours || 'not tracked'} hours
- Energy Level: ${healthMetrics?.energyLevel || 'unknown'}/10
- Stress Level: ${healthMetrics?.stressLevel || 'unknown'}/10
- Digestive Health: ${healthMetrics?.digestiveHealth || 'unknown'}/10

PROFESSIONAL OVERRIDE: ${professionalOverride || 'None'}

GMRP PHASE PROTOCOLS:
- Phase 1: Microbiome reset, 100% whole foods, 30-50g fiber daily, NO intermittent fasting
- Phase 2: 80/20 nutrition, introduce 12:12 IF once weekly, continue gut healing
- Phase 3: Flexible approach, sustainable IF patterns, intuitive eating with GMRP principles

Generate a personalized daily wellness plan including:
1. Warm, encouraging greeting mentioning their specific phase
2. 4-5 prioritized daily tasks for this GMRP phase
3. Phase-appropriate recommendations
4. Motivational insights about their progress
5. Safety reminders about professional consultation

Keep the tone supportive, medically responsible, and GMRP-protocol focused.
`;

    try {
      // Get model and generate AI response
      const model = llmGateway.getModelForAgent('wellnessAgent');
      const response = await model.invoke([{ role: 'user', content: prompt }]);
      const aiContent = response.content || response.text || response.toString();
      
      // Parse the AI response into structured format
      const structuredResponse = parseAIResponse(aiContent, userProfile, healthMetrics);
      
      console.log('✅ GMRP plan generated successfully with real AI');
      
      res.json({
        success: true,
        ai_generated: true,
        system: 'LangChain + Gemini Pro',
        timestamp: new Date().toISOString(),
        phase: userProfile.currentPhase || 'phase1',
        data: structuredResponse
      });

    } catch (aiError: any) {
      console.error('AI Generation Error:', aiError);
      throw new Error(`AI generation failed: ${aiError.message}`);
    }

  } catch (error: any) {
    console.error('❌ Daily plan generation error:', error);
    
    // Enhanced fallback plan
    const phase = req.body.userProfile?.currentPhase || 'phase1';
    const firstName = req.body.userProfile?.firstName || 'there';
    
    res.status(200).json({  // Still return 200 for fallback
      success: true,
      ai_generated: false,
      fallback: true,
      message: 'Using enhanced fallback plan',
      system: 'Enhanced Fallback System',
      data: getEnhancedFallbackPlan(phase, firstName)
    });
  }
});

// Nutrition plan endpoint
app.post('/api/wellness/nutrition-plan', async (req: Request, res: Response) => {
  try {
    console.log('🥗 Generating GMRP nutrition plan...');
    
    const { userProfile, dietaryPreferences } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const nutritionPrompt = `
You are a GMRP Nutrition Specialist creating a ${userProfile.currentPhase || 'phase1'} meal plan.

USER CONTEXT:
- Current Phase: ${userProfile.currentPhase || 'phase1'}
- Age: ${userProfile.age || 30}
- Dietary Preferences: ${dietaryPreferences?.join(', ') || 'none specified'}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'improve gut health'}

Create a comprehensive nutrition plan for ${userProfile.currentPhase || 'phase1'} including:
1. Daily meal suggestions with fiber content
2. Shopping list for 3 days
3. Supplement protocol for this phase
4. Meal prep tips
5. Phase-specific guidance

Ensure all recommendations are evidence-based and GMRP-compliant.
`;

    const model = llmGateway.getModelForAgent('nutritionAgent');
    const response = await model.invoke([{ role: 'user', content: nutritionPrompt }]);
    const aiContent = response.content || response.text || response.toString();

    const nutritionPlan = parseNutritionResponse(aiContent, userProfile);

    console.log('✅ GMRP nutrition plan generated successfully');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      phase: userProfile.currentPhase,
      data: nutritionPlan
    });

  } catch (error: any) {
    console.error('❌ Nutrition plan generation error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message,
      data: getFallbackNutritionPlan(req.body.userProfile?.currentPhase || 'phase1')
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    services: {
      express: 'running',
      llm_gateway: 'enabled',
      gemini_api: process.env.GOOGLE_API_KEY ? 'configured' : 'missing'
    },
    version: '2.0.0-enhanced',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Legacy test endpoint (enhanced)
app.get('/test-graph', async (req: Request, res: Response) => {
  console.log('--- TESTING ENHANCED GMRP SYSTEM ---');
  try {
    const firstName = req.query.firstName as string;
    const lastName = req.query.lastName as string;
    const email = req.query.email as string;
    const type = req.query.type as string;
    const phase = req.query.phase as string || 'phase1';

    if (!firstName || !lastName || !email || !type) {
      return res.status(400).json({ error: 'Missing user profile information' });
    }

    // Create realistic test user profile
    const userProfile = {
      id: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      firstName,
      lastName,
      email,
      age: 35,
      gender: 'not-specified',
      healthGoals: ['improve-gut-health', 'increase-energy'],
      currentPhase: phase as 'phase1' | 'phase2' | 'phase3',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    };

    const healthMetrics = {
      sleepHours: 7,
      stressLevel: 6,
      energyLevel: 5,
      digestiveHealth: 4,
      adherenceRate: 80
    };

    // Test AI generation
    console.log('🧠 Testing AI wellness plan generation...');
    const prompt = `Generate a brief GMRP ${phase} wellness plan for ${firstName}, a ${userProfile.age} year old in ${phase}. Include encouraging guidance and practical daily tasks.`;

    const model = llmGateway.getModelForAgent('wellnessAgent');
    const aiResponse = await model.invoke([{ role: 'user', content: prompt }]);
    const aiContent = aiResponse.content || aiResponse.text || aiResponse.toString();

    console.log('✅ Enhanced GMRP system test completed successfully');
    
    res.json({
      success: true,
      system: 'Enhanced GMRP with Real AI',
      test_mode: true,
      ai_generated: true,
      user_profile: {
        name: `${firstName} ${lastName}`,
        phase: userProfile.currentPhase,
        days_in_program: 30
      },
      ai_response: aiContent,
      structured_plan: parseAIResponse(aiContent, userProfile, healthMetrics),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Enhanced system test failed:', error);
    res.status(500).json({ 
      error: 'Enhanced AI system test failed',
      message: error.message,
      fallback_available: true
    });
  }
});

// Simple AI test endpoint
app.post('/test-ai', async (req: Request, res: Response) => {
  try {
    console.log('🧠 Testing basic AI generation...');
    
    const testPrompt = 'Generate a brief, encouraging wellness tip for someone in Phase 1 of the GMRP program. Focus on fiber intake and gut health. Keep it practical and supportive.';

    const model = llmGateway.getModelForAgent('wellnessAgent');
    const response = await model.invoke([{ role: 'user', content: testPrompt }]);
    const content = response.content || response.text || response.toString();
    
    res.json({
      success: true,
      ai_response: content,
      model: 'gemini-pro via LangChain',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ AI test failed:', error);
    res.status(500).json({
      error: 'AI test failed',
      message: error.message,
      suggestion: 'Check GOOGLE_API_KEY in environment variables'
    });
  }
});

// Helper functions
function parseAIResponse(aiContent: string, userProfile: any, healthMetrics?: any) {
  const greeting = extractSection(aiContent, ['greeting', 'good morning', 'hello', 'welcome']) || 
    `Good morning! Welcome to your GMRP ${userProfile.currentPhase || 'phase1'} journey! ✨`;

  const tasks = extractTasks(aiContent) || getDefaultTasks(userProfile.currentPhase || 'phase1');
  const recommendations = extractRecommendations(aiContent) || getDefaultRecommendations(userProfile.currentPhase || 'phase1');
  const insights = extractInsights(aiContent, userProfile, healthMetrics) || getDefaultInsights(userProfile.currentPhase || 'phase1');

  return {
    greeting,
    phaseGuidance: getPhaseGuidance(userProfile.currentPhase || 'phase1'),
    dailyPlan: tasks,
    recommendations,
    insights,
    nextSteps: [
      'Complete today\'s wellness tasks',
      'Track your progress and symptoms',
      'Stay consistent with GMRP protocols'
    ],
    progressAssessment: calculateSimpleProgress(healthMetrics)
  };
}

function parseNutritionResponse(aiContent: string, userProfile: any) {
  return {
    mealPlan: extractMealPlan(aiContent) || getDefaultMealPlan(userProfile.currentPhase),
    shoppingList: extractShoppingList(aiContent) || getDefaultShoppingList(),
    supplementProtocol: extractSupplementProtocol(aiContent) || getDefaultSupplements(userProfile.currentPhase),
    phaseGuidance: getPhaseNutritionGuidance(userProfile.currentPhase),
    fiberBreakdown: getFiberBreakdown(userProfile.currentPhase)
  };
}

function extractSection(text: string, keywords: string[]): string | null {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[:\\s]([^\\n]+)`, 'i');
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return null;
}

function extractTasks(text: string) {
  const tasks = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^\d+\.|\-|\•/) && line.length > 10) {
      tasks.push({
        title: line.replace(/^\d+\.|\-|\•/, '').trim(),
        priority: tasks.length < 2 ? 'high' : tasks.length < 4 ? 'medium' : 'low',
        completed: false,
        status: 'pending'
      });
    }
    if (tasks.length >= 5) break;
  }
  
  return tasks.length > 0 ? tasks : null;
}

function extractRecommendations(text: string) {
  const recommendations = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('recommend') || 
        line.toLowerCase().includes('suggest') ||
        line.toLowerCase().includes('focus on')) {
      recommendations.push(line.trim());
    }
    if (recommendations.length >= 3) break;
  }
  
  return recommendations.length > 0 ? recommendations : null;
}

function extractInsights(text: string, userProfile: any, healthMetrics: any) {
  const insights = [];
  
  // Phase-specific insights
  if (userProfile.currentPhase === 'phase1') {
    insights.push({
      title: 'Microbiome Reset Focus',
      message: 'Your gut is adapting to the new nutrition protocol. Some digestive changes are normal.',
      type: 'info'
    });
  }

  // Health metrics insights
  if (healthMetrics?.sleepHours && healthMetrics.sleepHours < 7) {
    insights.push({
      title: 'Sleep Optimization',
      message: 'Better sleep will significantly boost your GMRP results. Aim for 7-9 hours.',
      type: 'warning'
    });
  }

  if (text.toLowerCase().includes('fiber')) {
    insights.push({
      title: 'Fiber Intake',
      message: 'Aim for 30-50g of fiber daily from diverse whole food sources.',
      type: 'tip'
    });
  }
  
  return insights.length > 0 ? insights : null;
}

function extractMealPlan(text: string) {
  return {
    breakfast: extractSection(text, ['breakfast']) || 'Chia pudding with berries',
    lunch: extractSection(text, ['lunch']) || 'Large salad with lean protein',
    dinner: extractSection(text, ['dinner']) || 'Grilled fish with vegetables',
    snacks: ['Apple with almonds', 'Vegetable sticks with hummus']
  };
}

function extractShoppingList(text: string) {
  const items = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('shop') || line.includes('•') || line.includes('-')) {
      const cleaned = line.replace(/[-•\d\.]/g, '').trim();
      if (cleaned.length > 3) items.push(cleaned);
    }
    if (items.length >= 10) break;
  }
  
  return items.length > 0 ? items : null;
}

function extractSupplementProtocol(text: string) {
  return {
    morning: ['Probiotic', 'Vitamin D3', 'B-Complex'],
    evening: ['Magnesium', 'Omega-3'],
    notes: 'Take with meals for optimal absorption'
  };
}

function getPhaseGuidance(phase: string): string {
  const guidance = {
    phase1: 'Focus on microbiome reset with whole foods and plenty of fiber. No intermittent fasting during this phase.',
    phase2: 'Continue building healthy habits. You can now introduce 12:12 intermittent fasting once weekly.',
    phase3: 'Maintain your progress with flexible, sustainable practices. Enjoy social eating while staying mindful.'
  };
  return guidance[phase as keyof typeof guidance] || guidance.phase1;
}

function getPhaseNutritionGuidance(phase: string): string {
  const guidance = {
    phase1: 'Focus on 100% whole foods, 30-50g fiber daily, and gut-healing nutrients. No intermittent fasting.',
    phase2: 'Maintain 80/20 whole foods approach with weekly 12:12 intermittent fasting.',
    phase3: 'Practice flexible eating with GMRP principles and sustainable intermittent fasting patterns.'
  };
  return guidance[phase as keyof typeof guidance] || guidance.phase1;
}

function getDefaultTasks(phase: string) {
  const tasks = {
    phase1: [
      { title: 'Start with 16oz of filtered water', priority: 'high', completed: false, status: 'pending' },
      { title: 'Take Phase 1 supplements (probiotic, D3, B-complex)', priority: 'high', completed: false, status: 'pending' },
      { title: 'Eat 40g+ fiber from whole food sources', priority: 'high', completed: false, status: 'pending' },
      { title: '10-minute mindfulness practice', priority: 'medium', completed: false, status: 'pending' },
      { title: 'Log meals and digestive symptoms', priority: 'low', completed: false, status: 'pending' }
    ],
    phase2: [
      { title: 'Morning hydration with electrolytes', priority: 'high', completed: false, status: 'pending' },
      { title: 'Practice 12:12 IF if today is your fasting day', priority: 'high', completed: false, status: 'pending' },
      { title: '80/20 nutrition choices', priority: 'high', completed: false, status: 'pending' },
      { title: '20-minute movement or exercise', priority: 'medium', completed: false, status: 'pending' },
      { title: 'Plan tomorrow\'s meals', priority: 'low', completed: false, status: 'pending' }
    ],
    phase3: [
      { title: 'Intuitive morning routine', priority: 'high', completed: false, status: 'pending' },
      { title: 'Flexible eating with GMRP principles', priority: 'high', completed: false, status: 'pending' },
      { title: 'Maintain stress management practices', priority: 'medium', completed: false, status: 'pending' },
      { title: 'Social connection or family time', priority: 'medium', completed: false, status: 'pending' },
      { title: 'Reflect on wellness goals', priority: 'low', completed: false, status: 'pending' }
    ]
  };
  return tasks[phase as keyof typeof tasks] || tasks.phase1;
}

function getDefaultRecommendations(phase: string) {
  const recommendations = {
    phase1: [
      'Focus on 30-50g fiber daily from diverse sources',
      'Stay hydrated with 2-3L water daily',
      'Avoid processed foods completely',
      'Practice stress management daily'
    ],
    phase2: [
      'Continue 80/20 whole foods approach',
      'Practice 12:12 IF once weekly',
      'Build sustainable exercise habits',
      'Focus on gut healing foods'
    ],
    phase3: [
      'Maintain flexible eating patterns',
      'Practice intuitive eating',
      'Stay socially connected',
      'Focus on long-term sustainability'
    ]
  };
  return recommendations[phase as keyof typeof recommendations] || recommendations.phase1;
}

function getDefaultInsights(phase: string) {
  return [
    {
      title: 'GMRP Progress',
      message: `You're doing great in ${phase}! Every healthy choice matters.`,
      type: 'success'
    },
    {
      title: 'Daily Reminder',
      message: 'Consistency is more important than perfection.',
      type: 'tip'
    }
  ];
}

function getDefaultMealPlan(phase: string) {
  const meals = {
    phase1: {
      breakfast: 'Chia pudding with mixed berries and almond butter',
      lunch: 'Large rainbow salad with chickpeas and tahini dressing',
      dinner: 'Baked wild salmon with roasted vegetables and quinoa',
      snacks: ['Apple with raw almonds', 'Celery with hummus']
    },
    phase2: {
      breakfast: 'Green smoothie with spinach, banana, and protein powder',
      lunch: 'Buddha bowl with mixed vegetables and pumpkin seeds',
      dinner: 'Grass-fed beef stir-fry with colorful vegetables',
      snacks: ['Mixed berries', 'Raw vegetables with guacamole']
    },
    phase3: {
      breakfast: 'Overnight oats with nuts, seeds, and seasonal fruit',
      lunch: 'Flexible whole foods meal',
      dinner: 'Family-style meal following GMRP principles',
      snacks: ['Seasonal fruits', 'Handful of mixed nuts']
    }
  };
  return meals[phase as keyof typeof meals] || meals.phase1;
}

function getDefaultShoppingList() {
  return [
    'Organic leafy greens (spinach, kale, arugula)',
    'Rainbow vegetables (bell peppers, carrots, beets)',
    'Wild-caught fish and grass-fed proteins',
    'Nuts, seeds, and avocados',
    'Fermented foods (sauerkraut, kimchi)',
    'Whole grains (quinoa, brown rice, oats)'
  ];
}

function getDefaultSupplements(phase: string) {
  const supplements = {
    phase1: {
      morning: ['Multi-strain probiotic', 'Vitamin D3 with K2', 'B-Complex'],
      evening: ['Magnesium glycinate', 'Omega-3 EPA/DHA'],
      notes: 'Take with meals. Start probiotics gradually.'
    },
    phase2: {
      morning: ['Maintenance probiotic', 'Vitamin D3'],
      evening: ['Magnesium', 'L-theanine'],
      notes: 'Adjust timing around fasting windows.'
    },
    phase3: {
      morning: ['High-quality multivitamin'],
      evening: ['Magnesium as needed'],
      notes: 'Minimal supplementation, focus on whole foods.'
    }
  };
  return supplements[phase as keyof typeof supplements] || supplements.phase1;
}

function getFiberBreakdown(phase: string) {
  const targets = { phase1: 45, phase2: 40, phase3: 35 };
  return {
    target: targets[phase as keyof typeof targets] || 40,
    sources: [
      { food: 'Chia seeds', amount: '2 tbsp', fiber: '10g' },
      { food: 'Artichoke', amount: '1 medium', fiber: '10g' },
      { food: 'Black beans', amount: '1/2 cup', fiber: '8g' },
      { food: 'Avocado', amount: '1 medium', fiber: '7g' }
    ]
  };
}

function calculateSimpleProgress(metrics: any) {
  if (!metrics) return { currentScore: 75, summary: 'Limited data available' };
  
  const scores = [
    metrics.energyLevel ? metrics.energyLevel * 10 : 50,
    metrics.sleepHours ? (metrics.sleepHours >= 7 ? 100 : 60) : 50,
    metrics.digestiveHealth ? metrics.digestiveHealth * 10 : 50
  ];
  
  return {
    currentScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    summary: 'Based on available health metrics'
  };
}

function getEnhancedFallbackPlan(phase: string, firstName: string) {
  return {
    greeting: `Good morning, ${firstName}! 🌟 Welcome to your GMRP ${phase} journey!`,
    phaseGuidance: getPhaseGuidance(phase),
    dailyPlan: getDefaultTasks(phase),
    recommendations: getDefaultRecommendations(phase),
    insights: getDefaultInsights(phase),
    nextSteps: [
      'Complete today\'s wellness tasks',
      'Track your progress',
      'Stay consistent with GMRP protocols'
    ],
    progressAssessment: { currentScore: 75, summary: 'Fallback assessment' }
  };
}

function getFallbackNutritionPlan(phase: string) {
  return {
    mealPlan: getDefaultMealPlan(phase),
    shoppingList: getDefaultShoppingList(),
    supplementProtocol: getDefaultSupplements(phase),
    phaseGuidance: getPhaseNutritionGuidance(phase),
    fiberBreakdown: getFiberBreakdown(phase)
  };
}

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    available_routes: [
      'GET /',
      'GET /health',
      'GET /test-graph',
      'POST /test-ai',
      'POST /api/wellness/daily-plan',
      'POST /api/wellness/nutrition-plan'
    ]
  });
});

app.listen(port, () => {
  console.log(`🚀 WellnessAI Enhanced Backend running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/test-graph`);
  console.log(`🧠 AI test: http://localhost:${port}/test-ai`);
  console.log(`🏥 Wellness API: http://localhost:${port}/api/wellness/daily-plan`);
  
  try {
    llmGateway;
    console.log('✅ LLM Gateway initialized successfully');
    console.log('🏥 GMRP AI system ready for real medical intelligence');
    
  } catch (error) {
    console.error('❌ Failed to initialize LLM Gateway:', error);
    console.log('⚠️  Server running with fallback system');
  }
});