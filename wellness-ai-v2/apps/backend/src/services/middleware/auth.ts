// apps/backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { userId } = authService.verifyToken(token);
    const user = await authService.getUserById(userId);
    
    req.user = user;
    req.userId = userId;
    next();

  } catch (error: any) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireProfessional = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.type !== 'PROFESSIONAL' && req.user?.type !== 'ADMIN') {
    return res.status(403).json({ error: 'Professional access required' });
  }
  next();
};

// apps/backend/src/routes/auth.ts
import express, { Request, Response } from 'express';
import { authService, RegisterData, LoginData } from '../services/authService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const registerData: RegisterData = req.body;
    
    // Basic validation
    if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName) {
      return res.status(400).json({ 
        error: 'Email, password, first name, and last name are required' 
      });
    }

    if (registerData.password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    const result = await authService.register(registerData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: error.message || 'Registration failed'
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const loginData: LoginData = req.body;
    
    if (!loginData.email || !loginData.password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const result = await authService.login(loginData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({
      error: error.message || 'Login failed'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedUser = await authService.updateProfile(req.userId!, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(400).json({
      error: error.message || 'Failed to update profile'
    });
  }
});

// Logout (client-side should remove token)
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Professional: Get my clients
router.get('/clients', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.type !== 'PROFESSIONAL' && req.user?.type !== 'ADMIN') {
      return res.status(403).json({ error: 'Professional access required' });
    }

    // This would be implemented in a separate service
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });

  } catch (error: any) {
    console.error('Get clients error:', error);
    res.status(500).json({
      error: 'Failed to fetch clients'
    });
  }
});

export default router;