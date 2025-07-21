'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button, Card, Input } from '@/components';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.accent}10);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${theme.spacing['2xl']};
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
  margin-bottom: ${theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}10;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}20;
  font-size: ${theme.fontSize.sm};
`;

const SuccessMessage = styled.div`
  background: ${theme.colors.status.success}10;
  color: ${theme.colors.status.success};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.success}20;
  font-size: ${theme.fontSize.sm};
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: ${theme.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Join WellnessAI</Title>
        <Subtitle>Create your account to get started</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              placeholder="First name"
              required
              fullWidth
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              placeholder="Last name"
              required
              fullWidth
            />
          </FormRow>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Enter your email"
            required
            fullWidth
          />
          
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Create a password"
            required
            fullWidth
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Confirm your password"
            required
            fullWidth
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span style={{ marginLeft: '8px' }}>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </Form>
        
        <LinkText>
          Already have an account? <a href="/auth/login">Sign in</a>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
}