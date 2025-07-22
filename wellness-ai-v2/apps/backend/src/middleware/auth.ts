import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    currentPhase?: string;
  };
}

// Real JWT authentication middleware
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        type: true,
        currentPhase: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Attach user info to request
    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.type,
      currentPhase: user.currentPhase || 'PHASE1'
    };
    
    console.log('🔐 Authentication successful for user:', user.email);
    next();
  } catch (error: any) {
    console.error('🚨 Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

// Optional middleware for routes that work with or without auth
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          type: true,
          currentPhase: true
        }
      });

      if (user) {
        req.userId = user.id;
        req.user = {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.type,
          currentPhase: user.currentPhase || 'PHASE1'
        };
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, continue even if token is invalid
    next();
  }
};