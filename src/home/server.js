import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import subscriberDB from '../database/subscribers.js';
import logger from '../utils/logger.js';
import config from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.HOME_PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint to get subscriber count
app.get('/api/subscribers/count', (req, res) => {
  try {
    const stats = subscriberDB.getStats();
    res.json({ 
      success: true,
      count: stats.active || 0,
      total: stats.total || 0
    });
  } catch (error) {
    logger.error('Error fetching subscriber count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscriber count' 
    });
  }
});

// API endpoint to subscribe
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false,
      message: 'Email is required' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Please enter a valid email address' 
    });
  }

  try {
    const result = subscriberDB.addSubscriber(email);
    
    if (result.success) {
      logger.info(`New subscriber added: ${email}`);
      res.json({ 
        success: true,
        message: 'Successfully subscribed!' 
      });
    } else {
      logger.warn(`Subscription attempt for existing email: ${email}`);
      res.status(400).json({ 
        success: false,
        message: result.error || 'This email is already subscribed' 
      });
    }
  } catch (error) {
    logger.error('Error adding subscriber:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Home page server running at http://localhost:${PORT}`);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏠 Home Page Server Started                              ║
║                                                            ║
║   URL: http://localhost:${PORT}                              ║
║   Newsletter: ${config.get('email.fromName')}                    ║
║                                                            ║
║   Press Ctrl+C to stop the server                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

