import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { callAI } from './providers/index.js';

export async function consolidateNewsletter(plan, sections, tone, topic) {
  logger.info('Consolidating newsletter');

  const toneGuidelines = config.get(`tones.${tone}.guidelines`) || config.get('tones.custom.guidelines');
  const toneStructure = config.get(`tones.${tone}.structure`);
  
  const sectionsContent = sections.map(s => s.content).join('\n\n');
  
  let prompt;
  
  if (tone === 'hormozi' && toneStructure) {
    // Hormozi-specific format
    prompt = `You are Alex Hormozi writing a SHORT email. Format EXACTLY like this:

**Words I like:** [punchy quote about ${topic}]

**[Create a compelling title about ${topic} - be specific with numbers or results]**

[Brief personal story or context in 1-2 sentences with specific numbers]

${sectionsContent}

[Brief conclusion with action step - 1 sentence]

Julio

PS - [teaser or additional actionable tip]

CRITICAL Requirements:
- MAXIMUM 250 WORDS TOTAL for the entire email
- Use numbered lists (1. 2. 3. etc.)
- Include specific numbers and percentages
- Keep sentences short and punchy
- Absolutely NO fluff - cut everything unnecessary
- Direct and actionable
- Plain text format (no markdown headers, just bold for titles)
- Make the title specific to the topic with numbers/results
- Be EXTREMELY concise - every word must earn its place
- DO NOT include a date at the top - the system will add that automatically`;
  } else {
    // Default format
    prompt = `You are an expert newsletter editor. Consolidate and polish this newsletter.

Topic: ${topic}
Tone: ${toneGuidelines}
Hook: ${plan.hook}
CTA: ${plan.cta}

Current Sections:
${sectionsContent}

Tasks:
1. Add a compelling introduction using the hook
2. Ensure consistent voice across all sections
3. Remove any redundancy between sections
4. Smooth transitions between sections
5. Add a strong conclusion with the CTA

Output the complete newsletter in markdown format.`;
  }

  try {
    const consolidated = await callAI(prompt, {
      maxTokens: config.get('ai.maxTokens'),
      temperature: config.get('ai.temperature') * 0.8
    });

    logger.info('Newsletter consolidated');

    // For Hormozi style, prepend date and AI disclosure
    if (tone === 'hormozi' && toneStructure) {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return `${currentDate}\n*This newsletter was generated with AI*\n\n${consolidated}`;
    }

    return consolidated;
  } catch (error) {
    logger.error('Error consolidating newsletter', { error: error.message });
    throw new Error(`Failed to consolidate newsletter: ${error.message}`);
  }
}

export async function generateTitle(content, topic) {
  logger.info('Generating title');

  const prompt = `Create a compelling newsletter subject line for this content.

Topic: ${topic}

Content preview:
${content.substring(0, 500)}...

Requirements:
- Under 60 characters (ideal for email preview)
- Intriguing and click-worthy
- Specific and clear
- No clickbait
- Numbers or specific claims work well

Output ONLY the subject line, nothing else.`;

  try {
    const title = await callAI(prompt, {
      maxTokens: 100,
      temperature: 0.9 // Higher creativity for titles
    });
    
    const cleanTitle = title.trim().replace(/^["']|["']$/g, '');

    logger.info('Title generated', { title: cleanTitle });
    return cleanTitle;
  } catch (error) {
    logger.error('Error generating title', { error: error.message });
    return topic; // Fallback to topic
  }
}

export async function generatePreviewText(content) {
  logger.info('Generating preview text');

  const prompt = `Create preview text for this newsletter (the text that shows in email previews).

Content:
${content.substring(0, 300)}...

Requirements:
- 40-100 characters
- Complements the subject line
- Teases the value inside
- Conversational tone

Output ONLY the preview text, nothing else.`;

  try {
    const previewText = await callAI(prompt, {
      maxTokens: 100,
      temperature: 0.8
    });
    
    const cleanPreview = previewText.trim().replace(/^["']|["']$/g, '');

    logger.info('Preview text generated');
    return cleanPreview;
  } catch (error) {
    logger.error('Error generating preview text', { error: error.message });
    return content.substring(0, 100).trim() + '...';
  }
}

export function compileCitations(sections) {
  const allCitations = [];
  const citationMap = new Map();
  
  sections.forEach(section => {
    if (section.citations) {
      section.citations.forEach(citation => {
        if (!citationMap.has(citation.number)) {
          citationMap.set(citation.number, citation);
          allCitations.push(citation);
        }
      });
    }
  });

  return allCitations.sort((a, b) => a.number - b.number);
}
