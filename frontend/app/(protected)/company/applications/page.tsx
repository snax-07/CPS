'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Eye, Trash2, Loader2, User } from 'lucide-react';
import { companyAPI, type Application } from '@/lib/api-client';
import { toast } from 'sonner';

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
  shortlisted: { color: 'bg-blue-100 text-blue-700', label: 'Shortlisted' },
  rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
  interview: { color: 'bg-green-100 text-green-700', label: 'Interview Scheduled' },
  accepted: { color: 'bg-purple-100 text-purple-700', label: 'Accepted' },
};

export default function CompanyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getAllApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      toast.error('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const studentName = typeof app.student === 'object' ? app.student?.name || '' : '';
    const jobTitle = typeof app.job === 'object' ? (app.job as any)?.title || '' : '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await companyAPI.updateApplicantStatus(applicationId, newStatus);
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus as Application['status'] } : app
        )
      );
      toast.success(`Status updated to ${statusConfig[newStatus]?.label || newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update application status');
    }
  };

  const handleViewProfile = (studentId: string) => {
    router.push(`/company/applications/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground mt-2">Manage and review all candidate applications</p>
      </div>

      {/* Search and Filter */}
      <Card className="border-[#e5e5e5]">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by candidate name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#e5e5e5]"
              />
            </div>
            <Button variant="outline" className="border-[#e5e5e5] hover:bg-[#f5f5f3]" onClick={fetchApplications}>
              Refresh
            </Button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white' : 'border-[#e5e5e5]'}
            >
              All ({applications.length})
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = applications.filter((a) => a.status === status).length;
              return (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white' : 'border-[#e5e5e5]'}
                >
                  {config.label} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => {
            const studentName = typeof application.student === 'object' ? application.student?.name || 'Unknown' : 'Unknown';
            const studentEmail = typeof application.student === 'object' ? application.student?.email || '' : '';
            const studentId = typeof application.student === 'object' ? application.student?._id : application.student;
            const jobTitle = typeof application.job === 'object' ? (application.job as any)?.title || 'Position' : 'Position';
            const statusInfo = statusConfig[application.status] || { color: 'bg-gray-100 text-gray-700', label: application.status };

            return (
              <Card key={application._id} className="border-[#e5e5e5] hover:border-[#8b5cf6]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{studentName}</h3>
                          {studentEmail && (
                            <p className="text-sm text-muted-foreground">{studentEmail}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Applied for: <span className="font-medium text-foreground">{jobTitle}</span> • {' '}
                        {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 
                         application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                        {application.applyMethod && (
                          <Badge variant="outline" className="border-[#e5e5e5]">
                            Applied via {application.applyMethod}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5"
                        onClick={() => handleViewProfile(studentId as string)}
                      >
                        <User className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      {application.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#e5e5e5] hover:bg-[#f5f5f3]"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex gap-2 flex-wrap">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application._id, e.target.value)}
                      className="text-sm border border-[#e5e5e5] rounded-md px-3 py-2 bg-white text-foreground hover:border-[#8b5cf6]"
                    >
                      <option value="pending">Mark as Pending</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="interview">Schedule Interview</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-[#e5e5e5]">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {searchTerm || filterStatus !== 'all' ? 'No applications match your filters' : 'No applications received yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Applications will appear here once students apply to your jobs'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
