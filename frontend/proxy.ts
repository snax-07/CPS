import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];
const studentRoutes = ['/dashboard', '/placements', '/applications', '/profile'];
const companyRoutes = ['/company'];
const adminRoutes = ['/admin'];
const protectedRoutes = [...studentRoutes, ...companyRoutes, ...adminRoutes];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // If user has token and tries to access public routes (login, signup, landing)
  if (token && userRole && publicRoutes.includes(pathname)) {
    const redirectPath = 
      userRole === 'student' ? '/dashboard' :
      userRole === 'company' ? '/company' :
      userRole === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // If user doesn't have token and tries to access protected routes
  if (!token || !userRole) {
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Role-based route access
  if (studentRoutes.some(route => pathname.startsWith(route)) && userRole !== 'student') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (companyRoutes.some(route => pathname.startsWith(route)) && userRole !== 'company') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon\\.svg).*)'],
};
