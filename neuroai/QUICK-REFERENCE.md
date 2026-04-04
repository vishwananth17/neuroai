# NeuroAI Quick Reference Guide

## 🚀 Getting Started (First Time)

```bash
cd neuroai
cp .env.example .env.local
# Fill in API keys in .env.local

npm install
npm run db:generate
npm run db:push

npm run dev
# Open http://localhost:3000
```

## 📝 Key Commands

```bash
# Development
npm run dev                 # Start dev server (port 3000)
npm run lint               # Run ESLint
npm run build              # Build for production

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema changes
npm run db:studio          # Open Prisma Studio (visual DB browser)
npm run db:seed            # Seed test data (create if needed)

# Type checking
npx tsc --noEmit           # Check TypeScript
```

## 🏗️ Creating New Pages

### Example: Login Page
```bash
# Create file: app/login/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-glass rounded-xl p-8 border border-glass-hover">
        <h1 className="text-2xl font-bold text-star mb-6">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-rose/20 border border-rose rounded-lg text-rose text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-glass rounded-lg 
                       text-primary focus:outline-none focus:border-indigo"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-glass rounded-lg 
                       text-primary focus:outline-none focus:border-indigo"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo text-void font-bold rounded-lg 
                       hover:shadow-glow-indigo-md transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-secondary text-sm">
          No account? <a href="/register" className="text-indigo hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
```

## 🔌 Creating New API Routes

### Example: Get User Profile
```bash
# Create file: app/api/users/profile/route.ts

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { prisma } from '@/lib/db/prisma';
import { jsonSuccess } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req, auth) => {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        name: true,
        college: true,
        branch: true,
        year: true,
        plan: true,
        createdAt: true,
        lastActiveAt: true,
      },
    });

    return jsonSuccess({ user }, 200);
  });
}
```

## 🎨 CSS Utilities Quick Ref

### Colors
```
bg-void              /* #030306 - main background */
bg-surface           /* #0D0D1C - elevated surface */
bg-indigo            /* #6C63FF - primary brand */
bg-cyan              /* #00F5FF - secondary accent */
bg-glass             /* Glassmorphism bg */
text-star            /* #FFFFFF - bright text */
text-primary         /* #E8E8FF - body text */
text-secondary       /* #9898C0 - muted text */
```

### Components
```
/* Glassmorphism Card */
<div className="bg-glass border border-glass rounded-xl p-6 
                    backdrop-blur-md hover:border-glow-indigo">

/* Button */
<button className="px-4 py-2 bg-indigo text-void font-bold rounded-lg 
                   hover:shadow-glow-indigo-md transition-all">

/* Input */
<input className="px-4 py-2 bg-surface border border-glass rounded-lg 
                  text-primary focus:outline-none focus:border-indigo" />
```

## 🔐 Using Authenticated Requests

### From Frontend
```javascript
// Fetch with auth header automatically
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

### From API Route
```typescript
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req, auth) => {
    // auth.userId and auth.email available here
    const user = await prisma.user.findUnique({
      where: { id: auth.userId }
    });
    return jsonSuccess({ user });
  });
}
```

## 📊 Database Queries

### Find user by email
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

### Get user's saved papers
```typescript
const papers = await prisma.savedPaper.findMany({
  where: { userId: auth.userId },
  include: { paper: true },
  orderBy: { savedAt: 'desc' },
  take: 10,
});
```

### Create paper summary
```typescript
await prisma.paperSummary.create({
  data: {
    paperId: paper.id,
    summaryType: 'BRIEF',
    content: 'Summary text...',
    modelUsed: 'deepseek',
    tokensUsed: 150,
  },
});
```

### Check cached summary
```typescript
const cached = await prisma.paperSummary.findFirst({
  where: {
    paperId: paperId,
    summaryType: 'BRIEF',
    userId: null, // public cache
  },
});
```

## 🐛 Debugging

### Check Prisma Schema
```bash
npm run db:studio
# Opens visual database browser at http://localhost:5555
```

### Check TypeScript Issues
```bash
npx tsc --noEmit
```

### Debug API Routes
```typescript
// Add logging
console.log('[API] Request:', req.method, req.url);
console.log('[API] Body:', await req.json());
console.error('[API] Error:', error);
```

### Check Token in Browser
```javascript
// In browser console
localStorage.getItem('accessToken')
```

## 📡 Testing API Routes

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "college": "Test College",
    "branch": "CSE",
    "year": 3
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Search Papers
```bash
curl http://localhost:3000/api/papers/search?q=machine%20learning&limit=10
```

### Summarize Paper (requires auth)
```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "paperId": "semantic-scholar-id",
    "summaryType": "BRIEF"
  }'
```

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `DATABASE_URL not set` | Missing .env.local | Create .env.local with DATABASE_URL |
| `DeepSeek invalid key` | Wrong API key | Generate new key at platform.deepseek.com |
| `Port 3000 in use` | Another app using port | `npm run dev -- --port 3001` |
| `Module not found` | Import path wrong | Check path matches file location |
| `Cannot find module prisma` | Didn't run npm install | `npm install` |
| `Token expired` | JWT past expiry | Refresh token automatically |
| `Paper not found` | semanticId doesn't exist | Try searching first to create it |

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎯 Next Immediate Task

1. Create `/login` page (refer to example above)
2. Create `/register` page (similar to login)
3. Test both endpoints with curl
4. Add React Query for better state management
5. Build `/search` page with results display
