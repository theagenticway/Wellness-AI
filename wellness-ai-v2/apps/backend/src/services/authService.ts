// apps/backend/src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type?: 'MEMBER' | 'PROFESSIONAL';
  healthGoals?: string[];
  dietaryPreferences?: string[];
  age?: number;
  gender?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: 'MEMBER' | 'PROFESSIONAL' | 'ADMIN';
  createdAt: Date;
  profile?: {
    age?: number;
    gender?: string;
    currentPhase?: 'phase1' | 'phase2' | 'phase3';
    healthGoals?: string[];
    healthConditions?: string[];
    medications?: string[];
    preferences?: {
      dietary: string[];
      exercise: string[];
      communication: string;
    };
  };
}

// In-memory user storage for development (replace with database in production)
const users: Map<string, User & { password: string }> = new Map();

// Seed some development users
const seedUsers = () => {
  const defaultUsers = [
    {
      id: 'dev-user-123',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@wellness.ai',
      password: bcrypt.hashSync('password123', 10),
      type: 'MEMBER' as const,
      createdAt: new Date(),
      profile: {
        age: 30,
        gender: 'other',
        currentPhase: 'phase1' as const,
        healthGoals: ['weight_loss', 'energy_boost'],
        preferences: {
          dietary: ['whole_foods', 'plant_forward'],
          exercise: ['yoga', 'walking'],
          communication: 'encouraging'
        }
      }
    },
    {
      id: 'prof-user-456',
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      email: 'sarah@wellness.ai',
      password: bcrypt.hashSync('professional123', 10),
      type: 'PROFESSIONAL' as const,
      createdAt: new Date(),
      profile: {
        age: 45,
        preferences: {
          dietary: [],
          exercise: [],
          communication: 'professional'
        }
      }
    },
    {
      id: 'admin-user-789',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@wellness.ai',
      password: bcrypt.hashSync('admin123', 10),
      type: 'ADMIN' as const,
      createdAt: new Date()
    }
  ];

  defaultUsers.forEach(user => {
    users.set(user.email, user);
  });

  console.log('✅ Seeded development users:');
  console.log('   📧 demo@wellness.ai / password123 (Member)');
  console.log('   📧 sarah@wellness.ai / professional123 (Professional)');
  console.log('   📧 admin@wellness.ai / admin123 (Admin)');
};

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'wellness-ai-dev-secret-key-change-in-production';

  constructor() {
    // Initialize with seed data for development
    if (users.size === 0) {
      seedUsers();
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Validate input
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new Error('All required fields must be provided');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if user already exists
    if (users.has(data.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      type: data.type || 'MEMBER' as const,
      createdAt: new Date(),
      profile: {
        age: data.age,
        gender: data.gender,
        currentPhase: 'phase1' as const,
        healthGoals: data.healthGoals || [],
        healthConditions: [],
        medications: [],
        preferences: {
          dietary: data.dietaryPreferences || [],
          exercise: [],
          communication: 'encouraging'
        }
      }
    };

    // Store user
    users.set(data.email.toLowerCase(), newUser);

    // Generate token
    const token = this.generateToken(userId, data.email);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token
    };
  }

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = users.get(data.email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.id === userId) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = users.get(email.toLowerCase());
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, updateData: any): Promise<User> {
    let userFound = false;
    
    for (const [email, user] of users.entries()) {
      if (user.id === userId) {
        // Update user data
        const updatedUser = {
          ...user,
          ...updateData,
          profile: {
            ...user.profile,
            ...updateData.profile
          },
          // Prevent changing critical fields
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        };
        
        users.set(email, updatedUser);
        userFound = true;
        
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
      }
    }
    
    if (!userFound) {
      throw new Error('User not found');
    }
    
    throw new Error('Update failed');
  }

  verifyToken(token: string): { userId: string; email: string } {
    try {
      // Try JWT first
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return { userId: decoded.userId, email: decoded.email };
    } catch (jwtError) {
      // Fallback to development token format (base64 encoded JSON)
      try {
        const tokenData = Buffer.from(token, 'base64').toString('utf-8');
        const userData = JSON.parse(tokenData);
        return { userId: userData.id, email: userData.email };
      } catch (devTokenError) {
        throw new Error('Invalid token');
      }
    }
  }

  private generateToken(userId: string, email: string): string {
    // In development, use simple base64 encoding for easier testing
    if (process.env.NODE_ENV === 'development') {
      return Buffer.from(JSON.stringify({ id: userId, email })).toString('base64');
    }
    
    // In production, use JWT
    return jwt.sign(
      { userId, email },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Professional-specific methods
  async getClientsByProfessionalId(professionalId: string): Promise<User[]> {
    // This would typically involve a database relationship
    // For now, return empty array as this feature isn't fully implemented
    return [];
  }

  async assignClientToProfessional(clientId: string, professionalId: string): Promise<boolean> {
    // Implementation for assigning clients to professionals
    // This would involve database relationships in production
    return true;
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values()).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async deleteUser(userId: string): Promise<boolean> {
    for (const [email, user] of users.entries()) {
      if (user.id === userId) {
        users.delete(email);
        return true;
      }
    }
    return false;
  }

  async updateUserType(userId: string, newType: 'MEMBER' | 'PROFESSIONAL' | 'ADMIN'): Promise<User> {
    for (const [email, user] of users.entries()) {
      if (user.id === userId) {
        user.type = newType;
        users.set(email, user);
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    throw new Error('User not found');
  }

  // Development helpers
  resetUsers(): void {
    users.clear();
    seedUsers();
  }

  getUserCount(): number {
    return users.size;
  }

  // Health and debugging
  getStatus(): any {
    return {
      userCount: users.size,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}

export const authService = new AuthService();