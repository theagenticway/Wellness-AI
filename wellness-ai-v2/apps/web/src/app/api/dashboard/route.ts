import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.backendToken) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Fetch user's daily plan and persona from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/wellness/daily-plan`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.backendToken}`,
        'Content-Type': 'application/json',
      },
    });

    const dashboardData = await response.json();

    if (!response.ok) {
      throw new Error(dashboardData.message || 'Failed to fetch dashboard data');
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}