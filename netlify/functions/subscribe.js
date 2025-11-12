// Netlify Function to handle newsletter subscriptions
// For now, this will use a simple approach - can be enhanced with Supabase later

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Email is required'
        })
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Please enter a valid email address'
        })
      };
    }

    // TODO: Add subscriber to database
    // For now, we'll return success but need to integrate with Supabase or similar
    // Option 1: Use Supabase REST API
    // Option 2: Use a webhook to notify your local system
    // Option 3: Store in a JSON file in the repo (simple but not scalable)

    // Placeholder: Log the subscription (in production, add to database)
    console.log('New subscription:', email);

    // If SUPABASE_URL and SUPABASE_KEY are set, use Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
          },
          body: JSON.stringify({
            email: email,
            subscribed: true,
            subscribed_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Successfully subscribed!'
            })
          };
        }
      } catch (error) {
        console.error('Supabase error:', error);
        // Fall through to success response
      }
    }

    // For now, return success (subscriber will be added manually or via webhook)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully subscribed!'
      })
    };
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred. Please try again later.'
      })
    };
  }
};

