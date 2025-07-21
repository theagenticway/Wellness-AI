import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
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
          
          if (result && result.success) {
            const user = {
              id: result.user.id.toString(),
              email: result.user.email,
              name: `${result.user.firstName} ${result.user.lastName}`,
              role: result.user.role || 'member',
              currentPhase: result.user.currentPhase,
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.currentPhase = user.currentPhase;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.currentPhase = token.currentPhase as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };