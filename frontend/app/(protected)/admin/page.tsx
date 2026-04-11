'use client';

import { BarChart3, Users, Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mockStats = {
  totalStudents: 1250,
  totalCompanies: 45,
  placementPercentage: 78,
  activeJobPostings: 127,
};

export default function AdminDashboard() {
  const handleExportReport = () => {
    toast.success('Report exported successfully!');
    // TODO: Implement CSV/Excel export
  };

  const statsCards = [
    {
      label: 'Total Students',
      value: mockStats.totalStudents.toLocaleString(),
      icon: Users,
      color: 'from-[#8b5cf6] to-[#7c3aed]',
      trend: '+12% this month',
    },
    {
      label: 'Total Companies',
      value: mockStats.totalCompanies,
      icon: Building2,
      color: 'from-[#a78bfa] to-[#8b5cf6]',
      trend: '+3% this month',
    },
    {
      label: 'Placement Rate',
      value: `${mockStats.placementPercentage}%`,
      icon: TrendingUp,
      color: 'from-[#7c3aed] to-[#8b5cf6]',
      trend: '+5% from last year',
    },
    {
      label: 'Active Jobs',
      value: mockStats.activeJobPostings,
      icon: BarChart3,
      color: 'from-[#a78bfa] to-[#7c3aed]',
      trend: '+24 this month',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System-wide analytics and management</p>
        </div>
        <Button
          onClick={handleExportReport}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg"
        >
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-[#e5e5e5] hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <Icon className="w-4 h-4 text-[#8b5cf6]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              Pending Company Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'TechCorp India', email: 'hr@techcorp.com', date: '2 hours ago' },
                { name: 'Innovation Labs', email: 'recruit@innovationlabs.com', date: '5 hours ago' },
                { name: 'StartUp Hub', email: 'team@startuphub.in', date: '1 day ago' },
              ].map((company, idx) => (
                <div key={idx} className="p-3 border border-[#e5e5e5] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{company.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New student registration', time: '2 minutes ago', type: 'success' },
                { action: 'Job application submitted', time: '8 minutes ago', type: 'success' },
                { action: 'Company verification request', time: '45 minutes ago', type: 'pending' },
                { action: 'Student profile updated', time: '2 hours ago', type: 'success' },
                { action: 'Password reset requested', time: '3 hours ago', type: 'warning' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-[#e5e5e5] last:border-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success'
                        ? 'bg-green-500'
                        : activity.type === 'pending'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
