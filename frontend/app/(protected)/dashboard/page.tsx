'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, BookOpen, Target, Loader } from 'lucide-react';
import Link from 'next/link';
import {  jobAPI, type Application, type Job } from '@/lib/api-client';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const [appsData, jobsData] = await Promise.all([
      //   // applicationAPI.getApplications().catch(() => []),
      //   // jobAPI.getAllJobs().catch(() => []),
      // ]);
      // setApplications(appsData || []);
      // setJobs(jobsData || []);
    } catch (err) {
      console.error('[v0] Failed to fetch dashboard data:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Applications',
      value: applications.length.toString(),
      description: 'Total applications sent',
      icon: Target,
      color: 'from-[#8b5cf6] to-[#7c3aed]',
    },
    {
      title: 'Pending',
      value: applications.filter(a => a.status === 'pending').length.toString(),
      description: 'Awaiting review',
      icon: TrendingUp,
      color: 'from-[#a78bfa] to-[#8b5cf6]',
    },
    {
      title: 'Active Placements',
      value: jobs.length.toString(),
      description: 'Open positions available',
      icon: BookOpen,
      color: 'from-[#7c3aed] to-[#6d28d9]',
    },
    {
      title: 'Interviews',
      value: applications.filter(a => a.status === 'interview').length.toString(),
      description: 'Interview scheduled',
      icon: AlertCircle,
      color: 'from-[#8b5cf6] to-[#a78bfa]',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, {userName}! 👋</h1>
        <p className="opacity-90">Here's what's happening with your placements today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-[#e5e5e5] hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  company: 'Google',
                  position: 'Software Engineer Intern',
                  date: '2 days ago',
                  status: 'Under Review',
                },
                {
                  company: 'Microsoft',
                  position: 'Cloud Developer',
                  date: '1 week ago',
                  status: 'Rejected',
                },
                {
                  company: 'Amazon',
                  position: 'Data Engineer',
                  date: '2 weeks ago',
                  status: 'Interview Scheduled',
                },
              ].map((app, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg hover:bg-[#f5f5f3] transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{app.position}</h3>
                    <p className="text-sm text-muted-foreground">{app.company} • {app.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'Interview Scheduled' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/placements" className="block">
              <Button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white">
                Browse Placements
              </Button>
            </Link>
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5">
                Update Profile
              </Button>
            </Link>
            <Link href="/applications" className="block">
              <Button variant="outline" className="w-full border-[#e5e5e5] hover:bg-[#f5f5f3]">
                View Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Your scheduled interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                company: 'Google',
                date: 'Mar 15, 2024',
                time: '2:00 PM',
                round: 'Technical Round',
              },
              {
                company: 'Amazon',
                date: 'Mar 18, 2024',
                time: '10:00 AM',
                round: 'HR Round',
              },
            ].map((interview, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border border-[#e5e5e5] rounded-lg">
                <div className="w-2 h-12 bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{interview.company}</h3>
                  <p className="text-sm text-muted-foreground">{interview.round}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{interview.date}</p>
                  <p className="text-sm text-muted-foreground">{interview.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
