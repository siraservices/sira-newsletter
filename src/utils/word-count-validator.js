import config from './config.js';
import logger from './logger.js';

export function validateWordCount(content, minWords, maxWords) {
  const wordCount = content.split(/\s+/).length;
  
  logger.info('Word count validation', { 
    wordCount, 
    minWords, 
    maxWords, 
    withinRange: wordCount >= minWords && wordCount <= maxWords 
  });
  
  return {
    wordCount,
    minWords,
    maxWords,
    withinRange: wordCount >= minWords && wordCount <= maxWords,
    overLimit: wordCount > maxWords,
    underLimit: wordCount < minWords
  };
}

export function trimContentToLimit(content, maxWords) {
  const words = content.split(/\s+/);
  
  if (words.length <= maxWords) {
    return content;
  }
  
  // Trim to maxWords and add ellipsis
  const trimmedWords = words.slice(0, maxWords);
  const trimmedContent = trimmedWords.join(' ') + '...';
  
  logger.warn('Content trimmed to word limit', { 
    originalWords: words.length, 
    trimmedWords: trimmedWords.length,
    maxWords 
  });
  
  return trimmedContent;
}

export function enforceWordCount(content) {
  const minWords = config.get('newsletter.minWordCount') || 400;
  const maxWords = config.get('newsletter.maxWordCount') || 450;
  
  const validation = validateWordCount(content, minWords, maxWords);
  
  if (validation.overLimit) {
    logger.warn('Newsletter exceeds word limit - trimming content', {
      wordCount: validation.wordCount,
      maxWords: validation.maxWords,
      excess: validation.wordCount - validation.maxWords
    });
    
    return trimContentToLimit(content, maxWords);
  }
  
  if (validation.underLimit) {
    logger.warn('Newsletter under word limit', {
      wordCount: validation.wordCount,
      minWords: validation.minWords,
      deficit: validation.minWords - validation.wordCount
    });
  }
  
  return content;
}
