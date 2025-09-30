import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure marked for email-safe HTML
marked.setOptions({
  gfm: true,
  breaks: true
});

// Load template
const templatePath = join(__dirname, 'templates', 'newsletter.hbs');
const templateSource = readFileSync(templatePath, 'utf-8');
const template = Handlebars.compile(templateSource);

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

export function renderNewsletterHTML(data) {
  logger.info('Rendering newsletter HTML');

  // Convert markdown content to HTML
  const contentHTML = convertMarkdownToEmailHTML(data.content);

  const templateData = {
    subject: data.subject,
    previewText: data.previewText || data.subject,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    content: contentHTML,
    citations: data.citations || [],
    fromName: config.get('email.fromName') || 'Newsletter',
    unsubscribeLink: data.unsubscribeLink || '#unsubscribe',
    companyName: data.companyName || config.get('email.companyName') || 'Aira Development, LLC',
    companyAddress: data.companyAddress || config.get('email.companyAddress') || '1032 Charles Ave Charlotte, NC'
  };

  const html = template(templateData);
  
  logger.info('Newsletter HTML rendered');
  return html;
}

export function convertMarkdownToEmailHTML(markdown) {
  // First convert markdown to HTML
  let html = marked.parse(markdown);

  // Apply email-safe styles inline
  html = html.replace(/<h2>/g, '<h2 style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 32px 0 16px 0; line-height: 1.3;">');
  html = html.replace(/<h3>/g, '<h3 style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600; color: #1a1a1a; margin: 24px 0 12px 0; line-height: 1.3;">');
  html = html.replace(/<p>/g, '<p style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 16px 0;">');
  html = html.replace(/<ul>/g, '<ul style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 16px 0; padding-left: 24px;">');
  html = html.replace(/<ol>/g, '<ol style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 16px 0; padding-left: 24px;">');
  html = html.replace(/<li>/g, '<li style="margin-bottom: 8px;">');
  html = html.replace(/<a /g, '<a style="color: #0066cc; text-decoration: none;" ');
  html = html.replace(/<strong>/g, '<strong style="font-weight: 600; color: #1a1a1a;">');
  html = html.replace(/<em>/g, '<em style="font-style: italic;">');
  html = html.replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #0066cc; padding-left: 16px; margin: 16px 0; color: #666666; font-style: italic;">');

  return html;
}

export function generatePlainText(markdown) {
  // Remove markdown formatting for plain text version
  let text = markdown;
  
  // Remove heading markers
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove emphasis
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}
