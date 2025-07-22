import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  role?: string;
  currentPhase?: string;
}

export class JWTService {
  private static readonly secret = process.env.JWT_SECRET || 'fallback-secret';
  private static readonly expiresIn = '24h';

  /**
   * Generate a JWT token compatible with the backend
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role || 'MEMBER',
        currentPhase: payload.currentPhase || 'PHASE1',
      },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Generate a backend-compatible JWT from NextAuth session
   */
  static generateBackendToken(user: {
    id: string;
    email: string;
    role?: string;
    currentPhase?: string;
  }): string {
    return this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      currentPhase: user.currentPhase,
    });
  }
}