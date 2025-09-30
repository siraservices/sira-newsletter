#!/usr/bin/env node

import chalk from 'chalk';
import { checkOllamaStatus, listOllamaModels, callOllama } from '../ai/providers/ollama.js';
import config from '../utils/config.js';

console.log(chalk.bold.blue('\n🦙 Ollama Connection Test\n'));

async function testOllama() {
  try {
    // Check if Ollama is running
    console.log(chalk.yellow('1. Checking Ollama status...\n'));
    const status = await checkOllamaStatus();
    
    if (!status.running) {
      console.log(chalk.red('❌ Ollama is not running!'));
      console.log(chalk.yellow('\nTo start Ollama:'));
      console.log(chalk.cyan('  ollama serve'));
      console.log(chalk.yellow('\nOr run in background (recommended):'));
      console.log(chalk.cyan('  ollama serve &\n'));
      process.exit(1);
    }
    
    console.log(chalk.green('✅ Ollama is running\n'));
    
    // List available models
    console.log(chalk.yellow('2. Available models:\n'));
    const models = await listOllamaModels();
    
    if (models.length === 0) {
      console.log(chalk.red('❌ No models found!'));
      console.log(chalk.yellow('\nTo download a model:'));
      console.log(chalk.cyan('  ollama pull llama3.1:8b'));
      console.log(chalk.yellow('\nRecommended models:'));
      console.log(chalk.dim('  - llama3.1:8b (fast, good quality)'));
      console.log(chalk.dim('  - llama3.1:70b (slower, best quality)'));
      console.log(chalk.dim('  - mistral:7b (fast alternative)'));
      console.log(chalk.dim('  - mixtral:8x7b (good balance)\n'));
      process.exit(1);
    }
    
    models.forEach(model => {
      console.log(chalk.cyan(`  - ${model.name}`) + chalk.dim(` (${(model.size / 1e9).toFixed(1)} GB)`));
    });
    console.log('');
    
    // Get configured model
    const configuredModel = config.get('ai.model') || 'llama3.1:8b';
    const modelExists = models.some(m => m.name === configuredModel);
    
    if (!modelExists) {
      console.log(chalk.yellow(`⚠️  Configured model "${configuredModel}" not found`));
      console.log(chalk.yellow(`\nTo download it:`));
      console.log(chalk.cyan(`  ollama pull ${configuredModel}\n`));
    } else {
      console.log(chalk.green(`✅ Using model: ${configuredModel}\n`));
    }
    
    // Test API call
    console.log(chalk.yellow('3. Testing API call...\n'));
    const testPrompt = 'Write a one-sentence summary of what a newsletter is.';
    
    console.log(chalk.dim('Sending test prompt...'));
    console.log(chalk.dim('(This may take 10-30 seconds on first run)\n'));
    
    const startTime = Date.now();
    const response = await callOllama(testPrompt, { maxTokens: 100 });
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log(chalk.green('✅ API call successful!\n'));
    console.log(chalk.bold('Response:'));
    console.log(chalk.dim(response.trim()));
    console.log('');
    console.log(chalk.dim(`Time: ${duration}s\n`));
    
    // All tests passed
    console.log(chalk.green.bold('🎉 All Ollama tests passed!\n'));
    console.log(chalk.blue('You\'re ready to use Ollama for newsletter generation.'));
    console.log(chalk.dim('\nTo switch to Ollama:'));
    console.log(chalk.dim('1. Edit .env and set: AI_PROVIDER=ollama'));
    console.log(chalk.dim('2. Edit config.json and set your preferred model'));
    console.log(chalk.dim('3. Run: npm run generate\n'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error.message);
    console.log(chalk.yellow('\nMake sure Ollama is installed and running:'));
    console.log(chalk.cyan('  https://ollama.ai/download\n'));
    process.exit(1);
  }
}

testOllama();
