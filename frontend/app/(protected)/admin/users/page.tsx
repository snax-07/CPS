'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableSkeletonLoader, EmptyState } from '@/components/loading-skeleton';
import { Trash2, RotateCcw, Search } from 'lucide-react';
import { toast } from 'sonner';

const mockUsers = [
  {
    id: 1,
    name: 'Raj Kumar',
    email: 'raj@example.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya@example.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-02-20',
  },
  {
    id: 3,
    name: 'TechCorp Inc',
    email: 'hr@techcorp.com',
    role: 'company',
    status: 'active',
    joinedDate: '2024-01-10',
  },
  {
    id: 4,
    name: 'Arun Patel',
    email: 'arun@example.com',
    role: 'student',
    status: 'inactive',
    joinedDate: '2023-11-05',
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetPassword = async (userId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Password reset email sent');
      setIsLoading(false);
      setSelectedUser(null);
    }, 500);
  };

  const handleDeleteUser = async (userId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User deleted successfully');
      setIsLoading(false);
      setSelectedUser(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage all system users - students and companies</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-[#e5e5e5]"
        />
      </div>

      {/* Users Table */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeletonLoader rows={4} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No users found"
              description="Try adjusting your search criteria"
              variant="small"
            />
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-[#e5e5e5] rounded-lg hover:border-[#8b5cf6]/50 hover:bg-white/50 transition-all flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]" />
                      <div>
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={user.role === 'student' ? 'secondary' : 'default'}
                      className={
                        user.role === 'company'
                          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white'
                          : ''
                      }
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        user.status === 'active'
                          ? 'border-green-500 text-green-700'
                          : 'border-gray-500 text-gray-700'
                      }
                    >
                      {user.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Management Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="p-4 rounded-lg bg-[#f5f5f3] border border-[#e5e5e5]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]" />
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Role</p>
                    <p className="font-semibold text-foreground">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <p className="font-semibold text-foreground">{selectedUser.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Joined</p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedUser.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleResetPassword(selectedUser.id)}
                  variant="outline"
                  className="w-full justify-start border-[#e5e5e5]"
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
                <Button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  variant="destructive"
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
