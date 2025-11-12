// Netlify Function to get all published posts
// Reads from GitHub repository or local file system

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// For Netlify, we'll read from the repository
// The drafts folder should be in the repo root
const getDraftsDir = () => {
  // In Netlify Functions, the working directory is the function directory
  // We need to go up to the repo root
  const functionDir = process.cwd();
  // Netlify functions run from netlify/functions, so go up two levels
  const rootDir = join(functionDir, '..', '..');
  const draftsDir = join(rootDir, 'drafts');
  
  // Try multiple possible locations
  if (existsSync(draftsDir)) return draftsDir;
  
  // Fallback: try from current directory
  const altDraftsDir = join(process.cwd(), 'drafts');
  if (existsSync(altDraftsDir)) return altDraftsDir;
  
  // Last resort: try from function directory
  return join(functionDir, '..', '..', 'drafts');
};

// Helper functions (simplified versions from newsletter-utils.js)
function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}

function getWordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadTime(content, readingSpeed = 200) {
  const wordCount = getWordCount(content);
  return Math.ceil(wordCount / readingSpeed) || 1;
}

function getDaysAgo(dateString) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

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

function extractPreviewText(draft, maxLength = 200) {
  if (draft.metadata?.previewText) {
    const preview = stripMarkdown(draft.metadata.previewText);
    if (preview.length <= maxLength) return preview;
    return preview.substring(0, maxLength).trim() + '...';
  }
  if (draft.content) {
    const preview = stripMarkdown(draft.content);
    if (preview.length <= maxLength) return preview;
    return preview.substring(0, maxLength).trim() + '...';
  }
  return '';
}

function getTitle(draft) {
  return draft.metadata?.subject || draft.metadata?.topic || 'Untitled Newsletter';
}

function getIdFromFilename(filename) {
  return filename.replace('.json', '').replace(/[^a-zA-Z0-9-]/g, '-');
}

function getPostImagePath(post) {
  if (post.metadata?.imageUrl) return post.metadata.imageUrl;
  if (post.metadata?.previewImage) return post.metadata.previewImage;
  return null;
}

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const draftsDir = getDraftsDir();
    
    if (!existsSync(draftsDir)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          posts: [],
          featured: null,
          others: []
        })
      };
    }

    const files = readdirSync(draftsDir)
      .filter(f => f.endsWith('.json'))
      .map(filename => {
        try {
          const filePath = join(draftsDir, filename);
          const content = readFileSync(filePath, 'utf-8');
          const draft = JSON.parse(content);
          
          if (draft.metadata?.status !== 'sent') {
            return null;
          }
          
          const readingSpeed = 200;
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
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = new Date(a.sentAt || a.createdAt || 0);
        const dateB = new Date(b.sentAt || b.createdAt || 0);
        return dateB - dateA;
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        posts: files,
        featured: files.length > 0 ? files[0] : null,
        others: files.slice(1)
      })
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch posts'
      })
    };
  }
};

