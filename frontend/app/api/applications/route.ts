import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const auth_token = request.cookies.get('auth_token')?.value;
    
    if (!auth_token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data or JSON
    const contentType = request.headers.get('content-type');
    let placementId, applyMethod, resume;

    if (contentType?.includes('application/json')) {
      const body = await request.json();
      placementId = body.placementId;
      applyMethod = body.applyMethod;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      placementId = formData.get('placementId');
      applyMethod = formData.get('applyMethod');
      resume = formData.get('resume');
    }

    console.log('[v0] Application submitted:', {
      placementId,
      applyMethod,
      hasResume: !!resume,
    });

    // TODO: Call your backend API to save the application
    // Include: placementId, studentId (from auth_token), applyMethod, resume (if applicable)

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: 'mock-app-123',
    });
  } catch (error) {
    console.error('[v0] Application error:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
