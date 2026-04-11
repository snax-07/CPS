'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, CheckSquare, User, Settings, Users, Building2, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth-store';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRole = user?.role;

  // Student navigation
  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/placements', label: 'Placements', icon: Briefcase },
    { href: '/applications', label: 'Applications', icon: CheckSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  // Company navigation
  const companyLinks = [
    { href: '/company', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/company/jobs', label: 'Posted Jobs', icon: Briefcase },
    { href: '/company/applications', label: 'Applications', icon: FileStack },
    { href: '/company/profile', label: 'Company Profile', icon: Building2 },
  ];

  const links = userRole === 'company' ? companyLinks : studentLinks;

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-[#e5e5e5] flex-col">
      <div className="p-6 border-b border-[#e5e5e5]">
        <div className="text-xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
          Snax Hub
        </div>
        <p className="text-xs text-muted-foreground mt-2 capitalize">
          {userRole === 'company' ? 'Recruiter' : 'Student'} Portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white'
                  : 'text-muted-foreground hover:bg-[#f5f5f3]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e5e5e5] p-4">
        <Link
          href={userRole === 'company' ? '/company/settings' : '/settings'}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-[#f5f5f3] transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
