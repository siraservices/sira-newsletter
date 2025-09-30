#!/usr/bin/env node

import cron from 'node-cron';
import chalk from 'chalk';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';
import { GmailClient } from '../email/gmail.js';

console.log(chalk.bold.blue('\n📅 Newsletter Scheduler\n'));

const draftsDir = config.getDraftsDir();

async function sendApprovedNewsletters() {
  logger.info('Checking for approved newsletters to send');

  if (!existsSync(draftsDir)) {
    logger.warn('Drafts directory not found');
    return;
  }

  const drafts = readdirSync(draftsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => join(draftsDir, f));

  let sentCount = 0;

  for (const draftPath of drafts) {
    try {
      const draft = JSON.parse(readFileSync(draftPath, 'utf-8'));

      if (draft.metadata.status === 'approved') {
        logger.info('Sending approved newsletter', { draftPath });
        console.log(chalk.yellow(`\nSending: ${draft.metadata.subject}`));

        const results = await sendNewsletter(prepareNewsletterData(draft));
        const successCount = results.filter(r => r.success).length;

        if (successCount > 0) {
          // Update draft status
          draft.metadata.status = 'sent';
          draft.metadata.sentAt = new Date().toISOString();
          draft.metadata.sentResults = results;
          writeFileSync(draftPath, JSON.stringify(draft, null, 2));

          sentCount++;
          console.log(chalk.green(`✅ Sent to ${successCount} recipients`));
          logger.info('Newsletter sent successfully', { draftPath, recipientCount: successCount });
        }
      }
    } catch (error) {
      logger.error('Failed to send newsletter', { draftPath, error: error.message });
      console.error(chalk.red(`❌ Failed to send newsletter: ${error.message}`));
    }
  }

  if (sentCount === 0) {
    console.log(chalk.dim('No approved newsletters to send'));
  } else {
    console.log(chalk.green(`\n🎉 Sent ${sentCount} newsletter(s)\n`));
    
    // Send notification to user
    try {
      await sendNotificationEmail(sentCount);
    } catch (error) {
      logger.error('Failed to send notification email', { error: error.message });
    }
  }
}

async function sendNotificationEmail(count) {
  const gmailClient = new GmailClient();
  await gmailClient.initialize();

  const subject = `Newsletter Automation: ${count} newsletter(s) sent`;
  const content = `Your scheduled newsletter automation has completed.\n\n${count} newsletter(s) were sent successfully on ${new Date().toLocaleString()}.`;

  await gmailClient.sendEmail(
    config.get('email.from'),
    subject,
    `<p>${content}</p>`,
    content
  );
}

function startScheduler() {
  const enabled = config.get('scheduler.enabled');

  if (!enabled) {
    console.log(chalk.yellow('⚠️  Scheduler is disabled in config.json\n'));
    console.log(chalk.dim('To enable: Set scheduler.enabled = true\n'));
    process.exit(0);
  }

  const cronPattern = config.get('scheduler.cronPattern');
  const timezone = config.get('scheduler.timezone');

  console.log(chalk.green('✅ Scheduler started'));
  console.log(chalk.dim(`Pattern: ${cronPattern} (${timezone})`));
  console.log(chalk.dim(`Next run: Monday at 2:00 AM ${timezone}\n`));

  cron.schedule(cronPattern, async () => {
    console.log(chalk.blue('\n⏰ Scheduled task triggered\n'));
    logger.info('Scheduled task triggered');
    
    await sendApprovedNewsletters();
  }, {
    scheduled: true,
    timezone: timezone
  });

  logger.info('Scheduler started', { cronPattern, timezone });

  // Keep process running
  console.log(chalk.dim('Press Ctrl+C to stop\n'));
}

// Manual run
if (process.argv.includes('--run-now')) {
  console.log(chalk.yellow('Running manual send...\n'));
  sendApprovedNewsletters().then(() => {
    console.log(chalk.green('\n✅ Manual run completed\n'));
    process.exit(0);
  }).catch(error => {
    console.error(chalk.red('❌ Manual run failed:'), error.message);
    process.exit(1);
  });
} else {
  startScheduler();
}
