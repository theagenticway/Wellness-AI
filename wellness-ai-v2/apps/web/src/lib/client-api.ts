import { getSession } from 'next-auth/react';

/**
 * Client-side API utility for making requests through our API routes
 * This handles authentication through NextAuth sessions on the client side
 */
export class ClientAPI {
  /**
   * Make an authenticated API request through our Next.js API routes
   */
  private static async request(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    // For client-side requests, we rely on Next.js API routes to handle authentication
    // The API routes will use getServerSession to get the authenticated session
    return fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }

  /**
   * POST request to our API routes
   */
  static async post(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * GET request to our API routes
   */
  static async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Submit onboarding data
   */
  static async submitOnboarding(onboardingData: any): Promise<any> {
    const response = await this.post('/api/onboarding/submit', onboardingData);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Onboarding submission failed');
    }
    
    return response.json();
  }

  /**
   * Get user profile (example for future use)
   */
  static async getUserProfile(): Promise<any> {
    const response = await this.get('/api/user/profile');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user profile');
    }
    
    return response.json();
  }
}