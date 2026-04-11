# Quick Start Guide for Developers

## 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- Your backend running on `http://localhost:8080`
- Git (optional)

### Frontend Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## Testing the System

### Create Test Data
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Choose role: "Student"
4. Fill form and submit
5. Backend should store user in MongoDB

### Login
1. Go to http://localhost:3000/login
2. Use credentials you just created
3. Should redirect to `/dashboard`

### Browse Jobs
1. Click "Placements" in sidebar
2. Should see list from backend (empty if no jobs exist)
3. Try applying for a job

### Admin Access
1. Create user with role "admin"
2. Login and you'll see admin panel
3. View users, stats, verify companies

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/api-client.ts` | All API calls to backend |
| `lib/store/auth-store.ts` | Authentication state management |
| `middleware.ts` | Route protection & redirects |
| `app/login/page.tsx` | Login form |
| `app/signup/page.tsx` | Registration form |
| `app/(protected)/dashboard/page.tsx` | Student dashboard |

---

## Making Your First API Call

### Example: Fetch User Profile
```typescript
import { studentAPI } from '@/lib/api-client';

async function getProfile() {
  try {
    const profile = await studentAPI.getProfile();
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### Example: Apply for Job
```typescript
import { applicationAPI } from '@/lib/api-client';

async function applyForJob() {
  try {
    await applicationAPI.createApplication('jobId');
    toast.success('Applied successfully!');
  } catch (error) {
    toast.error('Failed to apply');
  }
}
```

---

## Common Tasks

### Add a New Page
```bash
# 1. Create page file
mkdir -p app/new-feature
touch app/new-feature/page.tsx

# 2. Add protected routes group
mkdir -p app/(protected)/new-feature

# 3. Write component and export default
```

### Fetch Data in a Component
```typescript
'use client';
import { useEffect, useState } from 'react';
import { jobAPI } from '@/lib/api-client';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobAPI.getAllJobs()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{/* render data */}</div>;
}
```

### Add a Toast Notification
```typescript
import { toast } from 'sonner';

// Success
toast.success('Profile updated!');

// Error
toast.error('Something went wrong');

// Info
toast.info('Please complete your profile');

// Warning
toast.warning('This action cannot be undone');
```

### Redirect User
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

---

## Debugging

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request
4. See full request/response

### Check Cookies
1. DevTools → Application
2. Click "Cookies"
3. Should see `auth_token` and `user_role`

### Check Browser Console
1. DevTools → Console
2. Look for errors
3. Check logged data with `console.log()`

### Check Middleware
If routes aren't redirecting:
1. Verify `middleware.ts` exists in root
2. Check `app/` has correct structure
3. Clear browser cookies and re-login

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Production build
npm run build        # Create optimized build
npm start            # Run production build

# Linting & formatting
npm run lint         # Check code quality
npm run format       # Format code

# Clean up
npm run clean        # Remove build files
```

---

## File Structure Quick Reference

```
/app
  /page.tsx                    # Landing page (/)
  /login/page.tsx              # Login page (/login)
  /signup/page.tsx             # Sign up page (/signup)
  
  /(protected)                 # Protected route group
    /dashboard/page.tsx        # Student dashboard (/dashboard)
    /placements/page.tsx       # Job list (/placements)
    /placements/[id]/page.tsx  # Job detail (/placements/:id)
    /applications/page.tsx     # Applications (/applications)
    /profile/page.tsx          # Student profile (/profile)
    
    /company/layout.tsx        # Company layout
    /company/page.tsx          # Company dashboard (/company)
    /company/jobs/[id]/page.tsx # Applicants (/company/jobs/:id)
    
    /admin/layout.tsx          # Admin layout
    /admin/page.tsx            # Admin dashboard (/admin)
    /admin/users/page.tsx      # User mgmt (/admin/users)
    /admin/companies/page.tsx   # Company verify (/admin/companies)

/components
  /ui/                         # Shadcn UI components
  /navbar.tsx                  # Top navigation
  /sidebar.tsx                 # Side navigation
  /profile-completeness-meter.tsx
  /status-badge.tsx
  /empty-state.tsx
  /loading-skeleton.tsx

/lib
  /api-client.ts               # Backend API calls
  /store/
    /auth-store.ts             # Auth state (Zustand)

middleware.ts                  # Route protection
```

---

## Backend Integration Points

### When Implementing Backend Endpoints:

1. **Authentication**
   - Login response must include `token` and `user` object
   - Frontend will auto-store token in HTTP-only cookie
   - Set `user_role` cookie to 'student', 'company', or 'admin'

2. **Student API**
   - `/students/profile` must return Student model
   - `/students/resume` must handle multipart/form-data
   - Return saved data in response

3. **Job API**
   - `/jobs` must support query filters (location, company)
   - `/jobs/{id}` must return full job details
   - Include `postedBy` user info

4. **Application API**
   - `/applications` POST must create application record
   - `/applications` GET must return user's applications
   - PATCH must update status

5. **Admin API**
   - `/admin/stats` must return aggregated statistics
   - `/admin/users` must return array of all users
   - `/admin/verify/{id}` must update isVerified flag

---

## Troubleshooting Common Issues

### Issue: 404 on API calls
**Solution**: Verify backend is running on port 8080
```bash
# Check if backend is listening
curl http://localhost:8080/api/jobs
```

### Issue: CORS errors
**Solution**: Add to backend cors config
```javascript
cors({
  origin: 'http://localhost:3000',
  credentials: true
})
```

### Issue: Cookies not persisting
**Solution**: Ensure fetch uses `credentials: 'include'`
```typescript
fetch(url, {
  credentials: 'include',  // This is required
})
```

### Issue: Routes redirecting to login
**Solution**: Check if token exists
```javascript
// DevTools Console
document.cookie // Should show auth_token
```

### Issue: Middleware not working
**Solution**: Verify middleware.ts location
```
/middleware.ts (root level, not in /app)
```

---

## Performance Tips

1. **Use SWR for data fetching**
   ```typescript
   import useSWR from 'swr';
   const { data, error } = useSWR('/api/endpoint', fetcher);
   ```

2. **Lazy load components**
   ```typescript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./heavy'));
   ```

3. **Optimize images**
   ```typescript
   import Image from 'next/image';
   <Image src="..." alt="..." width={400} height={300} />
   ```

4. **Memoize expensive components**
   ```typescript
   export default memo(MyComponent);
   ```

---

## Code Examples

### Complete Login Flow
```typescript
'use client';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### Complete Job List
```typescript
'use client';
import { useEffect, useState } from 'react';
import { jobAPI } from '@/lib/api-client';
import { LoadingSkeletons } from '@/components/loading-skeleton';
import { EmptyState } from '@/components/empty-state';

export default function JobList() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobAPI.getAllJobs()
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeletons count={3} />;
  if (!jobs?.length) return <EmptyState title="No jobs found" />;

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
```

---

## Next Steps

1. **Start backend** on `http://localhost:8080`
2. **Test authentication** - Sign up and login
3. **Verify API calls** - Check Network tab in DevTools
4. **Implement features** - Build custom endpoints
5. **Deploy** - Push to production

---

## Documentation Links

- **API Endpoints**: See `API_ENDPOINTS.md`
- **Full Guide**: See `IMPLEMENTATION_GUIDE.md`
- **System Summary**: See `COMPLETE_SYSTEM_SUMMARY.md`
- **Tailwind CSS**: https://tailwindcss.com
- **Shadcn UI**: https://ui.shadcn.com
- **Next.js**: https://nextjs.org

---

## Getting Help

### Check Logs
```bash
# Frontend errors
# Open DevTools → Console

# Backend errors
# Check terminal output where `npm start` runs
```

### Common Endpoints to Test
```bash
# Test backend connectivity
curl http://localhost:8080/api/jobs

# With auth (if you have token)
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/students/profile
```

### Contact Support
If you get stuck:
1. Check console for errors
2. Verify backend is running
3. Check Network tab for API response
4. Review `API_ENDPOINTS.md` for expected response format

---

## Happy Coding! 🚀

The foundation is solid. Now build amazing features on top! 

