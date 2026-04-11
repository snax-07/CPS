# PlaceHub - College Placement System Setup Guide

## Overview

PlaceHub is a modern college placement system built with Next.js, featuring a responsive design with a smoky white theme and purple gradient accents. This guide will help you integrate your backend API.

## Features Implemented

### Student-Side Features
- ✅ **Landing Page**: Role selection (Student/Company) with beautiful hero section
- ✅ **Authentication**: Login & Signup with role-based routing
- ✅ **Dashboard**: Welcome section, stats, recent applications, quick actions
- ✅ **Placements Browsing**: Search, filter by type, view placement cards
- ✅ **Placement Details**: Full job description, requirements, benefits, deadline
- ✅ **Apply Options**: 
  - Apply with profile (auto-fill from student profile)
  - Upload custom resume
- ✅ **Applications Tracking**: View status (Under Review, Interview Scheduled, Accepted, Rejected)
- ✅ **Student Profile**: 
  - Personal information management
  - Skills management (add/remove)
  - Resume upload/update
  - Education information

## Authentication Flow

### Cookie-Based Authentication (HttpOnly + Secure)

The system uses HttpOnly cookies for secure authentication:

1. **Login/Signup**: Backend sets two cookies:
   - `auth_token`: User authentication token (HttpOnly, Secure, 7-day expiry)
   - `user_role`: User role - 'student' or 'company' (HttpOnly, Secure, 7-day expiry)

2. **Middleware Protection**: 
   - File: `middleware.ts`
   - Protects routes: `/dashboard`, `/placements`, `/profile`, `/applications`
   - Redirects to login if cookies are missing

3. **Logout**: Removes both cookies and redirects to login

## Backend Integration Checklist

### 1. Update API Routes

Replace the placeholder implementations in these files with calls to your backend:

#### `/app/api/auth/login/route.ts`
```typescript
// TODO: Replace mock response with actual backend call
// Expected response:
// {
//   user: {
//     id: string,
//     email: string,
//     name: string,
//     role: 'student' | 'company'
//   },
//   token: string
// }
```

#### `/app/api/auth/signup/route.ts`
```typescript
// TODO: Replace mock response with actual backend call
// Validate role: must be 'student' or 'company'
// Hash password on backend using bcrypt or similar
```

#### `/app/api/applications/route.ts`
```typescript
// POST: Submit application
// Parameters:
// - placementId: string
// - applyMethod: 'profile' | 'resume'
// - resume?: File (if applyMethod is 'resume')
// - auth_token: from cookies (automatically included)

// TODO: Call your backend to:
// 1. Get student ID from auth_token
// 2. Save application record
// 3. Store resume if provided
```

#### `/app/api/profile/route.ts`
```typescript
// PUT: Update student profile
// GET: Fetch student profile
// Parameters: See form fields in `/app/(protected)/profile/page.tsx`

// TODO: Call your backend to:
// 1. Update/retrieve student profile data
// 2. Handle resume file uploads
```

### 2. Student Verification Logic

Currently, verification happens during signup by asking users to select "Student" role.

**Suggested improvements:**
- Validate college email domain (e.g., @university.edu)
- Require enrollment code/token from college
- Manual verification workflow with admin approval
- Integration with college database if available

### 3. Database Schema (Recommended)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role ENUM('student', 'company') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  phone VARCHAR,
  location VARCHAR,
  headline VARCHAR,
  bio TEXT,
  resume_url VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Skills
CREATE TABLE student_skills (
  id UUID PRIMARY KEY,
  student_id UUID FOREIGN KEY,
  skill_name VARCHAR NOT NULL
);

-- Education
CREATE TABLE education (
  id UUID PRIMARY KEY,
  student_id UUID FOREIGN KEY,
  school VARCHAR,
  degree VARCHAR,
  field VARCHAR,
  year INTEGER
);

-- Placements/Jobs
CREATE TABLE placements (
  id UUID PRIMARY KEY,
  company_id UUID FOREIGN KEY,
  position VARCHAR NOT NULL,
  location VARCHAR,
  description TEXT,
  salary_range VARCHAR,
  placement_type ENUM('Internship', 'Full-time'),
  posted_date TIMESTAMP,
  application_deadline TIMESTAMP
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  student_id UUID FOREIGN KEY,
  placement_id UUID FOREIGN KEY,
  apply_method ENUM('profile', 'resume'),
  resume_url VARCHAR,
  status ENUM('Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'),
  applied_date TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 4. Environment Variables

Currently using default Next.js. Add if needed:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
API_SECRET_KEY=your_backend_secret_key

# Email configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## File Structure

```
app/
├── page.tsx                          # Landing page
├── login/page.tsx                    # Login page
├── signup/page.tsx                   # Signup page
├── api/
│   └── auth/
│       ├── login/route.ts            # Login API
│       └── signup/route.ts           # Signup API
│   ├── applications/route.ts         # Applications API
│   └── profile/route.ts              # Profile API
└── (protected)/                      # Protected routes
    ├── layout.tsx                    # Protected layout + auth check
    ├── dashboard/page.tsx            # Dashboard
    ├── placements/
    │   ├── page.tsx                  # Placements list
    │   └── [id]/page.tsx             # Placement detail
    ├── applications/page.tsx         # Applications tracking
    └── profile/page.tsx              # Student profile

components/
├── navbar.tsx                        # Top navigation bar
├── sidebar.tsx                       # Left sidebar
└── ui/                               # Shadcn UI components

lib/
├── store/
│   └── auth-store.ts                 # Zustand auth store
└── utils.ts                          # Utility functions

middleware.ts                         # Route protection middleware
```

## State Management (Zustand)

Auth store located at `lib/store/auth-store.ts`:

```typescript
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  login: (email, password, role) => { /* ... */ },
  logout: () => { /* ... */ },
  checkAuth: () => { /* ... */ },
}));
```

Usage in components:
```typescript
const { user, isLoggedIn, logout } = useAuthStore();
```

## Design System

### Colors
- **Primary**: `#8b5cf6` (Purple)
- **Secondary**: `#7c3aed` (Deep Purple)
- **Background**: `#f5f5f3` (Smoky White)
- **Foreground**: `#1a1a1a` (Dark Gray)
- **Border**: `#e5e5e5` (Light Gray)

### Gradient
- Main gradient: `from-[#8b5cf6] to-[#7c3aed]`

## Testing

### Mock Login
- Email: `student@example.com`
- Password: `password123`

The app currently uses mock data for placements. Replace with real API calls once backend is ready.

## Deployment

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set environment variables in `.env.local`

3. Deploy to Vercel:
   ```bash
   pnpm build
   pnpm deploy
   ```

## Security Best Practices

✅ **Implemented:**
- HttpOnly cookies for auth tokens
- Middleware route protection
- CSRF protection (Next.js built-in)

⚠️ **To Implement on Backend:**
- Password hashing (bcrypt recommended)
- Rate limiting on auth endpoints
- Input validation and sanitization
- SQL injection prevention (use parameterized queries)
- CORS configuration
- Session timeout (7 days in this setup)
- Email verification for signup

## Common Issues & Solutions

### Issue: "Redirect to login on protected routes"
**Solution**: Ensure `auth_token` and `user_role` cookies are being set correctly in login/signup API.

### Issue: "Resume upload fails"
**Solution**: Implement multipart/form-data handling in your backend API. Files will be sent as FormData.

### Issue: "Profile updates don't persist"
**Solution**: Make sure your backend profile API is correctly persisting data to the database.

## Next Steps

1. **Setup Your Backend**: Create REST API endpoints for all the TODO items
2. **Update API Routes**: Replace placeholder implementations
3. **Add Database**: Implement the suggested schema
4. **Test Authentication**: Verify login/signup flow
5. **Test Applications**: Submit applications and verify storage
6. **Deploy**: Use Vercel for easy deployment

## Support

For questions about:
- **Frontend Architecture**: Check component files in `components/`
- **Authentication Flow**: See `middleware.ts` and `lib/store/auth-store.ts`
- **API Integration**: Check `app/api/` folder for current implementations
- **UI Components**: Using Shadcn UI components from `components/ui/`

## Future Enhancements

- [ ] Email notifications for application status
- [ ] Job recommendations based on skills
- [ ] Interview scheduling system
- [ ] Messaging between students and companies
- [ ] Admin dashboard for managing placements
- [ ] Company profiles and branding
- [ ] Analytics and reporting
