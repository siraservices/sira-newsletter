#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';
import config from '../utils/config.js';
import { validateWordCount, enforceWordCount } from '../utils/word-count-validator.js';

console.log(chalk.bold.blue('\n📧 Send Newsletter Draft\n'));

async function sendDraft() {
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
    console.log(chalk.cyan(`Created: ${draft.metadata.createdAt}`));
    
    // Word count validation
    if (validation.overLimit) {
      console.log(chalk.red(`\n⚠️  WARNING: Newsletter exceeds word limit by ${validation.wordCount - validation.maxWords} words!`));
      console.log(chalk.yellow('Content will be automatically trimmed before sending.\n'));
      
      // Enforce word count by trimming
      draft.content = enforceWordCount(draft.content);
      console.log(chalk.green(`✅ Content trimmed to ${draft.content.split(/\s+/).length} words\n`));
    } else if (validation.underLimit) {
      console.log(chalk.yellow(`\n⚠️  WARNING: Newsletter is ${validation.minWords - validation.wordCount} words under the minimum limit.\n`));
    } else {
      console.log(chalk.green(`\n✅ Word count is within acceptable range (${validation.wordCount} words)\n`));
    }
    
    // Send to julioaira4@gmail.com
    const recipient = 'julioaira4@gmail.com';
    console.log(chalk.yellow(`Sending to: ${recipient}\n`));
    
    // Prepare newsletter data with unsubscribe link
    const newsletterData = prepareNewsletterData(draft, recipient);
    
    // Send the newsletter
    const results = await sendNewsletter(newsletterData, draft);
    
    if (results[0].success) {
      // Update draft status to "sent"
      draft.metadata.status = 'sent';
      draft.metadata.sentAt = new Date().toISOString();
      draft.metadata.sentResults = results;
      const fs2 = await import('fs');
      fs2.writeFileSync(draftPath, JSON.stringify(draft, null, 2));
      
      console.log(chalk.green('✅ Newsletter sent successfully!\n'));
      console.log(chalk.blue(`Check inbox: ${recipient}\n`));
      console.log(chalk.dim('📝 Newsletter status updated to "sent" - it will appear on the website\n'));
    } else {
      console.log(chalk.red('❌ Failed to send newsletter\n'));
      console.log(chalk.red('Error:', results[0].error, '\n'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Send failed:'), error.message);
    
    if (error.message.includes('token.json')) {
      console.log(chalk.yellow('\nPlease run authentication first: npm run auth\n'));
    }
  }
}

sendDraft();
