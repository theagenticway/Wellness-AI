import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { APIService } from '@/lib/api';
import { JWTService } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    let backendToken = session.backendToken;
    
    // If no backend token exists, generate one for the current session
    if (!backendToken) {
      backendToken = JWTService.generateBackendToken({
        id: session.user.id || '',
        email: session.user.email || '',
        role: session.user.role || 'MEMBER',
        currentPhase: session.user.currentPhase || 'PHASE1',
      });
    }

    const onboardingData = await request.json();
    
    // Make authenticated request to backend using the unified API service
    const response = await APIService.post('/onboarding/submit', onboardingData, backendToken);
    const result = await response.json();
    
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Onboarding failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}