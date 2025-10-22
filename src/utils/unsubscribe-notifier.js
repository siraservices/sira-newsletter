import subscriberDB from '../database/subscribers.js';
import logger from './logger.js';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';
import config from './config.js';

export function checkForUnsubscribes() {
  try {
    const stats = subscriberDB.getStats();
    logger.info('Unsubscribe stats checked', stats);
    
    // Check if there are any recent unsubscribes
    if (stats.unsubscribed > 0) {
      logger.warn('Unsubscribes detected', { 
        total: stats.total, 
        active: stats.active, 
        unsubscribed: stats.unsubscribed 
      });
      
      // Send notification email to admin
      sendUnsubscribeNotification(stats);
    }
    
    return stats;
  } catch (error) {
    logger.error('Error checking unsubscribe stats', { error: error.message });
    return null;
  }
}

export async function sendUnsubscribeNotification(stats) {
  try {
    const adminEmail = config.get('email.from') || 'julioaira4@gmail.com';
    
    const notificationContent = `
# Unsubscribe Alert

## Current Subscriber Statistics

- **Total Subscribers**: ${stats.total}
- **Active Subscribers**: ${stats.active}
- **Unsubscribed**: ${stats.unsubscribed}

## Recent Activity

Someone has unsubscribed from your newsletter. This is normal and expected behavior, but you should be aware of your subscriber metrics.

## Recommendations

1. **Monitor Trends**: Keep an eye on unsubscribe rates
2. **Content Quality**: Review recent newsletters for quality
3. **Engagement**: Consider subscriber feedback

## Next Steps

- Check your subscriber database for details
- Review recent newsletter content
- Consider subscriber feedback mechanisms

---
*This is an automated notification from your newsletter system.*
    `;

    const notificationDraft = {
      metadata: {
        subject: `Newsletter Unsubscribe Alert - ${stats.unsubscribed} unsubscribed`,
        previewText: `Unsubscribe alert: ${stats.unsubscribed} people have unsubscribed from your newsletter.`,
        createdAt: new Date().toISOString(),
        status: 'notification'
      },
      content: notificationContent,
      citations: []
    };

    const newsletterData = prepareNewsletterData(notificationDraft, adminEmail);
    const results = await sendNewsletter(newsletterData, notificationDraft);
    
    if (results[0].success) {
      logger.info('Unsubscribe notification sent', { 
        adminEmail, 
        stats,
        messageId: results[0].messageId 
      });
    } else {
      logger.error('Failed to send unsubscribe notification', { 
        error: results[0].error 
      });
    }
    
  } catch (error) {
    logger.error('Error sending unsubscribe notification', { error: error.message });
  }
}

export function getUnsubscribeReport() {
  try {
    const stats = subscriberDB.getStats();
    const activeSubscribers = subscriberDB.getActiveSubscribers();
    
    return {
      stats,
      activeSubscribers: activeSubscribers.length,
      report: `
📊 Newsletter Subscriber Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Current Statistics:
• Total Subscribers: ${stats.total}
• Active Subscribers: ${stats.active}
• Unsubscribed: ${stats.unsubscribed}

📊 Health Metrics:
• Subscription Rate: ${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
• Unsubscribe Rate: ${stats.total > 0 ? Math.round((stats.unsubscribed / stats.total) * 100) : 0}%

🎯 Active Subscribers: ${activeSubscribers.length}
📧 Recent Activity: Check logs for detailed information

---
*Generated: ${new Date().toISOString()}*
      `.trim()
    };
  } catch (error) {
    logger.error('Error generating unsubscribe report', { error: error.message });
    return null;
  }
}
