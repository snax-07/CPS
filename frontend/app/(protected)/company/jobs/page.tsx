'use client';

import { useState , useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Eye, Users, Calendar, Trash2, Edit2, Briefcase, MapPin, DollarSign, FileText, XCircle } from 'lucide-react';
import { authAPI, companyAPI, jobAPI } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface JobPosting {
  _id : string
  id: string;
  title: string;
  position: string;
  applicants: number;
  views: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  expiryDate: string;
  salary?: string;
  location: string;
}


const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-700', label: 'Active' },
  closed: { color: 'bg-gray-100 text-gray-700', label: 'Closed' },
  draft: { color: 'bg-yellow-100 text-yellow-700', label: 'Draft' },
};

export default function CompanyJobsPage() {
  const [isLoading , setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    requirements: [''],
    deadline: '',
  });
const [isPosting, setIsPosting] = useState(false); // Specific state for the button
const [jobs, setJobs] = useState<JobPosting[]>([]); // Start with empty array
const router = useRouter();

// 1. Fetch jobs from backend on mount
const fetchJobs = async () => {
  try {
    setIsLoading(true);
    const response = await jobAPI.getAllJobs(); 
    setJobs(response as any)
  } catch (error) {
    toast.error("Failed to load your job postings");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchJobs();
}, []);
const handleAddJob = async () => {
  // Filter out any empty requirement strings
  const cleanRequirements = newJob.requirements.filter(req => req.trim() !== "");

  const jobPayload = {
    title: newJob.title,
    company: newJob.company,
    description: newJob.description,
    location: newJob.location,
    salary: newJob.salary,
    deadline: newJob.deadline,
    requirements: cleanRequirements
  };

  try {
    setIsPosting(true);
    // API Call to Backend
    const response = await companyAPI.postJob(jobPayload);

    // Assuming your backend returns { success: true, job: { ... } } or just the job object
    const savedJob = response.job || response.data?.job || response;

    if (savedJob) {
      // 1. Transform backend data to match your Frontend 'JobPosting' interface
      const formattedJob: JobPosting = {
        _id: savedJob._id,
        id: savedJob._id,
        title: savedJob.title,
        position: savedJob.title, // Map title to position for your UI
        applicants: 0,
        views: 0,
        status: 'active',
        postedDate: new Date().toLocaleDateString(),
        expiryDate: new Date(savedJob.deadline).toLocaleDateString(),
        salary: savedJob.salary,
        location: savedJob.location,
      };

      // 2. Update local state immediately (Prepending to the top of the list)
      setJobs((prevJobs) => [formattedJob, ...prevJobs]);

      // 3. Reset UI State: Hide form and clear inputs
      setShowAddJob(false);
      setNewJob({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        requirements: [''],
        deadline: '',
      });

      toast.success("Job posted successfully!");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to post job");
  } finally {
    setIsPosting(false);
  }
};
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

// Inside your CompanyJobsPage component
const handleDeleteJob = async (jobId: string) => {
  try {
    // 1. Backend Call: Specifically updating the 'status' field
    // Ensure companyAPI.updateJob is defined to use PATCH /jobs/:id
    const response : any = await jobAPI.updateJob(jobId, { status: 'closed' });

    if (response) {
      // 2. Local State Update: Seamlessly update the UI without refresh
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          (job._id === jobId || job.id === jobId) 
            ? { ...job, status: 'closed' } 
            : job
        )
      );
      toast.success("Job listing successfully closed");
    }
  } catch (error) {
    toast.error("Failed to update job status");
  }
};
  const handleViewJobDetails = (jobId: string) => {
    router.push(`/company/jobs/${jobId}`);
  };


  const stats = [
    {
      label: 'Active Listings',
      value: jobs.filter((j) => j.status === 'active').length,
      color: 'text-green-600',
    },
    {
      label: 'Closed Listings',
      value: jobs.filter((j) => j.status === 'closed').length,
      color: 'text-gray-600',
    },
    {
      label: 'Draft Listings',
      value: jobs.filter((j) => j.status === 'draft').length,
      color: 'text-yellow-600',
    },
    {
      label: 'Total Applications',
      value: jobs.reduce((sum, j) => sum + j.applicants, 0),
      color: 'text-[#8b5cf6]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Posted Jobs</h1>
        <p className="text-muted-foreground mt-2">Manage all your job postings</p>
      </div>

      {/* Add New Job Card */}
      {!showAddJob ? (
        <Card className="border-[#e5e5e5] bg-gradient-to-br from-[#8b5cf6]/5 to-[#7c3aed]/5 hover:border-[#8b5cf6]/50 transition-all cursor-pointer">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Post a New Job</h3>
                  <p className="text-sm text-muted-foreground">Create a new job opening and start receiving applications</p>
                </div>
              </div>
              <Button
                onClick={() => setShowAddJob(true)}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg"
              >
                Add Job
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#8b5cf6] bg-white">
          <CardHeader className="border-b border-[#e5e5e5]">
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Fill in the details to create a new job posting</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Job Title *</label>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="border-[#e5e5e5]"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name *</label>
                <Input
                  placeholder="e.g., Tech Company Inc."
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="border-[#e5e5e5]"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Job Description *
                </label>
                <textarea
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full p-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Location and Salary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location *
                  </label>
                  <Input
                    placeholder="e.g., San Francisco, CA"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="border-[#e5e5e5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Salary Range *
                  </label>
                  <Input
                    placeholder="e.g., ₹15-22L"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="border-[#e5e5e5]"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Application Deadline *
                </label>
                <Input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="border-[#e5e5e5]"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Requirements *</label>
                <div className="space-y-2">
                  {newJob.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder={`Requirement ${idx + 1}`}
                        value={req}
                        onChange={(e) => {
                          const updated = [...newJob.requirements];
                          updated[idx] = e.target.value;
                          setNewJob({ ...newJob, requirements: updated });
                        }}
                        className="border-[#e5e5e5]"
                      />
                      {newJob.requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewJob({
                              ...newJob,
                              requirements: newJob.requirements.filter((_, i) => i !== idx),
                            });
                          }}
                          className="px-3"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewJob({ ...newJob, requirements: [...newJob.requirements, ''] })}
                  className="mt-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#e5e5e5]">
                <Button
                  onClick={handleAddJob}
                  disabled={
                    isPosting ||
                    !newJob.title ||
                    !newJob.description ||
                    !newJob.company ||
                    !newJob.location ||
                    !newJob.salary ||
                    !newJob.deadline ||
                    newJob.requirements.every((req) => !req.trim())
                  }
                  className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isPosting ? "Posting..." : "Post Job"}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddJob(false);
                    setNewJob({ title: '', description: '', company: '', location: '', salary: '', requirements: [''], deadline: '' });
                  }}
                  variant="outline"
                  className="flex-1 border-[#e5e5e5]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-[#e5e5e5]">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="border-[#e5e5e5]">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#e5e5e5]"
              />
            </div>
            <Button variant="outline" className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5">
              <Filter className="w-4 h-4 mr-2" />
              Filters
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
              All ({jobs.length})
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = jobs.filter((j) => j.status === status).length;
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

      {/* Jobs List */}
      <div className="space-y-4">
       {filteredJobs.length > 0 ? (
    filteredJobs.map((job) => (
      <Card
        key={job._id || job.id} 
        className="border-[#e5e5e5] hover:border-[#8b5cf6]/50 transition-all cursor-pointer"
        onClick={() => handleViewJobDetails(job._id || job.id)}
      >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Job Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        <Badge className={statusConfig[job.status].color}>
                          {statusConfig[job.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.position}</p>
                    </div>
                   <div className="flex gap-2">
  {/* VIEW DETAILS BUTTON */}
  <Button
    variant="outline"
    size="sm"
    className="border-[#e5e5e5] text-[#8b5cf6] hover:bg-[#8b5cf6]/5"
    onClick={(e) => {
      e.stopPropagation();
      handleViewJobDetails(job._id || job.id);
    }}
  >
    <Eye className="w-4 h-4 mr-2" />
    Applicants
  </Button>

  {/* CLOSE JOB BUTTON (Replaces Delete) */}
  {job.status === 'active' && (

<Button
  variant="outline"
  size="sm"
  className="border-[#e5e5e5] text-amber-600 hover:bg-amber-50"
  onClick={(e) => {
    e.stopPropagation(); // Prevents navigating to details page
    handleDeleteJob(job._id || job.id);
  }}
>
  <XCircle className="w-4 h-4 mr-2" />
  Close Job
</Button>
  )}
</div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#e5e5e5]">
                    {/* Applicants */}
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> Applicants
                      </p>
                      <p className="text-lg font-bold text-foreground mt-1">{job.applicants}</p>
                    </div>

                    {/* Views */}
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Views
                      </p>
                      <p className="text-lg font-bold text-foreground mt-1">{job.views}</p>
                    </div>

                    {/* Posted Date */}
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Posted
                      </p>
                      <p className="text-sm text-foreground mt-1">{job.postedDate}</p>
                    </div>

                    {/* Salary */}
                    <div>
                      <p className="text-xs text-muted-foreground">Salary Range</p>
                      <p className="text-sm font-semibold text-[#8b5cf6] mt-1">{job.salary}</p>
                    </div>
                  </div>

                  {/* Job Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span>{job.location}</span>
                      {job.status === 'active' && (
                        <span className="ml-3">• Expires: {job.expiryDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
<Card key="no-jobs-found" className="border-[#e5e5e5]">
      <CardContent className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No jobs found</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        <Link href="/company/jobs/new">
          <Button className="mt-6 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Post Your First Job
          </Button>
        </Link>
      </CardContent>
    </Card>
        )}
      </div>
    </div>
  );
}
