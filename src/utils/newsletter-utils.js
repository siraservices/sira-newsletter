import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const draftsDir = config.getDraftsDir();
const postsImagesDir = join(rootDir, 'src', 'home', 'public', 'images', 'posts');

/**
 * Strip markdown formatting from text
 */
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}

/**
 * Calculate word count from text
 */
function getWordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate read time in minutes
 */
function calculateReadTime(content, readingSpeed = 200) {
  const wordCount = getWordCount(content);
  return Math.ceil(wordCount / readingSpeed) || 1; // Minimum 1 minute
}

/**
 * Calculate days since date
 */
function getDaysAgo(dateString) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format days ago text
 */
function formatDaysAgo(days) {
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week ago' : `about ${weeks} weeks ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `about ${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `about ${years} years ago`;
}

/**
 * Extract preview text from newsletter
 */
function extractPreviewText(draft, maxLength = 200) {
  // Try previewText first
  if (draft.metadata?.previewText) {
    const preview = stripMarkdown(draft.metadata.previewText);
    if (preview.length <= maxLength) return preview;
    return preview.substring(0, maxLength).trim() + '...';
  }
  
  // Fallback to content
  if (draft.content) {
    const preview = stripMarkdown(draft.content);
    if (preview.length <= maxLength) return preview;
    return preview.substring(0, maxLength).trim() + '...';
  }
  
  return '';
}

/**
 * Get title from newsletter
 */
function getTitle(draft) {
  return draft.metadata?.subject || draft.metadata?.topic || 'Untitled Newsletter';
}

/**
 * Generate a unique ID from filename
 */
function getIdFromFilename(filename) {
  return filename.replace('.json', '').replace(/[^a-zA-Z0-9-]/g, '-');
}

/**
 * Get image path for a post
 * Checks multiple possible image locations and formats
 */
function getPostImagePath(post) {
  // First, check if metadata has an explicit imageUrl
  if (post.metadata?.imageUrl) {
    return post.metadata.imageUrl;
  }
  
  // Check if metadata has previewImage
  if (post.metadata?.previewImage) {
    return post.metadata.previewImage;
  }
  
  // Try to find image by post ID (matching filename)
  const postId = post.id;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  for (const ext of imageExtensions) {
    const imagePath = join(postsImagesDir, `${postId}${ext}`);
    if (existsSync(imagePath)) {
      return `/images/posts/${postId}${ext}`;
    }
  }
  
  // Try to find image by original filename (without extension)
  const baseFilename = post.filename.replace('.json', '');
  for (const ext of imageExtensions) {
    const imagePath = join(postsImagesDir, `${baseFilename}${ext}`);
    if (existsSync(imagePath)) {
      return `/images/posts/${baseFilename}${ext}`;
    }
  }
  
  // Try to find image by sanitized title
  const sanitizedTitle = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 50)
    .replace(/^-+|-+$/g, '');
  
  for (const ext of imageExtensions) {
    const imagePath = join(postsImagesDir, `${sanitizedTitle}${ext}`);
    if (existsSync(imagePath)) {
      return `/images/posts/${sanitizedTitle}${ext}`;
    }
  }
  
  // No image found
  return null;
}

/**
 * Get all published newsletters
 */
export function getPublishedNewsletters() {
  try {
    const files = readdirSync(draftsDir)
      .filter(f => f.endsWith('.json'))
      .map(filename => {
        try {
          const filePath = join(draftsDir, filename);
          const content = readFileSync(filePath, 'utf-8');
          const draft = JSON.parse(content);
          
          // Only include sent newsletters
          if (draft.metadata?.status !== 'sent') {
            return null;
          }
          
          const readingSpeed = config.get('newsletter.readingSpeed') || 200;
          const sentDate = draft.metadata.sentAt || draft.metadata.createdAt;
          const daysAgo = getDaysAgo(sentDate);
          const readTime = calculateReadTime(draft.content, readingSpeed);
          
          const postId = getIdFromFilename(filename);
          const postData = {
            id: postId,
            filename,
            title: getTitle(draft),
            previewText: extractPreviewText(draft),
            content: draft.content,
            metadata: draft.metadata,
            daysAgo,
            daysAgoText: formatDaysAgo(daysAgo),
            readTime,
            sentAt: sentDate,
            createdAt: draft.metadata.createdAt
          };
          
          // Add image path if available
          const imagePath = getPostImagePath(postData);
          if (imagePath) {
            postData.imageUrl = imagePath;
          }
          
          return postData;
        } catch (error) {
          console.error(`Error reading newsletter file ${filename}:`, error.message);
          return null;
        }
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => {
        // Sort by sentAt date (newest first)
        const dateA = new Date(a.sentAt || a.createdAt || 0);
        const dateB = new Date(b.sentAt || b.createdAt || 0);
        return dateB - dateA;
      });
    
    return files;
  } catch (error) {
    console.error('Error reading newsletters:', error.message);
    return [];
  }
}

/**
 * Get a specific newsletter by ID
 */
export function getNewsletterById(id) {
  const newsletters = getPublishedNewsletters();
  return newsletters.find(n => n.id === id);
}

/**
 * Get featured post (most recent)
 */
export function getFeaturedPost() {
  const newsletters = getPublishedNewsletters();
  return newsletters.length > 0 ? newsletters[0] : null;
}

/**
 * Get other posts (excluding featured)
 */
export function getOtherPosts() {
  const newsletters = getPublishedNewsletters();
  return newsletters.slice(1); // Skip the first (featured) one
}

