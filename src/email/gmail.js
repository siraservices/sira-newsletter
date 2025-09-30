import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = join(config.getRootDir(), 'token.json');
const CREDENTIALS_PATH = join(config.getRootDir(), 'credentials.json');

export class GmailClient {
  constructor() {
    this.auth = null;
    this.gmail = null;
  }

  async initialize() {
    try {
      // Load client secrets
      if (!existsSync(CREDENTIALS_PATH)) {
        throw new Error('credentials.json not found. Please run: npm run auth');
      }

      const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Load token
      if (!existsSync(TOKEN_PATH)) {
        throw new Error('token.json not found. Please run: npm run auth');
      }

      const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'));
      oAuth2Client.setCredentials(token);

      this.auth = oAuth2Client;
      this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

      logger.info('Gmail client initialized');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Gmail client', { error: error.message });
      throw error;
    }
  }

  async sendEmail(to, subject, htmlContent, plainTextContent) {
    if (!this.gmail) {
      await this.initialize();
    }

    const fromEmail = config.get('email.from');
    const fromName = config.get('email.fromName');
    const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

    // Build email
    const email = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary-mixed"',
      '',
      '--boundary-mixed',
      'Content-Type: text/plain; charset=utf-8',
      '',
      plainTextContent,
      '',
      '--boundary-mixed',
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlContent,
      '',
      '--boundary-mixed--'
    ].join('\n');

    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      logger.info('Email sent successfully', { to, subject, messageId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to send email', { error: error.message, to, subject });
      throw error;
    }
  }

  async sendToMultipleRecipients(recipients, subject, htmlContent, plainTextContent) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(recipient, subject, htmlContent, plainTextContent);
        results.push({ recipient, success: true, messageId: result.id });
        
        // Rate limiting: wait 100ms between sends
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ recipient, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    logger.info('Batch send completed', { 
      total: recipients.length, 
      successful: successCount,
      failed: recipients.length - successCount
    });

    return results;
  }
}

export async function getAuthUrl() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  return { authUrl, oAuth2Client };
}

export async function getTokenFromCode(code, oAuth2Client) {
  const { tokens } = await oAuth2Client.getToken(code);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  logger.info('Token stored successfully');
  return tokens;
}
