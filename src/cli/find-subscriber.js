#!/usr/bin/env node

import subscriberDB from '../database/subscribers.js';
import chalk from 'chalk';

console.log(chalk.bold.blue('\n🔍 Find Subscriber\n'));

async function findSubscriber() {
  try {
    // Get all active subscribers
    const activeSubscribers = subscriberDB.getActiveSubscribers();
    
    console.log(chalk.yellow('Searching for Marah Hayes...\n'));
    
    // Search for Marah Hayes (case insensitive)
    const marahSubscribers = activeSubscribers.filter(subscriber => 
      subscriber.email.toLowerCase().includes('marah') ||
      subscriber.email.toLowerCase().includes('hayes')
    );
    
    if (marahSubscribers.length > 0) {
      console.log(chalk.green('✅ Found Marah Hayes:'));
      marahSubscribers.forEach(subscriber => {
        console.log(chalk.cyan(`• Email: ${subscriber.email}`));
        console.log(chalk.cyan(`• Token: ${subscriber.token}`));
        console.log(chalk.cyan(`• Subscribed: ${subscriber.subscribed ? 'Yes' : 'No'}`));
        console.log(chalk.cyan(`• Joined: ${subscriber.subscribed_at}`));
        console.log('');
      });
    } else {
      console.log(chalk.red('❌ Marah Hayes not found in active subscribers'));
      console.log(chalk.yellow('\nAll active subscribers:'));
      activeSubscribers.forEach(subscriber => {
        console.log(chalk.dim(`• ${subscriber.email}`));
      });
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error finding subscriber:'), error.message);
  }
}

findSubscriber();
