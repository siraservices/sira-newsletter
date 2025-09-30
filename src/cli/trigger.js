#!/usr/bin/env node

import inquirer from 'inquirer';
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

console.log(chalk.bold.blue('\n📰 Newsletter Generator'));
console.log(chalk.dim('━━━━━━━━━━━━━━━━━━━━\n'));

async function generate() {
  try {
    // Prompt for inputs
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'topic',
        message: 'Newsletter topic:',
        validate: input => input.length > 0 || 'Topic is required'
      },
      {
        type: 'list',
        name: 'tone',
        message: 'Select tone:',
        choices: [
          { name: '1️⃣  Alex Hormozi (Direct, ROI-focused)', value: 'hormozi' },
          { name: '2️⃣  Chris Williamson (Thoughtful, research-driven)', value: 'williamson' },
          { name: '3️⃣  Custom', value: 'custom' }
        ],
        default: config.get('newsletter.defaultTone')
      },
      {
        type: 'input',
        name: 'audience',
        message: 'Target audience:',
        default: 'Professionals interested in growth and productivity',
        validate: input => input.length > 0 || 'Audience is required'
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Generate newsletter with these settings?',
        default: true
      }
    ]);

    if (!answers.confirm) {
      console.log(chalk.yellow('\n❌ Cancelled\n'));
      process.exit(0);
    }

    const { topic, tone, audience } = answers;

    // Create drafts directory if needed
    const draftsDir = config.getDraftsDir();
    if (!existsSync(draftsDir)) {
      mkdirSync(draftsDir, { recursive: true });
    }

    console.log('');

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

    const filename = `newsletter-${sanitizeFilename(topic)}-${formatTimestamp()}.json`;
    const draftPath = join(draftsDir, filename);
    writeFileSync(draftPath, JSON.stringify(draft, null, 2));
    
    logger.info('Newsletter draft created', { filename, draftPath });

    console.log(chalk.green('\n🎉 Newsletter ready!\n'));
    console.log(chalk.bold('Subject: ') + chalk.cyan(subject));
    console.log(chalk.bold('Word count: ') + chalk.cyan(draft.content.split(/\s+/).length));
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

generate();
