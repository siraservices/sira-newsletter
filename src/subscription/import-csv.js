#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import subscriberDB from '../database/subscribers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(chalk.bold.blue('\n📥 CSV Subscriber Import\n'));

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function importCsv(csvPath) {
  try {
    console.log(chalk.yellow(`Reading CSV file: ${csvPath}\n`));
    
    const fileContent = readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
      console.log(chalk.red('❌ CSV file is empty\n'));
      return;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    console.log(chalk.dim(`Found ${dataLines.length} rows (excluding header)\n`));
    console.log(chalk.yellow('Importing subscribers...\n'));
    
    const results = {
      added: 0,
      existing: 0,
      invalid: 0,
      errors: []
    };
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const fields = parseCsvLine(line);
      const email = fields[0]; // Email is in first column
      
      // Skip empty emails
      if (!email) {
        continue;
      }
      
      // Validate email
      if (!isValidEmail(email)) {
        results.invalid++;
        console.log(chalk.dim(`  ⚠️  Invalid: ${email}`));
        continue;
      }
      
      try {
        const result = subscriberDB.addSubscriber(email);
        
        if (result.success) {
          results.added++;
          console.log(chalk.green(`  ✅ Added: ${email}`));
        } else {
          results.existing++;
          console.log(chalk.dim(`  ℹ️  Exists: ${email}`));
        }
      } catch (error) {
        results.errors.push({ email, error: error.message });
        console.log(chalk.red(`  ❌ Error: ${email} - ${error.message}`));
      }
    }
    
    // Show summary
    console.log(chalk.bold('\n📊 Import Summary:\n'));
    console.log(chalk.green(`  ✅ Successfully added:  ${results.added}`));
    console.log(chalk.blue(`  ℹ️  Already existed:    ${results.existing}`));
    console.log(chalk.yellow(`  ⚠️  Invalid emails:     ${results.invalid}`));
    console.log(chalk.red(`  ❌ Errors:             ${results.errors.length}`));
    
    // Show final stats
    const stats = subscriberDB.getStats();
    console.log(chalk.bold('\n📈 Database Statistics:\n'));
    console.log(chalk.green(`  Total subscribers:    ${stats.total}`));
    console.log(chalk.blue(`  Active:               ${stats.active}`));
    console.log(chalk.red(`  Unsubscribed:         ${stats.unsubscribed}`));
    console.log();
    
  } catch (error) {
    console.error(chalk.red('\n❌ Import failed:'), error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Get CSV path from command line args
const csvPath = process.argv[2];

if (!csvPath) {
  console.log(chalk.red('❌ Please provide a CSV file path\n'));
  console.log(chalk.dim('Usage: node import-csv.js <path-to-csv>\n'));
  process.exit(1);
}

importCsv(csvPath);

