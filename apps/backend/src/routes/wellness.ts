// apps/backend/src/routes/wellness.ts
import express, { Request, Response } from 'express';
import { wellnessAgent, UserProfile, HealthMetrics } from '../agents/wellnessAgent';
import { nutritionAgent } from '../agents/nutritionAgent';

const router = express.Router();

// Generate daily wellness plan with real AI
router.post('/daily-plan', async (req: Request, res: Response) => {
  try {
    console.log('🏥 Generating real GMRP daily plan...');
    
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
        fallback: true
      });
    }

    // Ensure userProfile has required structure
    const profile: UserProfile = {
      id: userId || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const metrics: HealthMetrics = {
      weight: healthMetrics?.weight,
      bmi: healthMetrics?.bmi,
      sleepHours: healthMetrics?.sleepHours || 7,
      stressLevel: healthMetrics?.stressLevel || 5,
      energyLevel: healthMetrics?.energyLevel || 6,
      digestiveHealth: healthMetrics?.digestiveHealth || 6,
      adherenceRate: healthMetrics?.adherenceRate || 75
    };

    // Generate real AI-powered plan
    const dailyPlan = await wellnessAgent.generatePersonalizedPlan(
      profile,
      metrics,
      professionalOverride
    );

    console.log('✅ Real GMRP plan generated successfully');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      phase: profile.currentPhase,
      data: dailyPlan
    });

  } catch (error) {
    console.error('❌ Daily plan generation error:', error);
    
    // Return fallback plan on error
    res.status(500).json({
      error: 'AI generation failed',
      fallback: true,
      message: 'Using fallback plan while AI service is unavailable',
      data: {
        greeting: 'Welcome to your GMRP journey! 🌟',
        phaseGuidance: 'Focus on whole foods and hydration today.',
        dailyPlan: [
          { title: 'Start with 16oz filtered water', completed: false, status: 'pending', priority: 'high' },
          { title: 'Take morning supplements', completed: false, status: 'pending', priority: 'high' },
          { title: 'Prepare nutrient-dense breakfast', completed: false, status: 'pending', priority: 'medium' }
        ],
        insights: [
          {
            title: 'GMRP Focus',
            message: 'Every healthy choice supports your gut-mind connection.',
            type: 'info'
          }
        ],
        recommendations: ['Stay hydrated', 'Focus on fiber'],
        nextSteps: ['Continue current protocols'],
        safetyAlerts: []
      }
    });
  }
});

// Generate nutrition plan with real AI
router.post('/nutrition-plan', async (req: Request, res: Response) => {
  try {
    console.log('🥗 Generating real GMRP nutrition plan...');
    
    const {
      userProfile,
      dietaryPreferences,
      professionalOverride
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const nutritionPlan = await nutritionAgent.generateMealPlan(
      profile,
      dietaryPreferences || [],
      professionalOverride
    );

    console.log('✅ Real GMRP nutrition plan generated successfully');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      phase: profile.currentPhase,
      data: nutritionPlan
    });

  } catch (error) {
    console.error('❌ Nutrition plan generation error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Shopping list generation
router.post('/shopping-list', async (req: Request, res: Response) => {
  try {
    const {
      userProfile,
      mealPlan,
      householdSize
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const shoppingList = await nutritionAgent.generateShoppingList(
      profile,
      mealPlan,
      householdSize || 1
    );

    res.json({
      success: true,
      ai_generated: true,
      data: shoppingList
    });

  } catch (error) {
    console.error('❌ Shopping list generation error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Progress assessment
router.post('/assess-progress', async (req: Request, res: Response) => {
  try {
    console.log('📊 Generating real GMRP progress assessment...');
    
    const {
      userProfile,
      recentActivities,
      healthMetrics
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const metrics: HealthMetrics = {
      weight: healthMetrics?.weight,
      bmi: healthMetrics?.bmi,
      sleepHours: healthMetrics?.sleepHours,
      stressLevel: healthMetrics?.stressLevel,
      energyLevel: healthMetrics?.energyLevel,
      digestiveHealth: healthMetrics?.digestiveHealth,
      adherenceRate: healthMetrics?.adherenceRate
    };

    const progressAssessment = await wellnessAgent.assessProgress(
      profile,
      recentActivities || [],
      metrics
    );

    console.log('✅ Real GMRP progress assessment completed');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      data: progressAssessment
    });

  } catch (error) {
    console.error('❌ Progress assessment error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Phase transition guidance
router.post('/phase-transition', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Generating phase transition guidance...');
    
    const {
      userProfile,
      readinessScore
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const transitionGuidance = await wellnessAgent.generatePhaseTransitionGuidance(
      profile,
      readinessScore || 75
    );

    console.log('✅ Phase transition guidance generated');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      data: transitionGuidance
    });

  } catch (error) {
    console.error('❌ Phase transition guidance error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Nutritional assessment
router.post('/nutrition-assessment', async (req: Request, res: Response) => {
  try {
    console.log('🔬 Performing nutritional assessment...');
    
    const {
      userProfile,
      recentMeals,
      symptoms
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const nutritionalAssessment = await nutritionAgent.assessNutritionalNeeds(
      profile,
      recentMeals || [],
      symptoms || []
    );

    console.log('✅ Nutritional assessment completed');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      data: nutritionalAssessment
    });

  } catch (error) {
    console.error('❌ Nutritional assessment error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Supplement guidance
router.post('/supplement-guidance', async (req: Request, res: Response) => {
  try {
    console.log('💊 Generating supplement guidance...');
    
    const {
      userProfile,
      currentSupplements,
      healthMetrics
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

    const profile: UserProfile = {
      id: userProfile.id || 'anonymous',
      age: userProfile.age || 30,
      gender: userProfile.gender || 'not-specified',
      healthGoals: userProfile.healthGoals || ['improve-gut-health'],
      currentPhase: userProfile.currentPhase || 'phase1',
      startDate: userProfile.startDate ? new Date(userProfile.startDate) : new Date(),
      healthConditions: userProfile.healthConditions || [],
      medications: userProfile.medications || [],
      preferences: {
        dietary: userProfile.preferences?.dietary || [],
        exercise: userProfile.preferences?.exercise || [],
        communication: userProfile.preferences?.communication || 'standard'
      }
    };

    const supplementGuidance = await nutritionAgent.generateSupplementGuidance(
      profile,
      currentSupplements || [],
      healthMetrics || {}
    );

    console.log('✅ Supplement guidance generated');
    
    res.json({
      success: true,
      ai_generated: true,
      timestamp: new Date().toISOString(),
      data: supplementGuidance
    });

  } catch (error) {
    console.error('❌ Supplement guidance error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Health check endpoint for the wellness service
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'WellnessAI GMRP Service',
    ai_enabled: true,
    timestamp: new Date().toISOString(),
    version: '2.0.0-gemini-enhanced'
  });
});

export default router;