import express from 'express';
import { body, param, validationResult } from 'express-validator';
import subscriberDB from '../database/subscribers.js';
import logger from '../utils/logger.js';
import config from '../utils/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || config.get('subscription.port') || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the unsubscribe page
app.get('/unsubscribe', (req, res) => {
  const token = req.query.token;
  
  if (!token) {
    return res.status(400).send('Missing unsubscribe token');
  }

  // Verify token exists
  const subscriber = subscriberDB.getSubscriberByToken(token);
  if (!subscriber) {
    return res.status(404).send('Invalid unsubscribe token');
  }

  // Serve the unsubscribe page
  res.sendFile(path.join(__dirname, 'public', 'unsubscribe.html'));
});

// Handle unsubscribe action
app.post('/api/unsubscribe', [
  body('token').notEmpty().withMessage('Token is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { token } = req.body;
  
  try {
    const subscriber = subscriberDB.getSubscriberByToken(token);
    
    if (!subscriber) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid unsubscribe token' 
      });
    }

    if (!subscriber.subscribed) {
      return res.json({ 
        success: true, 
        message: 'You are already unsubscribed',
        alreadyUnsubscribed: true
      });
    }

    const result = subscriberDB.unsubscribe(token);
    
    if (result.success) {
      logger.info('User unsubscribed', { email: subscriber.email });
      return res.json({ 
        success: true, 
        message: 'You have been successfully unsubscribed' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to unsubscribe' 
      });
    }
  } catch (error) {
    logger.error('Unsubscribe error', { error: error.message });
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during unsubscribe' 
    });
  }
});

// Subscribe endpoint (for future subscription forms)
app.post('/api/subscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;
  
  try {
    const result = subscriberDB.addSubscriber(email);
    
    if (result.success) {
      logger.info('New subscriber added', { email });
      return res.json({ 
        success: true, 
        message: 'Successfully subscribed!' 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: result.error 
      });
    }
  } catch (error) {
    logger.error('Subscribe error', { error: error.message });
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during subscription' 
    });
  }
});

// Get subscriber stats (admin endpoint - should be protected in production)
app.get('/api/stats', (req, res) => {
  try {
    const stats = subscriberDB.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    logger.error('Stats error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get stats' 
    });
  }
});

// Migration endpoint - migrate config.json recipients to database
app.post('/api/migrate', (req, res) => {
  try {
    const configRecipients = config.get('email.recipients') || [];
    const results = subscriberDB.migrateFromConfig(configRecipients);
    
    logger.info('Migration completed', results);
    res.json({ 
      success: true, 
      message: 'Migration completed',
      results 
    });
  } catch (error) {
    logger.error('Migration error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Migration failed' 
    });
  }
});

// Start server
export function startSubscriptionServer() {
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      logger.info(`Subscription server running on http://localhost:${PORT}`);
      console.log(`\n✅ Subscription server running on http://localhost:${PORT}`);
      console.log(`   Unsubscribe page: http://localhost:${PORT}/unsubscribe?token=<TOKEN>\n`);
      resolve(server);
    });
  });
}

// For direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  startSubscriptionServer();
}

export default app;

