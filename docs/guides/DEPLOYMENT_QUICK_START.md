# Quick Start: Deploy Unsubscribe Server to Railway

**Time Required:** ~10 minutes

## Quick Steps

### 1. Push to GitHub (if not already done)

```bash
git add .
git commit -m "Add Railway deployment support"
git push origin main
```

### 2. Deploy to Railway

1. **Sign up:** Go to [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project:** Click "New Project" → "Deploy from GitHub repo"
3. **Select Repo:** Choose `sira-newsletter`
4. **Wait:** Railway will auto-deploy (2-3 minutes)

### 3. Get Your URL

1. In Railway dashboard → Click on your service
2. Go to **Settings** → **Networking**
3. Click **Generate Domain**
4. Copy the URL (looks like: `https://sira-newsletter-production.up.railway.app`)

### 4. Set Environment Variable

1. In Railway, go to **Variables** tab
2. Click **New Variable**
3. Add:
   - **Name:** `SUBSCRIPTION_BASE_URL`
   - **Value:** Your Railway URL (e.g., `https://sira-newsletter-production.up.railway.app`)
4. Click **Add**
5. Railway will auto-redeploy

### 5. Test It

Send a test email from your local machine:

```bash
npm run test-send
```

Check the email → Click the unsubscribe link → Should work!

## That's It! 🎉

Your unsubscribe links will now work for all recipients.

## Optional: Update Local Config

Edit `config.json` to point to your Railway URL:

```json
{
  "subscription": {
    "baseUrl": "https://your-railway-app.up.railway.app"
  }
}
```

## Need Help?

See the [full deployment guide](../setup/RAILWAY_DEPLOYMENT.md) for detailed instructions and troubleshooting.

