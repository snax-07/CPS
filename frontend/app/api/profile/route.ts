import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const auth_token = request.cookies.get('auth_token')?.value;
    
    if (!auth_token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract profile data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const location = formData.get('location');
    const headline = formData.get('headline');
    const bio = formData.get('bio');
    const skills = JSON.parse(formData.get('skills') as string);
    const education = JSON.parse(formData.get('education') as string);
    const resume = formData.get('resume') as File;

    console.log('[v0] Profile update:', {
      name,
      email,
      skillsCount: skills?.length,
      hasResume: !!resume,
    });

    // TODO: Call your backend API to update the student profile
    // Include: all profile data, resume file (if present)

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('[v0] Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth_token = request.cookies.get('auth_token')?.value;
    
    if (!auth_token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Fetch student profile from your backend API
    
    const mockProfile = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      headline: 'Computer Science Student',
      bio: 'Passionate developer',
      skills: ['JavaScript', 'React', 'Python'],
      education: [],
      resumeUrl: '/resume.pdf',
    };

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('[v0] Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
