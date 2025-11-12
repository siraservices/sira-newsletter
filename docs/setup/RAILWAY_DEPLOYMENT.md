# Railway Deployment Guide

This guide walks you through deploying your newsletter unsubscribe server to Railway.app.

## Overview

Your unsubscribe functionality requires a live server that subscribers can access from anywhere. Railway.app provides:
- ✅ Free tier with $5/month credit
- ✅ Automatic deployments from GitHub
- ✅ Persistent storage for SQLite database
- ✅ HTTPS by default
- ✅ Environment variable management

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **Subscriber Database** - Your `data/subscribers.db` file with subscriber data

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, commit your changes to git:

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `sira-newsletter` repository
5. Railway will automatically detect it's a Node.js project

### 3. Configure Environment Variables

In your Railway project dashboard:

1. Click on your service
2. Go to the **"Variables"** tab
3. Add the following environment variable:

```
SUBSCRIPTION_BASE_URL=https://your-app-name.up.railway.app
```

**Note:** Replace `your-app-name` with your actual Railway app URL (you can find this in the "Settings" tab under "Domains")

### 4. Set Up Custom Domain (Optional)

Railway provides a free subdomain, but you can add a custom domain:

1. Go to **Settings** → **Domains**
2. Click **"Generate Domain"** for a Railway subdomain
3. Or click **"Custom Domain"** to add your own domain

### 5. Upload Database

Your subscriber database needs to be on Railway. There are two options:

#### Option A: Include in Git (Simple)
Add the database to git temporarily:

```bash
# Create a .gitignore exception for data folder
echo "!data/subscribers.db" >> .gitignore
git add data/subscribers.db
git commit -m "Add subscriber database for Railway deployment"
git push
```

#### Option B: Manual Upload (Recommended for production)
Use Railway's volume feature for persistent storage:

1. In Railway, go to **"Settings"** → **"Volumes"**
2. Create a new volume mounted at `/app/data`
3. Use Railway CLI to upload:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Upload database
railway run --volume data:/app/data cp data/subscribers.db /app/data/
```

### 6. Deploy

Railway automatically deploys when you push to GitHub. You can also:

1. Manually trigger deployment from the Railway dashboard
2. Click **"Deploy"** → **"Redeploy"**

### 7. Verify Deployment

1. Check deployment logs in Railway dashboard
2. Visit your unsubscribe URL:
   ```
   https://your-app-name.up.railway.app/unsubscribe?token=TEST
   ```
3. You should see the unsubscribe page (it will show "Invalid token" which is expected)

## Update Local Configuration

Update your local `config.json` to use the Railway URL for production:

```json
{
  "subscription": {
    "port": 3001,
    "baseUrl": "https://your-app-name.up.railway.app",
    "useDatabase": true
  }
}
```

**Important:** Keep `baseUrl` pointing to your Railway URL. The environment variable `SUBSCRIPTION_BASE_URL` will override this in production, but this ensures your local testing still works.

## Testing

### Test the Unsubscribe Flow

1. Send a test email from your local machine:
   ```bash
   npm run test-send
   ```

2. Check the email - the unsubscribe link should now point to your Railway URL

3. Click the unsubscribe link - it should load successfully

4. Click "Unsubscribe" button - the user should be unsubscribed in your Railway database

### Test Database Sync

Your local database and Railway database are separate. To sync:

**Option 1: Export/Import Subscribers**
```bash
# Export from local
npm run manage-subscribers
# Choose "Export subscribers to CSV"

# Import to Railway via Railway CLI
railway run node src/subscription/import-csv.js
```

**Option 2: Use Same Database**
Configure Railway to be your primary database and connect locally via Railway CLI.

## Monitoring

### View Logs

1. In Railway dashboard, click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. View real-time logs

### Check Database

You can query your Railway database using Railway CLI:

```bash
railway run node src/subscription/manage.js
```

## Costs

Railway's free tier includes:
- $5 credit per month
- Should be more than enough for an unsubscribe server
- Only charges when app is running
- Sleeps after 30 minutes of inactivity (which is fine for an unsubscribe server)

**Estimated cost:** $0-2/month depending on traffic

## Troubleshooting

### Deployment Fails

**Error: Cannot find module**
- Check that all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

**Error: Database not found**
- Ensure `data/subscribers.db` is uploaded
- Check volume is mounted correctly

### Unsubscribe Link Doesn't Work

1. **Check environment variable:**
   - Verify `SUBSCRIPTION_BASE_URL` is set correctly in Railway
   - Should be your Railway app URL (with https://)

2. **Check deployment:**
   - Ensure app is deployed and running
   - Check logs for errors

3. **Test endpoint:**
   ```bash
   curl https://your-app-name.up.railway.app/unsubscribe?token=test
   ```

### Database Changes Not Syncing

The Railway database and local database are separate:
- Changes on Railway don't affect local database
- Changes locally don't affect Railway database
- Use CSV export/import to sync when needed

## Security Considerations

1. **Database Backup:** Railway databases are not automatically backed up
   - Export subscriber list regularly via CSV
   - Store backups securely

2. **Environment Variables:** Never commit `SUBSCRIPTION_BASE_URL` to git
   - Keep it in Railway's environment variables only

3. **Rate Limiting:** Consider adding rate limiting for production:
   ```bash
   npm install express-rate-limit
   ```
   Then update `src/subscription/server.js` to use it

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure database backups
- [ ] Add rate limiting for security
- [ ] Set up monitoring/alerting
- [ ] Document subscriber sync process for your team

## Support

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **Railway Status:** [status.railway.app](https://status.railway.app)

---

**Deployment Complete! 🚀**

Your unsubscribe server is now live and accessible to all newsletter recipients.

