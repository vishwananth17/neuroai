# NeuroAI Implementation Checklist

## Phase 0: Foundation ✅ COMPLETE
- [x] Prisma database schema
- [x] Configuration system (lib/config/index.ts)
- [x] AI fallback chain (DeepSeek → Groq → OpenRouter)
- [x] Authentication utilities (JWT, password hashing)
- [x] Error handling system
- [x] Type definitions (lib/types.ts)
- [x] Tailwind design system
- [x] SearchBar component
- [x] PaperCard component
- [x] SummaryPanel component
- [x] API routes: auth/register, auth/login, papers/search, ai/summarize
- [x] Auth middleware

## Phase 1: Authentication Pages (Est. 3-4 hours)
- [ ] `/login` page
  - [ ] Email + password form
  - [ ] Error display
  - [ ] "Forgot password" link
  - [ ] "Sign up" link
  - [ ] Remember me checkbox (optional)
  - [ ] Loading state
  
- [ ] `/register` page
  - [ ] Form fields: name, email, password, college, branch, year
  - [ ] Password strength indicator
  - [ ] Email uniqueness check (live)
  - [ ] Terms of service checkbox
  - [ ] Error messages per field
  - [ ] Loading state
  - [ ] Email verification placeholder

- [ ] `/forgot-password` page
  - [ ] Email input
  - [ ] Submit button
  - [ ] Success message

- [ ] `/reset-password` page
  - [ ] Decode token from URL
  - [ ] New password + confirm
  - [ ] Success message

- [ ] Auth Context/Hook
  - [ ] `useAuth()` hook
  - [ ] Login function
  - [ ] Logout function
  - [ ] Register function
  - [ ] Token refresh on expiry
  - [ ] Redirect to login if not authenticated

## Phase 2: Core Pages (Est. 5-6 hours)
- [ ] `/search` page
  - [ ] Display search results
  - [ ] Map results to PaperCard component
  - [ ] Pagination
  - [ ] Loading skeleton states
  - [ ] Empty state message
  - [ ] Error state UI
  - [ ] Refine search (year, field filters)

- [ ] `/paper/[id]` page (Paper detail)
  - [ ] Fetch paper from /api/papers/:id
  - [ ] Display full metadata
  - [ ] Embed PDF viewer (if pdfUrl available)
  - [ ] Render SummaryPanel
  - [ ] "Save to library" button with loading state
  - [ ] Related papers section
  - [ ] Citation copy button
  - [ ] Share buttons (Twitter, email, copy link)
  - [ ] Comments/notes section (placeholder)

- [ ] `/dashboard` page (Protected)
  - [ ] Display user stats (searches today, AI queries used)
  - [ ] Quick actions (search, recent papers)
  - [ ] Trending papers widget
  - [ ] Usage progress bars
  - [ ] Upgrade CTA for free tier

- [ ] `/library` page (Protected)
  - [ ] Tab: "All papers" + "Collections"
  - [ ] Grid of saved papers
  - [ ] Delete from library button
  - [ ] Collections sidebar
  - [ ] Create new collection button

- [ ] `/profile` page (Protected)
  - [ ] Edit name, college, branch, year
  - [ ] Change password
  - [ ] Delete account
  - [ ] Usage history (last 7 days chart)
  - [ ] API key management (future)

## Phase 3: Missing API Routes (Est. 4-5 hours)
### Papers
- [ ] `GET /api/papers/:id`
  - [ ] Fetch from DB
  - [ ] Return full paper metadata
  - [ ] Increment view count

- [ ] `GET /api/papers/:id/related`
  - [ ] Call Semantic Scholar related API
  - [ ] Cache results
  - [ ] Return top 5 related papers

### Users
- [ ] `POST /api/users/saved-papers`
  - [ ] Save paper to user's library
  - [ ] Check if already saved (upsert)
  - [ ] Return success/failure

- [ ] `GET /api/users/saved-papers`
  - [ ] Fetch user's saved papers
  - [ ] Pagination
  - [ ] Sort by date/citations

- [ ] `POST /api/users/collections`
  - [ ] Create collection
  - [ ] Validate name
  - [ ] Return collection ID

- [ ] `GET /api/users/collections`
  - [ ] Fetch user's collections
  - [ ] Include paper count per collection

- [ ] `GET /api/users/usage-stats`
  - [ ] Daily searches remaining
  - [ ] Daily AI queries remaining
  - [ ] Total saved papers
  - [ ] Last 7 days usage chart data

### Auth
- [ ] `GET /api/auth/me`
  - [ ] Require auth
  - [ ] Return current user profile
  - [ ] Cache in React Query

- [ ] `POST /api/auth/refresh`
  - [ ] Accept refreshToken
  - [ ] Validate and return new accessToken
  - [ ] Update refresh token cookie

- [ ] `POST /api/auth/logout`
  - [ ] Invalidate refreshToken in DB
  - [ ] Clear cookies

## Phase 4: Utilities & Hooks (Est. 3-4 hours)
- [ ] `lib/hooks/useAuth.ts`
  - [ ] Auth context setup
  - [ ] Login/register/logout
  - [ ] Token management
  - [ ] Auto-redirect on auth

- [ ] `lib/hooks/useAPI.ts`
  - [ ] Fetch wrapper
  - [ ] Auto error handling
  - [ ] Auto auth header injection
  - [ ] Token refresh logic

- [ ] `lib/hooks/useRateLimit.ts`
  - [ ] Check daily quotas
  - [ ] Display usage warnings
  - [ ] Show upgrade CTA when near limit

- [ ] `lib/hooks/useSearch.ts`
  - [ ] Manage search state
  - [ ] Handle search submission
  - [ ] Manage pagination

- [ ] Setup React Query
  - [ ] QueryClient config
  - [ ] Query cache strategy
  - [ ] Mutation error handling

- [ ] Setup React Hot Toast
  - [ ] Toast wrapper component
  - [ ] Success/error/info variants
  - [ ] Auto-dismiss config

## Phase 5: Polish & Optimization (Est. 2-3 hours)
- [ ] Mobile Responsiveness
  - [ ] Test on iPhone + Android
  - [ ] Fix layout issues
  - [ ] Touch-friendly buttons
  - [ ] Mobile navigation

- [ ] Dark Mode
  - [ ] Already built into design system
  - [ ] Test all pages

- [ ] Accessibility
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] ARIA labels on interactive elements
  - [ ] Color contrast checks
  - [ ] Screen reader testing

- [ ] Performance
  - [ ] Code splitting per route
  - [ ] Image optimization (WebP)
  - [ ] Font preload
  - [ ] Bundle size analysis

- [ ] Loading States
  - [ ] Skeleton screens on all pages
  - [ ] Progress indicators on forms
  - [ ] Disable buttons during submit

- [ ] Empty States
  - [ ] No search results
  - [ ] No saved papers
  - [ ] No collections

- [ ] Error Boundaries
  - [ ] Catch React errors
  - [ ] Show user-friendly messages
  - [ ] Provide retry buttons

## Phase 6: Deployment (Est. 1-2 hours)
- [ ] Environment Setup
  - [ ] .env.local with all keys
  - [ ] Supabase project created
  - [ ] Upstash Redis created
  - [ ] All API keys generated

- [ ] Database
  - [ ] Migrations run
  - [ ] Indexes verified
  - [ ] Backups enabled

- [ ] Frontend (Vercel)
  - [ ] GitHub repo connected
  - [ ] Environment variables added
  - [ ] Build test passed
  - [ ] Deploy to production

- [ ] CI/CD Pipeline
  - [ ] GitHub Actions workflow
  - [ ] Lint on pull requests
  - [ ] Auto-deploy on merge

- [ ] Domain & SSL
  - [ ] Domain pointed to Vercel
  - [ ] SSL certificate automatic
  - [ ] CNAME records verified

- [ ] Monitoring
  - [ ] Sentry connected
  - [ ] PostHog tracking enabled
  - [ ] Database backups automated

- [ ] Launch Checklist
  - [ ] All core features working
  - [ ] Core Web Vitals > 85
  - [ ] Zero console errors
  - [ ] Mobile responsive
  - [ ] 404/500 error pages created
  - [ ] robots.txt + sitemap.xml
  - [ ] SEO metadata

## Optional (Post-MVP)
- [ ] PDF upload and parsing
- [ ] Literature review generation (batch job)
- [ ] AI chat with paper context
- [ ] Public collections & sharing
- [ ] Email digest (new papers in field)
- [ ] Browser extension
- [ ] API access for developers
- [ ] Team/institutional accounts
- [ ] Student discount codes

## Testing Checklist
- [ ] Auth: register → login → logout → login again
- [ ] Search: valid query → results → click paper → detail page
- [ ] Summary: each of 5 types generates correctly
- [ ] Save: save paper → check library → delete → verify
- [ ] Mobile: all pages responsive on iPhone SE + Android
- [ ] Error handling: all error messages appear correctly
- [ ] Rate limit: display warning at 90%
- [ ] Token refresh: manual wait 15+ minutes and retry

## Deployment Testing
- [ ] Production database connected
- [ ] All API keys working
- [ ] Redis caching working
- [ ] Emails sending (if enabled)
- [ ] Error tracking active
- [ ] Analytics tracking

---

**Total Estimated Time: 20-25 hours**

Start with Phase 1 (Auth pages) → Test thoroughly → Move to Phase 2 (Core pages)
