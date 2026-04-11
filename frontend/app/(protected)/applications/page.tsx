'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { applicationAPI, type Application } from '@/lib/api-client';
import { toast } from 'sonner';
import { EmptyState } from '@/components/empty-state';
import { TableSkeletonLoader } from '@/components/loading-skeleton';

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationAPI.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      toast.error('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'interview':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusBgColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-[#f5f5f3] border-[#e5e5e5]';
    }
  };

  const getStatusTextColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'red':
        return 'text-red-700';
      default:
        return 'text-foreground';
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">My Applications</h1>
        <TableSkeletonLoader rows={4} />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <EmptyState
          icon={AlertCircle}
          title="No Applications Yet"
          description="Start applying to placements to see them here"
          action={{
            label: 'Browse Placements',
            onClick: () => {
              // Add navigation logic here
            },
          }}
        />
      </div>
    );
  }

  const stats = [
    { label: 'Total Applications', value: applications.length },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of all your job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-[#e5e5e5]">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#8b5cf6]">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {applications.map(app => {
          const jobTitle =
            typeof app.job === 'object' ? app.job?.title : 'Job Position';
          const company =
            typeof app.job === 'object' ? app.job?.company : 'Company Name';
          const statusColor = getStatusColor(app.status);

          return (
            <Card
              key={app._id}
              className={`border-2 cursor-pointer transition-all hover:shadow-md ${getStatusBgColor(
                statusColor
              )}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Left */}
                  <div className="flex-1 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {company?.charAt(0)?.toUpperCase() || 'J'}
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">
                        {jobTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied on{' '}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 md:min-w-[200px]">
                    {app.status === 'accepted' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {app.status === 'interview' && (
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    )}
                    {app.status === 'pending' && (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    {app.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}

                    <div>
                      <p
                        className={`font-semibold capitalize ${getStatusTextColor(
                          statusColor
                        )}`}
                      >
                        {app.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status updated
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#e5e5e5] gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Message</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="border-[#8b5cf6]/30 bg-gradient-to-br from-[#f5f5f3] to-[#f0f0ed]">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Success</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">• Keep your profile up-to-date</p>
          <p className="text-sm">• Customize your resume per job</p>
          <p className="text-sm">• Check your email regularly</p>
        </CardContent>
      </Card>
    </div>
  );
}