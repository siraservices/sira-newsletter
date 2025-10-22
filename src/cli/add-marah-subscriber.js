#!/usr/bin/env node

import chalk from 'chalk';
import subscriberDB from '../database/subscribers.js';
import { v4 as uuidv4 } from 'uuid';

console.log(chalk.bold.blue('\n👤 Add Marah Hayes to Subscriber List\n'));

async function addMarahSubscriber() {
  try {
    const email = 'marahhayes2@gmail.com';
    const name = 'Marah Hayes';
    
    console.log(chalk.yellow(`Adding ${name} (${email}) to subscriber list...\n`));
    
    // Check if she already exists
    const existingSubscriber = subscriberDB.getSubscriberByEmail(email);
    if (existingSubscriber) {
      console.log(chalk.yellow(`⚠️  ${email} already exists in the database`));
      console.log(chalk.cyan(`Status: ${existingSubscriber.subscribed ? 'Subscribed' : 'Unsubscribed'}`));
      console.log(chalk.cyan(`Token: ${existingSubscriber.token}`));
      console.log(chalk.cyan(`Joined: ${existingSubscriber.subscribed_at}\n`));
      
      // If unsubscribed, resubscribe her
      if (!existingSubscriber.subscribed) {
        console.log(chalk.yellow('Resubscribing Marah Hayes...\n'));
        const result = subscriberDB.subscribe(email);
        if (result.success) {
          console.log(chalk.green('✅ Marah Hayes has been resubscribed!\n'));
        } else {
          console.log(chalk.red('❌ Failed to resubscribe Marah Hayes\n'));
        }
      }
      return;
    }
    
    // Add new subscriber
    const token = uuidv4();
    const result = subscriberDB.addSubscriber(email, name, token);
    
    if (result.success) {
      console.log(chalk.green('✅ Marah Hayes added to subscriber list!\n'));
      console.log(chalk.cyan(`Email: ${email}`));
      console.log(chalk.cyan(`Name: ${name}`));
      console.log(chalk.cyan(`Token: ${token}`));
      console.log(chalk.cyan(`Status: Subscribed\n`));
    } else {
      console.log(chalk.red('❌ Failed to add Marah Hayes to subscriber list\n'));
      console.log(chalk.red('Error:', result.error, '\n'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Add subscriber failed:'), error.message);
  }
}

addMarahSubscriber();
