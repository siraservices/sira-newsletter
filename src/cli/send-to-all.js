#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';
import config from '../utils/config.js';
import subscriberDB from '../database/subscribers.js';
import { validateWordCount } from '../utils/word-count-validator.js';
import { GmailClient } from '../email/gmail.js';
import { renderNewsletterHTML, generatePlainText } from '../email/template-renderer.js';
import logger from '../utils/logger.js';

console.log(chalk.bold.blue('\n📧 Send Newsletter to All Subscribers\n'));

async function sendToAll() {
  try {
    // Find the most recent draft
    const draftsDir = config.getDraftsDir();
    const fs = await import('fs');
    const path = await import('path');
    
    const files = fs.readdirSync(draftsDir)
      .filter(file => file.startsWith('newsletter-') && file.endsWith('.json'))
      .map(file => {
        const filePath = join(draftsDir, file);
        const stats = fs.statSync(filePath);
        return { file, mtime: stats.mtime };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .map(item => item.file);
    
    if (files.length === 0) {
      console.log(chalk.red('❌ No newsletter drafts found'));
      return;
    }
    
    const latestDraft = files[0];
    const draftPath = join(draftsDir, latestDraft);
    
    console.log(chalk.yellow(`Loading draft: ${latestDraft}\n`));
    
    const draft = JSON.parse(readFileSync(draftPath, 'utf8'));
    
    // Validate word count
    const minWords = config.get('newsletter.minWordCount') || 400;
    const maxWords = config.get('newsletter.maxWordCount') || 450;
    const validation = validateWordCount(draft.content, minWords, maxWords);
    
    console.log(chalk.bold('Newsletter Details:'));
    console.log(chalk.cyan(`Subject: ${draft.metadata.subject}`));
    console.log(chalk.cyan(`Word count: ${validation.wordCount}`));
    console.log(chalk.cyan(`Target range: ${minWords}-${maxWords} words`));
    console.log(chalk.cyan(`Created: ${draft.metadata.createdAt}\n`));
    
    // Word count validation
    if (validation.overLimit) {
      console.log(chalk.red(`\n⚠️  WARNING: Newsletter exceeds word limit by ${validation.wordCount - validation.maxWords} words!\n`));
      console.log(chalk.yellow('Please edit the draft to reduce word count before sending.\n'));
      return;
    } else if (validation.underLimit) {
      console.log(chalk.yellow(`\n⚠️  WARNING: Newsletter is ${validation.minWords - validation.wordCount} words under the minimum limit.\n`));
    } else {
      console.log(chalk.green(`✅ Word count is within acceptable range (${validation.wordCount} words)\n`));
    }
    
    // Get all active subscribers
    const recipients = subscriberDB.getActiveSubscriberEmails();
    const stats = subscriberDB.getStats();
    
    if (recipients.length === 0) {
      console.log(chalk.red('❌ No active subscribers found in database'));
      return;
    }
    
    console.log(chalk.bold('Subscriber Information:'));
    console.log(chalk.cyan(`Total subscribers: ${stats.total}`));
    console.log(chalk.cyan(`Active subscribers: ${stats.active}`));
    console.log(chalk.cyan(`Unsubscribed: ${stats.unsubscribed}`));
    console.log(chalk.yellow(`\n📤 Sending to ${recipients.length} active subscribers...\n`));
    
    // Confirm before sending
    console.log(chalk.yellow('\n⚠️  This will send the newsletter to ALL active subscribers.'));
    console.log(chalk.dim('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n'));
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Initialize Gmail client
    const gmailClient = new GmailClient();
    await gmailClient.initialize();
    
    // Send personalized emails to each recipient
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    console.log(chalk.dim(`Starting batch send...\n`));
    
    for (let i = 0; i < recipients.length; i++) {
      const recipientEmail = recipients[i];
      
      try {
        // Prepare personalized newsletter data for each recipient
        const personalizedData = prepareNewsletterData(draft, recipientEmail);
        
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
        
        if (recipientResults[0].success) {
          successCount++;
          if ((i + 1) % 10 === 0 || i === recipients.length - 1) {
            console.log(chalk.green(`✅ Sent ${i + 1}/${recipients.length} (${successCount} successful, ${failCount} failed)`));
          }
        } else {
          failCount++;
          logger.error('Failed to send email', { 
            email: recipientEmail, 
            error: recipientResults[0].error || 'Unknown error'
          });
        }
        
        // Small delay to avoid rate limiting
        if (i < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        failCount++;
        logger.error('Error sending email', { email: recipientEmail, error: error.message });
        results.push({ success: false, email: recipientEmail, errorUserId: error.message });
      }
    }
    
    console.log(chalk.bold('\n📊 Send Results:'));
    console.log(chalk.green(`✅ Successful: ${successCount}`));
    if (failCount > 0) {
      console.log(chalk.red(`❌ Failed: ${failCount}`));
    }
    console.log(chalk.cyan(`📧 Total: ${recipients.length}\n`));
    
    // Update draft status
    draft.metadata.status = 'sent';
    draft.metadata.sentAt = new Date().toISOString();
    draft.metadata.sentResults = results;
    const fs2 = await import('fs');
    fs2.writeFileSync(draftPath, JSON.stringify(draft, null, 2));
    
    console.log(chalk.green('✅ Newsletter batch send completed!\n'));
    logger.info('Newsletter sent to all subscribers', { 
      draftPath, 
      total: recipients.length,
      successful: successCount,
      failed: failCount
    });
    
  } catch (error) {
    console.error(chalk.red('\n❌ Send failed:'), error.message);
    logger.error('Failed to send newsletter to all subscribers', { error: error.message });
    
    if (error.message.includes('token.json')) {
      console.log(chalk.yellow('\nPlease run authentication first: npm run auth\n'));
    }
  }
}

sendToAll();

