import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { JWTService } from './jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // Use internal Docker network URL for server-side auth calls
          const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:3001';
          console.log('Calling backend auth at:', `${apiUrl}/auth/login`);
          
          // Call our backend auth endpoint
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('Backend response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            return null;
          }

          const result = await response.json();
          console.log('Backend success response:', result);
          
          if (result && result.success && result.user) {
            const user = {
              id: result.user.id.toString(),
              email: result.user.email,
              name: `${result.user.firstName} ${result.user.lastName}`,
              role: result.user.type || 'MEMBER',
              currentPhase: result.user.currentPhase || 'PHASE1',
              requiresOnboarding: result.requiresOnboarding || false,
            };
            console.log('Returning NextAuth user:', user);
            return user;
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Set to false for development
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user data in JWT token
        token.role = user.role;
        token.currentPhase = user.currentPhase;
        token.requiresOnboarding = user.requiresOnboarding;
        
        // Generate backend-compatible JWT token
        const backendToken = JWTService.generateBackendToken({
          id: user.id,
          email: user.email || '',
          role: user.role,
          currentPhase: user.currentPhase,
        });
        
        token.backendToken = backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.currentPhase = token.currentPhase as string;
        session.user.requiresOnboarding = token.requiresOnboarding as boolean;
        // Store backend token in session for API calls
        session.backendToken = token.backendToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};