#!/usr/bin/env node

import chalk from 'chalk';
import { checkForUnsubscribes, getUnsubscribeReport } from '../utils/unsubscribe-notifier.js';
import subscriberDB from '../database/subscribers.js';

console.log(chalk.bold.blue('\n📊 Unsubscribe Monitor\n'));
console.log(chalk.dim('━━━━━━━━━━━━━━━━━━━━\n'));

async function checkUnsubscribes() {
  try {
    console.log(chalk.yellow('Checking for unsubscribes...\n'));
    
    // Get current stats
    const stats = subscriberDB.getStats();
    console.log(chalk.bold('📈 Current Subscriber Statistics:'));
    console.log(chalk.cyan(`• Total Subscribers: ${stats.total}`));
    console.log(chalk.cyan(`• Active Subscribers: ${stats.active}`));
    console.log(chalk.cyan(`• Unsubscribed: ${stats.unsubscribed}`));
    
    if (stats.unsubscribed > 0) {
      console.log(chalk.red(`\n⚠️  ${stats.unsubscribed} people have unsubscribed`));
      
      // Calculate rates
      const unsubscribeRate = stats.total > 0 ? Math.round((stats.unsubscribed / stats.total) * 100) : 0;
      const subscriptionRate = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
      
      console.log(chalk.yellow(`• Unsubscribe Rate: ${unsubscribeRate}%`));
      console.log(chalk.green(`• Active Rate: ${subscriptionRate}%`));
      
      // Send notification if there are unsubscribes
      console.log(chalk.yellow('\n📧 Sending unsubscribe notification...'));
      await checkForUnsubscribes();
      console.log(chalk.green('✅ Notification sent to admin email'));
      
    } else {
      console.log(chalk.green('\n✅ No unsubscribes detected'));
    }
    
    // Show detailed report
    console.log(chalk.bold('\n📊 Detailed Report:'));
    const report = getUnsubscribeReport();
    if (report) {
      console.log(report.report);
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error checking unsubscribes:'), error.message);
  }
}

checkUnsubscribes();
