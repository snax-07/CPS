import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// --- Interfaces ---

export interface IStats {
  active : string,
  applicants : number;
  shortListed : number;
  view : number;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  isVerified: boolean;
  createdAt: string;
};

export interface Student {
  _id: string;
  user: string | User;
  department: string;
  cgpa: number;
  skills: string[];
  resumeUrl?: string;
  bio?: string;
  batch?: string;
  createdAt: string;
  updatedAt: string;
};

export interface Company {
  _id: string;
  user: string;
  companyName: string;
  website: string;
  industry: string;
  description: string;
  location: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
};

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  deadline: string;
  postedBy: string;
  applicants?: number;
  createdAt: string;
  updatedAt: string;
  status : string;
};

export interface Application {
  _id: string;
  job: string | Job;
  student: any; // Populated student details
  status: 'pending' | 'interview' | 'accepted' | 'rejected' | 'shortlisted';
  applyMethod: 'profile' | 'resume';
  resumeUrl?: string;
  appliedAt: string;
  createdAt: string;
};

// --- API Methods ---

// 1. Auth API: Handles User Access
export const authAPI = {
  // POST /auth/login - Authenticate user
  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
    return res.data;
  },

  // POST /auth/register - Create new account
  register: async (name: string, email: string, password: string, role: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role }, { withCredentials: true });
    return res.data;
  },

  // POST /auth/logout - Clear session cookies
  logout: async () => {
    const res = await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    return res.data;
  },
};

// 2. Student API: Profile and Resume Management
export const studentAPI = {
  // GET /students/profile - Get logged-in student's data
  getProfile: async (): Promise<Student> => {
    const res = await axios.get(`${API_BASE_URL}/students/profile`, { withCredentials: true });
    return res.data;
  },

  // GET /students/profile/:userId - Get a student's profile by user ID (for company use)
  getStudentProfileById: async (userId: string): Promise<Student> => {
    const res = await axios.get(`${API_BASE_URL}/students/profile/${userId}`, { withCredentials: true });
    return res.data;
  },

  // POST /students/profile - Create or Update profile
  updateProfile: async (data: Partial<Student>) => {
    const res = await axios.post(`${API_BASE_URL}/students/profile`, data, { withCredentials: true });
    return res.data;
  },

  // POST /students/resume - Upload PDF to server/cloud
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await axios.post(`${API_BASE_URL}/students/resume`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
};

// 3. Job API: Public browsing and Applying
export const jobAPI = {
  // GET /jobs - Browse all jobs with optional filters
  getAllJobs: async (filters?: { company?: string; location?: string }): Promise<Job[]> => {
    const res = await axios.get(`${API_BASE_URL}/jobs`, { params: filters, withCredentials: true });
    return res.data;
  },

  // GET /jobs/:id - Get specific job details
  getJobById: async (id: string): Promise<Job> => {
    const res = await axios.get(`${API_BASE_URL}/jobs/${id}`, { withCredentials: true });
    return res.data;
  },

  // GET /jobs/:id/application-status - Check if current student already applied
  getApplicationStatus: async (jobId: string) => {
    const res = await axios.get(`${API_BASE_URL}/jobs/${jobId}/application-status`, { withCredentials: true });
    return res.data; // Expected { applied: boolean }
  },

  // POST /jobs/:id/apply - Apply using internal profile data
  applyWithProfile: async (id: string) => {
    const res = await axios.post(`${API_BASE_URL}/jobs/${id}/apply`, { applyMethod: "profile" }, { withCredentials: true });
    return res.data;
  },

  // POST /jobs/:id/apply - Apply by uploading a custom resume
  applyWithResume: async (id: string, formData: FormData) => {
    console.log(formData.get('resume'))
    console.log(formData.get('applyMethod'))
    const res = await axios.post(`${API_BASE_URL}/jobs/${id}/apply`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updateJob : async (id : string , meta : {status : string}) => {
    const res = await axios.post(`${API_BASE_URL}/jobs/update` , {id , meta} , {withCredentials : true});

    return res;
  }
};

// 4. Company API: Recruitment and Job Posting
export const companyAPI = {
  // GET /companies/profile/:userId - View company public info
  getCompanyProfile: async (userId: string): Promise<Company> => {
    const res = await axios.get(`${API_BASE_URL}/companies/profile/${userId}`, { withCredentials: true });
    return res.data;
  },

  // PATCH /companies/profile - Update logged-in company info
  updateCompanyProfile: async (data: Partial<Company>): Promise<Company> => {
    const res = await axios.patch(`${API_BASE_URL}/companies/profile`, data, { withCredentials: true });
    return res.data;
  },

  // POST /companies/jobs - Create a new job listing
  postJob: async (jobData: any) => {
    const res = await axios.post(`${API_BASE_URL}/companies/jobs`, jobData, { withCredentials: true });
    return res.data;
  },

  // GET /companies/my-jobs - Get all jobs posted by this company
  getMyJobs: async (): Promise<Job[]> => {
    const res = await axios.get(`${API_BASE_URL}/companies/my-jobs`, { withCredentials: true });
    return res.data;
  },

  // GET /companies/jobs/:jobId/applicants - Get all students who applied for a job
  viewJobApplicants: async (jobId: string): Promise<Application[]> => {
    const res = await axios.get(`${API_BASE_URL}/companies/jobs/${jobId}/applicants`, { withCredentials: true });
    return res.data;
  },

  // PATCH /companies/applications/:applicationId/status - Shortlist/Accept/Reject
  updateApplicantStatus: async (applicationId: string, status: string) => {
    const res = await axios.patch(`${API_BASE_URL}/companies/applications/${applicationId}/status`, { status }, { withCredentials: true });
    return res.data;
  },

  getStats : async ()  => {
    const res = await axios.get(`${API_BASE_URL}/companies/stats` , {withCredentials : true})
    return res.data;
  },

  // GET /companies/all-applications - Get all applications across all company jobs
  getAllApplications: async (): Promise<Application[]> => {
    const res = await axios.get(`${API_BASE_URL}/companies/all-applications`, { withCredentials: true });
    return res.data;
  },
};

// 5. Admin API: System Management
export const adminAPI = {
  // GET /admin/users - Admin: View all platform users
  getAllUsers: async (): Promise<User[]> => {
    const res = await axios.get(`${API_BASE_URL}/admin/users`, { withCredentials: true });
    return res.data;
  },

  // DELETE /jobs/:id - Admin/Company: Remove a job
  deleteJob: async (id: string) => {
    const res = await axios.delete(`${API_BASE_URL}/jobs/${id}`, { withCredentials: true });
  },
};

// 6. Application API: Student's personal application management
export const applicationAPI = {
  // GET /jobs/my-applications - Get all applications for the logged-in student
  getMyApplications: async (): Promise<Application[]> => {
    const res = await axios.get(`${API_BASE_URL}/jobs/my-applications`, { withCredentials: true });
    return res.data;
  }
};