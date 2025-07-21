import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock user database (replace with real database later)
const users: any[] = [
  {
    id: 1,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@wellnessai.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye1VfWoKP3x8Q.7EbLRBOQ/2HXOJZLGaS', // 'password123'
    role: 'member',
    currentPhase: 'phase1',
  },
  {
    id: 2,
    firstName: 'Professional',
    lastName: 'Demo',
    email: 'professional@wellnessai.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye1VfWoKP3x8Q.7EbLRBOQ/2HXOJZLGaS', // 'password123'
    role: 'professional',
    currentPhase: 'phase1',
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful'
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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'member',
      currentPhase: 'phase1',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Logout successful' 
  });
});

// Get current user profile
router.get('/me', (req: Request, res: Response) => {
  // This would normally use JWT middleware to verify the token
  // For now, return demo user
  const demoUser = users.find(u => u.id === 1);
  if (demoUser) {
    const { password: _, ...userWithoutPassword } = demoUser;
    res.json({
      success: true,
      data: { user: userWithoutPassword },
      message: 'User profile retrieved'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

export default router;