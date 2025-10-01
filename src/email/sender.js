import { GmailClient } from './gmail.js';
import { renderNewsletterHTML, generatePlainText } from './template-renderer.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import subscriberDB from '../database/subscribers.js';

export async function sendNewsletter(newsletterData, draft = null) {
  logger.info('Preparing to send newsletter', { subject: newsletterData.subject });

  // Get recipients
  const testMode = config.get('email.testMode');
  const useDatabase = config.get('subscription.useDatabase');
  
  let recipients;
  
  if (testMode) {
    // In test mode, use test recipient
    recipients = [config.get('email.testRecipient')];
  } else if (useDatabase) {
    // Get active subscribers from database
    recipients = subscriberDB.getActiveSubscriberEmails();
  } else {
    // Fallback to config.json
    recipients = config.get('email.recipients');
  }

  if (!recipients || recipients.length === 0) {
    throw new Error('No recipients configured');
  }

  logger.info('Sending newsletter', { 
    testMode,
    useDatabase,
    recipientCount: recipients.length 
  });

  // Initialize Gmail client
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  // Send personalized emails to each recipient
  const results = [];
  
  for (const recipientEmail of recipients) {
    // Prepare personalized newsletter data for each recipient
    const personalizedData = draft 
      ? prepareNewsletterData(draft, recipientEmail)
      : newsletterData;
    
    // Render email with personalized unsubscribe link
    const html = renderNewsletterHTML(personalizedData);
    const plainText = generatePlainText(personalizedData.content);
    
    // Send to this recipient
    const recipientResults = await gmailClient.sendToMultipleRecipients(
      [recipientEmail],
      personalizedData.subject,
      html,
      plainText
    );
    
    results.push(...recipientResults);
  }

  logger.info('Newsletter sent', { 
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  });

  return results;
}

export function prepareNewsletterData(draft, recipientEmail = null) {
  const fromEmail = config.get('email.from');
  const useDatabase = config.get('subscription.useDatabase');
  const baseUrl = process.env.SUBSCRIPTION_BASE_URL || config.get('subscription.baseUrl') || 'http://localhost:3001';
  
  let unsubscribeLink;
  
  // Generate unsubscribe link
  if (useDatabase && recipientEmail) {
    // Get subscriber token from database
    const subscriber = subscriberDB.getSubscriberByEmail(recipientEmail);
    
    if (subscriber && subscriber.token) {
      // Use web-based unsubscribe with token
      unsubscribeLink = `${baseUrl}/unsubscribe?token=${subscriber.token}`;
    } else {
      // Fallback to mailto if subscriber not found in database
      unsubscribeLink = `mailto:${fromEmail}?subject=Unsubscribe&body=Please unsubscribe ${recipientEmail} from this newsletter.`;
    }
  } else {
    // Use mailto link for non-database mode
    unsubscribeLink = recipientEmail 
      ? `mailto:${fromEmail}?subject=Unsubscribe&body=Please unsubscribe ${recipientEmail} from this newsletter.`
      : `mailto:${fromEmail}?subject=Unsubscribe&body=Please unsubscribe me from this newsletter.`;
  }
  
  return {
    subject: draft.metadata.subject,
    previewText: draft.metadata.previewText,
    content: draft.content,
    citations: draft.citations || [],
    unsubscribeLink,
    companyName: config.get('email.companyName') || 'Aira Development, LLC',
    companyAddress: config.get('email.companyAddress') || '1032 Charles Ave Charlotte, NC',
    fromEmail: fromEmail
  };
}
