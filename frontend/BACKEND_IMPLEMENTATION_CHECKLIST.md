# Backend Implementation Checklist

## Overview
This document lists all the backend endpoints that need to be implemented to make the frontend fully functional. The frontend is 100% ready and waiting for these endpoints.

---

## Priority 1: Critical Authentication (Must Have)

### ✅ POST `/auth/register`
**Frontend**: Sign up page and Zustand store
**Required Parameters**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashedPassword",
  "role": "student" | "company" | "admin"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "user": {
    "_id": "MongoDB_ObjectId",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student",
    "isVerified": false,
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "token": "JWT_TOKEN_HERE"
}
```

**What Frontend Does**:
- Saves token in HTTP-only cookie
- Sets `user_role` cookie
- Stores user object in Zustand
- Redirects to dashboard

---

### ✅ POST `/auth/login`
**Frontend**: Login page and Zustand store
**Required Parameters**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "MongoDB_ObjectId",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student",
    "isVerified": true,
    "createdAt": "2024-01-20T10:30:00Z"
  },
  "token": "JWT_TOKEN_HERE"
}
```

**Error Responses**:
- 401: Invalid credentials
- 404: User not found
- 400: Missing email or password

**What Frontend Does**:
- Same cookie/store setup as register
- Redirects to appropriate dashboard based on role

---

### ✅ POST `/auth/logout`
**Frontend**: Navbar logout button
**Required Parameters**: None (uses auth token from cookie)

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**What Frontend Does**:
- Clears cookies
- Clears Zustand store
- Redirects to `/login`

---

## Priority 2: Student Features

### ✅ GET `/students/profile`
**Frontend**: Profile page on initial load
**Auth Required**: Yes (Student role)
**Parameters**: None (uses auth token)

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "student_id",
    "user": "user_id",
    "department": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "resumeUrl": "https://...",
    "bio": "Aspiring software engineer",
    "batch": "2024",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Empty Case** (200):
```json
{
  "success": true,
  "data": null
}
```

**What Frontend Does**:
- Displays profile info in editable form
- Shows profile completeness percentage
- Fills skill tags

---

### ✅ POST `/students/profile`
**Frontend**: Profile page save button
**Auth Required**: Yes (Student role)
**Body**:
```json
{
  "department": "Computer Science",
  "cgpa": 8.5,
  "skills": ["JavaScript", "React", "Node.js"],
  "bio": "Aspiring software engineer",
  "batch": "2024"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    // Updated student object
  }
}
```

**What Frontend Does**:
- Shows toast: "Profile updated successfully"
- Updates local state
- Recalculates profile completeness %

---

### ✅ POST `/students/resume` (Multipart Form Data)
**Frontend**: Profile resume upload
**Auth Required**: Yes (Student role)
**Content-Type**: `multipart/form-data`
**File Field Name**: `resume`
**Allowed Types**: PDF, DOC, DOCX
**Max Size**: 5MB

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resumeUrl": "https://storage/resume_123.pdf"
}
```

**What Frontend Does**:
- Shows upload progress
- Stores resumeUrl in profile
- Shows toast: "Resume uploaded"
- Updates profile completeness

---

## Priority 3: Job Features

### ✅ GET `/jobs`
**Frontend**: Placements page listing
**Auth Required**: Yes
**Query Parameters** (Optional):
```
?location=Bangalore
?company=Google
?search=Developer
?type=internship | full-time
?sort=newest | salary
?page=1
```

**Expected Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "title": "Senior Software Engineer",
      "description": "We are looking for...",
      "company": "Google",
      "location": "Bangalore",
      "salary": "12-18 LPA",
      "requirements": ["5+ years", "React", "Node.js"],
      "deadline": "2024-03-15T23:59:59Z",
      "postedBy": "company_user_id",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

**Empty Case** (200):
```json
{
  "success": true,
  "data": [],
  "pagination": { "total": 0 }
}
```

**What Frontend Does**:
- Displays jobs in grid layout
- Shows empty state if no jobs
- Supports search/filter
- Implements pagination

---

### ✅ GET `/jobs/{id}`
**Frontend**: Placements detail page
**Auth Required**: Yes
**Parameters**: `id` in URL

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Senior Software Engineer",
    "description": "Full job description...",
    "company": "Google",
    "location": "Bangalore",
    "salary": "12-18 LPA",
    "requirements": ["5+ years", "React", "Node.js"],
    "benefits": ["Health Insurance", "Relocation"],
    "deadline": "2024-03-15T23:59:59Z",
    "postedBy": {
      "_id": "company_user_id",
      "name": "Google Inc"
    },
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

**What Frontend Does**:
- Displays full job details
- Shows apply button with options
- Shows deadline countdown

---

### ✅ POST `/jobs` (Company/Admin Only)
**Frontend**: Company create job page (optional - build later)
**Auth Required**: Yes (Company or Admin role)
**Body**:
```json
{
  "title": "Senior Software Engineer",
  "description": "Full job description...",
  "company": "Google",
  "location": "Bangalore",
  "salary": "12-18 LPA",
  "requirements": ["5+ years", "React", "Node.js"],
  "deadline": "2024-03-15T23:59:59Z"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": { job_object }
}
```

---

### ✅ DELETE `/jobs/{id}` (Admin Only)
**Frontend**: Company delete job (optional - build later)
**Auth Required**: Yes (Admin or job creator)

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## Priority 4: Application Features

### ✅ GET `/applications`
**Frontend**: Applications tracking page
**Auth Required**: Yes
**Role**: Student (returns student's applications)

**Expected Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "app_id",
      "job": {
        "_id": "job_id",
        "title": "Software Engineer",
        "company": "Google",
        "location": "Bangalore"
      },
      "student": "student_id",
      "status": "pending",
      "appliedAt": "2024-01-20T10:30:00Z",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

**Empty Case** (200):
```json
{
  "success": true,
  "data": []
}
```

**What Frontend Does**:
- Lists all applications with status badges
- Shows color-coded status
- Shows apply date
- Shows "View Details" button

---

### ✅ POST `/applications`
**Frontend**: Apply for job button
**Auth Required**: Yes (Student role)
**Body**:
```json
{
  "job": "job_id",
  "resumeUrl": "custom_resume_url" // Optional - if not provided, use profile resume
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "app_id",
    "job": "job_id",
    "student": "student_id",
    "status": "pending",
    "appliedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Error Cases**:
- 400: Job not found
- 409: Already applied for this job
- 401: Unauthorized

**What Frontend Does**:
- Shows loading spinner
- Shows success toast: "Application submitted"
- Redirects to applications page or closes modal

---

### ✅ PATCH `/applications/{id}` (Company/Admin Only)
**Frontend**: Company applicants pipeline
**Auth Required**: Yes
**Body**:
```json
{
  "status": "interview" // pending, interview, accepted, rejected
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Application status updated",
  "data": { updated_application }
}
```

**What Frontend Does**:
- Updates card in applicants pipeline
- Shows success toast
- Re-fetches applications list

---

## Priority 5: Company Features

### ✅ GET `/companies/profile`
**Frontend**: Company profile (optional - build later)
**Auth Required**: Yes (Company role)

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "company_id",
    "user": "user_id",
    "companyName": "Google",
    "website": "https://google.com",
    "industry": "Technology",
    "description": "Leading tech company",
    "location": "Mountain View",
    "contactEmail": "careers@google.com",
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

---

### ✅ GET `/companies/applications`
**Frontend**: Company applicants pipeline
**Auth Required**: Yes (Company role)

**Expected Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "app_id",
      "job": { job_details },
      "student": {
        "_id": "student_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "pending",
      "appliedAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

**What Frontend Does**:
- Displays applicants in Kanban board
- Shows applicant cards with info
- Shows status change dropdown

---

## Priority 6: Admin Features

### ✅ GET `/admin/users`
**Frontend**: Admin user management page
**Auth Required**: Yes (Admin role only)
**Query Parameters** (Optional):
```
?role=student|company|admin
?search=name_or_email
?page=1
```

**Expected Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

**What Frontend Does**:
- Displays users in table
- Shows role badge
- Shows verification status
- Provides action buttons (delete, reset password, verify)

---

### ✅ GET `/admin/stats`
**Frontend**: Admin dashboard
**Auth Required**: Yes (Admin role only)

**Expected Response** (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStudents": 100,
    "totalCompanies": 40,
    "verifiedCompanies": 35,
    "totalJobs": 45,
    "totalApplications": 320,
    "placementRate": 65.5,
    "recentActivities": [
      {
        "type": "job_posted",
        "description": "Google posted 'Senior Engineer'",
        "timestamp": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

**What Frontend Does**:
- Shows stat cards with numbers
- Displays charts (optional enhancement)
- Shows recent activities log

---

### ✅ PATCH `/admin/verify/{id}`
**Frontend**: Admin company verification
**Auth Required**: Yes (Admin role only)

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Company verified successfully",
  "data": { updated_user }
}
```

**What Frontend Does**:
- Updates company status to verified
- Shows success toast
- Removes from pending list

---

### ✅ DELETE `/admin/user/{id}`
**Frontend**: Admin user deletion
**Auth Required**: Yes (Admin role only)

**Expected Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**What Frontend Does**:
- Shows confirmation dialog
- Deletes user from table
- Shows success toast

---

## Optional/Enhancement Endpoints

### POST `/auth/change-password`
**Frontend**: Ready to implement
**Body**:
```json
{
  "oldPassword": "current_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

---

### POST `/auth/forgot-password`
**Frontend**: Ready to implement
**Body**:
```json
{
  "email": "user@example.com"
}
```

---

### GET `/companies/{id}`
**Frontend**: View company profile (optional)
Useful for students to see company details before applying

---

### GET `/students/{id}/profile-views`
**Frontend**: Show count in dashboard
Tracks how many companies viewed student profile

---

## Error Handling Standards

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- **200**: Success (GET, POST, PUT, PATCH)
- **201**: Created (POST creating new resource)
- **400**: Bad Request (validation failed)
- **401**: Unauthorized (no valid token)
- **403**: Forbidden (user doesn't have permission)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate email, already applied, etc.)
- **500**: Server Error

---

## Implementation Order Recommended

1. **Phase 1** (Critical - 2 days)
   - Authentication (register, login, logout)
   - Student profile endpoints

2. **Phase 2** (Core - 3 days)
   - Job endpoints (GET list, GET detail)
   - Application endpoints

3. **Phase 3** (Admin - 2 days)
   - Admin stats
   - Admin users management
   - Company verification

4. **Phase 4** (Enhancement - Optional)
   - Company endpoints
   - Optional features (password reset, profile views, etc.)

---

## Testing Checklist

For each endpoint, test:

- [ ] Valid request works
- [ ] Invalid data returns 400
- [ ] Unauthorized user gets 401
- [ ] Non-existent resource returns 404
- [ ] Duplicate entries return 409 (if applicable)
- [ ] Response format matches documentation
- [ ] Token validation works
- [ ] Database stores data correctly

---

## Frontend Waiting For

The frontend is **100% ready** and waiting for these endpoints. Once you implement them:

1. Sign up works ✓
2. Login works ✓
3. All dashboards display real data ✓
4. All forms submit real data ✓
5. All pages load real content ✓
6. Complete end-to-end system works ✓

---

## Integration Notes

1. **Token Handling**: Frontend includes token in cookies automatically
2. **CORS**: Enable on backend for `http://localhost:3000`
3. **Content-Type**: Frontend sends `application/json` for all requests
4. **Credentials**: Frontend sends `credentials: 'include'` for all requests
5. **Response Format**: Frontend expects `data` field in successful responses

---

## Quick Start Backend

```bash
# 1. Implement auth routes first
# 2. Add middleware to protect other routes
# 3. Implement student/job/application routes
# 4. Add admin routes
# 5. Test with frontend

# Run backend
npm start  # Listen on port 8080

# Run frontend (in another terminal)
npm run dev  # Runs on port 3000

# Test
# Go to http://localhost:3000/signup
```

---

## Questions?

Refer to:
- `API_ENDPOINTS.md` - Expected request/response formats
- `IMPLEMENTATION_GUIDE.md` - How frontend uses each endpoint
- `COMPLETE_SYSTEM_SUMMARY.md` - Full system architecture

