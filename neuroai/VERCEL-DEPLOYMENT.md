# NeuroAI Vercel Deployment Guide

## Quick Start (5 minutes)

### Prerequisites
- GitHub account with the NeuroAI repository pushed
- Vercel account (create at vercel.com)

### Step 1: Connect to GitHub
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for your NeuroAI repository
5. Click "Import"

### Step 2: Configure Environment Variables
On the Vercel import screen, add these environment variables:

```
# Database (Production)
DATABASE_URL=postgresql://user:password@db.example.com/neuroai

# AI Providers
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxx
GROQ_API_KEY=xxx
OPENROUTER_API_KEY=xxx

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-super-secret-nextauth-key

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Where to get these values:**
- **DATABASE_URL**: From Supabase (PostgreSQL) or Railway
- **DEEPSEEK_API_KEY**: From DeepSeek API dashboard
- **JWT_SECRET**: Generate with: `openssl rand -base64 32`
- **NEXTAUTH_SECRET**: Generate with: `openssl rand -base64 32`

### Step 3: Deploy
1. Click "Deploy"
2. Wait 3-5 minutes for build to complete
3. Your site is live at `https://your-project.vercel.app`

---

## Detailed Configuration

### 1. Database Setup (Choose One)

#### Option A: Supabase (Recommended)
```bash
# 1. Create project at supabase.com
# 2. Get CONNECTION_STRING from Settings → Database → URI
# 3. Add to Vercel as DATABASE_URL
```

#### Option B: Railway
```bash
# 1. Create PostgreSQL database at railway.app
# 2. Copy DATABASE_URL
# 3. Add to Vercel
```

### 2. Prepare Database in Production
After deployment, run migrations:

```bash
# In Vercel environment, run:
npm run db:push
```

Or use Vercel CLI:
```bash
vercel env pull
npm run db:push
vercel env push
```

### 3. AI Provider Keys Configuration

#### DeepSeek API
- Sign up at [platform.deepseek.com](https://platform.deepseek.com)
- Create API key
- Add to Vercel as `DEEPSEEK_API_KEY`

#### Groq Cloud (Fallback)
- Sign up at [console.groq.com](https://console.groq.com)
- Create API key
- Add to Vercel as `GROQ_API_KEY`

#### OpenRouter (Fallback)
- Sign up at [openrouter.ai](https://openrouter.ai)
- Create API key
- Add to Vercel as `OPENROUTER_API_KEY`

### 4. Email Configuration (Optional)
For production email notifications:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@neuroai.app
```

---

## Environment Variables Reference

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host/db` | Supabase/Railway |
| `DEEPSEEK_API_KEY` | ✅ | `sk-xxx` | platform.deepseek.com |
| `GROQ_API_KEY` | ✅ | `gsk-xxx` | console.groq.com |
| `OPENROUTER_API_KEY` | ✅ | `sk-or-xxx` | openrouter.ai |
| `JWT_SECRET` | ✅ | `openssl rand -base64 32` | Generate new |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` | Generate new |
| `NEXT_PUBLIC_API_URL` | ⚠️ | `https://neuroai.vercel.app` | Your domain |
| `NODE_ENV` | ✅ | `production` | Set to production |

---

## Post-Deployment Checklist

- [ ] Database migrations completed (`npm run db:push`)
- [ ] Environment variables all set in Vercel
- [ ] Visited site homepage - should load
- [ ] Create test account at `/register`
- [ ] Test search functionality at `/search`
- [ ] Verify paper details page loads
- [ ] Check error logs for any issues

---

## Troubleshooting

### Build Fails: "DATABASE_URL not found"
**Solution:** Add `DATABASE_URL` to Vercel environment variables

### Build Fails: "Module not found"
```bash
# Locally:
npm install
npm run build

# Verify it works before pushing to git
```

### Pages 404 in Production
- Check that routes exist: `/login`, `/register`, `/search`, `/paper/[id]`
- Verify `next.config.ts` - no rewrites conflicting

### Database Connection Timeout
- Verify `DATABASE_URL` is correct and accessible
- Check database provider allows Vercel IPs
- Increase timeout: Add `?connect_timeout=10` to connection string

### Slow API Responses
1. Check API rate limits in AI provider dashboards
2. Verify network latency to database
3. Enable Vercel Analytics to profile

---

## Enabling Vercel Analytics (Optional)

Add to `next.config.ts`:
```typescript
export default {
  // ... other config
  experimental: {
    webpackBuildWorker: true,
  },
};
```

Then enable in Vercel Dashboard → Settings → Analytics

---

## Custom Domain Setup

1. Go to Vercel Project Settings → Domains
2. Add your custom domain (e.g., `neuroai.app`)
3. Update DNS records at domain provider
4. Vercel will auto-generate SSL certificate

---

## Monitoring & Logs

### View Deployment Logs
```bash
vercel logs
# or in dashboard: Deployments → select → Logs
```

### Monitor Performance
- Vercel Dashboard → Analytics
- Check Lighthouse scores
- Monitor API response times

---

## Rollback to Previous Version
```bash
vercel rollback
# Select previous deployment to restore
```

---

## Cost Estimation (April 2026)

| Service | Free Tier | Pro Tier |
|---------|-----------|---------|
| Vercel Hosting | 100GB bandwidth | Overage $0.15/GB |
| Supabase Database | 500MB | $4/month base |
| DeepSeek API | Pay-per-call | ~$0.001-0.002 per request |
| **Total** | Free-$5/month | $50-200/month |

---

## Next Steps After Deployment

1. **Set up monitoring**: Sentry, LogRocket, or Vercel Analytics
2. **Configure backups**: Supabase auto-backups included
3. **Enable CORS**: If calling from other domains
4. **Set up CI/CD**: Vercel auto-deploys on push to main
5. **Scale infrastructure**: Add caching, CDN, etc.

---

## Questions?

Check the main README.md or contact DevOps team.
