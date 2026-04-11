'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Briefcase, Users, Eye, TrendingUp, Target, Loader2, Star, Badge } from 'lucide-react';
import { companyAPI, Job, Application } from '@/lib/api-client';
import { toast } from 'sonner';

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    profileViews: 0
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApps, setRecentApps] = useState<Application[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, jobs, apps] = await Promise.all([
        companyAPI.getStats(),
        companyAPI.getMyJobs(),
        companyAPI.getAllApplications()
      ]);

      if (stats) setStatsData(stats);
      setRecentJobs(jobs?.slice(0, 3) || []);
      setRecentApps(apps?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Active Jobs', value: statsData.activeJobs.toString(), icon: Briefcase, color: 'from-[#8b5cf6] to-[#7c3aed]' },
    { label: 'Total Applicants', value: statsData.totalApplicants.toString(), icon: Users, color: 'from-[#a78bfa] to-[#8b5cf6]' },
    { label: 'Profile Views', value: statsData.profileViews.toString(), icon: Eye, color: 'from-[#7c3aed] to-[#8b5cf6]' },
    { label: 'Shortlisted', value: statsData.shortlisted.toString(), icon: TrendingUp, color: 'from-[#8b5cf6] to-[#a78bfa]' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="opacity-90">Find and hire top talent for your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-[#e5e5e5] hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs List */}
        <Card className="lg:col-span-2 border-[#e5e5e5]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Active Jobs</CardTitle>
              <CardDescription>Recently posted job openings</CardDescription>
            </div>
            <Link href="/company/my-jobs">
              <Button variant="ghost" size="sm" className="text-[#8b5cf6]">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border border-[#e5e5e5] rounded-lg hover:border-[#8b5cf6]/50 hover:bg-white transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {job.applicants || 0} applicants
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : job.status === 'closed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        <Link href={`/company/jobs/${job._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active jobs found. Post a new job to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/company/jobs" className="block">
              <Button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </Link>
            <Link href="/company/applications" className="block">
              <Button variant="outline" className="w-full border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5">
                View Applications
              </Button>
            </Link>
            <Link href="/company/profile" className="block">
              <Button variant="outline" className="w-full border-[#e5e5e5] hover:bg-[#f5f5f3]">
                Company Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applicants */}
      <Card className="border-[#e5e5e5]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>Latest candidates who applied to your jobs</CardDescription>
          </div>
          <Link href="/company/applications">
            <Button variant="ghost" size="sm" className="text-[#8b5cf6]">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApps.length > 0 ? (
              recentApps.map((app) => {
                const studentName = typeof app.student === 'object' ? app.student?.name || 'Candidate' : 'Candidate';
                const jobTitle = typeof app.job === 'object' ? (app.job as any)?.title || 'Position' : 'Position';
                const studentId = typeof app.student === 'object' ? app.student?._id : app.student;

                return (
                  <div key={app._id} className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg hover:bg-white transition-all hover:shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{studentName}</h3>
                      <p className="text-sm text-muted-foreground">{jobTitle} • {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-2 bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20">
                        {app.status}
                      </Badge>
                      <br />
                      <Link href={`/company/applications/${studentId}`}>
                        <Button variant="ghost" size="sm">Review Profile</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent applications found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
