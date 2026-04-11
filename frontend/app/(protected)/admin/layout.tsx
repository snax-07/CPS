'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LogOut, Menu, Shield, Users, Building2, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutGrid },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f3] via-[#fafaf8] to-[#f0f0ed]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#8b5cf6]" />
            <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-[#f5f5f3] rounded"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r border-[#e5e5e5] bg-white p-6 transition-all duration-300 ${
            sidebarOpen ? 'fixed inset-0 top-[61px] z-30 w-full sm:w-64' : 'hidden lg:block'
          }`}
        >
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground hover:bg-[#f5f5f3]"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
