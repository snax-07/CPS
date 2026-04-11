# Real Data Integration Guide

## Overview

All pages have been updated to fetch real data from your backend API instead of using dummy data. The frontend now connects to your Express.js backend using the API client utility.

## Environment Setup

1. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, update to your live backend URL:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## API Integration Points

### 1. **Placements Page** (`/placements`)
**Fetches:** All jobs from backend
**API Call:** `GET /api/jobs`
**Data Flow:**
- Loads all available job postings
- Supports search by title/company
- Supports location filtering
- Shows loading skeleton while fetching
- Displays empty state if no jobs found

**Connected Endpoints:**
```typescript
jobAPI.getAllJobs(filters?: { company?: string; location?: string })
```

### 2. **Dashboard Page** (`/dashboard`)
**Fetches:** Student applications + all jobs
**API Calls:**
- `GET /api/students/applications` - Get user's applications
- `GET /api/jobs` - Get all available jobs

**Stats Calculated From:**
- Total applications: `applications.length`
- Pending applications: `applications.filter(a => a.status === 'pending').length`
- Active placements: `jobs.length`
- Interview scheduled: `applications.filter(a => a.status === 'interview').length`

**Connected Endpoints:**
```typescript
applicationAPI.getApplications()
jobAPI.getAllJobs()
```

### 3. **Placement Detail Page** (`/placements/[id]`)
**Fetches:** Single job details
**API Call:** `GET /api/jobs/:id`

**Apply Functionality:**
```typescript
applicationAPI.createApplication(jobId, resumeUrl?)
```

### 4. **Applications Page** (`/applications`)
**Fetches:** Student's applications with status
**API Call:** `GET /api/applications`

**Status Types:**
- `pending` - Under review
- `interview` - Interview scheduled
- `accepted` - Job offer accepted
- `rejected` - Application rejected

**Connected Endpoints:**
```typescript
applicationAPI.getApplications()
applicationAPI.updateApplicationStatus(id, status)
```

### 5. **Profile Page** (`/profile`)
**Fetches:** Student profile data
**API Calls:**
- `GET /api/students/profile` - Get profile
- `POST /api/students/profile` - Update profile
- `POST /api/students/resume` - Upload resume

**Profile Fields Synced:**
- bio
- skills (array)
- department
- cgpa (GPA)
- batch (graduation year)
- resumeUrl

**Connected Endpoints:**
```typescript
studentAPI.getProfile()
studentAPI.updateProfile(data)
studentAPI.uploadResume(file)
```

### 6. **Admin Pages** (`/admin/*`)
**Fetches:** System-wide data
**API Calls:**
- `GET /api/admin/users` - All users
- `GET /api/admin/stats` - System statistics
- `PATCH /api/admin/verify/:id` - Verify company
- `DELETE /api/admin/user/:id` - Delete user

## Data Structures Mapping

### Student Profile
```typescript
interface Student {
  _id: string;
  user: string; // User ID reference
  department: string;
  cgpa: number;
  skills: string[];
  resumeUrl?: string;
  bio?: string;
  batch?: string; // e.g., "2024"
  createdAt: string;
  updatedAt: string;
}
```

### Job Listing
```typescript
interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  deadline: string;
  postedBy: string; // Company user ID
  createdAt: string;
  updatedAt: string;
}
```

### Application
```typescript
interface Application {
  _id: string;
  job: string | Job; // Can be expanded with full job details
  student: string; // Student user ID
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

## Page-by-Page Changes

### ✅ Placements Page (`/app/(protected)/placements/page.tsx`)
- **Before:** Static array of 6 dummy jobs
- **After:** Dynamic fetch from `GET /api/jobs`
- **Features:** Real-time search, location filtering, loading states, empty states
- **Error Handling:** Toast notifications on fetch failure with retry button

### ✅ Dashboard (`/app/(protected)/dashboard/page.tsx`)
- **Before:** Hardcoded stats values
- **After:** Calculated from real applications and jobs
- **Features:** Loading skeleton, auto-refresh on mount
- **Performance:** Parallel fetch of applications and jobs

### ✅ Applications (`/app/(protected)/applications/page.tsx`)
- **Before:** 6 dummy application objects
- **After:** Real-time application list from backend
- **Features:** Status tracking, color-coded badges, empty state handling
- **Status Mapping:** `pending` → Yellow, `interview` → Blue, `accepted` → Green, `rejected` → Red

### ✅ Profile (`/app/(protected)/profile/page.tsx`)
- **Before:** Hardcoded student "John Doe"
- **After:** Fetches real student profile on mount
- **Features:** Edit mode, save to backend, resume upload, skill management
- **Profile Meter:** Automatically calculates completion percentage from real data

## Authentication & Credentials

All API calls include:
```typescript
credentials: 'include' // For cookie-based auth
```

This ensures HttpOnly cookies with auth tokens are sent automatically.

## Error Handling

All pages include:
1. **Loading States:** Skeleton screens while fetching
2. **Error States:** EmptyState components with retry buttons
3. **Toast Notifications:** User feedback on success/error
4. **Graceful Fallbacks:** Default empty states if API fails

## Testing the Integration

1. **Start Backend:**
```bash
npm start # or your backend start command
```

2. **Update Environment:**
Create `.env.local` with your backend URL

3. **Start Frontend:**
```bash
npm run dev
```

4. **Test Each Page:**
- Navigate to `/placements` → Should load jobs from backend
- Navigate to `/dashboard` → Should show stats from real applications
- Navigate to `/applications` → Should show your applications
- Navigate to `/profile` → Should load your profile data

## API Response Examples

### GET /api/jobs
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Software Engineer",
    "description": "Join our engineering team...",
    "company": "Google",
    "location": "Mountain View, CA",
    "salary": "$150K-$170K",
    "requirements": ["JavaScript", "React", "Node.js"],
    "deadline": "2024-04-30T00:00:00.000Z",
    "postedBy": "507f1f77bcf86cd799439012",
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-01T10:00:00.000Z"
  }
]
```

### GET /api/students/profile
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user": "John Doe",
  "department": "Computer Science",
  "cgpa": 3.8,
  "skills": ["JavaScript", "React", "Python"],
  "resumeUrl": "https://example.com/resume.pdf",
  "bio": "Passionate developer...",
  "batch": "2024",
  "createdAt": "2024-02-01T10:00:00.000Z",
  "updatedAt": "2024-03-01T10:00:00.000Z"
}
```

### GET /api/applications
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "job": "507f1f77bcf86cd799439011",
    "student": "507f1f77bcf86cd799439013",
    "status": "pending",
    "appliedAt": "2024-03-01T10:00:00.000Z",
    "createdAt": "2024-03-01T10:00:00.000Z",
    "updatedAt": "2024-03-01T10:00:00.000Z"
  }
]
```

## Common Issues & Solutions

### 1. **CORS Errors**
**Problem:** Frontend can't connect to backend
**Solution:** Ensure backend has CORS enabled for your frontend origin

### 2. **401 Unauthorized**
**Problem:** Requests failing with auth errors
**Solution:** Make sure cookies are being sent (`credentials: 'include'`)

### 3. **Empty Lists**
**Problem:** Pages show empty states instead of data
**Solution:** 
- Check if backend is running
- Verify API URL in `.env.local`
- Check browser console for API error messages

### 4. **Timeout Errors**
**Problem:** Requests taking too long or timing out
**Solution:**
- Check network connection
- Verify backend is responding
- Check backend performance

## Next Steps

1. Test all pages with real backend data
2. Implement role-based access control (student vs company vs admin)
3. Add pagination for large lists
4. Implement advanced filtering and sorting
5. Add real-time updates with WebSockets if needed

## Files Modified

- ✅ `/lib/api-client.ts` - API client utilities (NEW)
- ✅ `/app/(protected)/placements/page.tsx` - Real job fetching
- ✅ `/app/(protected)/dashboard/page.tsx` - Real stats
- ✅ `/app/(protected)/applications/page.tsx` - Real applications
- ✅ `/app/(protected)/profile/page.tsx` - Real profile data
- ✅ `.env.example` - Environment template (NEW)

All dummy data has been removed and replaced with real API integration!
