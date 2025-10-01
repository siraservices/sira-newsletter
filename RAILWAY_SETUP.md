# 🚀 Railway Setup - Quick Reference

Your unsubscribe server is now ready to deploy to Railway!

## What Changed

✅ **Railway configuration files created:**
- `railway.json` - Railway deployment config
- `.railwayignore` - Files to exclude from deployment

✅ **Code updated to use environment variables:**
- Unsubscribe links now use `SUBSCRIPTION_BASE_URL` env var
- Port automatically uses Railway's `PORT` env var
- Falls back to local config for development

✅ **Package.json updated:**
- Added `start` script for Railway deployment

✅ **Documentation created:**
- Full guide: `docs/setup/RAILWAY_DEPLOYMENT.md`
- Quick start: `docs/guides/DEPLOYMENT_QUICK_START.md`

## Deploy Now (5 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Wait for deployment (~2-3 minutes)

### 3. Configure
1. In Railway dashboard → **Settings** → **Networking** → **Generate Domain**
2. Copy your URL (e.g., `https://sira-newsletter-production.up.railway.app`)
3. Go to **Variables** tab
4. Add variable:
   - Name: `SUBSCRIPTION_BASE_URL`
   - Value: Your Railway URL
5. Save (auto-redeploys)

### 4. Test
```bash
npm run test-send
```

Check email → Click unsubscribe → Should work! ✅

## Environment Variables

Set these in Railway's **Variables** tab:

| Variable | Value | Required |
|----------|-------|----------|
| `SUBSCRIPTION_BASE_URL` | Your Railway app URL | ✅ Yes |
| `PORT` | (Auto-set by Railway) | Auto |

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

