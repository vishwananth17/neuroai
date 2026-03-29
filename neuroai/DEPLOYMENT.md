# 🚀 NeuroAI Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- Git repository set up
- API keys for external services

## 🔑 Environment Variables

Create a `.env.local` file with your API keys:

```env
# AI Services
TOGETHER_AI_API_KEY=your_together_ai_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here

# Research APIs
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key_here

# Optional: OpenAI (fallback)
OPENAI_API_KEY=your_openai_key_here
```

## 🎯 Deployment Options

### 1. **Vercel (Recommended) - Easiest**

Vercel is the best choice for Next.js applications:

#### Steps:
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set environment variables
   - Deploy!

#### Environment Variables in Vercel:
- Go to your project dashboard
- Settings → Environment Variables
- Add all your API keys

### 2. **Netlify**

#### Steps:
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `out` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### 3. **Railway**

#### Steps:
1. **Connect your GitHub repo to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically**

### 4. **DigitalOcean App Platform**

#### Steps:
1. **Connect your GitHub repo**
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Set environment variables**
4. **Deploy**

### 5. **AWS Amplify**

#### Steps:
1. **Connect your GitHub repo**
2. **Configure build settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
3. **Set environment variables**
4. **Deploy**

## 🛠️ Local Build Test

Before deploying, test the build locally:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the production build
npm start
```

## 📦 Build Configuration

Your `next.config.js` should look like this:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Errors:**
   - Check all imports are correct
   - Ensure all dependencies are installed
   - Verify environment variables

2. **API Errors:**
   - Verify API keys are set correctly
   - Check API rate limits
   - Ensure CORS is configured

3. **Environment Variables:**
   - Make sure they're set in your deployment platform
   - Check for typos in variable names
   - Restart deployment after adding variables

## 🌐 Custom Domain

### Vercel:
1. Go to project settings
2. Domains → Add domain
3. Configure DNS records

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Configure DNS

## 📊 Monitoring

### Vercel Analytics:
- Built-in analytics
- Performance monitoring
- Error tracking

### Other Options:
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

## 🔒 Security

### Environment Variables:
- Never commit API keys to Git
- Use deployment platform's secure environment variables
- Rotate keys regularly

### API Security:
- Implement rate limiting
- Add authentication if needed
- Monitor API usage

## 🚀 Post-Deployment

### Checklist:
- [ ] All environment variables set
- [ ] Build successful
- [ ] All features working
- [ ] Custom domain configured (if needed)
- [ ] Analytics set up
- [ ] Error monitoring configured

### Testing:
- Test search functionality
- Test AI features
- Test Semantic Scholar integration
- Check mobile responsiveness

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify all environment variables
3. Test locally first
4. Check Next.js documentation

---

**Done by Vishwananth B** ✨ 