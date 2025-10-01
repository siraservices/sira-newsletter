#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import subscriberDB from '../database/subscribers.js';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n📊 Subscriber Management\n'));

async function showMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📈 View Statistics', value: 'stats' },
        { name: '➕ Add Subscriber', value: 'add' },
        { name: '📋 List Active Subscribers', value: 'list' },
        { name: '🔄 Migrate from config.json', value: 'migrate' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'stats':
      await showStats();
      break;
    case 'add':
      await addSubscriber();
      break;
    case 'list':
      await listSubscribers();
      break;
    case 'migrate':
      await migrateSubscribers();
      break;
    case 'exit':
      console.log(chalk.yellow('\nGoodbye!\n'));
      process.exit(0);
  }

  // Show menu again
  await showMenu();
}

async function showStats() {
  const stats = subscriberDB.getStats();
  
  console.log(chalk.bold('\n📊 Subscriber Statistics:\n'));
  console.log(chalk.green(`  Total:        ${stats.total}`));
  console.log(chalk.blue(`  Active:       ${stats.active}`));
  console.log(chalk.red(`  Unsubscribed: ${stats.unsubscribed}`));
  console.log();
}

async function addSubscriber() {
  const { email } = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter email address:',
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) ? true : 'Please enter a valid email address';
      }
    }
  ]);

  try {
    const result = subscriberDB.addSubscriber(email);
    
    if (result.success) {
      console.log(chalk.green(`\n✅ Successfully added: ${email}`));
      console.log(chalk.dim(`   Token: ${result.token}\n`));
    } else {
      console.log(chalk.yellow(`\n⚠️  ${result.error}\n`));
    }
  } catch (error) {
    console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
  }
}

async function listSubscribers() {
  const subscribers = subscriberDB.getActiveSubscribers();
  
  if (subscribers.length === 0) {
    console.log(chalk.yellow('\n⚠️  No active subscribers found\n'));
    return;
  }

  console.log(chalk.bold('\n📋 Active Subscribers:\n'));
  
  subscribers.forEach((sub, index) => {
    const date = new Date(sub.subscribed_at).toLocaleDateString();
    console.log(chalk.dim(`  ${index + 1}. `) + chalk.white(sub.email) + chalk.dim(` (since ${date})`));
  });
  
  console.log(chalk.dim(`\n  Total: ${subscribers.length} active subscribers\n`));
}

async function migrateSubscribers() {
  const configRecipients = config.get('email.recipients') || [];
  
  if (configRecipients.length === 0) {
    console.log(chalk.yellow('\n⚠️  No recipients found in config.json\n'));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Migrate ${configRecipients.length} recipients from config.json to database?`,
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Migration cancelled\n'));
    return;
  }

  console.log(chalk.yellow('\n🔄 Migrating subscribers...\n'));
  
  const results = subscriberDB.migrateFromConfig(configRecipients);
  
  console.log(chalk.green(`✅ Added: ${results.added}`));
  console.log(chalk.blue(`ℹ️  Already existed: ${results.existing}`));
  
  if (results.errors.length > 0) {
    console.log(chalk.red(`❌ Errors: ${results.errors.length}`));
    results.errors.forEach(err => {
      console.log(chalk.red(`   - ${err.email}: ${err.error}`));
    });
  }
  
  console.log();
}

// Start the interactive menu
showMenu().catch(error => {
  console.error(chalk.red('\n❌ Error:'), error.message);
  process.exit(1);
});

