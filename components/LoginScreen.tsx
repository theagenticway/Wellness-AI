import React, { useState } from 'react';
import { useAuth, getDemoCredentials } from '../src/providers/AuthProvider';

export function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  console.log('LoginScreen rendered', { email, password, isLoading, showDemoInfo });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', { email, password });
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try the demo accounts below.');
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    console.log('fillDemoCredentials called', { demoEmail, demoPassword });
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const demoCredentials = getDemoCredentials();

  // Define all styles as objects to ensure they apply
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const mainContentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#6b7280',
    margin: '0 0 16px 0'
  };

  const debugButtonStyle: React.CSSProperties = {
    background: '#dc2626',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const demoBoxStyle: React.CSSProperties = {
    border: '2px solid #bfdbfe',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '16px'
  };

  const demoHeaderStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#1f2937'
  };

  const demoButtonStyle: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'underline',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '14px'
  };

  const hideButtonStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    marginTop: '8px'
  };

  const formBoxStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: '2px solid #2563eb',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8'
  };

  const errorStyle: React.CSSProperties = {
    border: '2px solid #fecaca',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  };

  const linkButtonStyle: React.CSSProperties = {
    color: '#059669',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px',
    fontSize: '14px'
  };

  const greenButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    backgroundColor: '#059669',
    color: 'white',
    border: '2px solid #059669',
    borderRadius: '6px',
    padding: '12px 16px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>WellnessAI</h1>
          <p style={subtitleStyle}>Sign in to your wellness journey</p>
          
          {/* DEBUG BUTTON */}
          <button 
            style={debugButtonStyle}
            onClick={() => {
              console.log('DEBUG: Simple button clicked!');
              alert('Button works!');
            }}
          >
            🔴 DEBUG CLICK TEST
          </button>
        </div>

        {/* Demo Credentials Info */}
        {showDemoInfo && (
          <div style={demoBoxStyle}>
            <div style={demoHeaderStyle}>Demo Accounts Available:</div>
            
            {demoCredentials.map((cred, index) => (
              <div key={index} style={{ margin: '8px 0' }}>
                <button
                  style={demoButtonStyle}
                  onClick={() => {
                    console.log('Demo credential clicked:', cred.email);
                    fillDemoCredentials(cred.email, 'demo123');
                  }}
                >
                  {cred.email}
                </button>
                <span style={{ color: '#6b7280', marginLeft: '8px' }}>({cred.role})</span>
              </div>
            ))}
            
            <button
              style={hideButtonStyle}
              onClick={() => {
                console.log('Hide demo info clicked');
                setShowDemoInfo(false);
              }}
            >
              Hide demo info
            </button>
          </div>
        )}

        {/* Login Form */}
        <div style={formBoxStyle}>
          <form style={formStyle} onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input
                style={inputStyle}
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  console.log('Email changed:', e.target.value);
                  setEmail(e.target.value);
                }}
                placeholder="Enter your email"
                disabled={isLoading}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={labelStyle} htmlFor="password">Password</label>
              <input
                style={inputStyle}
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  console.log('Password changed');
                  setPassword(e.target.value);
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={buttonStyle}
              disabled={isLoading}
              onClick={() => console.log('Submit button clicked')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={{ margin: '0 0 8px 0' }}>Don't have an account?</p>
          <button 
            style={linkButtonStyle}
            onClick={() => {
              console.log('Complete Wellness Quiz clicked!');
              alert('Complete the onboarding quiz to create your account!');
            }}
          >
            Complete Wellness Quiz →
          </button>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <button 
        style={greenButtonStyle}
        onClick={() => {
          console.log('New User button clicked!');
          alert('Starting onboarding quiz!');
        }}
      >
        👤 New User? Start Quiz
      </button>
    </div>
  );
}