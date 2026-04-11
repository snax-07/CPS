import { authAPI } from '@/lib/api-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // TODO: Implement backend API call to your auth server
    // This is a placeholder - replace with actual backend call
    console.log('[v0] Signup request:', { name, email, role });

    // Validate role
    if (!['student', 'company'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Mock response - replace with actual backend response
    // Set HttpOnly cookies
    const response = NextResponse.json(authAPI.register(name , email , password , role));
    response.cookies.set('user_role', (response as any).role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { message: 'Signup failed' },
      { status: 500 }
    );
  }
}
