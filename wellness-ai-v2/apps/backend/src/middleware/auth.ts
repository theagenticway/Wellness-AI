import { Request, Response, NextFunction } from 'express';

// Extend Request interface
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Mock authentication for development
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // For development - just pass through with mock user
    req.userId = 'mock-user-123';
    req.user = {
      id: 'mock-user-123',
      email: 'demo@wellness.ai',
      name: 'Demo User'
    };
    
    console.log('🔐 Mock authentication passed for user:', req.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};