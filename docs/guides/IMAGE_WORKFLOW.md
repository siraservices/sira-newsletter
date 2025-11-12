# Image Workflow for Newsletter Posts

Quick guide for adding images to newsletter posts.

## Quick Start

1. **Save image** to `src/home/public/images/posts/`
2. **Name it** to match your newsletter (see naming options below)
3. **Or add** `imageUrl` to newsletter metadata
4. **Done!** Image appears automatically when newsletter is sent

## Image Location

```
src/home/public/images/posts/
```

This directory is served by the home server, so images are accessible at:
```
/images/posts/your-image.jpg
```

## Naming Your Image

The system tries to find images in this order:

### Option 1: Match Post ID (Recommended)

Post ID is derived from the newsletter filename.

**Example:**
- Newsletter file: `newsletter-ai-tools-2025-10-21.json`
- Post ID: `newsletter-ai-tools-2025-10-21`
- Image file: `newsletter-ai-tools-2025-10-21.jpg`

### Option 2: Match Original Filename

Use the exact newsletter filename (without `.json`).

**Example:**
- Newsletter file: `newsletter-ai-tools-2025-10-21T20-35-40-738Z.json`
- Image file: `newsletter-ai-tools-2025-10-21T20-35-40-738Z.jpg`

### Option 3: Match Sanitized Title

Use a sanitized version of the newsletter title.

**Example:**
- Newsletter title: "AI Tools That Save Time"
- Sanitized: `ai-tools-that-save-time`
- Image file: `ai-tools-that-save-time.jpg`

### Option 4: Add to Metadata (Most Reliable)

Edit the newsletter JSON file and add:

```json
{
  "metadata": {
    "imageUrl": "/images/posts/my-custom-name.jpg",
    ...
  }
}
```

This is the most reliable method - the system checks this first.

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Recommended Sizes

- **Featured post image**: 300x200px (3:2 aspect ratio)
- **Post list image**: 120x120px (square/1:1 aspect ratio)

Images are automatically resized by CSS, but using the correct aspect ratio gives the best results.

## Workflow Example

```bash
# 1. Generate newsletter
npm run generate

# 2. Save your image
# Save to: src/home/public/images/posts/deepmind-cancer-breakthrough.jpg

# 3. Option A: Add to metadata (recommended)
# Edit drafts/newsletter-*.json
# Add: "imageUrl": "/images/posts/deepmind-cancer-breakthrough.jpg"

# 3. Option B: Name to match
# Newsletter: newsletter-ais-leap-2025-11-12.json
# Image: newsletter-ais-leap-2025-11-12.jpg

# 4. Send newsletter
npm run send-to-all

# 5. Image appears automatically on home page!
```

## Troubleshooting

### Image Not Showing

**Check:**
1. File exists in `src/home/public/images/posts/`
2. Filename matches one of the patterns
3. Image URL in metadata is correct (starts with `/images/posts/`)
4. File is included in git/deployment

**Fix:**
- Verify file path and name
- Check image URL format in metadata
- Ensure image is committed to git (if using git deployment)

### Image Shows Placeholder

If no image is found, a placeholder is shown. To fix:
- Add image to the directory
- Name it correctly
- Or add `imageUrl` to newsletter metadata

### Image Not in Deployment

**For Railway:**
- Include images in git repository, OR
- Use Railway volumes to persist images

**For Local:**
- Images in `src/home/public/images/posts/` are automatically served

## Best Practices

1. **Use descriptive filenames** - Makes images easier to manage
2. **Add to metadata** - Most reliable method
3. **Optimize images** - Compress before uploading (use tools like TinyPNG)
4. **Consistent naming** - Use a consistent pattern (e.g., always match post ID)
5. **Test locally first** - Verify image appears before deploying

## Image Optimization

Before uploading, optimize images:

**Online Tools:**
- [TinyPNG](https://tinypng.com) - Compress PNG/JPG
- [Squoosh](https://squoosh.app) - Advanced compression

**Command Line:**
```bash
# Using ImageMagick (if installed)
convert input.jpg -quality 85 -resize 300x200 output.jpg
```

**Recommended:**
- Keep file size under 200KB
- Use JPEG for photos, PNG for graphics
- Consider WebP for modern browsers

## Production Deployment

When deploying to Railway:

**Option 1: Include in Git**
- Commit images to repository
- They'll be included in deployment automatically

**Option 2: Railway Volumes**
- Create volume at `/app/src/home/public/images/posts`
- Upload images to volume
- Images persist across deployments

**Option 3: External Storage (Advanced)**
- Use S3, Cloudinary, or similar
- Update `imageUrl` in metadata to point to external URL

