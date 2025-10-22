#!/usr/bin/env node

import chalk from 'chalk';
import { getWordCountStats, generateWordCountReport } from '../utils/word-count-monitor.js';

console.log(chalk.bold.blue('\n📊 Word Count Monitoring Report\n'));

async function showReport() {
  try {
    const report = generateWordCountReport();
    console.log(report);
    
    const stats = getWordCountStats();
    if (stats) {
      console.log(chalk.dim('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      
      if (stats.successRate < 80) {
        console.log(chalk.red('⚠️  WARNING: Word count success rate is below 80%'));
        console.log(chalk.yellow('Consider reviewing AI prompts and word count enforcement.'));
      } else {
        console.log(chalk.green('✅ Word count performance is good!'));
      }
      
      if (stats.overLimitCount > 0) {
        console.log(chalk.red(`\n📈 ${stats.overLimitCount} newsletters exceeded the word limit recently.`));
        console.log(chalk.yellow('This indicates the AI prompts need stronger word count enforcement.'));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error generating report:'), error.message);
  }
}

showReport();
