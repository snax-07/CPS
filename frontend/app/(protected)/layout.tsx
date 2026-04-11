'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { useAuthStore } from '@/lib/store/auth-store';
import Cookies from 'js-cookie';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthenticated = checkAuth();
    const userRoleCookie = Cookies.get('user_role');

    // If not authenticated and no user_role cookie, redirect to login
    // We check user_role cookie because 'token' is httpOnly and invisible to client JS
    if (!isAuthenticated && !userRoleCookie) {
      router.push('/login');
      return;
    }

    // Role-based route guard: company users shouldn't be on student routes
    if (user?.role === 'company' && !pathname.startsWith('/company') && !pathname.startsWith('/admin')) {
      router.replace('/company');
      return;
    }

    // Role-based route guard: student users shouldn't be on company routes
    if (user?.role === 'student' && pathname.startsWith('/company')) {
      router.replace('/dashboard');
      return;
    }
  }, [mounted, user, pathname, checkAuth, router]);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#f5f5f3] via-[#fafaf8] to-[#f0f0ed]" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5f5f3] via-[#fafaf8] to-[#f0f0ed]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
       <main className="flex-1 overflow-auto p-6 md:p-8">
  <div className="max-w-7xl mx-auto">
    {children}
  </div>
</main>
      </div>
    </div>
  );
}
