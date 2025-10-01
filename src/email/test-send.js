#!/usr/bin/env node

import chalk from 'chalk';
import { sendNewsletter, prepareNewsletterData } from './sender.js';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n📧 Test Email Send\n'));

const testNewsletterDraft = {
  metadata: {
    subject: 'Test Newsletter - Please Ignore',
    previewText: 'This is a test email from the newsletter automation system'
  },
  content: `# Test Newsletter

This is a test email to verify the newsletter system is working correctly.

## Section 1: System Test

This email confirms that:
- Email rendering is working
- Gmail API integration is functional
- Templates are being applied correctly

## Section 2: Next Steps

If you're seeing this email:
1. ✅ Gmail authentication is configured correctly
2. ✅ Email sending is working
3. ✅ You're ready to generate real newsletters!

**Ready to create your first newsletter?**

Run: \`npm run generate\`

## Test the Unsubscribe Button

Click the unsubscribe link in the footer below to test the unsubscribe functionality!`,
  citations: [
    {
      number: 1,
      title: 'Example Citation',
      url: 'https://example.com'
    }
  ]
};

async function testSend() {
  try {
    console.log(chalk.yellow('Sending test email...\n'));
    
    const testRecipient = config.get('email.testRecipient') || config.get('email.from');
    console.log(chalk.dim(`Recipient: ${testRecipient}\n`));

    // Prepare newsletter data with unsubscribe link
    const newsletterData = prepareNewsletterData(testNewsletterDraft, testRecipient);
    
    // Pass the draft to enable personalized unsubscribe links
    const results = await sendNewsletter(newsletterData, testNewsletterDraft);

    if (results[0].success) {
      console.log(chalk.green('✅ Test email sent successfully!\n'));
      console.log(chalk.blue('Check your inbox:', testRecipient, '\n'));
      
      const useDatabase = config.get('subscription.useDatabase');
      if (useDatabase) {
        const baseUrl = process.env.SUBSCRIPTION_BASE_URL || config.get('subscription.baseUrl') || 'http://localhost:3001';
        console.log(chalk.dim(`\nUnsubscribe URL type: Web-based (${baseUrl})\n`));
      }
    } else {
      console.log(chalk.red('❌ Failed to send test email\n'));
      console.log(chalk.red('Error:', results[0].error, '\n'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Test send failed:'), error.message);
    
    if (error.message.includes('token.json')) {
      console.log(chalk.yellow('\nPlease run authentication first: npm run auth\n'));
    }
  }
}

testSend();
