import Anthropic from '@anthropic-ai/sdk';
import config from '../../utils/config.js';
import logger from '../../utils/logger.js';
import { retry } from '../../utils/helpers.js';

const anthropic = new Anthropic({
  apiKey: config.getEnv('ANTHROPIC_API_KEY')
});

/**
 * Anthropic API Provider
 */
export async function callAnthropic(prompt, options = {}) {
  const model = config.get('ai.model') || 'claude-sonnet-4-5-20250929';
  const temperature = options.temperature ?? config.get('ai.temperature');
  const maxTokens = options.maxTokens ?? config.get('ai.maxTokens');

  logger.info('Calling Anthropic', { model, promptLength: prompt.length });

  try {
    const result = await retry(async () => {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.content[0].text;
    });

    logger.info('Anthropic response received', { 
      responseLength: result.length 
    });

    return result;
  } catch (error) {
    logger.error('Anthropic API error', { error: error.message });
    throw error;
  }
}
