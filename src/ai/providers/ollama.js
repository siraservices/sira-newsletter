import axios from 'axios';
import config from '../../utils/config.js';
import logger from '../../utils/logger.js';
import { retry } from '../../utils/helpers.js';

/**
 * Ollama API Provider
 * Uses local Ollama instance (OpenAI-compatible API)
 */

export async function callOllama(prompt, options = {}) {
  const ollamaUrl = config.getEnv('OLLAMA_URL', 'http://localhost:11434');
  const model = config.get('ai.model') || 'llama3.1:8b';
  const temperature = options.temperature ?? config.get('ai.temperature');
  const maxTokens = options.maxTokens ?? config.get('ai.maxTokens');

  logger.info('Calling Ollama', { model, promptLength: prompt.length });

  try {
    const result = await retry(async () => {
      const requestBody = {
        model,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens
        }
      };
      
      // Add JSON format if the prompt is requesting JSON output
      if (options.format === 'json' || prompt.toLowerCase().includes('json')) {
        requestBody.format = 'json';
      }
      
      const response = await axios.post(`${ollamaUrl}/api/generate`, requestBody, {
        timeout: 120000, // 2 minutes timeout for local models
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response from Ollama');
      }

      return response.data.response;
    });

    logger.info('Ollama response received', { 
      responseLength: result.length 
    });

    return result;
  } catch (error) {
    logger.error('Ollama API error', { error: error.message });
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running: ollama serve');
    }
    
    throw error;
  }
}

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaStatus() {
  const ollamaUrl = config.getEnv('OLLAMA_URL', 'http://localhost:11434');
  
  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`, {
      timeout: 5000
    });
    
    return {
      running: true,
      models: response.data.models || []
    };
  } catch (error) {
    return {
      running: false,
      error: error.message
    };
  }
}

/**
 * List available Ollama models
 */
export async function listOllamaModels() {
  const ollamaUrl = config.getEnv('OLLAMA_URL', 'http://localhost:11434');
  
  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`);
    return response.data.models || [];
  } catch (error) {
    logger.error('Failed to list Ollama models', { error: error.message });
    return [];
  }
}
