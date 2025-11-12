#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GmailClient } from '../email/gmail.js';
import { renderNewsletterHTML, generatePlainText } from '../email/template-renderer.js';
import { prepareNewsletterData } from '../email/sender.js';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n📧 Send Newsletter Preview\n'));

async function sendPreview() {
  try {
    // Find the most recent draft
    const draftsDir = config.getDraftsDir();
    const fs = await import('fs');
    
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
    
    console.log(chalk.bold('Newsletter Details:'));
    console.log(chalk.cyan(`Subject: ${draft.metadata.subject}`));
    console.log(chalk.cyan(`Word count: ${draft.content.split(/\s+/).length}`));
    console.log(chalk.cyan(`Created: ${draft.metadata.createdAt}\n`));
    
    // Send to julioaira4@gmail.com
    const recipient = 'julioaira4@gmail.com';
    console.log(chalk.yellow(`Sending preview to: ${recipient}\n`));
    
    // Prepare newsletter data with unsubscribe link
    const newsletterData = prepareNewsletterData(draft, recipient);
    
    // Initialize Gmail client
    const gmailClient = new GmailClient();
    await gmailClient.initialize();
    
    // Render email content
    const html = renderNewsletterHTML(newsletterData);
    const plainText = generatePlainText(newsletterData.content);
    
    // Send preview
    const results = await gmailClient.sendToMultipleRecipients(
      [recipient],
      newsletterData.subject,
      html,
      plainText
    );
    
    if (results[0].success) {
      console.log(chalk.green('✅ Newsletter preview sent successfully!\n'));
      console.log(chalk.blue(`Check inbox: ${recipient}\n`));
      console.log(chalk.green(`Message ID: ${results[0].messageId}\n`));
    } else {
      console.log(chalk.red('❌ Failed to send preview\n'));
      console.log(chalk.red('Error:', results[0].error, '\n'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Send failed:'), error.message);
    if (error.message.includes('token.json')) {
      console.log(chalk.yellow('\nPlease run authentication first: npm run auth\n'));
    }
  }
}

sendPreview();

