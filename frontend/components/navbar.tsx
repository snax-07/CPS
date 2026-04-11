'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const { logout , user } = useAuthStore();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-[#f5f5f3] rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Snax Hub</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#f5f5f3] rounded-lg relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-sm font-semibold">
            {user?.name[0]}{user?.name.split(" ")[1][0]}
          </div>
        </div>

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
    </nav>
  );
}
