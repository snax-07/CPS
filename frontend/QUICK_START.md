# Quick Start Guide - College Placement System

## Installation & Setup

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev

# Open http://localhost:3000
```

---

## User Roles & Access

### Student
- **Routes**: `/dashboard`, `/placements`, `/placements/[id]`, `/applications`, `/profile`
- **Features**: Browse jobs, apply, track applications, manage profile
- **Entry Point**: `/dashboard`

### Company
- **Routes**: `/company`, `/company/jobs`, `/company/jobs/[id]`
- **Features**: Post jobs, view applicants, manage applications, track metrics
- **Entry Point**: `/company`

### Admin
- **Routes**: `/admin`, `/admin/users`, `/admin/companies`
- **Features**: System analytics, verify companies, manage users, export reports
- **Entry Point**: `/admin`

---

## Key Components & Their Variants

### ProfileCompletenessMeter
```tsx
// Small - for lists/sidebars
<ProfileCompletenessMeter percentage={65} variant="small" />

// Premium - for profile page
<ProfileCompletenessMeter percentage={65} variant="premium" />
```

### EmptyState
```tsx
// Small - for list sections
<EmptyState 
  icon={Users}
  title="No users found"
  description="Try adjusting search"
  variant="small"
/>

// Premium - for full-page sections
<EmptyState 
  icon={Users}
  title="No users found"
  description="Try adjusting search"
  action={{ label: "Create User", onClick: () => {} }}
  variant="premium"
/>
```

### StatusBadge
```tsx
// Small
<StatusBadge status="accepted" variant="small" />

// Premium
<StatusBadge status="accepted" variant="premium" />
```

### Loading Skeletons
```tsx
// Job cards
<JobCardSkeleton />

// Table rows
<TableSkeletonLoader rows={5} />

// Stat cards
<DashboardCardSkeleton />
```

---

## Common Workflows

### Adding a Toast Notification
```tsx
import { toast } from 'sonner';

// Success
toast.success('Application submitted successfully!');

// Error
toast.error('Failed to update status');

// Info
toast.info('Processing your request...');
```

### Making API Calls
```tsx
const response = await fetch('/api/placements', {
  method: 'GET',
  credentials: 'include', // Important for cookies
});

const data = await response.json();
```

### Logout
```tsx
const handleLogout = () => {
  // Clear cookies
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  router.push('/login');
};
```

---

## File Structure

```
app/
├── page.tsx                    # Landing page
├── login/page.tsx             # Login page
├── signup/page.tsx            # Signup page
├── (protected)/
│   ├── dashboard/page.tsx     # Student dashboard
│   ├── placements/
│   │   ├── page.tsx           # Browse jobs
│   │   └── [id]/page.tsx      # Job detail
│   ├── applications/page.tsx  # Track applications
│   ├── profile/page.tsx       # Student profile
│   ├── company/
│   │   ├── layout.tsx         # Company layout
│   │   ├── page.tsx           # Company dashboard
│   │   └── jobs/[id]/page.tsx # Applicants pipeline
│   └── admin/
│       ├── layout.tsx         # Admin layout
│       ├── page.tsx           # Admin dashboard
│       ├── users/page.tsx     # User management
│       └── companies/page.tsx # Company verification
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── signup/route.ts
│   ├── profile/route.ts
│   ├── applications/route.ts
│   └── v1/
│       ├── company/jobs/route.ts
│       └── admin/stats/route.ts
└── globals.css               # Global styles

components/
├── profile-completeness-meter.tsx
├── empty-state.tsx
├── loading-skeleton.tsx
├── status-badge.tsx
├── navbar.tsx
├── sidebar.tsx
├── ui/                        # shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── badge.tsx
│   └── ... (40+ more)
└── theme-provider.tsx

lib/
├── store/
│   └── auth-store.ts         # Zustand auth store
└── utils.ts

Documentation/
├── SYSTEM_ARCHITECTURE.md    # Complete guide
├── CHANGES_IMPLEMENTED.md    # What's new
└── QUICK_START.md           # This file
```

---

## Color Tokens

```css
--primary: #8b5cf6 (Purple)
--secondary: #7c3aed (Deep Purple)
--background: #f5f5f3 (Smoky White)
--border: #e5e5e5 (Light Gray)
--foreground: #1a1a1a (Dark)
--muted-foreground: #737373 (Gray)
```

---

## API Endpoints to Implement

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/signup` - Register with role selection
- `POST /api/auth/logout` - Logout user

### Student
- `GET /api/placements` - List all jobs
- `GET /api/placements/:id` - Get job detail
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get student's applications
- `GET /api/profile` - Get student profile
- `PUT /api/profile` - Update student profile

### Company
- `GET /api/v1/company/jobs` - Get company's jobs
- `POST /api/v1/company/jobs` - Create new job
- `GET /api/v1/company/jobs/:id/applicants` - Get applicants for job
- `PATCH /api/v1/applications/:id/status` - Update application status

### Admin
- `GET /api/v1/admin/stats` - System analytics
- `GET /api/v1/admin/users` - List all users
- `PUT /api/v1/admin/verify-company/:id` - Verify company
- `DELETE /api/v1/admin/users/:id` - Delete user

---

## Database Tables (Backend Required)

### users
```sql
id, email, password_hash, name, role (student|company|admin), created_at, updated_at
```

### students
```sql
user_id, phone, location, headline, bio, cgpa, department, college, 
resume_url, skills (JSON), education (JSON), profile_completeness
```

### companies
```sql
user_id, company_name, website, verified, documents_url, created_at
```

### jobs
```sql
id, company_id, title, description, requirements, salary_range,
location, deadline, min_cgpa, posted_date, status (active|closed)
```

### applications
```sql
id, student_id, job_id, applied_date, status (pending|shortlisted|interview|accepted|rejected),
resume_url, applied_with_profile, next_steps
```

---

## Testing Tips

1. **Test Profile Completeness**:
   - Go to `/profile`
   - See completeness meter at top
   - Fill in different sections and watch percentage update

2. **Test Empty States**:
   - As admin, go to `/admin/users`
   - Search for non-existent user
   - See "No users found" message with action button

3. **Test Company Module**:
   - Go to `/company`
   - Click "View Details" on a job
   - Click on an applicant to see quick view modal
   - Try updating status (watch toast notification)

4. **Test Admin Module**:
   - Go to `/admin`
   - See stats cards with trends
   - Go to `/admin/companies`
   - Try approving/rejecting a company

---

## Common Issues & Solutions

### Issue: Cookies not being set
**Solution**: Make sure login endpoint sets HttpOnly cookies
```js
res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Secure; Path=/`);
```

### Issue: Middleware not protecting routes
**Solution**: Check middleware.ts is in root directory (not in app folder)

### Issue: Components not showing styles
**Solution**: 
- Verify Tailwind CSS is configured in globals.css
- Check design tokens are defined in :root
- Ensure classes are using semantic tokens (e.g., `text-foreground`)

### Issue: Toast notifications not showing
**Solution**: Make sure `<Toaster />` is in layout.tsx
```tsx
import { Toaster } from 'sonner';
export default function Layout() {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

---

## Performance Optimization

✅ Already implemented:
- Responsive images with lazy loading
- Code splitting via Next.js dynamic imports
- CSS optimization via Tailwind
- Component-level memoization where needed
- Skeleton loaders for perceived performance

---

## Security Checklist

- [ ] Backend validates all inputs
- [ ] Passwords hashed with bcrypt
- [ ] HTTPS/SSL enabled in production
- [ ] HttpOnly cookies for auth tokens
- [ ] CORS configured properly
- [ ] Environment variables secured
- [ ] SQL injection prevention via parameterized queries
- [ ] CSRF tokens on forms
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for sensitive actions

---

## Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel deploy

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=your-api-url
# DATABASE_URL=your-database-url
```

---

## Support & Documentation

- **Full Architecture**: See `SYSTEM_ARCHITECTURE.md`
- **All Changes**: See `CHANGES_IMPLEMENTED.md`
- **API Docs**: See `/api` folder with TODO comments
- **Component Props**: Check component files for TypeScript interfaces

---

**Status**: ✅ Frontend Complete - Ready for Backend Integration

Start with the `SYSTEM_ARCHITECTURE.md` for complete understanding of the system!
