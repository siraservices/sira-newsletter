import config from './config.js';
import logger from './logger.js';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const MONITOR_FILE = 'logs/word-count-monitor.json';

export function recordWordCount(draftPath, wordCount, status = 'generated') {
  const minWords = config.get('newsletter.minWordCount') || 400;
  const maxWords = config.get('newsletter.maxWordCount') || 450;
  
  const record = {
    timestamp: new Date().toISOString(),
    draftPath,
    wordCount,
    minWords,
    maxWords,
    status,
    withinRange: wordCount >= minWords && wordCount <= maxWords,
    overLimit: wordCount > maxWords,
    underLimit: wordCount < minWords,
    variance: wordCount - maxWords
  };
  
  // Load existing records
  let records = [];
  if (existsSync(MONITOR_FILE)) {
    try {
      records = JSON.parse(readFileSync(MONITOR_FILE, 'utf8'));
    } catch (error) {
      logger.warn('Could not load word count monitor file', { error: error.message });
    }
  }
  
  // Add new record
  records.push(record);
  
  // Keep only last 50 records
  if (records.length > 50) {
    records = records.slice(-50);
  }
  
  // Save records
  try {
    writeFileSync(MONITOR_FILE, JSON.stringify(records, null, 2));
    logger.info('Word count recorded', record);
  } catch (error) {
    logger.error('Could not save word count monitor file', { error: error.message });
  }
  
  return record;
}

export function getWordCountStats() {
  if (!existsSync(MONITOR_FILE)) {
    return null;
  }
  
  try {
    const records = JSON.parse(readFileSync(MONITOR_FILE, 'utf8'));
    
    if (records.length === 0) {
      return null;
    }
    
    const recentRecords = records.slice(-10); // Last 10 newsletters
    const overLimitCount = recentRecords.filter(r => r.overLimit).length;
    const underLimitCount = recentRecords.filter(r => r.underLimit).length;
    const withinRangeCount = recentRecords.filter(r => r.withinRange).length;
    
    const avgWordCount = recentRecords.reduce((sum, r) => sum + r.wordCount, 0) / recentRecords.length;
    const maxWordCount = Math.max(...recentRecords.map(r => r.wordCount));
    const minWordCount = Math.min(...recentRecords.map(r => r.wordCount));
    
    return {
      totalRecords: records.length,
      recentRecords: recentRecords.length,
      overLimitCount,
      underLimitCount,
      withinRangeCount,
      avgWordCount: Math.round(avgWordCount),
      maxWordCount,
      minWordCount,
      successRate: Math.round((withinRangeCount / recentRecords.length) * 100)
    };
  } catch (error) {
    logger.error('Could not load word count stats', { error: error.message });
    return null;
  }
}

export function generateWordCountReport() {
  const stats = getWordCountStats();
  
  if (!stats) {
    return 'No word count data available.';
  }
  
  return `
📊 Word Count Monitoring Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent Performance (Last ${stats.recentRecords} newsletters):
• Success Rate: ${stats.successRate}% (${stats.withinRangeCount}/${stats.recentRecords} within range)
• Average Word Count: ${stats.avgWordCount} words
• Range: ${stats.minWordCount} - ${stats.maxWordCount} words

Issues:
• Over Limit: ${stats.overLimitCount} newsletters
• Under Limit: ${stats.underLimitCount} newsletters

Target Range: 400-450 words
Total Records: ${stats.totalRecords}
  `.trim();
}
