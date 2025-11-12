// Netlify Function to get newsletter configuration

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
    // Get config from environment variables (set in Netlify dashboard)
    // Fallback to defaults
    const config = {
      name: process.env.NEWSLETTER_NAME || 'DeepHealth',
      description: process.env.NEWSLETTER_DESCRIPTION || 'Learn how to implement AI in your business. One strategy a day, delivered to your inbox. Save time, cut costs, and scale faster.',
      authorName: process.env.AUTHOR_NAME || 'Julio',
      authorImage: process.env.AUTHOR_IMAGE || '/profile.jpg'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        config
      })
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch config'
      })
    };
  }
};

