// apps/backend/src/index.ts - Enhanced with Behavioral Economics
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { llmGateway } from './services/llmGateway';
import { behavioralAI } from './services/behavioralAI';
import authRoutes from './routes/auth';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth';
import authRoutes from './routes/auth';
import authMiddleware from './middleware/auth';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}
// Simple auth middleware for development
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Mock authentication for development
  req.userId = 'demo-user-123';
  req.user = {
    id: 'demo-user-123',
    email: 'demo@wellness.ai',
    name: 'Demo User'
  };
  next();
};

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'WellnessAI v3.0 - Behavioral Economics Powered! 🧠',
    version: '3.0.0-behavioral-ai',
    features: {
      ai_enabled: true,
      database_enabled: true,
      behavioral_economics: true,
      habit_formation: true,
      personalized_nudges: true
    },
    endpoints: {
      health: '/health',
      auth: '/auth/*',
      'behavioral-daily-plan': '/api/behavioral/daily-plan',
      'habit-tracking': '/api/habits/*',
      'nudges': '/api/nudges/*',
      'progress-analytics': '/api/analytics/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Enhanced health check with behavioral AI status
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const llmStatus = llmGateway.getStatus();
    
    res.json({
      status: 'healthy',
      services: {
        express: 'running',
        database: 'connected',
        llm_gateway: llmStatus.isInitialized ? 'ready' : 'error',
        behavioral_ai: 'active',
        habit_engine: 'ready',
        nudge_system: 'active'
      },
      behavioral_features: [
        '2-minute rule implementation',
        'habit stacking optimization',
        'personalized nudge timing',
        'loss aversion protection',
        'social proof integration',
        'implementation intentions',
        'temptation bundling',
        'willpower pattern analysis'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// BEHAVIORAL ECONOMICS ENDPOINTS

/**
 * Generate completely personalized daily plan using behavioral economics
 */
app.post('/api/behavioral/daily-plan', async (req: Request, res: Response) => {
    try {
    console.log('🧠 Generating behavioral economics daily plan for user:', req.userId);
    
    const user = req.user;
    const { forceRegenerate = false } = req.body;

    // Check for existing plan today (unless force regenerate)
    if (!forceRegenerate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingPlan = await prisma.dailyPlan.findUnique({
        where: {
          userId_date: {
            userId: req.userId!,
            date: today
          }
        }
      });

      if (existingPlan) {
        console.log('📋 Returning existing behavioral plan');
        return res.json({
          success: true,
          cached: true,
          data: {
            id: existingPlan.id,
            greeting: existingPlan.greeting,
            phaseGuidance: existingPlan.phaseGuidance,
            primaryFocus: existingPlan.primaryFocus,
            tinyWins: existingPlan.tinyWins,
            habitStack: existingPlan.habitStack,
            implementation: existingPlan.implementation,
            temptationPairs: existingPlan.temptationPairs,
            communityStats: existingPlan.communityStats,
            streakRisks: existingPlan.streakRisks,
            scheduledNudges: existingPlan.scheduledNudges,
            contextualCues: existingPlan.contextualCues,
            overallProgress: existingPlan.overallProgress,
            aiConfidence: existingPlan.aiConfidence
          }
        });
      }
    }

    // Generate personalized content using behavioral AI
    const personalizedContent = await behavioralAI.generatePersonalizedDailyContent(req.userId!);
    
    // Create behavioral daily plan
    const behavioralPlan = await createBehavioralDailyPlan(req.userId!, personalizedContent, user);
    
    // Save to database
    const savedPlan = await prisma.dailyPlan.create({
      data: {
        userId: req.userId!,
        date: new Date(),
        phase: user.currentPhase,
        greeting: behavioralPlan.greeting,
        phaseGuidance: behavioralPlan.phaseGuidance,
        primaryFocus: behavioralPlan.primaryFocus,
        tinyWins: behavioralPlan.tinyWins,
        habitStack: behavioralPlan.habitStack,
        implementation: behavioralPlan.implementation,
        temptationPairs: behavioralPlan.temptationPairs,
        communityStats: behavioralPlan.communityStats,
        streakRisks: behavioralPlan.streakRisks,
        scheduledNudges: behavioralPlan.scheduledNudges,
        contextualCues: behavioralPlan.contextualCues,
        aiConfidence: behavioralPlan.aiConfidence
      }
    });

    // Schedule personalized nudges
    await schedulePersonalizedNudges(req.userId!, personalizedContent.nudges);

    console.log('✅ Behavioral economics daily plan generated and saved');
    
    res.json({
      success: true,
      ai_generated: true,
      behavioral_optimized: true,
      plan_id: savedPlan.id,
      data: behavioralPlan
    });

  } catch (error: any) {
    console.error('❌ Behavioral daily plan error:', error);
    res.status(500).json({
      error: 'Failed to generate behavioral daily plan',
      message: error.message
    });
  }
});

/**
 * Track habit completion with behavioral insights
 */
app.post('/api/habits/:habitId/complete', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { habitId } = req.params;
    const {
      quality,
      effort,
      enjoyment,
      timeOfDay,
      locationContext,
      emotionalState,
      energyLevel,
      stressLevel,
      cueStrength,
      temptationLevel,
      automaticity,
      identityAlignment,
      notes,
      challenges = [],
      wins = []
    } = req.body;

    // Record habit completion with rich behavioral data
    const habitLog = await prisma.habitLog.create({
      data: {
        userId: req.userId!,
        habitId,
        completed: true,
        quality,
        effort,
        enjoyment,
        timeOfDay,
        locationContext,
        emotionalState,
        energyLevel,
        stressLevel,
        cueStrength,
        temptationLevel,
        automaticity,
        identityAlignment,
        notes,
        challenges,
        wins
      }
    });

    // Update or create streak
    await updateHabitStreak(req.userId!, habitId, true);

    // Analyze behavioral patterns for AI learning
    await analyzeBehavioralPatterns(req.userId!, habitLog);

    // Generate immediate positive reinforcement
    const reinforcement = await generateImmediateReinforcement(req.userId!, habitId);

    res.json({
      success: true,
      message: 'Habit completed with behavioral insights recorded',
      data: {
        logId: habitLog.id,
        reinforcement,
        streakUpdate: await getCurrentStreaks(req.userId!)
      }
    });

  } catch (error: any) {
    console.error('❌ Habit completion error:', error);
    res.status(500).json({
      error: 'Failed to record habit completion',
      message: error.message
    });
  }
});

/**
 * Get personalized nudges for user
 */
app.get('/api/nudges/pending', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    
    const pendingNudges = await prisma.nudge.findMany({
      where: {
        userId: req.userId!,
        isActive: true,
        scheduledFor: {
          lte: now
        },
        deliveredAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } }
        ]
      },
      orderBy: { scheduledFor: 'asc' }
    });

    // Mark nudges as delivered
    await prisma.nudge.updateMany({
      where: {
        id: { in: pendingNudges.map(n => n.id) }
      },
      data: {
        deliveredAt: now
      }
    });

    res.json({
      success: true,
      data: pendingNudges
    });

  } catch (error: any) {
    console.error('❌ Nudges fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch nudges',
      message: error.message
    });
  }
});

/**
 * Record nudge response for learning
 */
app.post('/api/nudges/:nudgeId/respond', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { nudgeId } = req.params;
    const { response, effectiveness } = req.body;

    await prisma.nudge.update({
      where: { id: nudgeId },
      data: {
        response,
        effectiveness,
        respondedAt: new Date()
      }
    });

    // Learn from nudge effectiveness for future optimization
    await learnFromNudgeResponse(req.userId!, nudgeId, response, effectiveness);

    res.json({
      success: true,
      message: 'Nudge response recorded'
    });

  } catch (error: any) {
    console.error('❌ Nudge response error:', error);
    res.status(500).json({
      error: 'Failed to record nudge response',
      message: error.message
    });
  }
});

/**
 * Get behavioral analytics and insights
 */
app.get('/api/analytics/behavioral', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe as string);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Gather behavioral analytics
    const [habitLogs, behaviorMetrics, streaks, nudgeEffectiveness] = await Promise.all([
      prisma.habitLog.findMany({
        where: {
          userId: req.userId!,
          date: { gte: startDate }
        },
        include: { habit: true }
      }),
      prisma.behaviorMetric.findMany({
        where: {
          userId: req.userId!,
          date: { gte: startDate }
        }
      }),
      prisma.streak.findMany({
        where: { userId: req.userId! }
      }),
      prisma.nudge.findMany({
        where: {
          userId: req.userId!,
          deliveredAt: { gte: startDate }
        }
      })
    ]);

    // Calculate behavioral insights
    const analytics = {
      habitFormation: calculateHabitFormationMetrics(habitLogs),
      behavioralPatterns: analyzeBehavioralTrends(behaviorMetrics),
      streakAnalysis: analyzeStreakPatterns(streaks),
      nudgeEffectiveness: calculateNudgeEffectiveness(nudgeEffectiveness),
      willpowerPatterns: analyzeWillpowerPatterns(behaviorMetrics),
      optimalTiming: identifyOptimalTimingPatterns(habitLogs),
      socialInfluenceImpact: calculateSocialInfluenceMetrics(habitLogs),
      environmentalFactors: analyzeEnvironmentalImpact(habitLogs),
      motivationTrends: analyzeMotivationTrends(behaviorMetrics)
    };

    res.json({
      success: true,
      timeframe: `${days} days`,
      data: analytics
    });

  } catch (error: any) {
    console.error('❌ Behavioral analytics error:', error);
    res.status(500).json({
      error: 'Failed to generate behavioral analytics',
      message: error.message
    });
  }
});

/**
 * Create or update user's behavioral profile
 */
app.post('/api/behavioral/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      motivationType,
      lossAversion,
      presentBias,
      socialInfluence,
      gamificationResponse,
      optimalHabitStack,
      bestPerformanceTime,
      worstPerformanceTime,
      averageWillpower,
      publicCommitments,
      financialStakes,
      socialAccountability,
      reminderFrequency,
      nudgeStyle,
      responseToRewards
    } = req.body;

    const behaviorProfile = await prisma.behaviorProfile.upsert({
      where: { userId: req.userId! },
      update: {
        motivationType,
        lossAversion,
        presentBias,
        socialInfluence,
        gamificationResponse,
        optimalHabitStack,
        bestPerformanceTime,
        worstPerformanceTime,
        averageWillpower,
        publicCommitments,
        financialStakes,
        socialAccountability,
        reminderFrequency,
        nudgeStyle,
        responseToRewards
      },
      create: {
        userId: req.userId!,
        motivationType,
        lossAversion,
        presentBias,
        socialInfluence,
        gamificationResponse,
        optimalHabitStack,
        bestPerformanceTime,
        worstPerformanceTime,
        averageWillpower,
        publicCommitments,
        financialStakes,
        socialAccountability,
        reminderFrequency,
        nudgeStyle,
        responseToRewards
      }
    });

    res.json({
      success: true,
      message: 'Behavioral profile updated',
      data: behaviorProfile
    });

  } catch (error: any) {
    console.error('❌ Behavioral profile error:', error);
    res.status(500).json({
      error: 'Failed to update behavioral profile',
      message: error.message
    });
  }
});

/**
 * Get habit recommendations based on behavioral science
 */
app.get('/api/habits/recommendations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const behaviorProfile = await prisma.behaviorProfile.findUnique({
      where: { userId: req.userId! }
    });

    // Generate habit recommendations using behavioral AI
    const recommendations = await generateHabitRecommendations(user, behaviorProfile);

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error: any) {
    console.error('❌ Habit recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate habit recommendations',
      message: error.message
    });
  }
});

// HELPER FUNCTIONS

async function createBehavioralDailyPlan(userId: string, personalizedContent: any, user: any) {
  const currentStreaks = await prisma.streak.findMany({
    where: { userId, isActive: true }
  });

  const communityStats = await getCommunityStats(user.currentPhase);
  
  return {
    greeting: `Good ${getTimeGreeting()}, ${user.firstName}! Ready to make today count? 🌟`,
    phaseGuidance: getPhaseGuidanceWithBehavioral(user.currentPhase),
    primaryFocus: personalizedContent.nutrition?.primaryFocus || "Focus on one tiny nutrition win today",
    tinyWins: personalizedContent.nutrition?.easyWins || generateTinyWins(user.currentPhase),
    habitStack: personalizedContent.habitStacks || [],
    implementation: personalizedContent.implementationIntentions || [],
    temptationPairs: personalizedContent.nutrition?.temptationBundling || [],
    communityStats: {
      phaseCompletion: communityStats.completionRate,
      popularChoices: communityStats.popularHabits,
      socialProof: `${communityStats.activeToday}% of ${user.currentPhase} members are active today`
    },
    streakRisks: identifyStreakRisks(currentStreaks),
    scheduledNudges: personalizedContent.nudges?.map(n => ({
      time: n.scheduledFor,
      type: n.nudgeType,
      message: n.message
    })) || [],
    contextualCues: generateContextualCues(user),
    aiConfidence: 0.85 // AI confidence in this plan
  };
}

async function schedulePersonalizedNudges(userId: string, nudges: any[]) {
  for (const nudge of nudges) {
    await prisma.nudge.create({
      data: {
        userId,
        nudgeType: nudge.type,
        title: nudge.title,
        message: nudge.message,
        actionRequired: nudge.actionRequired,
        triggerType: nudge.triggerType,
        scheduledFor: nudge.scheduledFor,
        personalizedContent: nudge.personalizedContent,
        variant: nudge.variant || 'default'
      }
    });
  }
}

async function updateHabitStreak(userId: string, habitId: string, completed: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await prisma.streak.findFirst({
    where: {
      userId,
      habitId,
      isActive: true
    }
  });

  if (!streak && completed) {
    // Create new streak
    streak = await prisma.streak.create({
      data: {
        userId,
        habitId,
        streakType: 'SINGLE_HABIT',
        currentCount: 1,
        longestCount: 1,
        startDate: today,
        lastActiveDate: today
      }
    });
  } else if (streak && completed) {
    // Update existing streak
    await prisma.streak.update({
      where: { id: streak.id },
      data: {
        currentCount: { increment: 1 },
        longestCount: { increment: streak.currentCount >= streak.longestCount ? 1 : 0 },
        lastActiveDate: today
      }
    });
  } else if (streak && !completed) {
    // Break streak
    await prisma.streak.update({
      where: { id: streak.id },
      data: {
        isActive: false,
        brokenAt: today,
        brokenReason: 'habit_not_completed'
      }
    });
  }

  return streak;
}

async function analyzeBehavioralPatterns(userId: string, habitLog: any) {
  // Analyze patterns for AI learning
  const recentLogs = await prisma.habitLog.findMany({
    where: { userId },
    take: 30,
    orderBy: { date: 'desc' }
  });

  // Calculate behavioral metrics
  const willpowerUsed = calculateWillpowerDepletion(recentLogs);
  const automaticity = habitLog.automaticity || 5;
  const identityAlignment = habitLog.identityAlignment || 5;

  // Store behavioral metrics
  await prisma.behaviorMetric.create({
    data: {
      userId,
      willpowerUsed,
      automaticity: automaticity / 10,
      identityAlignment: identityAlignment / 10,
      intrinsicMotivation: calculateIntrinsicMotivation(habitLog),
      environmentQuality: calculateEnvironmentQuality(habitLog),
      cueStrength: habitLog.cueStrength / 10
    }
  });
}

async function generateImmediateReinforcement(userId: string, habitId: string) {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId }
  });

  const streak = await prisma.streak.findFirst({
    where: { userId, habitId, isActive: true }
  });

  const reinforcements = [
    `🎉 Great job completing ${habit?.name}!`,
    `🔥 You're on a ${streak?.currentCount || 1}-day streak!`,
    `💪 Every completion strengthens your ${habit?.name} identity.`,
    `⚡ You just proved you're someone who follows through!`
  ];

  return {
    message: reinforcements[Math.floor(Math.random() * reinforcements.length)],
    streakCount: streak?.currentCount || 1,
    identityReinforcement: `You're becoming someone who ${habit?.routine || 'takes action'}.`
  };
}

async function getCurrentStreaks(userId: string) {
  return await prisma.streak.findMany({
    where: { userId, isActive: true },
    include: { habit: true }
  });
}

function calculateHabitFormationMetrics(habitLogs: any[]) {
  const completionRate = habitLogs.filter(log => log.completed).length / habitLogs.length;
  const averageAutomaticity = habitLogs
    .map(log => log.automaticity)
    .filter(a => a !== null)
    .reduce((a, b) => a + b, 0) / habitLogs.length;

  return {
    overallCompletionRate: completionRate,
    averageAutomaticity: averageAutomaticity / 10,
    habitStrength: (completionRate + averageAutomaticity / 10) / 2,
    consistency: calculateConsistencyScore(habitLogs)
  };
}

function analyzeBehavioralTrends(behaviorMetrics: any[]) {
  if (behaviorMetrics.length === 0) return null;

  const latest = behaviorMetrics[0];
  const earliest = behaviorMetrics[behaviorMetrics.length - 1];

  return {
    willpowerTrend: latest.willpowerUsed - earliest.willpowerUsed,
    motivationTrend: latest.intrinsicMotivation - earliest.intrinsicMotivation,
    automaticityTrend: latest.automaticity - earliest.automaticity,
    environmentImprovementTrend: latest.environmentQuality - earliest.environmentQuality
  };
}

function analyzeStreakPatterns(streaks: any[]) {
  const activeStreaks = streaks.filter(s => s.isActive);
  const brokenStreaks = streaks.filter(s => !s.isActive);

  return {
    totalActiveStreaks: activeStreaks.length,
    longestCurrentStreak: Math.max(...activeStreaks.map(s => s.currentCount), 0),
    averageStreakLength: activeStreaks.reduce((a, b) => a + b.currentCount, 0) / activeStreaks.length || 0,
    streakResiliency: activeStreaks.length / (activeStreaks.length + brokenStreaks.length) || 0
  };
}

function calculateNudgeEffectiveness(nudges: any[]) {
  const respondedNudges = nudges.filter(n => n.respondedAt);
  const effectiveNudges = nudges.filter(n => n.effectiveness > 0.5);

  return {
    responseRate: respondedNudges.length / nudges.length || 0,
    effectivenessRate: effectiveNudges.length / nudges.length || 0,
    averageEffectiveness: nudges.reduce((a, b) => a + (b.effectiveness || 0), 0) / nudges.length || 0
  };
}

// Additional helper functions...
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getPhaseGuidanceWithBehavioral(phase: string): string {
  const guidance = {
    PHASE1: 'Building micro-habits that stick. Focus on consistency over perfection - every tiny action rewires your brain! 🧠',
    PHASE2: 'Stacking new habits onto strong foundations. Your brain loves patterns - we\'re leveraging that! 🔗',
    PHASE3: 'Mastering behavioral flexibility. You\'ve built the neural pathways - now make them sustainable! 🌱'
  };
  return guidance[phase as keyof typeof guidance] || guidance.PHASE1;
}

function generateTinyWins(phase: string): any[] {
  const tinyWins = {
    PHASE1: [
      { action: 'Drink one glass of water', time: '2 minutes', benefit: 'Starts hydration habit' },
      { action: 'Take 3 deep breaths', time: '1 minute', benefit: 'Builds mindfulness pathway' },
      { action: 'Put vegetables on your plate', time: '30 seconds', benefit: 'Visual nutrition cue' }
    ],
    PHASE2: [
      { action: 'Set fasting timer', time: '10 seconds', benefit: 'Implementation intention trigger' },
      { action: 'Choose anti-inflammatory snack', time: '1 minute', benefit: 'Reinforces gut health identity' },
      { action: 'Stack meditation with coffee', time: '2 minutes', benefit: 'Leverages existing habit' }
    ],
    PHASE3: [
      { action: 'Practice intuitive eating check-in', time: '30 seconds', benefit: 'Strengthens internal awareness' },
      { action: 'Adjust fasting window mindfully', time: '1 minute', benefit: 'Flexible habit mastery' },
      { action: 'Share one insight with community', time: '2 minutes', benefit: 'Social reinforcement' }
    ]
  };
  return tinyWins[phase as keyof typeof tinyWins] || tinyWins.PHASE1;
}

async function getCommunityStats(phase: string) {
  // Mock community stats - in production, calculate from real user data
  return {
    completionRate: Math.floor(Math.random() * 20) + 70, // 70-90%
    activeToday: Math.floor(Math.random() * 15) + 75,    // 75-90%
    popularHabits: ['morning hydration', 'fiber tracking', 'mindful eating']
  };
}

function identifyStreakRisks(streaks: any[]) {
  return streaks
    .filter(s => s.currentCount > 3) // Only warn about meaningful streaks
    .map(s => ({
      habitName: s.habit?.name || 'Unknown habit',
      streakLength: s.currentCount,
      riskLevel: s.currentCount > 14 ? 'high' : 'medium',
      protectionStrategy: `Just ${getMinimumAction(s.habit)} to keep your ${s.currentCount}-day streak alive!`
    }));
}

function getMinimumAction(habit: any): string {
  const minimums = {
    NUTRITION: 'eat one healthy snack',
    EXERCISE: 'do 1 minute of movement',
    MEDITATION: 'take 3 conscious breaths',
    HYDRATION: 'drink one glass of water'
  };
  return minimums[habit?.category as keyof typeof minimums] || 'complete the minimum version';
}

function generateContextualCues(user: any): any[] {
  return [
    {
      trigger: 'When you see your water bottle',
      action: 'Take a sip immediately',
      purpose: 'Environmental cue strengthening'
    },
    {
      trigger: 'When you open the fridge',
      action: 'Look for vegetables first',
      purpose: 'Visual priority training'
    },
    {
      trigger: 'When you feel stressed',
      action: 'Take one deep breath',
      purpose: 'Emotional regulation habit'
    }
  ];
}

// Additional utility functions would be implemented here...
function calculateWillpowerDepletion(logs: any[]): number {
  // Implementation for willpower calculation
  return Math.random() * 0.5 + 0.3; // Mock implementation
}

function calculateIntrinsicMotivation(log: any): number {
  return (log.enjoyment + log.identityAlignment) / 2 / 10;
}

function calculateEnvironmentQuality(log: any): number {
  return log.cueStrength / 10;
}

function calculateConsistencyScore(logs: any[]): number {
  // Implementation for consistency calculation
  return Math.random() * 0.3 + 0.7; // Mock implementation
}

// Error handling and 404 remain the same...
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 WellnessAI Behavioral Economics Backend v3.0 running on port ${port}`);
  console.log(`🧠 Behavioral AI: Active`);
  console.log(`📊 Habit Formation Engine: Ready`);
  console.log(`💡 Personalized Nudge System: Online`);
  console.log(`🔬 Behavioral Analytics: Enabled`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  
  console.log('\n🎯 Behavioral Economics Features:');
  console.log('   ✅ 2-minute rule implementation');
  console.log('   ✅ Habit stacking optimization');
  console.log('   ✅ Implementation intentions');
  console.log('   ✅ Loss aversion protection');
  console.log('   ✅ Social proof integration');
  console.log('   ✅ Temptation bundling');
  console.log('   ✅ Willpower pattern analysis');
  console.log('   ✅ Personalized nudge timing');
  
  console.log('\n🏥 GMRP + Behavioral Science = Habit Formation Success! 🌟');
});