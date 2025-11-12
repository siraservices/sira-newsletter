# Netlify Deployment Guide

This guide walks you through deploying your newsletter signup page to Netlify's free tier.

## Overview

Your newsletter signup page with posts will be deployed to Netlify, which provides:
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Serverless functions for API endpoints
- ✅ HTTPS by default
- ✅ CDN for fast global delivery
- ✅ Environment variable management

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Netlify Account** - Sign up at [netlify.com](https://netlify.com) (free)
3. **Drafts Folder** - Your `drafts/` folder should be committed to git (for Netlify Functions to read)

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, ensure your repository is ready:

```bash
# Make sure drafts folder is tracked (remove from .gitignore if needed)
git add drafts/
git add public/
git add netlify/
git add netlify.toml
git commit -m "Add Netlify deployment configuration"
git push origin main
```

**Important:** The `drafts/` folder must be in your repository so Netlify Functions can read sent newsletters.

### 2. Create Netlify Site

1. Go to [app.netlify.com](https://app.netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your `sira-newsletter` repository
6. Netlify will auto-detect the settings from `netlify.toml`

### 3. Configure Build Settings

Netlify should auto-detect from `netlify.toml`, but verify:

- **Build command:** (leave empty - no build needed)
- **Publish directory:** `public`
- **Functions directory:** `netlify/functions`

### 4. Set Environment Variables

In your Netlify site dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEWSLETTER_NAME` | `DeepHealth` | Newsletter title |
| `NEWSLETTER_DESCRIPTION` | `Learn how to implement AI...` | Newsletter description |
| `AUTHOR_NAME` | `Julio` | Author name |
| `AUTHOR_IMAGE` | `/profile.jpg` | Profile image path |

**Optional - For Database Integration:**
If you want to use Supabase for subscriber management:

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Supabase project URL |
| `SUPABASE_KEY` | `your-anon-key` | Supabase anon/public key |

### 5. Deploy

Netlify will automatically deploy when you push to GitHub. You can also:

1. Click **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

### 6. Get Your URL

1. Go to **Site settings** → **General**
2. Your site URL will be: `https://your-site-name.netlify.app`
3. You can customize it in **Site settings** → **Domain management**

### 7. Update Configuration

Update your local `config.json` (if needed for other services):

```json
{
  "newsletter": {
    "homePageUrl": "https://your-site-name.netlify.app"
  }
}
```

## How It Works

### Architecture

1. **Static Files:** HTML, CSS, JS, images served from `public/` directory
2. **Netlify Functions:** Serverless functions in `netlify/functions/` handle API requests
3. **Drafts Folder:** Read directly from repository (must be committed to git)
4. **Database:** Optional - can use Supabase or other free database service

### API Endpoints

- `GET /api/posts` - Get all published newsletters
- `GET /api/posts/:id` - Get specific newsletter
- `GET /api/config` - Get newsletter configuration
- `POST /api/subscribe` - Subscribe to newsletter

### Automatic Updates

When you send a newsletter:

1. Newsletter status is updated to `"sent"` in the JSON file
2. Commit and push to GitHub
3. Netlify automatically redeploys
4. New post appears on the website

## Newsletter Workflow

### Sending a Newsletter

1. Generate newsletter: `npm run generate`
2. Review and edit if needed
3. Send newsletter: `npm run send-to-all` (or other send method)
4. Newsletter status is automatically set to `"sent"`
5. Commit changes: `git add drafts/ && git commit -m "Newsletter sent" && git push`
6. Netlify auto-deploys
7. Post appears on website

### Adding Images

1. Save image to `public/images/posts/your-image.jpg`
2. Add to newsletter metadata:
   ```json
   {
     "metadata": {
       "imageUrl": "/images/posts/your-image.jpg"
     }
   }
   ```
3. Commit and push
4. Image appears on website

## Testing

### Local Testing

Test Netlify Functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local dev server
netlify dev
```

Visit `http://localhost:8888` to test locally.

### Production Testing

1. Visit your Netlify URL
2. Verify posts display correctly
3. Test subscription form
4. Verify images load
5. Test post modal (click "Read now")
6. Test "View more posts" pagination
7. Test social sharing links

## Troubleshooting

### Posts Not Showing

**Problem:** No posts appear on the website

**Solutions:**
1. Check that newsletters have `"status": "sent"` in metadata
2. Verify `drafts/` folder is committed to git
3. Check Netlify build logs for errors
4. Verify Netlify Functions are deployed (check Functions tab)

### Images Not Loading

**Problem:** Post images don't display

**Solutions:**
1. Verify images are in `public/images/posts/`
2. Check image paths in newsletter metadata
3. Ensure images are committed to git
4. Check browser console for 404 errors

### Subscription Form Not Working

**Problem:** Subscribe button doesn't work

**Solutions:**
1. Check Netlify Functions logs
2. Verify environment variables are set
3. If using Supabase, verify credentials
4. Check browser console for errors

### Functions Not Deploying

**Problem:** API endpoints return 404

**Solutions:**
1. Verify `netlify/functions/` directory exists
2. Check function files export `handler` function
3. Verify `netlify.toml` has correct function directory
4. Check Netlify build logs

## Database Integration (Optional)

### Using Supabase

1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Create `subscribers` table:
   ```sql
   CREATE TABLE subscribers (
     id SERIAL PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     token TEXT UNIQUE NOT NULL,
     subscribed BOOLEAN DEFAULT true,
     subscribed_at TIMESTAMP DEFAULT NOW(),
     unsubscribed_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. Get project URL and anon key
5. Add to Netlify environment variables
6. Update `netlify/functions/subscribe.js` if needed

## Costs

**Netlify Free Tier:**
- 100GB bandwidth/month
- 125,000 function invocations/month
- 300 build minutes/month
- ✅ Free for this use case

**Supabase Free Tier (if used):**
- 500MB database storage
- 2GB bandwidth
- Unlimited projects
- ✅ Free for this use case

## Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure database for subscriptions (optional)
- [ ] Set up analytics (optional)
- [ ] Configure CDN caching
- [ ] Set up monitoring/alerts

## Support

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Netlify Community:** [community.netlify.com](https://community.netlify.com)
- **Netlify Status:** [status.netlify.com](https://status.netlify.com)

---

**Deployment Complete! 🚀**

Your newsletter signup page is now live and will automatically update when you send newsletters!

