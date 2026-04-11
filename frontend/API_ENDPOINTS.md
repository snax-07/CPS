# Frontend API Endpoints Reference

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student" // or "company" or "admin"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isVerified": false
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**
- 201: Created successfully
- 400: Bad request / User already exists
- 500: Server error

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isVerified": true
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials
- 404: User not found
- 500: Server error

---

### 3. Logout User
**POST** `/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Student Endpoints

### 1. Get Student Profile
**GET** `/students/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "student_id",
    "user": "user_id",
    "department": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "resumeUrl": "url_to_resume",
    "bio": "Aspiring software engineer",
    "batch": "2024",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

---

### 2. Update Student Profile
**POST** `/students/profile`

**Request Body:**
```json
{
  "department": "Computer Science",
  "cgpa": 8.5,
  "skills": ["JavaScript", "React", "Node.js"],
  "bio": "Aspiring software engineer",
  "batch": "2024"
}
```

**Response:** Same as Get Profile

---

### 3. Upload Resume
**POST** `/students/resume`

**Form Data:**
```
resume: File (multipart/form-data)
```

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resumeUrl": "url_to_uploaded_resume"
}
```

---

## Job Endpoints

### 1. Get All Jobs
**GET** `/jobs`

**Query Parameters (optional):**
```
?company=company_id
?location=Delhi
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "title": "Software Engineer",
      "description": "Looking for experienced developers...",
      "company": "Google",
      "location": "Bangalore",
      "salary": "12-18 LPA",
      "requirements": ["2+ years experience", "React", "Node.js"],
      "deadline": "2024-03-15T23:59:59Z",
      "postedBy": "company_user_id",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Job by ID
**GET** `/jobs/{job_id}`

**Response:** Single job object (same structure as above)

---

### 3. Create Job (Company/Admin Only)
**POST** `/jobs`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Software Engineer",
  "description": "Looking for experienced developers...",
  "company": "Google",
  "location": "Bangalore",
  "salary": "12-18 LPA",
  "requirements": ["2+ years experience", "React", "Node.js"],
  "deadline": "2024-03-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": { job_object }
}
```

---

### 4. Delete Job (Admin/Creator Only)
**DELETE** `/jobs/{job_id}`

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## Application Endpoints

### 1. Get My Applications (Student)
**GET** `/applications`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "application_id",
      "job": {
        "_id": "job_id",
        "title": "Software Engineer",
        "company": "Google"
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

---

### 2. Apply for Job (Student)
**POST** `/applications`

**Request Body:**
```json
{
  "job": "job_id",
  "resumeUrl": "custom_resume_url" // optional - if not provided, use profile resume
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": { application_object }
}
```

---

### 3. Update Application Status (Company/Admin)
**PATCH** `/applications/{application_id}`

**Request Body:**
```json
{
  "status": "interview" // pending, interview, accepted, rejected
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated",
  "data": { updated_application }
}
```

---

## Admin Endpoints

### 1. Get All Users
**GET** `/admin/users`

**Response:**
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
  ]
}
```

---

### 2. Get System Stats
**GET** `/admin/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStudents": 100,
    "totalCompanies": 30,
    "verifiedCompanies": 25,
    "totalJobs": 45,
    "totalApplications": 320,
    "placementRate": 65.5
  }
}
```

---

### 3. Verify User (Company Verification)
**PATCH** `/admin/verify/{user_id}`

**Response:**
```json
{
  "success": true,
  "message": "User verified successfully",
  "data": { user_object }
}
```

---

### 4. Delete User
**DELETE** `/admin/user/{user_id}`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Company Endpoints (if applicable)

### 1. Get Company Profile
**GET** `/companies/profile`

**Response:**
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

### 2. Update Company Profile
**POST** `/companies/profile`

**Request Body:** (Same structure as Get response, excluding _id, user, createdAt)

**Response:** Updated company object

---

## Authentication Token Handling

### Frontend Implementation:
1. Token is set in HTTP-only cookie by backend
2. Frontend includes `credentials: 'include'` in all fetch requests
3. Middleware checks for token in cookies
4. If token missing, redirect to `/login`

### Token Claims (JWT):
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "student",
  "iat": 1705755000,
  "exp": 1705841400
}
```

---

## Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details"
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Frontend API Client Usage

### Example: Login
```typescript
import { authAPI } from '@/lib/api-client';

try {
  const response = await authAPI.login('email@example.com', 'password');
  // response.user contains user data
  // Token is automatically stored in cookie
} catch (error) {
  console.error('Login failed:', error);
}
```

### Example: Get Student Profile
```typescript
import { studentAPI } from '@/lib/api-client';

try {
  const profile = await studentAPI.getProfile();
  console.log(profile);
} catch (error) {
  console.error('Failed to fetch profile:', error);
}
```

### Example: Get All Jobs
```typescript
import { jobAPI } from '@/lib/api-client';

try {
  const jobs = await jobAPI.getAllJobs({ location: 'Bangalore' });
  console.log(jobs);
} catch (error) {
  console.error('Failed to fetch jobs:', error);
}
```

---

## Important Notes

1. **All requests require authentication token** (except /auth routes)
2. **Token is stored in HTTP-only cookie** - cannot be accessed via JavaScript
3. **CORS must be enabled** on backend to allow requests from frontend
4. **Resume uploads** require `multipart/form-data` content type
5. **Role-based access** - Ensure user role matches endpoint requirements
6. **Middleware protection** - Routes automatically redirect unauthenticated users

---

## To Add to Frontend

If you need additional features beyond existing endpoints:

1. **Change Password**
   - Endpoint: `POST /auth/change-password`
   - Body: `{ oldPassword, newPassword }`

2. **Reset Password**
   - Endpoint: `POST /auth/forgot-password`
   - Body: `{ email }`

3. **Get Company Applications**
   - Endpoint: `GET /companies/applications`
   - Returns all applications to company's jobs

4. **Search/Filter Jobs**
   - Endpoint: `GET /jobs?search=keyword&location=city&company=name`

5. **Profile Views Count**
   - Endpoint: `GET /students/profile-views`
   - Returns count of how many companies viewed profile
