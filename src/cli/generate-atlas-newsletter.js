#!/usr/bin/env node

import ora from 'ora';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { formatTimestamp, sanitizeFilename } from '../utils/helpers.js';
import { planNewsletter } from '../ai/planner.js';
import { researchQueries, formatResearchForWriter } from '../ai/researcher.js';
import { generateAllSections } from '../ai/writer.js';
import { consolidateNewsletter, generateTitle, generatePreviewText, compileCitations } from '../ai/editor.js';
import { PreviewServer } from '../preview/server.js';
import { recordWordCount } from '../utils/word-count-monitor.js';
import { validateWordCount, enforceWordCount } from '../utils/word-count-validator.js';

console.log(chalk.bold.blue('\n📰 ChatGPT Atlas Newsletter Generator'));
console.log(chalk.dim('━━━━━━━━━━━━━━━━━━━━\n'));

async function generateAtlasNewsletter() {
  try {
    // Predefined values for ChatGPT Atlas newsletter
    const topic = "ChatGPT Atlas: The Browser with ChatGPT Built In - Should You Switch?";
    const tone = "hormozi";
    const audience = "Tech-savvy professionals and entrepreneurs evaluating AI-powered browser solutions";

    console.log(chalk.bold('Topic: ') + chalk.cyan(topic));
    console.log(chalk.bold('Tone: ') + chalk.cyan('Alex Hormozi (Direct, ROI-focused)'));
    console.log(chalk.bold('Audience: ') + chalk.cyan(audience));
    console.log(chalk.bold('Word Limit: ') + chalk.cyan('400-450 words'));
    console.log('');

    // Create drafts directory if needed
    const draftsDir = config.getDraftsDir();
    if (!existsSync(draftsDir)) {
      mkdirSync(draftsDir, { recursive: true });
    }

    // Step 1: Plan
    const spinner = ora('Planning newsletter structure...').start();
    const plan = await planNewsletter(topic, tone, audience);
    spinner.succeed(`Newsletter planned: ${plan.sections.length} sections`);

    // Step 2: Research all sections
    spinner.start('Researching content...');
    const allQueries = plan.sections.flatMap(section => section.researchQueries || []);
    const researchResults = await researchQueries(allQueries);
    
    // Map research results to sections
    const researchBySections = plan.sections.map(section => {
      const sectionQueries = section.researchQueries || [];
      return sectionQueries.map(query => {
        const result = researchResults.find(r => r.query === query);
        if (!result || result.results.length === 0) {
          return { query, sources: [] };
        }
        return formatResearchForWriter([result])[0];
      });
    });
    
    spinner.succeed(`Research completed: ${researchResults.length} queries processed`);

    // Step 3: Generate all sections in parallel
    spinner.start('Writing all sections...');
    const sections = await generateAllSections(plan, researchBySections, tone);
    spinner.succeed(`All sections written: ${sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0)} words total`);

    // Step 4: Consolidate
    spinner.start('Consolidating and editing...');
    const consolidatedContent = await consolidateNewsletter(plan, sections, tone, topic);
    spinner.succeed('Newsletter consolidated');

    // Step 5: Generate metadata
    spinner.start('Generating title and metadata...');
    const subject = await generateTitle(consolidatedContent, topic);
    const previewText = await generatePreviewText(consolidatedContent);
    const citations = compileCitations(sections);
    spinner.succeed('Metadata generated');

    // Save draft
    const draft = {
      metadata: {
        topic,
        tone,
        audience,
        subject,
        previewText,
        createdAt: new Date().toISOString(),
        status: 'pending'
      },
      content: consolidatedContent,
      citations,
      plan
    };

    // Validate and enforce word count
    const minWords = config.get('newsletter.minWordCount') || 400;
    const maxWords = config.get('newsletter.maxWordCount') || 450;
    const validation = validateWordCount(draft.content, minWords, maxWords);
    
    // Record word count for monitoring
    recordWordCount('generated', validation.wordCount, 'generated');
    
    // Enforce word count if over limit
    if (validation.overLimit) {
      console.log(chalk.red(`\n⚠️  WARNING: Newsletter exceeds word limit by ${validation.wordCount - validation.maxWords} words!`));
      console.log(chalk.yellow('Content will be automatically trimmed.\n'));
      
      draft.content = enforceWordCount(draft.content);
      console.log(chalk.green(`✅ Content trimmed to ${draft.content.split(/\s+/).length} words\n`));
    } else if (validation.underLimit) {
      console.log(chalk.yellow(`\n⚠️  WARNING: Newsletter is ${validation.minWords - validation.wordCount} words under the minimum limit.\n`));
    } else {
      console.log(chalk.green(`\n✅ Word count is within acceptable range (${validation.wordCount} words)\n`));
    }

    const filename = `newsletter-${sanitizeFilename(topic)}-${formatTimestamp()}.json`;
    const draftPath = join(draftsDir, filename);
    writeFileSync(draftPath, JSON.stringify(draft, null, 2));
    
    logger.info('Newsletter draft created', { filename, draftPath });

    console.log(chalk.green('\n🎉 Newsletter ready!\n'));
    console.log(chalk.bold('Subject: ') + chalk.cyan(subject));
    console.log(chalk.bold('Word count: ') + chalk.cyan(draft.content.split(/\s+/).length));
    console.log(chalk.bold('Target range: ') + chalk.cyan(`${minWords}-${maxWords} words`));
    console.log(chalk.bold('Citations: ') + chalk.cyan(citations.length));
    console.log(chalk.dim(`\nDraft saved: ${filename}\n`));

    // Launch preview server
    console.log(chalk.yellow('Opening preview...\n'));
    
    const previewServer = new PreviewServer(draftPath);
    await previewServer.start();

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    logger.error('Newsletter generation failed', { error: error.message, stack: error.stack });
    
    if (error.message.includes('API key')) {
      console.log(chalk.yellow('\n💡 Make sure your API keys are configured in .env\n'));
    }
    
    process.exit(1);
  }
}

generateAtlasNewsletter();
