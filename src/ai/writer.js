import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { callAI } from './providers/index.js';

export async function writeSection(section, researchData, tone, sectionIndex) {
  logger.info('Writing section', { title: section.title, sectionIndex });

  const toneGuidelines = config.get(`tones.${tone}.guidelines`) || config.get('tones.custom.guidelines');

  const researchContext = researchData && researchData.length > 0 && researchData.some(r => r.sources && r.sources.length > 0)
    ? formatResearchForPrompt(researchData)
    : 'No web search results available. Use your comprehensive knowledge base to provide accurate, up-to-date information on this topic. Include specific examples, statistics, and actionable insights based on widely known best practices and research.';

  const prompt = `Write a SHORT newsletter section with these specifications:

Section Plan:
${JSON.stringify(section, null, 2)}

Research Data:
${researchContext}

Tone Guidelines:
${toneGuidelines}

CRITICAL Requirements:
- MAXIMUM ${section.targetWords} words for this section
- Be EXTREMELY concise and direct
- Use specific examples and data from research when available
- Match the tone precisely
- NO fluff, get straight to the point
- Short, punchy sentences
- One key takeaway

Output in markdown format. Keep it BRIEF and impactful.`;

  try {
    const content = await callAI(prompt, {
      maxTokens: config.get('ai.maxTokens'),
      temperature: config.get('ai.temperature')
    });

    logger.info('Section written', { 
      title: section.title,
      wordCount: content.split(/\s+/).length 
    });

    return {
      title: section.title,
      content,
      citations: extractCitations(content, researchData)
    };
  } catch (error) {
    logger.error('Error writing section', { error: error.message, section: section.title });
    throw new Error(`Failed to write section: ${error.message}`);
  }
}

export async function generateAllSections(plan, researchDataBySections, tone) {
  logger.info('Generating all sections in parallel', { count: plan.sections.length });

  const sectionPromises = plan.sections.map((section, index) => 
    writeSection(section, researchDataBySections[index], tone, index)
  );

  const sections = await Promise.all(sectionPromises);
  
  logger.info('All sections generated', { count: sections.length });
  return sections;
}

function formatResearchForPrompt(researchData) {
  return researchData.map(({ query, sources }) => {
    const sourcesText = sources.map(source => 
      `[${source.citation}] ${source.title}\n   ${source.snippet}\n   Source: ${source.url}`
    ).join('\n\n');

    return `Query: ${query}\n${sourcesText}`;
  }).join('\n\n---\n\n');
}

function extractCitations(content, researchData) {
  const citations = [];
  const citationRegex = /\[(\d+)\]/g;
  const matches = [...content.matchAll(citationRegex)];

  const citationNumbers = [...new Set(matches.map(m => parseInt(m[1])))].sort((a, b) => a - b);

  for (const num of citationNumbers) {
    // Find the corresponding source
    if (researchData) {
      for (const research of researchData) {
        const source = research.sources?.find(s => s.citation === num);
        if (source) {
          citations.push({
            number: num,
            title: source.title,
            url: source.url
          });
          break;
        }
      }
    }
  }

  return citations;
}
