import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Unified API service for making authenticated requests to the backend
 */
export class APIService {
  private static readonly backendUrl = process.env.INTERNAL_API_URL || 'http://backend:3001';

  /**
   * Make an authenticated request to the backend using the session's backend token
   */
  static async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {},
    customToken?: string
  ): Promise<Response> {
    let token = customToken;
    
    // If no custom token provided, get from session
    if (!token) {
      const session = await getServerSession(authOptions);
      if (!session?.backendToken) {
        throw new Error('No authentication token available');
      }
      token = session.backendToken;
    }

    // Merge headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Make the request to the backend
    return fetch(`${this.backendUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }

  /**
   * POST request with authentication
   */
  static async post(endpoint: string, data: any, customToken?: string): Promise<Response> {
    return this.authenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, customToken);
  }

  /**
   * GET request with authentication
   */
  static async get(endpoint: string): Promise<Response> {
    return this.authenticatedRequest(endpoint, {
      method: 'GET',
    });
  }

  /**
   * PUT request with authentication
   */
  static async put(endpoint: string, data: any): Promise<Response> {
    return this.authenticatedRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request with authentication
   */
  static async delete(endpoint: string): Promise<Response> {
    return this.authenticatedRequest(endpoint, {
      method: 'DELETE',
    });
  }
}