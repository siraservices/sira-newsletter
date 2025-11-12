# Newsletter Workflow - How Posts Appear on Website

This guide explains how sent newsletters automatically appear as posts on your website.

## Overview

When you send a newsletter, it automatically becomes available on your website. Here's how the process works:

1. **Send Newsletter** → Status updated to `"sent"`
2. **Commit to Git** → Push changes to GitHub
3. **Netlify Auto-Deploys** → Website updates automatically
4. **Post Appears** → Newsletter shows up on the website

## Sending Methods

All newsletter sending methods automatically update the status:

### 1. Send to All Subscribers
```bash
npm run send-to-all
```
- Updates status to `"sent"`
- Sets `sentAt` timestamp
- Saves results

### 2. Send via Preview Server
```bash
npm run preview
# Then click "Approve and Send" in browser
```
- Updates status to `"sent"`
- Sets `sentAt` timestamp
- Saves results

### 3. Send via Scheduler
```bash
npm run schedule
```
- Automatically sends approved newsletters
- Updates status to `"sent"`
- Sets `sentAt` timestamp

### 4. Send Draft
```bash
npm run send-draft
```
- Updates status to `"sent"`
- Sets `sentAt` timestamp

## Making Posts Appear on Website

After sending a newsletter:

### Step 1: Commit Changes
```bash
git add drafts/
git commit -m "Newsletter sent: [Subject]"
git push origin main
```

### Step 2: Netlify Auto-Deploys
- Netlify detects the push
- Automatically rebuilds the site
- New post appears within 1-2 minutes

### Step 3: Verify
- Visit your Netlify URL
- Check that the new post appears
- Verify it's the featured post (if it's the most recent)

## Adding Images to Posts

### Method 1: Add to Newsletter Metadata (Recommended)

When creating or editing a newsletter, add the image URL to metadata:

```json
{
  "metadata": {
    "subject": "Your Newsletter Title",
    "imageUrl": "/images/posts/your-image.jpg",
    ...
  }
}
```

### Method 2: Name Image to Match Post

Save image as: `public/images/posts/[post-id].jpg`

The system will automatically find it.

## Post Display Rules

- **Featured Post**: Most recent sent newsletter (first in list)
- **Other Posts**: All other sent newsletters, sorted by date (newest first)
- **Status Required**: Only newsletters with `"status": "sent"` appear
- **Date Sorting**: Posts sorted by `sentAt` or `createdAt` date

## Troubleshooting

### Post Not Appearing

**Check:**
1. Newsletter has `"status": "sent"` in metadata
2. Changes are committed and pushed to GitHub
3. Netlify deployment completed successfully
4. Check Netlify build logs for errors

### Image Not Showing

**Check:**
1. Image is in `public/images/posts/`
2. Image path is correct in metadata
3. Image is committed to git
4. Check browser console for 404 errors

### Old Posts Still Showing

**Solution:**
- Netlify may be caching
- Trigger a new deployment in Netlify dashboard
- Or wait a few minutes for cache to clear

## Best Practices

1. **Always commit after sending**: Make sure to commit and push after sending
2. **Add images before sending**: Include image URLs in metadata before sending
3. **Use descriptive filenames**: Makes it easier to find images later
4. **Test locally first**: Use `npm run home` to test before deploying
5. **Check Netlify logs**: If posts don't appear, check deployment logs

## Quick Reference

```bash
# Send newsletter
npm run send-to-all

# Commit changes
git add drafts/ public/images/posts/
git commit -m "Newsletter sent"
git push

# Check Netlify deployment
# Visit: https://app.netlify.com → Your site → Deploys
```

---

**That's it!** Your newsletters will automatically appear on your website after you send them and push to GitHub.

