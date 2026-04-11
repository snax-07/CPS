# PlaceHub - College Placement System 🎓

A modern, fully responsive college placement system built with **Next.js 16**, **React 19**, and **Tailwind CSS**. Students can browse placements, apply with their profile or resume, and track application status.

## ✨ Key Features

### For Students
- 🔐 **Secure Authentication**: Role-based login/signup with HttpOnly cookies
- 📊 **Dashboard**: Stats overview, recent applications, quick actions
- 💼 **Browse Placements**: Search, filter by type (Internship/Full-time)
- 📝 **Apply Options**: 
  - Quick apply using existing profile
  - Custom resume upload
- 📱 **Track Applications**: View status (Under Review, Interview Scheduled, Accepted, Rejected)
- 👤 **Student Profile**: 
  - Personal information management
  - Skills management (add/remove)
  - Resume upload/update
  - Education details

### Technical Features
- ✅ **Mobile-First Responsive Design**: 320px to 1920px
- ✅ **Modern UI**: Smoky white theme with purple gradient accents
- ✅ **Route Protection**: Middleware-based authentication
- ✅ **State Management**: Zustand for lightweight auth state
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **API Ready**: Placeholder routes ready for backend integration

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 with App Router
- **UI**: Shadcn UI Components + Tailwind CSS
- **State**: Zustand (lightweight alternative to Redux)
- **Auth**: HttpOnly Cookies + Middleware Protection
- **Icons**: Lucide React

### Authentication Flow
```
Landing Page → Select Role (Student/Company)
↓
Signup/Login → Set HttpOnly Cookies (auth_token, user_role)
↓
Middleware Check → Protect Routes (/dashboard, /placements, etc.)
↓
Auto-redirect to Login if Cookies Missing
```

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                      # Landing page
│   ├── login/page.tsx                # Login
│   ├── signup/page.tsx               # Signup with role selection
│   ├── (protected)/                  # Route group for protected pages
│   │   ├── layout.tsx                # Auth check + Navbar/Sidebar
│   │   ├── dashboard/page.tsx        # Welcome & stats
│   │   ├── placements/
│   │   │   ├── page.tsx              # Browse & search placements
│   │   │   └── [id]/page.tsx         # Placement detail + apply
│   │   ├── applications/page.tsx     # Track applications
│   │   └── profile/page.tsx          # Manage profile & resume
│   └── api/
│       ├── auth/login/route.ts       # Login endpoint
│       ├── auth/signup/route.ts      # Signup endpoint
│       ├── applications/route.ts     # Submit application
│       └── profile/route.ts          # Get/update profile
├── components/
│   ├── navbar.tsx                    # Top navigation
│   ├── sidebar.tsx                   # Left sidebar navigation
│   └── ui/                           # Shadcn UI components
├── lib/
│   ├── store/
│   │   └── auth-store.ts             # Zustand auth store
│   └── utils.ts                      # Utility functions
├── middleware.ts                     # Route protection
├── SETUP.md                          # Backend integration guide
└── README.md                         # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Navigate the App
- **Landing Page**: `/`
- **Signup**: `/signup`
- **Login**: `/login`
- **Dashboard**: `/dashboard` (protected)
- **Placements**: `/placements` (protected)
- **Applications**: `/applications` (protected)
- **Profile**: `/profile` (protected)

## 🔐 Authentication

### How It Works
1. User signs up/logs in with email and password
2. Backend sets two HttpOnly cookies:
   - `auth_token`: Contains JWT or session token
   - `user_role`: 'student' or 'company'
3. Middleware checks cookies on every request
4. Protected routes redirect to login if cookies are missing
5. Logout removes cookies

### Current Mock Implementation
The API routes currently use mock responses. See `SETUP.md` for backend integration instructions.

### Demo Credentials
- Email: `student@example.com`
- Password: `password123`

## 🎨 Design System

### Colors
- **Primary**: `#8b5cf6` (Purple)
- **Secondary**: `#7c3aed` (Deep Purple)  
- **Background**: `#f5f5f3` (Smoky White)
- **Foreground**: `#1a1a1a` (Dark Gray)
- **Muted**: `#e5e5e5` (Light Gray)

### Gradients
- Main: `from-[#8b5cf6] to-[#7c3aed]`
- Hover effects on buttons and cards

### Typography
- **Headings**: Geist font
- **Body**: Geist Sans
- **Mono**: Geist Mono

## 📊 State Management

### Zustand Auth Store (`lib/store/auth-store.ts`)

```typescript
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  login: async (email, password, role) => { /* ... */ },
  logout: () => { /* ... */ },
  checkAuth: () => { /* ... */ },
}));
```

**Usage in components:**
```typescript
const { user, isLoggedIn, logout } = useAuthStore();
```

## 🔗 Backend Integration

### Ready for Integration
All API routes are set up with TODO comments for backend integration:

- `/app/api/auth/login/route.ts` - Login endpoint
- `/app/api/auth/signup/route.ts` - Signup endpoint
- `/app/api/applications/route.ts` - Submit/track applications
- `/app/api/profile/route.ts` - Manage student profile

**See `SETUP.md` for detailed integration instructions.**

## 🛡️ Security Features

### Implemented
- HttpOnly Secure Cookies (immune to XSS)
- Route middleware protection
- CSRF protection (Next.js built-in)
- Type-safe API routes

### Ready to Implement (Backend)
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- SQL injection prevention
- Email verification
- Session timeout

## 📱 Responsive Design

- **Mobile**: 320px+ (full-width, stack layout)
- **Tablet**: 768px+ (side navigation, 2-column grids)
- **Desktop**: 1024px+ (full sidebar, 3+ column grids)

All pages use mobile-first approach with Tailwind breakpoints.

## 🧪 Testing

The app uses mock data for placements. Before going to production:

1. Replace mock placements in `app/(protected)/placements/page.tsx`
2. Implement real API calls from backend
3. Test application submission flow
4. Verify resume upload functionality
5. Test profile updates

## 📦 Dependencies

Key packages:
- `zustand`: State management
- `js-cookie`: Cookie handling
- `lucide-react`: Icons
- `shadcn/ui`: UI components
- `tailwindcss`: Styling
- `next`: Framework
- `react` & `react-dom`: Core React

## 🚢 Deployment

### Deploy to Vercel (Recommended)
```bash
pnpm build
vercel deploy
```

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=your_backend_url
# Add other env vars as needed
```

## 📝 License

This project is ready for production use. Customize as needed for your institution.

## 🤝 Support

For questions about:
- **Authentication**: Check `middleware.ts` and `lib/store/auth-store.ts`
- **Backend Integration**: Read `SETUP.md`
- **Component Usage**: Shadcn UI docs at `ui.shadcn.com`
- **Styling**: Tailwind CSS at `tailwindcss.com`

---

**Built with ❤️ for college placements**
