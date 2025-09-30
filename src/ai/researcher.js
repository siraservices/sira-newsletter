import axios from 'axios';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { sleep } from '../utils/helpers.js';

export async function researchQueries(queries) {
  logger.info('Starting research', { queryCount: queries.length });

  const provider = config.getEnv('SEARCH_PROVIDER', 'none');
  const apiKey = provider === 'brave' ? config.getEnv('BRAVE_API_KEY') : config.getEnv('SERPER_API_KEY');
  
  // If no API key or provider is 'none', skip search
  if (provider === 'none' || !apiKey) {
    logger.info('Web search disabled, using AI knowledge only');
    return queries.map(query => ({
      query,
      results: [],
      skipped: true,
      reason: 'Web search disabled - using AI knowledge'
    }));
  }

  const results = [];

  for (const query of queries) {
    try {
      const searchResults = await searchWithProvider(query, provider);
      results.push({
        query,
        results: searchResults
      });
      
      // Rate limiting
      await sleep(1000);
    } catch (error) {
      logger.error('Search failed for query', { query, error: error.message });
      results.push({
        query,
        results: [],
        error: error.message
      });
    }
  }

  logger.info('Research completed', { queriesProcessed: results.length });
  return results;
}

async function searchWithProvider(query, provider) {
  const maxResults = config.get('search.maxResults');

  if (provider === 'none') {
    return [];
  } else if (provider === 'brave') {
    return await searchBrave(query, maxResults);
  } else if (provider === 'serper') {
    return await searchSerper(query, maxResults);
  } else {
    throw new Error(`Unknown search provider: ${provider}`);
  }
}

async function searchBrave(query, maxResults) {
  const apiKey = config.getEnv('BRAVE_API_KEY');
  if (!apiKey) {
    throw new Error('BRAVE_API_KEY not set');
  }

  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: {
        q: query,
        count: maxResults
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      },
      timeout: config.get('search.timeout')
    });

    if (!response.data.web?.results) {
      return [];
    }

    return response.data.web.results.map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.description,
      relevanceScore: calculateRelevance(query, result.title + ' ' + result.description)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    logger.error('Brave search error', { error: error.message });
    throw error;
  }
}

async function searchSerper(query, maxResults) {
  const apiKey = config.getEnv('SERPER_API_KEY');
  if (!apiKey) {
    throw new Error('SERPER_API_KEY not set');
  }

  try {
    const response = await axios.post(
      'https://google.serper.dev/search',
      {
        q: query,
        num: maxResults
      },
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: config.get('search.timeout')
      }
    );

    if (!response.data.organic) {
      return [];
    }

    return response.data.organic.map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
      relevanceScore: calculateRelevance(query, result.title + ' ' + result.snippet)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    logger.error('Serper search error', { error: error.message });
    throw error;
  }
}

function calculateRelevance(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  
  let score = 0;
  for (const word of queryWords) {
    if (word.length < 3) continue;
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length;
    score += matches;
  }
  
  return score;
}

export function formatResearchForWriter(researchResults) {
  return researchResults.map(({ query, results }) => {
    const formattedResults = results.slice(0, 3).map((result, idx) => ({
      citation: idx + 1,
      title: result.title,
      url: result.url,
      snippet: result.snippet
    }));

    return {
      query,
      sources: formattedResults
    };
  });
}
