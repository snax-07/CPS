'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Bell, Lock, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    weeklyReport: true,
    jobExpiryReminder: true,
    newApplicationNotification: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const handleDeleteAccount = () => {
    // Add delete account logic here
    router.push('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and notification preferences</p>
      </div>

      {/* Notifications Settings */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8b5cf6]" />
            Notification Settings
          </CardTitle>
          <CardDescription>Control how you receive updates about applications and jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#f5f5f3] transition-colors">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground cursor-pointer">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receive email updates about your account activity
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          {/* Application Alerts */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#f5f5f3] transition-colors">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground cursor-pointer">
                New Application Alerts
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Get notified instantly when someone applies to your jobs
              </p>
            </div>
            <Switch
              checked={settings.newApplicationNotification}
              onCheckedChange={() => handleToggle('newApplicationNotification')}
            />
          </div>

          {/* Weekly Reports */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#f5f5f3] transition-colors">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground cursor-pointer">
                Weekly Reports
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receive weekly summary of your job postings and applications
              </p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={() => handleToggle('weeklyReport')}
            />
          </div>

          {/* Job Expiry Reminder */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#f5f5f3] transition-colors">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground cursor-pointer">
                Job Expiry Reminders
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Get reminder when your job postings are about to expire
              </p>
            </div>
            <Switch
              checked={settings.jobExpiryReminder}
              onCheckedChange={() => handleToggle('jobExpiryReminder')}
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[#e5e5e5]">
            <Button className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password & Security */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#8b5cf6]" />
            Password & Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div>
            <Label className="text-base font-semibold text-foreground">Change Password</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Update your password to keep your account secure
            </p>
            <Button variant="outline" className="border-[#e5e5e5] hover:bg-[#f5f5f3]">
              Change Password
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="pt-4 border-t border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold text-foreground cursor-pointer">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5">
                Enable 2FA
              </Button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="pt-4 border-t border-[#e5e5e5]">
            <Label className="text-base font-semibold text-foreground">Active Sessions</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Manage your active login sessions
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Current Device</p>
                  <p className="text-sm text-muted-foreground">Chrome on macOS • Last active now</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[#e5e5e5] border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logout */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-base font-semibold text-foreground">Logout</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Sign out from your account
              </p>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Delete Account */}
          <div className="pt-4 border-t border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-base font-semibold text-foreground">Delete Account</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-[#e5e5e5]">
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data, job postings, and applications will be permanently deleted.
                  </AlertDialogDescription>
                  <div className="flex gap-3 justify-end mt-6">
                    <AlertDialogCancel className="border-[#e5e5e5]">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
