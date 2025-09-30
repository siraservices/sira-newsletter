#!/usr/bin/env node

import { createServer } from 'http';
import { parse } from 'url';
import open from 'open';
import chalk from 'chalk';
import { getAuthUrl, getTokenFromCode } from './gmail.js';
import { existsSync } from 'fs';
import { join } from 'path';
import config from '../utils/config.js';

const CREDENTIALS_PATH = join(config.getRootDir(), 'credentials.json');

console.log(chalk.bold.blue('\n📧 Gmail OAuth Setup\n'));

// Check for credentials.json
if (!existsSync(CREDENTIALS_PATH)) {
  console.log(chalk.red('❌ credentials.json not found!\n'));
  console.log(chalk.yellow('Please follow these steps:\n'));
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Enable the Gmail API');
  console.log('4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"');
  console.log('5. Choose "Desktop app" as application type');
  console.log('6. Download the credentials JSON file');
  console.log('7. Save it as credentials.json in the project root');
  console.log(chalk.yellow('\nThen run this command again.\n'));
  process.exit(1);
}

async function setupAuth() {
  try {
    const { authUrl, oAuth2Client } = await getAuthUrl();

    console.log(chalk.yellow('Opening browser for authentication...\n'));
    console.log(chalk.dim('If the browser doesn\'t open, visit this URL:'));
    console.log(chalk.cyan(authUrl + '\n'));

    // Start local server to receive OAuth callback
    const server = createServer(async (req, res) => {
      const queryObject = parse(req.url, true).query;

      if (queryObject.code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; padding: 40px; text-align: center;">
              <h1 style="color: #0066cc;">✅ Authorization Successful!</h1>
              <p>You can close this window and return to the terminal.</p>
            </body>
          </html>
        `);

        try {
          await getTokenFromCode(queryObject.code, oAuth2Client);
          console.log(chalk.green('\n✅ Authentication successful!'));
          console.log(chalk.green('Token saved to token.json\n'));
          console.log(chalk.blue('You can now send newsletters with: npm run generate\n'));
          
          server.close();
          process.exit(0);
        } catch (error) {
          console.error(chalk.red('\n❌ Error getting token:'), error.message);
          server.close();
          process.exit(1);
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('No code received');
      }
    });

    server.listen(3000, () => {
      console.log(chalk.dim('Waiting for authorization...\n'));
      open(authUrl);
    });

  } catch (error) {
    console.error(chalk.red('❌ Setup failed:'), error.message);
    process.exit(1);
  }
}

setupAuth();
