'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only check role after Zustand store has hydrated
    if (mounted && user && user.role !== 'company') {
      router.replace('/dashboard');
    }
  }, [mounted, user, router]);

  // Show nothing while waiting for hydration
  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#f5f5f3] via-[#fafaf8] to-[#f0f0ed]" />;
  }

  return <>{children}</>;
}
