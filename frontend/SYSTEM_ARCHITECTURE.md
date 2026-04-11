# College Placement System - Complete Architecture

## Overview
This is a comprehensive college placement system with three distinct modules: **Student Portal**, **Company Recruiter Dashboard**, and **Admin Control Tower**. The system is built with Next.js 16, TypeScript, Zustand for state management, and Tailwind CSS for styling.

---

## Module 1: Student Portal (Protected Routes)

### Pages & Features

#### Dashboard (`/dashboard`)
- **Welcome Section**: Personalized greeting and quick stats
- **Stats Cards**: Applications, Profile Views, Active Placements, Interviews
- **Recent Applications**: Tracked applications with status
- **Quick Actions**: Browse placements, update profile, view applications

#### Placements (`/placements`)
- **Browse & Search**: Find jobs by company, position, or keyword
- **Filter System**: By job type (Internship/Full-time), company, deadline
- **Job Cards**: Display company, position, salary range, location, tech tags
- **Posted Date**: Shows when each job was posted
- **Responsive Grid**: Mobile-friendly layout

#### Placement Detail (`/placements/[id]`)
- **Full Job Description**: Requirements, benefits, compensation
- **Dual Apply Options**:
  - Apply with profile (auto-fill student data)
  - Upload custom resume
- **Sidebar**: Salary, location, deadline, qualifications
- **Toast Notifications**: Feedback on application submission

#### Applications (`/applications`)
- **Track Status**: Under Review → Interview → Accepted/Rejected
- **Color-coded Badges**: Visual status indicators
- **Stats Overview**: Total applications, pending, interviews, accepted
- **Next Steps**: Instructions for each status
- **Resume Download**: Download submitted resume

#### Profile (`/profile`)
- **Profile Completeness Meter**: Visual progress (Premium variant)
  - Shows: 20% per section (Name, Headline, Skills, Resume, Bio)
  - Encourages profile completion
- **Tabs**:
  - **Personal**: Name, email, phone, location, headline, bio
  - **Skills**: Add/remove skills with visual tags
  - **Resume**: Upload/update resume files
  - **Education**: Add educational background
- **Edit Mode**: Toggle editing with save functionality
- **Toast Feedback**: Success messages on updates

---

## Module 2: Company Recruiter Dashboard (Protected Routes)

### Pages & Features

#### Dashboard (`/company`)
- **Quick Stats**: Active jobs, total applicants, profile views
- **Job Cards**: Recent job postings with metrics
- **Status Indicators**: Active/Closed jobs
- **Quick Actions**: View details, edit job postings

#### Job Management (`/company/jobs`)
- **Create Job**: Post new job opening
- **Edit Jobs**: Update job details, requirements, salary
- **Archive Jobs**: Close job postings
- **Job Data Required**:
  - Title, description, requirements (array)
  - Salary range, location, deadline
  - Minimum CGPA, job type

#### Applicants Pipeline (`/company/jobs/[id]`)
- **Kanban/Table View**: All applicants for a job
- **Filter by Status**: Pending, Shortlisted, Interview, Accepted, Rejected
- **Quick View Modal**: Shows applicant details including:
  - Name, email, department, CGPA
  - Skills, resume download link
- **Status Updater**: Move applicants through pipeline
  - Pending → Shortlisted → Interview → Accepted/Rejected
- **Email Integration**: Auto-triggers notification emails (via sendEmail.ts)
- **Instant Feedback**: Toast notifications on status changes
- **Empty States**: "No applicants yet—try sharing your job link!" message

---

## Module 3: Admin Control Tower (Protected Routes)

### Pages & Features

#### Dashboard (`/admin`)
- **System Analytics**: Cards showing:
  - Total students
  - Total companies
  - Placement percentage (%)
  - Active job postings
- **Pending Verifications**: Companies waiting for approval
- **Recent Activities**: System-wide event log
- **Export Reports**: Generate CSV/Excel of placed students

#### User Management (`/admin/users`)
- **User List**: All registered students and companies
- **Search/Filter**: Find users by name or email
- **User Details**: Name, email, role, status, join date
- **Actions**:
  - Reset Password: Send password reset email
  - Delete User: Remove user from system (for graduates)
- **Filtering**: By role (student/company), status (active/inactive)
- **Empty States**: Friendly message when no users found

#### Company Management (`/admin/companies`)
- **Verification Stats**: Pending, Verified, Rejected counts
- **Pending Verification Tab**: Review company registrations
- **Quick Review**:
  - Company details, email, website
  - Document verification link
  - Approve/Reject buttons
- **Rejection Reason**: Required field when rejecting
- **Verified Companies**: List of approved companies
- **Auto-notifications**: Email sent on approval/rejection

---

## Component System: Small & Premium Variants

### 1. Profile Completeness Meter
**Purpose**: Encourage students to complete their profiles

**Small Variant**:
- Compact bar with percentage
- 3 lines: label, progress bar, percentage text
- Used in list views, sidebars

**Premium Variant**:
- Full card layout with description
- Icon indicators (checkmark/alert) for each section
- Detailed progress breakdown
- Used on profile page

### 2. Empty State Component
**Purpose**: Friendly feedback when no data exists

**Small Variant**:
- Icon, title, description
- Optional action button (compact)
- Used in list views

**Premium Variant**:
- Large icon in circle
- Larger title and description
- Prominent action button
- Used on full-page sections

### 3. Loading Skeleton
**Purpose**: Show content is loading with visual feedback

**Types**:
- `JobCardSkeleton`: Matches job card layout
- `ApplicantRowSkeleton`: Matches applicant list row
- `DashboardCardSkeleton`: Matches stat cards
- `TableSkeletonLoader`: Multiple rows for lists
- Pulse animation for visual feedback

### 4. Status Badge
**Purpose**: Show application/job status at a glance

**Small Variant**:
- Compact badge with icon
- Used in list rows, quick previews

**Premium Variant**:
- Larger badge with icon and full label
- Used in modals, detail pages
- Color-coded by status

---

## Authentication & Authorization

### Middleware (`middleware.ts`)
- **Protected Routes**: `/dashboard`, `/placements`, `/profile`, `/applications`, `/company`, `/admin`
- **Auth Routes**: `/login`, `/signup`
- **Token Checking**: Reads `auth_token` and `user_role` from cookies
- **Role-based Access**:
  - Students: Can access `/dashboard`, `/placements`, `/profile`, `/applications`
  - Companies: Can access `/company` routes
  - Admin: Can access `/admin` routes
- **Redirect Logic**:
  - No auth → Redirect to `/login`
  - Wrong role → Redirect to default dashboard
  - Already logged in → Redirect to dashboard

### Zustand Auth Store (`lib/store/auth-store.ts`)
- **State**: `isLoggedIn`, `user`, `userRole`
- **Actions**: `login()`, `logout()`, `setUser()`
- **Persistence**: Syncs with cookies via middleware

### Security Features
- HttpOnly Secure Cookies (immune to XSS)
- CSRF protection (Next.js built-in)
- Role-based access control
- Password hashing (bcrypt required on backend)

---

## API Routes & Integration

### Authentication Endpoints
```
POST /api/auth/login
- Body: { email, password }
- Response: { token, user, role }
- Action: Sets HttpOnly auth_token cookie

POST /api/auth/signup
- Body: { email, password, name, role: 'student' | 'company' }
- Response: { success, message }
- Validation: Verify student email domain or enrollment code
```

### Student Endpoints
```
GET /api/placements
- Query: { search, type, company, page }
- Response: { jobs: Job[], total }

GET /api/placements/:id
- Response: Job with full details

POST /api/applications
- Body: { jobId, type: 'profile' | 'resume', resume?: File }
- Response: { applicationId, status }

GET /api/applications
- Response: { applications: Application[] }

GET /api/profile
- Response: Student profile with completeness %

PUT /api/profile
- Body: { name, email, phone, location, headline, bio, skills, resume }
- Response: { success, message }
```

### Company Endpoints
```
GET /api/v1/company/jobs
- Response: { jobs: Job[] }

POST /api/v1/company/jobs
- Body: { title, description, requirements, salaryRange, location, deadline, minCGPA }
- Response: { jobId }

GET /api/v1/company/jobs/:jobId/applicants
- Response: { applicants: Applicant[] }

PATCH /api/v1/applications/:appId/status
- Body: { status: 'shortlisted' | 'interview' | 'accepted' | 'rejected' }
- Action: Triggers sendEmail.ts utility
```

### Admin Endpoints
```
GET /api/v1/admin/stats
- Response: { totalStudents, totalCompanies, placementRate, activeJobs }

GET /api/v1/admin/users
- Response: { users: User[] }

PUT /api/v1/admin/verify-company/:id
- Body: { isVerified: boolean, rejectionReason?: string }

POST /api/v1/admin/export-report
- Response: CSV file download
```

---

## Styling & Design System

### Color Palette
- **Primary**: `#8b5cf6` (Purple)
- **Secondary**: `#7c3aed` (Deep Purple)
- **Background**: `#f5f5f3` (Smoky White)
- **Borders**: `#e5e5e5` (Light Gray)
- **Text**: `#1a1a1a` (Dark)
- **Muted**: `#737373` (Gray)

### Responsive Breakpoints
- Mobile: `320px - 640px`
- Tablet: `641px - 1024px`
- Desktop: `1025px - 1920px`
- Animations & transitions on all interactive elements

### Typography
- Headings: Geist (SemiBold)
- Body: Geist (Regular)
- Mono: Geist Mono (for code)
- Line height: 1.4-1.6 for readability

---

## UX/DX Features

### Instant Feedback
- **Toast Notifications** (Sonner):
  - "Application Submitted Successfully!"
  - "Status updated to [status]"
  - "Profile updated successfully!"
  - Error messages on failures

### Empty States
- Non-blank screens with helpful messaging
- Example: "No applicants yet—try sharing your job link!"
- Action buttons to guide users

### Loading States
- Pulse animations on skeleton loaders
- Shows during API fetches
- Improves perceived performance

### Smart Redirects
- After login: Navigate to appropriate dashboard (student/company/admin)
- Protected routes: Auto-redirect to login
- Already logged in: Can't access auth pages

---

## Database Schema (Backend Required)

### Users Table
```
id, email, password_hash, name, role, created_at, updated_at
```

### Students Table
```
user_id, phone, location, headline, bio, cgpa, department, college
resume_url, skills (JSON), education (JSON), profile_completeness
```

### Companies Table
```
user_id, company_name, website, verified, documents_url, created_at
```

### Jobs Table
```
id, company_id, title, description, requirements, salary_range
location, deadline, min_cgpa, posted_date, status
```

### Applications Table
```
id, student_id, job_id, applied_date, status, resume_url
applied_with_profile, next_steps
```

---

## Testing Credentials

### For Development
Use these when testing (once auth is connected to backend):
- **Student**: email: `student@example.com` | password: `password123`
- **Company**: email: `company@example.com` | password: `password123`
- **Admin**: email: `admin@example.com` | password: `password123`

---

## Deployment Checklist

- [ ] Connect backend API endpoints
- [ ] Implement authentication with password hashing (bcrypt)
- [ ] Set up database with all required tables
- [ ] Configure student verification (email domain or enrollment code)
- [ ] Set up email service for notifications
- [ ] Implement file storage (AWS S3, Vercel Blob, etc.)
- [ ] Add SSL/TLS certificates
- [ ] Configure environment variables
- [ ] Test all workflows end-to-end
- [ ] Set up monitoring and error tracking
- [ ] Configure backups and disaster recovery

---

## Future Enhancements

1. **Real-time Notifications**: WebSocket notifications for new applications
2. **Interview Scheduling**: Calendar integration for scheduling interviews
3. **Analytics Dashboard**: Detailed recruitment metrics for companies
4. **Advanced Matching**: ML-based job recommendations for students
5. **Resume Parser**: Automatic skill extraction from resumes
6. **Bulk Operations**: Import multiple jobs or applications
7. **Integrations**: LinkedIn, email providers, calendar services
8. **Mobile App**: Native iOS/Android applications
9. **Two-factor Authentication**: Enhanced security
10. **Audit Logging**: Track all system changes for compliance
