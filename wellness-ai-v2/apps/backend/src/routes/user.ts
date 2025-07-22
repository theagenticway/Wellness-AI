import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's AI generation status
router.get('/ai-status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check user's onboarding status and if they have a daily plan
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        onboardingCompleted: true,
        dailyPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            createdAt: true,
            aiConfidence: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine AI generation status
    let status: 'pending' | 'completed' | 'failed' = 'pending';
    let message = 'Generating your personalized wellness plan...';

    if (user.onboardingCompleted && user.dailyPlans.length > 0) {
      status = 'completed';
      message = 'Your personalized plan is ready!';
    } else if (user.onboardingCompleted && user.dailyPlans.length === 0) {
      status = 'failed';
      message = 'Plan generation encountered an issue. We\'ll create a basic plan for you.';
    }

    res.json({
      success: true,
      status,
      message,
      userId: user.id,
      hasDailyPlan: user.dailyPlans.length > 0,
      aiConfidence: user.dailyPlans[0]?.aiConfidence || null
    });

  } catch (error) {
    console.error('AI Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;