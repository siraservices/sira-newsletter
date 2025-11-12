# Newsletter Post Workflow

This guide explains how sent newsletters automatically appear as posts on the home page.

## Overview

When you send a newsletter, it automatically appears on the home page at `/posts` section. The system reads newsletters with `status: "sent"` from the `drafts/` folder and displays them as posts.

## How Posts Appear

### Automatic Process

1. **Send Newsletter** - Use any of these methods:
   - `npm run send-to-all` - Send to all subscribers
   - `npm run send-draft` - Send test newsletter
   - Automated scheduler - Sends approved newsletters

2. **Status Update** - Newsletter status is automatically set to:
   ```json
   {
     "metadata": {
       "status": "sent",
       "sentAt": "2025-11-12T19:15:36.466Z"
     }
   }
   ```

3. **Post Display** - The home page automatically:
   - Reads all newsletters with `status: "sent"`
   - Sorts them by `sentAt` date (newest first)
   - Displays the most recent as "Featured Post"
   - Shows others in the post list

## Adding Images to Posts

### Method 1: Add to Newsletter Metadata (Recommended)

Edit the newsletter JSON file in `drafts/` and add:

```json
{
  "metadata": {
    "imageUrl": "/images/posts/my-image.jpg",
    ...
  }
}
```

### Method 2: Match by Filename

Save your image in `src/home/public/images/posts/` with one of these names:

1. **Match Post ID**: `newsletter-ai-tools-2025-10-21.jpg`
2. **Match Original Filename**: `newsletter-ai-tools-2025-10-21T20-35-40-738Z.jpg`
3. **Match Sanitized Title**: `ai-tools-that-save-time.jpg`

The system will automatically find and use the image.

### Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

### Recommended Image Sizes

- **Featured post**: 300x200px (3:2 aspect ratio)
- **Post list**: 120x120px (square/1:1 aspect ratio)

## Workflow Steps

### Step 1: Create Newsletter

```bash
npm run generate
```

This creates a draft in `drafts/` folder.

### Step 2: Review and Edit (Optional)

- Preview: `npm run preview`
- Edit the draft JSON file if needed
- Add image URL to metadata if you have an image

### Step 3: Add Image (Optional)

1. Save image to `src/home/public/images/posts/`
2. Name it to match the newsletter (see naming options above)
3. Or add `imageUrl` to newsletter metadata

### Step 4: Send Newsletter

```bash
npm run send-to-all
```

The newsletter is automatically:
- Sent to subscribers
- Marked as `status: "sent"`
- Given a `sentAt` timestamp
- Made available on the home page

### Step 5: Verify on Home Page

1. Visit your home page (local: `http://localhost:3002` or production URL)
2. Check the "Posts" section
3. Your newsletter should appear as a post

## Troubleshooting

### Post Not Appearing

**Check:**
1. Newsletter status is `"sent"` (not `"pending"` or `"approved"`)
2. `sentAt` timestamp exists
3. Newsletter file is in `drafts/` folder
4. Home server is running

**Fix:**
- Manually edit the JSON file to set `status: "sent"`
- Add `sentAt` timestamp if missing

### Image Not Showing

**Check:**
1. Image file exists in `src/home/public/images/posts/`
2. Filename matches one of the patterns
3. Image URL in metadata is correct (starts with `/images/posts/`)

**Fix:**
- Verify file path and name
- Check image URL format in metadata
- Ensure image file is included in deployment

### Multiple Posts with Same Date

Posts are sorted by `sentAt` timestamp. If multiple posts have the same timestamp, they'll be ordered by filename.

## Best Practices

1. **Always set imageUrl in metadata** - Most reliable method
2. **Use descriptive filenames** - Makes images easier to manage
3. **Optimize images** - Compress before uploading for faster page loads
4. **Test locally first** - Verify posts appear before deploying
5. **Keep drafts organized** - Archive old drafts if needed

## Example Workflow

```bash
# 1. Generate newsletter
npm run generate

# 2. Preview and edit
npm run preview
# Edit draft JSON, add imageUrl if needed

# 3. Add image (if using filename matching)
# Save image to: src/home/public/images/posts/newsletter-ai-tools-2025-10-21.jpg

# 4. Send newsletter
npm run send-to-all

# 5. Check home page
# Visit http://localhost:3002
# Newsletter appears as post automatically!
```

## Integration with Newsletter Process

The post system is fully integrated:

- ✅ **Automatic** - No manual steps needed
- ✅ **Real-time** - Posts appear immediately after sending
- ✅ **Persistent** - Posts remain even after server restart
- ✅ **Scalable** - Handles unlimited posts

No additional configuration needed - it just works!

