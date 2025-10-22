#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n📧 Send Newsletter to Specific Email\n'));

async function sendToSpecific() {
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
    
    console.log(chalk.bold('Newsletter Details:'));
    console.log(chalk.cyan(`Subject: ${draft.metadata.subject}`));
    console.log(chalk.cyan(`Word count: ${draft.content.split(/\s+/).length}`));
    console.log(chalk.cyan(`Created: ${draft.metadata.createdAt}\n`));
    
    // Send to Marah Hayes
    const recipient = 'marah.hayes@example.com'; // You'll need to provide the actual email
    console.log(chalk.yellow(`Sending to: ${recipient}\n`));
    
    // Prepare newsletter data with unsubscribe link
    const newsletterData = prepareNewsletterData(draft, recipient);
    
    // Send the newsletter
    const results = await sendNewsletter(newsletterData, draft);
    
    if (results[0].success) {
      console.log(chalk.green('✅ Newsletter sent successfully!\n'));
      console.log(chalk.blue(`Check inbox: ${recipient}\n`));
    } else {
      console.log(chalk.red('❌ Failed to send newsletter\n'));
      console.log(chalk.red('Error:', results[0].error, '\n'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Send failed:'), error.message);
  }
}

sendToSpecific();
