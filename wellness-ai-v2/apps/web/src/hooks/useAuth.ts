import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const requireAuth = () => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    }
  };

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    logout,
    requireAuth,
    session,
  };
}