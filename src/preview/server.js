import express from 'express';
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import chalk from 'chalk';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { renderNewsletterHTML, generatePlainText } from '../email/template-renderer.js';
import { sendNewsletter, prepareNewsletterData } from '../email/sender.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PreviewServer {
  constructor(draftPath) {
    this.draftPath = draftPath;
    this.app = express();
    this.server = null;
    this.draft = null;
    
    this.setupRoutes();
  }

  loadDraft() {
    if (!existsSync(this.draftPath)) {
      throw new Error(`Draft not found: ${this.draftPath}`);
    }
    this.draft = JSON.parse(readFileSync(this.draftPath, 'utf-8'));
    logger.info('Draft loaded for preview', { draftPath: this.draftPath });
  }

  setupRoutes() {
    this.app.use(express.json());
    this.app.use(express.static(join(__dirname, 'public')));

    // Main preview page
    this.app.get('/', (req, res) => {
      this.loadDraft();
      
      const html = readFileSync(join(__dirname, 'public', 'preview.html'), 'utf-8');
      res.send(html);
    });

    // Get draft data
    this.app.get('/api/draft', (req, res) => {
      try {
        this.loadDraft();
        
        const newsletterData = prepareNewsletterData(this.draft);
        const htmlContent = renderNewsletterHTML(newsletterData);
        const plainText = generatePlainText(this.draft.content);

        res.json({
          success: true,
          draft: {
            ...this.draft,
            htmlPreview: htmlContent,
            plainTextPreview: plainText,
            metadata: {
              ...this.draft.metadata,
              wordCount: this.draft.content.split(/\s+/).length,
              estimatedReadTime: Math.ceil(this.draft.content.split(/\s+/).length / 200),
              subjectLength: this.draft.metadata.subject.length,
              previewTextLength: (this.draft.metadata.previewText || '').length
            }
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Approve and send
    this.app.post('/api/approve', async (req, res) => {
      try {
        this.loadDraft();
        
        console.log(chalk.yellow('\n📤 Sending newsletter...\n'));
        
        const results = await sendNewsletter(prepareNewsletterData(this.draft), this.draft);
        
        const successCount = results.filter(r => r.success).length;
        
        if (successCount > 0) {
          // Update draft status to "sent"
          this.draft.metadata.status = 'sent';
          this.draft.metadata.sentAt = new Date().toISOString();
          this.draft.metadata.sentResults = results;
          writeFileSync(this.draftPath, JSON.stringify(this.draft, null, 2));
          
          console.log(chalk.green(`✅ Newsletter sent to ${successCount}/${results.length} recipients\n`));
          console.log(chalk.dim('📝 Newsletter status updated to "sent" - it will appear on the website\n'));
        } else {
          console.log(chalk.red('❌ Newsletter send failed - status not updated\n'));
        }
        
        res.json({ 
          success: true, 
          message: 'Newsletter sent successfully',
          results 
        });

        // Close server after successful send
        setTimeout(() => this.close(), 2000);
      } catch (error) {
        logger.error('Failed to send newsletter', { error: error.message });
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Cancel
    this.app.post('/api/cancel', (req, res) => {
      res.json({ success: true, message: 'Cancelled' });
      console.log(chalk.yellow('\n❌ Preview cancelled\n'));
      setTimeout(() => this.close(), 1000);
    });
  }

  async start() {
    const port = config.get('preview.port');
    
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        const url = `http://localhost:${port}`;
        logger.info('Preview server started', { url });
        
        console.log(chalk.green(`\n✅ Preview server running at ${url}\n`));
        
        if (config.get('preview.autoOpen')) {
          open(url);
        }

        resolve(url);
      });

      // Auto-close after timeout
      const timeout = config.get('preview.timeout');
      setTimeout(() => {
        console.log(chalk.yellow('\n⏰ Preview timeout reached. Closing server.\n'));
        this.close();
      }, timeout);
    });
  }

  close() {
    if (this.server) {
      this.server.close();
      logger.info('Preview server closed');
      process.exit(0);
    }
  }
}

// CLI usage
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const draftsDir = config.getDraftsDir();
  
  if (!existsSync(draftsDir)) {
    console.error(chalk.red('No drafts directory found'));
    process.exit(1);
  }

  const drafts = readdirSync(draftsDir).filter(f => f.endsWith('.json'));
  
  if (drafts.length === 0) {
    console.error(chalk.red('No drafts found'));
    process.exit(1);
  }

  // Use the most recent draft
  const latestDraft = drafts.sort().reverse()[0];
  const draftPath = join(draftsDir, latestDraft);

  console.log(chalk.blue(`\nPreviewing: ${latestDraft}\n`));

  const server = new PreviewServer(draftPath);
  server.start();
}
