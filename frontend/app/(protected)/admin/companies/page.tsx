'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/empty-state';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockCompanies = [
  {
    id: 1,
    name: 'TechCorp India',
    email: 'hr@techcorp.com',
    website: 'techcorp.com',
    status: 'pending',
    submittedDate: '2024-03-01',
    document: 'Company_Registration_TechCorp.pdf',
  },
  {
    id: 2,
    name: 'Innovation Labs',
    email: 'recruit@innovationlabs.com',
    website: 'innovationlabs.in',
    status: 'pending',
    submittedDate: '2024-02-28',
    document: 'Company_Reg_InnovationLabs.pdf',
  },
  {
    id: 3,
    name: 'StartUp Hub',
    email: 'team@startuphub.in',
    website: 'startuphub.co.in',
    status: 'verified',
    submittedDate: '2024-02-20',
    document: 'Company_StartUpHub.pdf',
  },
  {
    id: 4,
    name: 'Global Tech Solutions',
    email: 'careers@globaltechsol.com',
    website: 'globaltechsolutions.com',
    status: 'rejected',
    submittedDate: '2024-02-15',
    document: 'GlobalTechSolutions_Doc.pdf',
  },
];

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState<typeof mockCompanies[0] | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pendingCount = companies.filter((c) => c.status === 'pending').length;
  const verifiedCount = companies.filter((c) => c.status === 'verified').length;
  const rejectedCount = companies.filter((c) => c.status === 'rejected').length;

  const handleApprove = async (companyId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCompanies(
        companies.map((c) => (c.id === companyId ? { ...c, status: 'verified' } : c))
      );
      toast.success('Company verified successfully');
      setIsLoading(false);
      setSelectedCompany(null);
    }, 500);
  };

  const handleReject = async (companyId: number) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setCompanies(
        companies.map((c) => (c.id === companyId ? { ...c, status: 'rejected' } : c))
      );
      toast.success('Company rejected successfully');
      setIsLoading(false);
      setRejectionReason('');
      setSelectedCompany(null);
    }, 500);
  };

  const statusConfig = {
    pending: { badge: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    verified: { badge: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    rejected: { badge: 'bg-red-100 text-red-800', icon: XCircle },
  };

  const pendingCompanies = companies.filter((c) => c.status === 'pending');
  const verifiedCompanies = companies.filter((c) => c.status === 'verified');
  const rejectedCompanies = companies.filter((c) => c.status === 'rejected');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
        <p className="text-muted-foreground mt-2">Verify and manage company registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#e5e5e5]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e5e5]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e5e5]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verification Tab */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Pending Verification ({pendingCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingCompanies.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All caught up!"
              description="No pending company verifications at the moment"
              variant="small"
            />
          ) : (
            <div className="space-y-3">
              {pendingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-4 border border-[#e5e5e5] rounded-lg hover:border-amber-300 hover:bg-amber-50/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{company.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{company.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Website: {company.website}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(company.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedCompany(company)}
                      className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verified Companies */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Verified Companies ({verifiedCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedCompanies.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No verified companies yet"
              description="Approve pending companies to see them here"
              variant="small"
            />
          ) : (
            <div className="space-y-3">
              {verifiedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-4 border border-green-200 rounded-lg bg-green-50/30 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.email}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Review Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Verification Review</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Details */}
              <div className="p-4 rounded-lg bg-[#f5f5f3] border border-[#e5e5e5]">
                <h3 className="font-semibold text-foreground mb-4">{selectedCompany.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Website</p>
                    <p className="font-semibold text-foreground">{selectedCompany.website}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedCompany.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Document</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-[#8b5cf6] hover:text-[#7c3aed]"
                    >
                      {selectedCompany.document}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Rejection Reason (if rejecting) */}
              {selectedCompany.status === 'pending' && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Rejection Reason (if applicable)
                  </label>
                  <Textarea
                    placeholder="Enter reason for rejection if you choose to reject this company"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="border-[#e5e5e5]"
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedCompany.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleApprove(selectedCompany.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedCompany.id)}
                    variant="destructive"
                    disabled={isLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
