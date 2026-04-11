'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { TableSkeletonLoader } from '@/components/loading-skeleton';
import { Download, Eye, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { jobAPI, companyAPI } from '@/lib/api-client';
import { useParams, useRouter } from 'next/navigation';

export default function ApplicantsPipeline() {
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  const params = useParams(); // Get params object
  const jobId = params.id as string; // Extract 'id' from jobs/[id]


  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        // Correct API call: use companyAPI to get applicants for this job
        const data = await companyAPI.viewJobApplicants(jobId); 
        setApplicants(data || []);
      } catch (error: any) {
        console.error('Failed to fetch applicants:', error);
        toast.error("Failed to fetch applicants");
        setApplicants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          const jobDetails = await jobAPI.getJobById(jobId as string);
          setJob(jobDetails);
        } catch (error) {
          toast.error('Failed to fetch job details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchJobDetails();
    }
  }, [jobId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!job) {
    return <p>Job not found</p>;
  }

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      setIsLoading(true);
      await companyAPI.updateApplicantStatus(applicantId, newStatus);
      setApplicants(
        applicants.map((app: any) =>
          app._id === applicantId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    toast.success(`Email sent to ${selectedApplicant?.name}`);
  };

  const statusBadges = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    interview: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Applicants for {job?.title || 'Loading...'}</h1>
        <p className="text-muted-foreground mt-2">Manage and review applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Pending', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'].map((filter) => (
          <Button
            key={filter}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Applicants List */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Applicants Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No applicants yet"
              description="Try sharing your job link to attract more candidates"
              action={{ label: 'Share Job', onClick: () => {} }}
              variant="premium"
            />
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant : any) => (
                <div
                  key={applicant._id}
                  className="p-4 border border-[#e5e5e5] rounded-lg hover:border-[#8b5cf6]/50 hover:bg-white/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]" />
                        <div>
                          <h3 className="font-semibold text-foreground">{applicant.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {applicant.department} • CGPA: {applicant.cgpa}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {applicant.skills?.map((skill : any) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusBadges[applicant.status as keyof typeof statusBadges]}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplicant(applicant)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applicant Quick View Modal */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{selectedApplicant.name}</h2>
                  <p className="text-muted-foreground">{selectedApplicant.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-foreground">{selectedApplicant.department}</span>
                    <span className="text-foreground">CGPA: {selectedApplicant.cgpa}</span>
                  </div>
                </div>
                <Badge className={statusBadges[selectedApplicant.status as keyof typeof statusBadges]}>
                  {selectedApplicant.status}
                </Badge>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.skills.map((skill : any) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open('#', '_blank');
                    toast.success('Resume downloaded');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSendEmail}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>

              {/* Status Buttons */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedApplicant.status === 'shortlisted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplicant._id, 'shortlisted')}
                    className={selectedApplicant.status === 'shortlisted' ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' : ''}
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant={selectedApplicant.status === 'interview' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplicant._id, 'interview')}
                    className={selectedApplicant.status === 'interview' ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' : ''}
                  >
                    Interview
                  </Button>
                  <Button
                    variant={selectedApplicant.status === 'accepted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplicant._id, 'accepted')}
                    className={selectedApplicant.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Accept
                  </Button>
                  <Button
                    variant={selectedApplicant.status === 'rejected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplicant._id, 'rejected')}
                    className={selectedApplicant.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
