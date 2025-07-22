import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email in database
    console.log('🔍 Looking up user in database...');
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    console.log('👤 User found:', user ? `${user.firstName} ${user.lastName} (${user.email})` : 'NOT FOUND');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.type 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      token,
      user: userWithoutPassword,
      requiresOnboarding: !user.onboardingCompleted
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        type: 'MEMBER',
        currentPhase: 'PHASE1',
        onboardingCompleted: false,
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.type 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
      requiresOnboarding: !newUser.onboardingCompleted
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Complete registration endpoint (atomic user creation with full onboarding)
router.post('/register-complete', async (req: Request, res: Response) => {
  try {
    const { auth, personalInfo, healthInfo, behaviorProfile, lifestyle, preferences } = req.body;

    // Validate auth data
    if (!auth.firstName || !auth.lastName || !auth.email || !auth.password) {
      return res.status(400).json({
        success: false,
        message: 'All authentication fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: auth.email.toLowerCase() }
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(auth.password, 10);

    // Step 1: Create user and profiles in transaction (fast)
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user with all data atomically
      const user = await tx.user.create({
        data: {
          firstName: auth.firstName,
          lastName: auth.lastName,
          email: auth.email.toLowerCase(),
          password: hashedPassword,
          type: 'MEMBER',
          currentPhase: healthInfo.currentPhase.toUpperCase() as any,
          healthGoals: healthInfo.primaryGoals,
          onboardingCompleted: true, // User is fully onboarded
        }
      });

      // Create health profile
      await tx.healthProfile.create({
        data: {
          userId: user.id,
          age: personalInfo.age,
          gender: personalInfo.gender,
          weight: healthInfo.currentWeight,
          height: healthInfo.height,
          healthConditions: healthInfo.healthConditions || [],
          medications: healthInfo.medications || [],
          allergies: healthInfo.allergies || [],
        }
      });

      // Create behavior profile with comprehensive data
      await tx.behaviorProfile.create({
        data: {
          userId: user.id,
          // Behavioral Economics Profile
          motivationType: behaviorProfile.motivationType.toUpperCase() as any,
          lossAversion: behaviorProfile.lossAversion,
          presentBias: behaviorProfile.presentBias,
          socialInfluence: behaviorProfile.socialInfluence,
          gamificationResponse: behaviorProfile.gamificationResponse,
          
          // Habit Formation Preferences
          bestPerformanceTime: mapTimePreferences(behaviorProfile.bestPerformanceTime) as any,
          averageWillpower: 5.0,
          willpowerPattern: { steady: true }, // JSON field
          
          // Commitment Devices
          publicCommitments: behaviorProfile.publicCommitments || false,
          socialAccountability: behaviorProfile.socialAccountability || false,
          
          // Nudge Preferences
          reminderFrequency: (behaviorProfile.reminderFrequency || 'MODERATE').toUpperCase() as any,
          nudgeStyle: (behaviorProfile.nudgeStyle || 'ENCOURAGING').toUpperCase() as any,
          
          // Behavioral Patterns (will be learned by AI over time)
          personalTriggers: lifestyle.mainChallenges || [],
        }
      });

      return user;
    });

    // Step 2: Mark user as pending AI generation
    await prisma.user.update({
      where: { id: newUser.id },
      data: { 
        // Add aiGenerationStatus field or use a flag
        // For now, we'll use onboardingCompleted: false to indicate AI is pending
        onboardingCompleted: false
      }
    });

    // Step 3: Trigger async AI generation (don't wait for it)
    console.log('🚀 Triggering async AI generation for:', newUser.firstName);
    generateUserPlanAsync(newUser.id, {
      user: newUser,
      healthProfile: { age: personalInfo.age, gender: personalInfo.gender, healthGoals: healthInfo.primaryGoals },
      behaviorProfile: behaviorProfile,
      lifestyle: lifestyle,
      preferences: preferences
    }).catch(error => {
      console.error('❌ Async AI generation failed for user:', newUser.id, error);
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.type 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
      requiresOnboarding: false,
      aiGenerating: true // Indicates AI is generating plan in background
    });
    
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// Helper functions for AI personalization
function mapTimePreferences(timePreferences: string[]): string[] {
  const timeMapping: { [key: string]: string } = {
    'Early Morning (5-7 AM)': 'EARLY_MORNING',
    'Morning (7-10 AM)': 'MORNING',
    'Late Morning (10-12 PM)': 'LATE_MORNING',
    'Early Afternoon (12-3 PM)': 'EARLY_AFTERNOON',
    'Late Afternoon (3-6 PM)': 'LATE_AFTERNOON',
    'Evening (6-9 PM)': 'EARLY_EVENING',
    'Night (9 PM+)': 'EVENING'
  };
  
  return timePreferences.map(time => timeMapping[time] || 'MORNING');
}

function calculateChangeReadiness(behaviorProfile: any, lifestyle: any): number {
  let score = 5; // Base score
  
  if (behaviorProfile.motivationType === 'intrinsic') score += 2;
  if (lifestyle.stressLevel <= 5) score += 1;
  if (lifestyle.timeAvailability !== '5-10') score += 1;
  if (lifestyle.exerciseExperience !== 'beginner') score += 1;
  
  return Math.min(Math.max(score, 1), 10);
}

function generateImplementationIntentions(goals: string[], timeAvailability: string): string[] {
  const intentions: string[] = [];
  
  if (goals.includes('Better Sleep')) {
    intentions.push('When I finish dinner, I will set a phone alarm for 30 minutes before my target bedtime');
  }
  if (goals.includes('More Energy')) {
    intentions.push(`When I wake up, I will do 5 minutes of light movement before checking my phone`);
  }
  if (goals.includes('Stress Management')) {
    intentions.push('When I feel overwhelmed, I will take 3 deep breaths and remind myself of one thing I can control');
  }
  
  return intentions;
}

function generateHabitStacking(lifestyle: any): string[] {
  const stacks: string[] = [];
  
  if (lifestyle.sleepSchedule.bedtime) {
    stacks.push('After I brush my teeth, I will write down one positive thing from my day');
  }
  if (lifestyle.exerciseExperience === 'beginner') {
    stacks.push('After I have my morning coffee, I will do 2 minutes of stretching');
  }
  
  return stacks;
}

async function generatePersonalizedDailyPlan(data: any) {
  const { user, healthProfile, behaviorProfile, lifestyle, preferences } = data;
  
  try {
    // Import the wellness agent for AI generation
    const { wellnessAgent } = await import('../agents/wellnessAgent');
    
    // Create comprehensive user profile for AI
    const aiUserProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: healthProfile.age,
      gender: healthProfile.gender,
      healthGoals: healthProfile.healthGoals,
      currentPhase: user.currentPhase.toLowerCase(),
      startDate: new Date(),
      healthConditions: [],
      medications: [],
      preferences: {
        dietary: [],
        exercise: [lifestyle.exerciseExperience],
        communication: preferences.communicationStyle || 'encouraging'
      }
    };

    // Create health metrics from onboarding data
    const healthMetrics = {
      sleepHours: lifestyle.sleepSchedule?.avgSleepHours || 7,
      stressLevel: lifestyle.stressLevel || 5,
      energyLevel: 6, // Default since new user
      adherenceRate: 100 // New user, optimistic start
    };

    console.log('🤖 Generating AI-powered wellness plan for new user:', user.firstName);
    
    // Generate comprehensive AI-powered persona and plan
    const aiGeneratedPlan = await wellnessAgent.generatePersonalizedPlan(
      aiUserProfile,
      healthMetrics,
      `New user onboarding: Create sustainable foundation habits for ${user.currentPhase}. Focus on behavioral economics principles for habit formation. Goals: ${healthProfile.healthGoals.join(', ')}`
    );

    console.log('✅ AI plan generated successfully for:', user.firstName);

    return {
      personalizedGreeting: aiGeneratedPlan.greeting || `Good ${getCurrentTimeGreeting()}, ${user.firstName}! Ready to build some healthy habits today?`,
      phaseGuidance: aiGeneratedPlan.phaseGuidance || getPhaseGuidance('PHASE1', healthProfile.healthGoals),
      tinyWins: aiGeneratedPlan.dailyPlan?.map(task => task.title) || generateTinyWins(healthProfile.healthGoals, lifestyle.exerciseExperience),
      habitStackingSuggestions: aiGeneratedPlan.behavioralNudges?.filter(n => n.type === 'habit_stack').map(n => n.message) || generateHabitStacking(lifestyle),
      implementationIntentions: aiGeneratedPlan.behavioralNudges?.filter(n => n.type === 'implementation_intention').map(n => n.message) || generateImplementationIntentions(healthProfile.healthGoals, lifestyle.timeAvailability),
      scheduledNudges: aiGeneratedPlan.nextSteps || generateScheduledNudges(behaviorProfile.bestPerformanceTime, preferences.communicationStyle),
      aiPersona: {
        motivationalStyle: determineMotivationalStyle(behaviorProfile),
        communicationTone: preferences.communicationStyle,
        focusAreas: aiGeneratedPlan.recommendations || [],
        personalizedInsights: aiGeneratedPlan.insights || [],
        phaseStrategy: aiGeneratedPlan.phaseGuidance || 'Focus on building foundation habits'
      }
    };
    
  } catch (error) {
    console.error('❌ AI generation failed, using fallback:', error);
    
    // Fallback to basic generation if AI fails
    const greeting = `Good ${getCurrentTimeGreeting()}, ${user.firstName}! Ready to build some healthy habits today?`;
    const tinyWins = generateTinyWins(healthProfile.healthGoals, lifestyle.exerciseExperience);
    const phaseGuidance = getPhaseGuidance('PHASE1', healthProfile.healthGoals);
    
    return {
      personalizedGreeting: greeting,
      phaseGuidance: phaseGuidance,
      tinyWins: tinyWins,
      habitStackingSuggestions: generateHabitStacking(lifestyle),
      implementationIntentions: generateImplementationIntentions(healthProfile.healthGoals, lifestyle.timeAvailability),
      scheduledNudges: generateScheduledNudges(behaviorProfile.bestPerformanceTime, preferences.communicationStyle),
      aiPersona: {
        motivationalStyle: determineMotivationalStyle(behaviorProfile),
        communicationTone: preferences.communicationStyle,
        focusAreas: healthProfile.healthGoals,
        personalizedInsights: ['Starting your wellness journey with small, sustainable changes'],
        phaseStrategy: 'Building healthy foundations step by step'
      }
    };
  }
}

function getCurrentTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function generateTinyWins(goals: string[], experience: string): string[] {
  const wins: string[] = [];
  
  if (goals.includes('Better Sleep')) {
    wins.push(experience === 'beginner' ? 'Set a consistent bedtime for tonight' : 'Try 5 minutes of evening stretching');
  }
  if (goals.includes('More Energy')) {
    wins.push(experience === 'beginner' ? 'Take a 2-minute walk outside' : 'Do 10 jumping jacks when you feel sluggish');
  }
  if (goals.includes('Stress Management')) {
    wins.push('Practice one 60-second breathing exercise');
  }
  
  return wins.slice(0, 3); // Limit to 3 for focus
}

function getPhaseGuidance(phase: string, goals: string[]): string {
  if (phase === 'PHASE1') {
    return `🌱 Foundation Building Phase: Focus on building one small habit at a time. Your brain is learning new patterns, so consistency matters more than perfection. Start with just 2 minutes a day!`;
  }
  return 'Welcome to your wellness journey!';
}

function generateScheduledNudges(performanceTimes: string[], communicationStyle: string): string[] {
  const nudges: string[] = [];
  
  if (performanceTimes.includes('Morning (7-10 AM)')) {
    nudges.push(communicationStyle === 'gentle' ? 
      'Gentle reminder: A small morning habit can set a positive tone for your entire day 🌅' :
      'Morning power hour! This is your prime time - make it count! 💪'
    );
  }
  
  return nudges;
}

function determineMotivationalStyle(behaviorProfile: any): string {
  if (behaviorProfile.lossAversion > 3) return 'loss_prevention_focused';
  if (behaviorProfile.socialInfluence > 0.7) return 'community_driven';
  if (behaviorProfile.gamificationResponse > 0.7) return 'achievement_oriented';
  return 'balanced_encouragement';
}

// Async AI generation function (runs in background)
async function generateUserPlanAsync(userId: string, data: any): Promise<void> {
  try {
    console.log('🤖 Starting async AI generation for user:', userId);
    
    // Generate AI plan (this can take 30-60 seconds)
    const dailyPlanData = await generatePersonalizedDailyPlan(data);
    
    // Save AI-generated plan to database
    await prisma.dailyPlan.create({
      data: {
        userId: userId,
        date: new Date(),
        phase: data.user.currentPhase.toUpperCase() as any,
        greeting: dailyPlanData.personalizedGreeting,
        phaseGuidance: dailyPlanData.phaseGuidance,
        primaryFocus: "Building your first healthy habit",
        tinyWins: dailyPlanData.tinyWins,
        habitStack: dailyPlanData.habitStackingSuggestions,
        implementation: dailyPlanData.implementationIntentions,
        scheduledNudges: dailyPlanData.scheduledNudges,
        contextualCues: [],
        overallProgress: 0,
        isCompleted: false,
        aiConfidence: 0.85,
      }
    });
    
    // Mark user as AI generation completed
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true }
    });
    
    console.log('✅ Async AI generation completed for user:', userId);
    
  } catch (error) {
    console.error('❌ Async AI generation failed for user:', userId, error);
    
    // Mark user as AI generation failed (still create basic plan)
    try {
      await prisma.dailyPlan.create({
        data: {
          userId: userId,
          date: new Date(),
          phase: data.user.currentPhase.toUpperCase() as any,
          greeting: `Good ${getCurrentTimeGreeting()}, ${data.user.firstName}! Ready to build some healthy habits today?`,
          phaseGuidance: getPhaseGuidance('PHASE1', data.healthProfile.healthGoals),
          primaryFocus: "Building your first healthy habit",
          tinyWins: generateTinyWins(data.healthProfile.healthGoals, data.lifestyle.exerciseExperience),
          habitStack: generateHabitStacking(data.lifestyle),
          implementation: generateImplementationIntentions(data.healthProfile.healthGoals, data.lifestyle.timeAvailability),
          scheduledNudges: generateScheduledNudges(data.behaviorProfile.bestPerformanceTime, data.preferences.communicationStyle),
          contextualCues: [],
          overallProgress: 0,
          isCompleted: false,
          aiConfidence: 0.5, // Lower confidence for fallback plan
        }
      });
      
      // Mark as completed with fallback plan
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true }
      });
      
      console.log('⚠️ Created fallback plan for user:', userId);
    } catch (fallbackError) {
      console.error('💥 Failed to create fallback plan for user:', userId, fallbackError);
    }
  }
}

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Logout successful' 
  });
});

export default router;