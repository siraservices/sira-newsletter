import { GmailClient } from './gmail.js';
import { renderNewsletterHTML, generatePlainText } from './template-renderer.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

export async function sendNewsletter(newsletterData) {
  logger.info('Preparing to send newsletter', { subject: newsletterData.subject });

  // Render email
  const html = renderNewsletterHTML(newsletterData);
  const plainText = generatePlainText(newsletterData.content);

  // Get recipients
  const testMode = config.get('email.testMode');
  const recipients = testMode 
    ? [config.get('email.testRecipient')]
    : config.get('email.recipients');

  if (!recipients || recipients.length === 0) {
    throw new Error('No recipients configured');
  }

  logger.info('Sending newsletter', { 
    testMode, 
    recipientCount: recipients.length 
  });

  // Initialize Gmail client
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  // Send email
  const results = await gmailClient.sendToMultipleRecipients(
    recipients,
    newsletterData.subject,
    html,
    plainText
  );

  logger.info('Newsletter sent', { 
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  });

  return results;
}

export function prepareNewsletterData(draft, recipientEmail = null) {
  // Generate Gmail unsubscribe link
  const fromEmail = config.get('email.from');
  const unsubscribeLink = recipientEmail 
    ? `mailto:${fromEmail}?subject=Unsubscribe&body=Please unsubscribe ${recipientEmail} from this newsletter.`
    : `mailto:${fromEmail}?subject=Unsubscribe&body=Please unsubscribe me from this newsletter.`;
  
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
