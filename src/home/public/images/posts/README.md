# Post Images Directory

This directory stores images for newsletter posts displayed on the home page.

## Where to Save Images

Save your post images in this directory:
```
src/home/public/images/posts/
```

## Image Naming Options

The system will automatically find images using one of these methods (in order of priority):

### 1. Metadata in Newsletter JSON (Recommended)
Add an `imageUrl` or `previewImage` field to your newsletter's metadata in the draft JSON file:

```json
{
  "metadata": {
    "subject": "Your Newsletter Title",
    "imageUrl": "/images/posts/my-image.jpg",
    "previewImage": "/images/posts/my-image.jpg",
    ...
  }
}
```

### 2. Match by Post ID
Name your image file to match the post ID (derived from the newsletter filename):
- Newsletter file: `newsletter-ai-tools-2025-10-21.json`
- Post ID: `newsletter-ai-tools-2025-10-21`
- Image file: `newsletter-ai-tools-2025-10-21.jpg`

### 3. Match by Original Filename
Name your image file to match the newsletter filename (without .json extension):
- Newsletter file: `newsletter-ai-tools-2025-10-21.json`
- Image file: `newsletter-ai-tools-2025-10-21.jpg`

### 4. Match by Sanitized Title
Name your image file based on the newsletter title:
- Newsletter title: "AI Tools That Actually Save Time"
- Sanitized: `ai-tools-that-actually-save-time`
- Image file: `ai-tools-that-actually-save-time.jpg`

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Image Sizes

**Recommended sizes:**
- Featured post image: 300x200px (or 3:2 aspect ratio)
- Post list image: 120x120px (or 1:1 aspect ratio/square)

The system will automatically resize images using CSS, but using the correct aspect ratio will give the best results.

## Example

If you have a newsletter with:
- Filename: `newsletter-chatgpt-atlas-2025-10-21.json`
- Title: "ChatGPT Atlas: The Browser Revolution"

You can save your image as any of these:
- `newsletter-chatgpt-atlas-2025-10-21.jpg` (matches post ID)
- `newsletter-chatgpt-atlas-2025-10-21T20-35-40-738Z.jpg` (matches original filename)
- `chatgpt-atlas-the-browser-revolution.jpg` (matches sanitized title)

Or add to the newsletter JSON metadata:
```json
{
  "metadata": {
    "imageUrl": "/images/posts/chatgpt-atlas.jpg"
  }
}
```

## Fallback

If no image is found, the system will display a placeholder image with the post title.

