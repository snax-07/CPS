'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, MapPin, Briefcase, Clock, DollarSign, Download, CheckCircle, FileText } from 'lucide-react';
import { jobAPI } from '@/lib/api-client';
import { toast } from 'sonner';

export default function PlacementDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyMethod, setApplyMethod] = useState<'profile' | 'resume' | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [jobData, statusData] = await Promise.all([
          jobAPI.getJobById(id as string),
          jobAPI.getApplicationStatus(id as string)
        ]);
        setPlacement(jobData);
        if (statusData.applied) setHasApplied(true);
      } catch (error) {
        toast.error("Failed to load opportunity data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleApplyWithProfile = async () => {
    try {
      setSubmitting(true);
      await jobAPI.applyWithProfile(id as string);
      toast.success("Profile application submitted!");
      setHasApplied(true);
      setApplyMethod(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Profile application failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyWithResume = async () => {
    if (!resumeFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      // 'resume' must match the field name your backend Multer middleware expects
      formData.append('resume', resumeFile);
      formData.append('applyMethod', 'resume');

      await jobAPI.applyWithResume(id as string, formData);
      
      toast.success("Resume application submitted successfully!");
      setHasApplied(true);
      setApplyMethod(null);
      setResumeFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading opportunity...</div>;
  if (!placement) return <div className="p-10 text-center">Opportunity not found.</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#8b5cf6] font-semibold">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-3xl font-bold">
            {placement.company?.charAt(0) || 'C'}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{placement.title}</h1>
            <p className="text-white/90 text-lg">{placement.company}</p>
          </div>
          <Badge className="bg-white/20 text-white border-none py-2 px-4">
            {hasApplied ? "Applied" : "Active"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#e5e5e5]">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <InfoItem icon={<MapPin className="w-5 h-5" />} label="Location" value={placement.location} />
                <InfoItem icon={<DollarSign className="w-5 h-5" />} label="Salary" value={placement.salary} />
                <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Role" value={placement.title} />
                <InfoItem icon={<Clock className="w-5 h-5" />} label="Deadline" value={placement.deadline ? new Date(placement.deadline).toLocaleDateString() : 'N/A'} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#e5e5e5]">
            <CardHeader><CardTitle className="text-2xl font-bold">About the Role</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{placement.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-[#e5e5e5] sticky top-20 shadow-md">
            <CardHeader>
              <CardTitle>{hasApplied ? "Status" : "Submit Application"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasApplied ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-900">Applied Successfully</p>
                  <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Link href="/applications">View All Applications</Link>
                  </Button>
                </div>
              ) : (
                applyMethod === null ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Button onClick={() => setApplyMethod('profile')} className="w-full bg-[#8b5cf6] text-white">
                      Apply with Profile
                    </Button>
                    <Button onClick={() => setApplyMethod('resume')} variant="outline" className="w-full border-[#8b5cf6] text-[#8b5cf6]">
                      Upload Resume
                    </Button>
                  </div>
                ) : applyMethod === 'profile' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-muted-foreground border">
                      Applying using your verified platform profile.
                    </div>
                    <Button onClick={handleApplyWithProfile} disabled={submitting} className="w-full bg-[#8b5cf6]">
                      {submitting ? 'Submitting...' : 'Confirm Submission'}
                    </Button>
                    <Button onClick={() => setApplyMethod(null)} variant="ghost" className="w-full">Cancel</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-[#8b5cf6]/30 rounded-lg text-center">
                      <label className="cursor-pointer">
                        <Download className="w-6 h-6 text-[#8b5cf6] mx-auto mb-2" />
                        <span className="text-sm font-semibold block">Select Resume</span>
                        <span className="text-xs text-muted-foreground">PDF or DOCX</span>
                        <input 
                           type="file" 
                           accept=".pdf,.docx" 
                           onChange={(e) => setResumeFile(e.target.files?.[0] || null)} 
                           className="hidden" 
                        />
                      </label>
                    </div>
                    {resumeFile && (
                      <div className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-700">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-medium truncate">{resumeFile.name}</span>
                      </div>
                    )}
                    <Button onClick={handleApplyWithResume} disabled={!resumeFile || submitting} className="w-full bg-[#8b5cf6]">
                      {submitting ? 'Uploading...' : 'Submit Resume'}
                    </Button>
                    <Button onClick={() => setApplyMethod(null)} variant="ghost" className="w-full">Cancel</Button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#8b5cf6] p-2 bg-[#8b5cf6]/10 rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] uppercase text-muted-foreground font-bold">{label}</p>
        <p className="font-bold text-sm truncate max-w-[100px]">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}