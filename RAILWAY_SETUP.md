# 🚀 Railway Setup - Quick Reference

Your newsletter system (home page + unsubscribe server) is now ready to deploy to Railway!

## What Changed

✅ **Railway configuration files created:**
- `railway.json` - Subscription server deployment config
- `railway-home.json` - Home server deployment config
- `.railwayignore` - Files to exclude from deployment

✅ **Code updated to use environment variables:**
- Unsubscribe links now use `SUBSCRIPTION_BASE_URL` env var
- Port automatically uses Railway's `PORT` env var
- Home server uses `PORT` env var (Railway compatible)
- Falls back to local config for development

✅ **Newsletter integration:**
- All send methods mark newsletters as "sent"
- Sent newsletters automatically appear on home page
- Image support for posts

✅ **Documentation created:**
- Full guide: `docs/setup/RAILWAY_DEPLOYMENT.md`
- Quick start: `docs/guides/DEPLOYMENT_QUICK_START.md`

## Deploy Now (10 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration for home and subscription servers"
git push origin main
```

### 2. Deploy to Railway - Create Two Services

**Service 1: Home Server (Newsletter Signup Page)**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. In service settings → **Settings** → **Deploy**
6. Set **Start Command**: `node src/home/server.js`
7. Wait for deployment (~2-3 minutes)
8. Go to **Settings** → **Networking** → **Generate Domain**
9. Copy Home Server URL (e.g., `https://your-newsletter.up.railway.app`)

**Service 2: Subscription Server (Unsubscribe)**
1. In same Railway project, click **"+ New"** → **"Service"**
2. Select **"GitHub Repo"** → Choose your repository
3. Set **Start Command**: `node src/subscription/server.js`
4. Wait for deployment
5. Go to **Settings** → **Networking** → **Generate Domain**
6. Copy Subscription Server URL (e.g., `https://your-unsubscribe.up.railway.app`)

### 3. Configure Environment Variables

**Subscription Server:**
1. Go to Subscription Server → **Variables** tab
2. Add variable:
   - Name: `SUBSCRIPTION_BASE_URL`
   - Value: Your Subscription Server Railway URL
3. Save (auto-redeploys)

**Home Server:**
- No environment variables needed (uses Railway's `PORT` automatically)

### 4. Test

**Test Home Server:**
1. Visit your Home Server Railway URL
2. Verify newsletter signup page loads
3. Check that sent newsletters appear as posts
4. Test subscription form

**Test Subscription Server:**
```bash
npm run test-send
```

Check email → Click unsubscribe → Should work! ✅

**Test Integration:**
1. Send a newsletter (`npm run send-to-all`)
2. Verify it appears on home page automatically
3. Check unsubscribe link works

## Environment Variables

**Subscription Server:**
| Variable | Value | Required |
|----------|-------|----------|
| `SUBSCRIPTION_BASE_URL` | Your Subscription Server Railway URL | ✅ Yes |
| `PORT` | (Auto-set by Railway) | Auto |

**Home Server:**
| Variable | Value | Required |
|----------|-------|----------|
| `PORT` | (Auto-set by Railway) | Auto |
| `NODE_ENV` | `production` | Optional |

## Local Development

Your local setup still works! The code checks for environment variables first, then falls back to `config.json`:

```javascript
// Checks in this order:
1. process.env.SUBSCRIPTION_BASE_URL
2. config.json → subscription.baseUrl
3. http://localhost:3001 (default)
```

## Files Created

- `railway.json` - Railway build/deploy config
- `.railwayignore` - Excludes logs, drafts, etc.
- `docs/setup/RAILWAY_DEPLOYMENT.md` - Full deployment guide
- `docs/guides/DEPLOYMENT_QUICK_START.md` - Quick start guide

## Need Help?

📖 **Full Guide:** See `docs/setup/RAILWAY_DEPLOYMENT.md`

🔧 **Troubleshooting:**
- Deployment fails? Check Railway logs in dashboard
- Unsubscribe doesn't work? Verify `SUBSCRIPTION_BASE_URL` is set correctly
- Database issues? Ensure `data/subscribers.db` is in your git repo

## Costs

**Free tier:** $5/month credit (more than enough for unsubscribe server)

**Actual cost:** ~$0-2/month

---

**Ready to deploy?** Follow the steps above or see the quick start guide! 🚀

