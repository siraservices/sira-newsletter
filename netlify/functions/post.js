// Netlify Function to get a specific post by ID

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

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

function getIdFromFilename(filename) {
  return filename.replace('.json', '').replace(/[^a-zA-Z0-9-]/g, '-');
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get ID from query string or path
    const id = event.queryStringParameters?.id || event.pathParameters?.id;
    
    console.log('Requested post ID:', id);
    console.log('Query params:', event.queryStringParameters);
    console.log('Path params:', event.pathParameters);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Post ID is required'
        })
      };
    }

    const draftsDir = getDraftsDir();
    console.log('Drafts directory:', draftsDir);
    
    if (!existsSync(draftsDir)) {
      console.error('Drafts directory does not exist');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Drafts directory not found'
        })
      };
    }

    const files = readdirSync(draftsDir).filter(f => f.endsWith('.json'));
    console.log('Found files:', files.length);
    
    const postIds = [];
    for (const filename of files) {
      const postId = getIdFromFilename(filename);
      postIds.push({filename, postId});
      console.log(`Checking: ${filename} -> ${postId} (match: ${postId === id})`);
      if (postId === id) {
        const filePath = join(draftsDir, filename);
        const content = readFileSync(filePath, 'utf-8');
        const draft = JSON.parse(content);
        
        if (draft.metadata?.status !== 'sent') {
          continue;
        }

        // Render markdown to HTML
        marked.setOptions({ gfm: true, breaks: true });
        const contentHTML = marked.parse(draft.content);

        const readingSpeed = 200;
        const sentDate = draft.metadata.sentAt || draft.metadata.createdAt;
        const daysAgo = Math.floor((Date.now() - new Date(sentDate)) / (1000 * 60 * 60 * 24));
        const readTime = Math.ceil((draft.content.split(/\s+/).length) / readingSpeed) || 1;

        const post = {
          id: postId,
          filename,
          title: draft.metadata?.subject || draft.metadata?.topic || 'Untitled Newsletter',
          content: draft.content,
          contentHTML,
          metadata: draft.metadata,
          daysAgoText: formatDaysAgo(daysAgo),
          readTime,
          sentAt: sentDate,
          createdAt: draft.metadata.createdAt
        };

        if (draft.metadata?.imageUrl) {
          post.imageUrl = draft.metadata.imageUrl;
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            post
          })
        };
      }
    }

    console.error('Post not found. Available posts:', postIds);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Post not found',
        requestedId: id,
        availableIds: postIds.map(p => p.postId)
      })
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch post'
      })
    };
  }
};

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

