'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${theme.spacing['2xl']};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xs};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}30;
  }
`;

const Button = styled.button`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  background-color: ${theme.colors.primary};
  color: white;
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: ${theme.colors.text.muted};
  margin: ${theme.spacing.xl} 0;

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${theme.colors.border};
  }

  &::before { margin-right: .5em; }
  &::after { margin-left: .5em; }
`;

const SocialButton = styled(Button)`
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  margin-top: ${theme.spacing.md};
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.sm};

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: ${theme.fontWeight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to continue your wellness journey</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
        
        <Divider>OR</Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <SocialButton onClick={() => handleSocialSignIn('google')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2.18 12.19,2.18C6.42,2.18 2.03,6.8 2.03,12C2.03,17.2 6.42,21.82 12.19,21.82C17.82,21.82 21.5,18.09 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1Z"/></svg>
            Sign In with Google
          </SocialButton>
          <SocialButton onClick={() => handleSocialSignIn('apple')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17.1,22A2.9,2.9,0,0,1,14.2,19.1A2.9,2.9,0,0,1,17.1,16.2A2.9,2.9,0,0,1,20,19.1A2.9,2.9,0,0,1,17.1,22M17.1,6.9A2.9,2.9,0,0,1,14.2,4A2.9,2.9,0,0,1,17.1,1.1A2.9,2.9,0,0,1,20,4A2.9,2.9,0,0,1,17.1,6.9M10.2,22A2.9,2.9,0,0,1,7.3,19.1A2.9,2.9,0,0,1,10.2,16.2A2.9,2.9,0,0,1,13.1,19.1A2.9,2.9,0,0,1,10.2,22M10.2,6.9A2.9,2.9,0,0,1,7.3,4A2.9,2.9,0,0,1,10.2,1.1A2.9,2.9,0,0,1,13.1,4A2.9,2.9,0,0,1,10.2,6.9M3.3,14.5A2.9,2.9,0,0,1,0.4,11.6A2.9,2.9,0,0,1,3.3,8.7A2.9,2.9,0,0,1,6.2,11.6A2.9,2.9,0,0,1,3.3,14.5Z"/></svg>
            Sign In with Apple
          </SocialButton>
        </div>

        <LinkText>
          Don't have an account? <a href="/auth/register">Sign Up</a>
        </LinkText>
      </AuthCard>
    </AuthContainer>
  );
}
t.value)}
            placeholder="Enter your password"
            required
            fullWidth
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span style={{ marginLeft: '8px' }}>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>
        
        <LinkText>
          Don&apos;t have an account? <a href="/auth/register">Sign up</a>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
}