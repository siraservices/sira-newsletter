#!/usr/bin/env node

import chalk from 'chalk';
import { existsSync } from 'fs';
import { join } from 'path';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n🧪 Integration Test\n'));

const tests = [];

// Test 1: Configuration
tests.push({
  name: 'Configuration files',
  test: () => {
    const configPath = join(config.getRootDir(), 'config.json');
    const envPath = join(config.getRootDir(), '.env');
    
    if (!existsSync(configPath)) throw new Error('config.json not found');
    if (!existsSync(envPath)) throw new Error('.env not found');
    
    return 'Config files exist';
  }
});

// Test 2: API Keys
tests.push({
  name: 'API Keys',
  test: () => {
    const aiProvider = config.getEnv('AI_PROVIDER');
    const searchProvider = config.getEnv('SEARCH_PROVIDER');
    
    if (!aiProvider) throw new Error('AI_PROVIDER not set');
    if (!searchProvider) throw new Error('SEARCH_PROVIDER not set');
    
    // Check AI key only if not using Ollama (Ollama runs locally, no key needed)
    if (aiProvider !== 'ollama') {
      const aiKey = aiProvider === 'anthropic' 
        ? config.getEnv('ANTHROPIC_API_KEY')
        : config.getEnv('OPENAI_API_KEY');
      
      if (!aiKey) throw new Error(`${aiProvider.toUpperCase()}_API_KEY not set`);
    }
    
    // Check search key only if using a search provider (not 'none')
    if (searchProvider !== 'none') {
      const searchKey = searchProvider === 'brave'
        ? config.getEnv('BRAVE_API_KEY')
        : config.getEnv('SERPER_API_KEY');
      
      if (!searchKey) throw new Error(`${searchProvider.toUpperCase()}_API_KEY not set`);
    }
    
    return `AI: ${aiProvider}, Search: ${searchProvider}`;
  }
});

// Test 3: Gmail Setup
tests.push({
  name: 'Gmail Authentication',
  test: () => {
    const credentialsPath = join(config.getRootDir(), 'credentials.json');
    const tokenPath = join(config.getRootDir(), 'token.json');
    
    if (!existsSync(credentialsPath)) {
      throw new Error('credentials.json not found. Run: npm run auth');
    }
    
    if (!existsSync(tokenPath)) {
      throw new Error('token.json not found. Run: npm run auth');
    }
    
    return 'Gmail configured';
  }
});

// Test 4: Directories
tests.push({
  name: 'Required directories',
  test: () => {
    const dirs = [
      config.getDraftsDir(),
      config.getLogsDir()
    ];
    
    for (const dir of dirs) {
      if (!existsSync(dir)) {
        throw new Error(`Directory missing: ${dir}`);
      }
    }
    
    return 'All directories exist';
  }
});

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const { name, test } of tests) {
    try {
      const result = test();
      console.log(chalk.green('✅'), name, chalk.dim(`- ${result}`));
      passed++;
    } catch (error) {
      console.log(chalk.red('❌'), name, chalk.dim(`- ${error.message}`));
      failed++;
    }
  }

  console.log('');
  
  if (failed === 0) {
    console.log(chalk.green.bold('🎉 All tests passed!'));
    console.log(chalk.dim('\nYou\'re ready to generate newsletters: npm run generate\n'));
  } else {
    console.log(chalk.red.bold(`❌ ${failed} test(s) failed`));
    console.log(chalk.dim('\nPlease fix the issues above before generating newsletters.\n'));
    process.exit(1);
  }
}

runTests();
