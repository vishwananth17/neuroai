# NeuroAI - AI Research Platform for Indian Engineers

> Research Smarter. Think Deeper. Built production-ready from day one.

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL (via Supabase)
- Redis (via Upstash)
- API Keys:
  - DeepSeek API (primary AI)
  - Groq API (fallback AI)
  - Semantic Scholar (free, no key needed)
  - Resend (for emails)

### 1. Setup Environment

```bash
cd neuroai

# Copy environment template
cp .env.example .env.local

# Fill in your API keys in .env.local
nano .env.local
```

Required variables:
```
DATABASE_URL=postgresql://...    # Supabase
DEEPSEEK_API_KEY=sk-...          # https://platform.deepseek.com
GROQ_API_KEY=gsk-...             # https://console.groq.com
JWT_SECRET=your-secret-key       # Generate: openssl rand -base64 32
```

### 2. Install & Setup Database

```bash
# Install dependencies
npm install

# Setup Prisma
npm run db:generate
npm run db:push

# (Optional) Seed with test data
# npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
neuroai/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── api/
│       ├── auth/                # Auth routes (register, login, refresh)
│       ├── papers/              # Paper search & detail
│       ├── ai/                  # AI summarization & chat
│       └── users/               # User profile & collections
├── components/
│   ├── SearchBar.tsx            # Main search input
│   ├── PaperCard.tsx            # Paper result card
│   ├── SummaryPanel.tsx         # AI summary viewer
│   ├── Header.tsx               # App header
│   └── Navbar.tsx               # Navigation
├── lib/
│   ├── config/                  # All configuration
│   ├── ai/
│   │   └── provider.ts          # AI fallback chain
│   ├── auth.ts                  # JWT & password utilities
│   ├── api/
│   │   └── errors.ts            # Error handling system
│   ├── types.ts                 # TypeScript definitions
│   └── db/
│       └── prisma.ts            # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
├── tailwind.config.ts           # Design system tokens
├── next.config.ts               # Next.js config
└── .env.example                 # Environment template
```

## 🏗️ Architecture Overview

### Authentication Flow
```
Register/Login → JWT Token (15min) + Refresh Token (7d)
                → Stored in: accessToken (memory) + refreshToken (httpOnly cookie)
                → Protected routes check Bearer token
                → Auto-refresh on expiry
```

### Paper Search Flow
```
User Search Query
  ↓
[/api/papers/search]
  ↓
Try Semantic Scholar API
  ↓(if fails)
Fallback to PostgreSQL FTS
  ↓
Cache results in PostgreSQL
  ↓
Return to frontend
```

### AI Summarization Flow
```
User Request (paperId, summaryType)
  ↓
Check PostgreSQL cache
  ↓(if cached)
Return instantly
  ↓(if not cached)
Call AI with fallback chain:
  1. DeepSeek (primary)
  2. Groq (ultra-fast)
  3. OpenRouter (flexible)
  ↓
Save to PostgreSQL cache
  ↓
Deduct from daily quota
  ↓
Return to frontend
```

## 🔌 API Endpoints (Built)

### ✅ Implemented
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/papers/search?q=...` - Search papers (Semantic Scholar)
- `POST /api/ai/summarize` - Generate paper summary (5 types)

### 📋 TODO (High Priority)
- `GET /api/papers/:id` - Paper details
- `GET /api/papers/:id/related` - Related papers
- `POST /api/users/saved-papers` - Save paper to library
- `GET /api/users/saved-papers` - User's library
- `POST /api/users/collections` - Create collection
- `GET /api/auth/me` - Current user profile
- `POST /api/auth/refresh` - Refresh JWT

## 🎨 Design System

### Colors (Anti-Gravity Dark Cosmos)
- **Primary:** `#6C63FF` (Indigo)
- **Accent:** `#00F5FF` (Cyan)
- **Success:** `#00FFB2` (Emerald)
- **Error:** `#FF3D7F` (Rose)
- **Background:** `#030306` (Void)
- **Surface:** `#0D0D1C` (Space)

### Typography
- **Display:** Syne (bold headings)
- **Body:** DM Mono (code & content)
- **Weights:** 400 (regular), 600 (medium), 700 (bold), 800 (black)

### Components (Glassmorphism)
- Rounded corners: `20px`
- Backdrop blur: `16px`
- Border opacity: `6%`
- Glow shadows available

### Animations
- `animate-fade-up` - Page loads
- `animate-float` - Cards
- `animate-shimmer` - Skeletons
- All easing: `cubic-bezier(0.23, 1, 0.32, 1)`

## 🔐 Security

✅ **Implemented:**
- Password hashing (PBKDF2, cost factor 100,000)
- JWT with HS256
- httpOnly refresh token cookies
- Input validation on all routes
- Prisma ORM (SQL injection proof)
- XSS protection (React auto-escapes)
- CORS whitelist (configure for production)
- Rate limiting per user tier

⚠️ **TODO:**
- CSRF protection
- API key rotation
- Sentry error tracking
- Helmet.js for security headers

## 📊 Rate Limiting

```
FREE tier:     20 searches/day, 10 AI queries/day
STUDENT tier:  100 searches/day, 50 AI queries/day
PRO tier:      Unlimited
```

Cache TTLs:
- Paper search results: 1 hour
- Paper metadata: 24 hours
- AI summaries: Permanent
- User session: 15 minutes

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Database (Supabase)
1. Create project at https://supabase.com
2. Get `DATABASE_URL` from Settings → Connection Strings
3. Run migrations: `npm run db:push`

### Redis (Upstash)
1. Create DB at https://upstash.com
2. Copy `UPSTASH_REDIS_URL` and token

### Environment Variables
Set in production:
- All API keys
- `NODE_ENV=production`
- `SENTRY_DSN` for error tracking
- `POSTHOG_KEY` for analytics

## 📈 Monitoring

### Errors (Sentry)
```javascript
// Already integrated in error handler
// Just set NEXT_PUBLIC_SENTRY_DSN in production
```

### Analytics (PostHog)
```javascript
// Track user events automatically
// Set NEXT_PUBLIC_POSTHOG_KEY in production
```

### Logs
- Console logs in development
- File logs in production (configure Winston)

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# TODO: Add Unit Tests
# npm test

# TODO: Add E2E Tests
# npm run e2e
```

## 📚 API Documentation

### Example: Register User
```bash
curl -X POST http://localhost:3000/api/auth/register\
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arjun Sharma",
    "email": "arjun@college.edu",
    "password": "SecurePass123",
    "college": "NIT Trichy",
    "branch": "CSE",
    "year": 3
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid123",
      "email": "arjun@college.edu",
      "name": "Arjun Sharma"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "15m"
    }
  }
}
```

## 🐛 Troubleshooting

### "DATABASE_URL not set"
→ Create `.env.local` file with valid PostgreSQL URL

### "DEEPSEEK_API_KEY invalid"
→ Generate key at https://platform.deepseek.com
→ Check credit balance (free tier has limits)

### "Semantic Scholar rate limited"
→ Results fall back to PostgreSQL FTS search
→ Wait a moment and retry

### "Port 3000 already in use"
```bash
npm run dev -- --port 3001
```

## 🤝 Contributing

Current focus: **Complete MVP in 2 weeks**

Priority:
1. Auth pages (login/register UI)
2. Search results page
3. Paper detail page
4. User library
5. Polish & optimize

## 📝 License

MIT - Built with ❤️ for Indian engineering students

## 🎯 Next Immediate Steps

1. **Today:** Setup .env.local, run `npm run dev`
2. **Test auth:** Try register endpoint via curl
3. **Build login page:** Use SearchBar as reference
4. **Build search results page:** Use PaperCard component
5. **Build paper detail page:** Add SummaryPanel

See `/memories/session/neuroai-build-plan.md` for detailed roadmap.

---

Built by engineers, for engineers. Let's ship. 🚀
