-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('MEMBER', 'PROFESSIONAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('PHASE1', 'PHASE2', 'PHASE3');

-- CreateEnum
CREATE TYPE "MotivationType" AS ENUM ('INTRINSIC', 'EXTRINSIC', 'BALANCED');

-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('EARLY_MORNING', 'MORNING', 'LATE_MORNING', 'EARLY_AFTERNOON', 'LATE_AFTERNOON', 'EARLY_EVENING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('MINIMAL', 'LOW', 'MODERATE', 'HIGH', 'INTENSIVE');

-- CreateEnum
CREATE TYPE "NudgeStyle" AS ENUM ('GENTLE', 'ENCOURAGING', 'MOTIVATIONAL', 'URGENT', 'PLAYFUL');

-- CreateEnum
CREATE TYPE "RewardResponse" AS ENUM ('IMMEDIATE_FOCUSED', 'DELAYED_FOCUSED', 'BALANCED', 'INTRINSIC_ONLY');

-- CreateEnum
CREATE TYPE "HabitCategory" AS ENUM ('NUTRITION', 'EXERCISE', 'MEDITATION', 'SLEEP', 'SUPPLEMENTS', 'HYDRATION', 'SOCIAL', 'LEARNING', 'CBT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CueType" AS ENUM ('TIME_BASED', 'LOCATION_BASED', 'PERSON_BASED', 'EMOTION_BASED', 'ACTIVITY_BASED', 'ENVIRONMENTAL');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('TINY', 'EASY', 'MODERATE', 'CHALLENGING', 'INTENSIVE');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKDAYS', 'WEEKENDS', 'WEEKLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "QualityRating" AS ENUM ('POOR', 'FAIR', 'GOOD', 'EXCELLENT');

-- CreateEnum
CREATE TYPE "EffortLevel" AS ENUM ('EFFORTLESS', 'MINIMAL', 'MODERATE', 'HIGH', 'MAXIMUM');

-- CreateEnum
CREATE TYPE "EnjoymentLevel" AS ENUM ('UNENJOYABLE', 'NEUTRAL', 'SOMEWHAT_ENJOYABLE', 'ENJOYABLE', 'VERY_ENJOYABLE');

-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('STRESSED', 'ANXIOUS', 'NEUTRAL', 'MOTIVATED', 'ENERGIZED', 'CALM', 'HAPPY');

-- CreateEnum
CREATE TYPE "StreakType" AS ENUM ('SINGLE_HABIT', 'HABIT_STACK', 'CATEGORY_BASED', 'CUSTOM_COMPOSITE');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NudgeType" AS ENUM ('REMINDER', 'ENCOURAGEMENT', 'SOCIAL_PROOF', 'LOSS_AVERSION', 'IMPLEMENTATION_INTENTION', 'TEMPTATION_BUNDLING', 'FRESH_START');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('TIME_TRIGGER', 'LOCATION_TRIGGER', 'BEHAVIOR_TRIGGER', 'EMOTION_TRIGGER', 'SOCIAL_TRIGGER', 'ENVIRONMENTAL_TRIGGER');

-- CreateEnum
CREATE TYPE "NudgeResponse" AS ENUM ('IGNORED', 'DISMISSED', 'VIEWED', 'ACTED_UPON', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('POINTS', 'BADGE', 'UNLOCK', 'SOCIAL_RECOGNITION', 'MONETARY', 'EXPERIENCE', 'PRIVILEGE');

-- CreateEnum
CREATE TYPE "ImmediateLevel" AS ENUM ('INSTANT', 'WITHIN_HOUR', 'SAME_DAY', 'NEXT_DAY', 'DELAYED');

-- CreateEnum
CREATE TYPE "CertaintyLevel" AS ENUM ('GUARANTEED', 'VERY_LIKELY', 'LIKELY', 'VARIABLE', 'SURPRISE');

-- CreateEnum
CREATE TYPE "OverrideType" AS ENUM ('FASTING_SCHEDULE', 'SUPPLEMENT_DOSE', 'EXERCISE_INTENSITY', 'NUTRITION_RESTRICTION', 'PHASE_TRANSITION', 'HABIT_MODIFICATION', 'BEHAVIORAL_INTERVENTION', 'EMERGENCY_STOP');

-- CreateEnum
CREATE TYPE "OverrideUrgency" AS ENUM ('ROUTINE', 'IMPORTANT', 'URGENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'MEMBER',
    "currentPhase" "Phase" NOT NULL DEFAULT 'PHASE1',
    "healthGoals" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionalId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "motivationType" "MotivationType" NOT NULL DEFAULT 'INTRINSIC',
    "lossAversion" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "presentBias" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "socialInfluence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "gamificationResponse" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "optimalHabitStack" TEXT[],
    "bestPerformanceTime" "TimeOfDay"[],
    "worstPerformanceTime" "TimeOfDay"[],
    "averageWillpower" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "willpowerPattern" JSONB NOT NULL,
    "publicCommitments" BOOLEAN NOT NULL DEFAULT false,
    "financialStakes" BOOLEAN NOT NULL DEFAULT false,
    "socialAccountability" BOOLEAN NOT NULL DEFAULT true,
    "reminderFrequency" "ReminderFrequency" NOT NULL DEFAULT 'MODERATE',
    "nudgeStyle" "NudgeStyle" NOT NULL DEFAULT 'ENCOURAGING',
    "responseToRewards" "RewardResponse" NOT NULL DEFAULT 'BALANCED',
    "sucessfulPatterns" JSONB,
    "failurePatterns" JSONB,
    "optimalNudgeTiming" JSONB,
    "personalTriggers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "behavior_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "HabitCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cueType" "CueType" NOT NULL,
    "cue" TEXT NOT NULL,
    "routine" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "difficultyLevel" "DifficultyLevel" NOT NULL DEFAULT 'TINY',
    "minimumVersion" TEXT NOT NULL,
    "currentVersion" TEXT NOT NULL,
    "targetVersion" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "timeOfDay" "TimeOfDay"[],
    "estimatedDuration" INTEGER NOT NULL,
    "contextRequired" TEXT[],
    "implementationIntention" TEXT,
    "habitStack" TEXT,
    "socialCommitment" TEXT,
    "personalizedCue" TEXT,
    "personalizedReward" TEXT,
    "aiOptimizations" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pausedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL,
    "quality" "QualityRating",
    "effort" "EffortLevel",
    "enjoyment" "EnjoymentLevel",
    "timeOfDay" "TimeOfDay" NOT NULL,
    "locationContext" TEXT,
    "emotionalState" "EmotionalState",
    "energyLevel" INTEGER,
    "stressLevel" INTEGER,
    "cueStrength" INTEGER,
    "temptationLevel" INTEGER,
    "socialInfluence" TEXT,
    "automaticity" INTEGER,
    "identityAlignment" INTEGER,
    "notes" TEXT,
    "challenges" TEXT[],
    "wins" TEXT[],

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitId" TEXT,
    "streakType" "StreakType" NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "longestCount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "lastActiveDate" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "stakesAttached" BOOLEAN NOT NULL DEFAULT false,
    "socialSharing" BOOLEAN NOT NULL DEFAULT false,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "predictedEnd" TIMESTAMP(3),
    "interventions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "brokenAt" TIMESTAMP(3),
    "brokenReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nudges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nudgeType" "NudgeType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionRequired" TEXT,
    "triggerType" "TriggerType" NOT NULL,
    "triggerValue" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "personalizedContent" TEXT,
    "contextualFactors" JSONB,
    "behavioralState" TEXT,
    "response" "NudgeResponse",
    "effectiveness" DOUBLE PRECISION,
    "variant" TEXT,
    "cohort" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nudges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardType" "RewardType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "triggerEvent" TEXT NOT NULL,
    "habitId" TEXT,
    "streakMilestone" INTEGER,
    "immediacy" "ImmediateLevel" NOT NULL,
    "certainty" "CertaintyLevel" NOT NULL,
    "personalRelevance" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "isEarned" BOOLEAN NOT NULL DEFAULT false,
    "earnedAt" TIMESTAMP(3),
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "predictedValue" DOUBLE PRECISION,
    "actualImpact" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "category" "HabitCategory" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "socialElement" BOOLEAN NOT NULL DEFAULT true,
    "competitiveElement" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "rewards" JSONB,
    "stakes" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_challenges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "dropgedAt" TIMESTAMP(3),
    "currentProgress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dailyCheckins" JSONB,
    "publicProgress" BOOLEAN NOT NULL DEFAULT true,
    "teamId" TEXT,
    "motivationLevel" INTEGER,
    "difficultyRating" INTEGER,
    "finalRank" INTEGER,
    "rewardsEarned" JSONB,

    CONSTRAINT "user_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "phase" "Phase" NOT NULL,
    "greeting" TEXT NOT NULL,
    "phaseGuidance" TEXT NOT NULL,
    "primaryFocus" TEXT NOT NULL,
    "tinyWins" JSONB NOT NULL,
    "habitStack" JSONB NOT NULL,
    "implementation" JSONB NOT NULL,
    "temptationPairs" JSONB,
    "communityStats" JSONB,
    "peerComparisons" JSONB,
    "streakRisks" JSONB,
    "commitmentReminders" JSONB,
    "scheduledNudges" JSONB NOT NULL,
    "contextualCues" JSONB NOT NULL,
    "overallProgress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "aiConfidence" DOUBLE PRECISION,
    "userSatisfaction" INTEGER,
    "behavioralFit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_metrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "willpowerUsed" DOUBLE PRECISION,
    "temptationLevel" DOUBLE PRECISION,
    "automaticity" DOUBLE PRECISION,
    "intrinsicMotivation" DOUBLE PRECISION,
    "extrinsicMotivation" DOUBLE PRECISION,
    "identityAlignment" DOUBLE PRECISION,
    "socialSupport" DOUBLE PRECISION,
    "peerPressure" DOUBLE PRECISION,
    "environmentQuality" DOUBLE PRECISION,
    "cueStrength" DOUBLE PRECISION,
    "habitFormationVelocity" DOUBLE PRECISION,
    "behavioralMomentum" DOUBLE PRECISION,
    "changeReadiness" DOUBLE PRECISION,

    CONSTRAINT "behavior_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "phase" "Phase" NOT NULL,
    "easyWins" JSONB NOT NULL,
    "habitStacks" JSONB NOT NULL,
    "temptationBundling" JSONB,
    "mealTiming" JSONB NOT NULL,
    "shoppingPlan" JSONB NOT NULL,
    "prepSchedule" JSONB NOT NULL,
    "popularChoices" JSONB NOT NULL,
    "communityFavorites" JSONB,
    "personalizedMeals" JSONB NOT NULL,
    "preferenceAdaptations" JSONB NOT NULL,
    "fiberStrategy" JSONB NOT NULL,
    "antiInflammatory" JSONB NOT NULL,
    "gutHealthFocus" JSONB NOT NULL,
    "easeOfImplementation" DOUBLE PRECISION,
    "enjoymentPrediction" DOUBLE PRECISION,
    "adherenceLikelihood" DOUBLE PRECISION,

    CONSTRAINT "nutrition_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "minimumVersion" JSONB NOT NULL,
    "tinyHabits" JSONB NOT NULL,
    "habitStacks" JSONB NOT NULL,
    "specificTiming" JSONB NOT NULL,
    "equipmentSetup" JSONB NOT NULL,
    "clothingPlan" JSONB NOT NULL,
    "personalizedWorkout" JSONB NOT NULL,
    "motivationBoosts" JSONB NOT NULL,
    "obstaclePreplanning" JSONB NOT NULL,
    "accountabilityPartner" TEXT,
    "socialSharing" BOOLEAN NOT NULL DEFAULT false,
    "publicCommitment" TEXT,
    "progressMilestones" JSONB NOT NULL,
    "celebrationPlans" JSONB NOT NULL,
    "setbackRecovery" JSONB NOT NULL,

    CONSTRAINT "exercise_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meditation_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "anchorHabit" TEXT NOT NULL,
    "minimumPractice" JSONB NOT NULL,
    "contextualCues" JSONB NOT NULL,
    "personalizedTechnique" JSONB NOT NULL,
    "difficultyProgression" JSONB NOT NULL,
    "specificLocation" TEXT NOT NULL,
    "timingStrategy" JSONB NOT NULL,
    "obstacleHandling" JSONB NOT NULL,
    "reminderStrategy" JSONB NOT NULL,
    "motivationAnchors" JSONB NOT NULL,
    "progressTracking" JSONB NOT NULL,

    CONSTRAINT "meditation_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "healthConditions" TEXT[],
    "medications" TEXT[],
    "allergies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "sleepHours" DOUBLE PRECISION,
    "stressLevel" INTEGER,
    "energyLevel" INTEGER,
    "habitCompletion" DOUBLE PRECISION,
    "willpowerLevel" INTEGER,
    "motivationLevel" INTEGER,

    CONSTRAINT "progress_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_overrides" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "overrideType" "OverrideType" NOT NULL,
    "originalValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "urgency" "OverrideUrgency" NOT NULL DEFAULT 'ROUTINE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professional_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_profiles_userId_key" ON "behavior_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_userId_challengeId_key" ON "user_challenges"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_userId_date_key" ON "daily_plans"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_plans_userId_date_key" ON "nutrition_plans"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_plans_userId_date_key" ON "exercise_plans"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "meditation_plans_userId_date_key" ON "meditation_plans"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "health_profiles_userId_key" ON "health_profiles"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_profiles" ADD CONSTRAINT "behavior_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudges" ADD CONSTRAINT "nudges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "behavior_metrics" ADD CONSTRAINT "behavior_metrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_plans" ADD CONSTRAINT "exercise_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meditation_plans" ADD CONSTRAINT "meditation_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_profiles" ADD CONSTRAINT "health_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_overrides" ADD CONSTRAINT "professional_overrides_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_overrides" ADD CONSTRAINT "professional_overrides_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
