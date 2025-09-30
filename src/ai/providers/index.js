import config from '../../utils/config.js';
import logger from '../../utils/logger.js';
import { callAnthropic } from './anthropic.js';
import { callOllama } from './ollama.js';

/**
 * Universal AI API caller
 * Routes to the appropriate provider based on configuration
 */
export async function callAI(prompt, options = {}) {
  const provider = config.getEnv('AI_PROVIDER', 'anthropic');

  logger.info('Calling AI', { provider });

  switch (provider) {
    case 'anthropic':
      return await callAnthropic(prompt, options);
    
    case 'ollama':
      return await callOllama(prompt, options);
    
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

export { callAnthropic } from './anthropic.js';
export { callOllama, checkOllamaStatus, listOllamaModels } from './ollama.js';
