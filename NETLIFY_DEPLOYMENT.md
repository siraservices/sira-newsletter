# Netlify Deployment - Quick Start

Deploy your newsletter signup page to Netlify in 5 minutes.

## Prerequisites

- GitHub repository with your code
- Netlify account (free at [netlify.com](https://netlify.com))

## Quick Deployment Steps

### 1. Prepare Repository

Make sure these files are committed to git:

```bash
git add public/ netlify/ netlify.toml
git commit -m "Add Netlify deployment"
git push origin main
```

**Important:** The `drafts/` folder must be in your repository (remove from `.gitignore` if needed).

### 2. Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"Deploy with GitHub"**
4. Authorize Netlify
5. Select your repository
6. Netlify auto-detects settings from `netlify.toml`
7. Click **"Deploy site"**

### 3. Set Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**, add:

- `NEWSLETTER_NAME` = `DeepHealth`
- `NEWSLETTER_DESCRIPTION` = `Learn how to implement AI...`
- `AUTHOR_NAME` = `Julio`
- `AUTHOR_IMAGE` = `/profile.jpg`

### 4. Get Your URL

Your site will be live at: `https://your-site-name.netlify.app`

## How It Works

1. **Static files** (HTML, CSS, images) are served from `public/`
2. **Netlify Functions** handle API requests (`/api/posts`, `/api/subscribe`, etc.)
3. **Drafts folder** is read from the repository
4. **Auto-deploys** when you push to GitHub

## Newsletter Workflow

After sending a newsletter:

1. Newsletter status is set to `"sent"` automatically
2. Commit changes: `git add drafts/ && git commit -m "Newsletter sent" && git push`
3. Netlify auto-deploys
4. Post appears on website

## Testing Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local dev server
npm run netlify:dev
```

Visit `http://localhost:8888` to test.

## Full Documentation

See `docs/setup/NETLIFY_DEPLOYMENT.md` for detailed instructions.

