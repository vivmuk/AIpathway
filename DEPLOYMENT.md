# 🚀 Deployment Guide for AIPathway

This guide covers deploying AIPathway to various platforms.

---

## Vercel (Recommended - Easiest)

Vercel is built by the Next.js team and offers the best integration.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Set Environment Variables
In the Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `VENICE_API_KEY`: Your Venice API key
   - `VENICE_API_URL`: https://api.venice.ai/api/v1

### Step 5: Redeploy
```bash
vercel --prod
```

**Your app is now live!** 🎉

---

## Netlify

### Step 1: Build Command
```bash
npm run build
```

### Step 2: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 3: Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Step 4: Environment Variables
In Netlify dashboard:
- Site settings → Build & deploy → Environment variables
- Add `VENICE_API_KEY` and `VENICE_API_URL`

---

## Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build & Run
```bash
docker build -t aipathway .
docker run -p 3000:3000 -e VENICE_API_KEY=your_key aipathway
```

---

## Azure Static Web Apps

### Step 1: Install Azure CLI
```bash
npm install -g @azure/static-web-apps-cli
```

### Step 2: Create `staticwebapp.config.json`
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ]
}
```

### Step 3: Deploy
```bash
swa deploy --app-location ./ --output-location .next
```

---

## AWS Amplify

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize
```bash
amplify init
```

### Step 3: Add Hosting
```bash
amplify add hosting
```

### Step 4: Deploy
```bash
amplify publish
```

---

## Environment Variables for Production

### Required Variables
```env
VENICE_API_KEY=your_venice_api_key_here
VENICE_API_URL=https://api.venice.ai/api/v1
```

### Optional Variables
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Pre-Deployment Checklist

- [ ] Test build locally: `npm run build && npm start`
- [ ] Verify environment variables are set
- [ ] Test all quiz flows
- [ ] Test course generation
- [ ] Test chapter navigation
- [ ] Test export functionality
- [ ] Check mobile responsiveness
- [ ] Review console for errors
- [ ] Test on different browsers

---

## Performance Optimization

### Next.js Build Configuration
```js
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-image-domain.com'],
  },
  // Enable compression
  compress: true,
  // Production source maps
  productionBrowserSourceMaps: false,
}
```

### Recommended Settings
- Enable caching for static assets
- Use CDN for faster global delivery
- Enable gzip/brotli compression
- Implement rate limiting for API routes

---

## Monitoring & Analytics

### Add Google Analytics
```tsx
// Add to src/app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Mixpanel for user analytics

---

## Custom Domain

### Vercel
1. Go to project settings
2. Domains → Add domain
3. Follow DNS configuration instructions

### Netlify
1. Domain settings → Add custom domain
2. Update DNS records with your provider

---

## SSL/HTTPS

All recommended platforms (Vercel, Netlify, AWS Amplify) provide automatic SSL certificates via Let's Encrypt. No configuration needed!

---

## Scaling Considerations

### For High Traffic
- Use edge functions for API routes
- Implement Redis for caching course data
- Add rate limiting to prevent abuse
- Consider serverless database (PlanetScale, Supabase)
- Use CDN for static assets

### API Optimization
- Cache course generations for common profiles
- Implement request queuing for Venice API
- Add retry logic for failed API calls
- Monitor API usage and costs

---

## Backup & Recovery

### User Data
- Export courses to database instead of localStorage
- Implement user authentication
- Regular database backups

### Code
- Use Git tags for releases
- Maintain staging environment
- Document deployment process

---

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review build logs
3. Verify environment variables
4. Test API connectivity
5. Check browser console for errors

---

**Good luck with your deployment!** 🚀

