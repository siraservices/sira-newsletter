import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { callAI } from './providers/index.js';

export async function planNewsletter(topic, tone, audience) {
  logger.info('Planning newsletter', { topic, tone, audience });

  const toneGuidelines = config.get(`tones.${tone}.guidelines`) || config.get('tones.custom.guidelines');
  const sectionsCount = config.get('newsletter.sectionsCount');
  const targetWordCount = config.get('newsletter.targetWordCount');

  const prompt = `You are a newsletter content strategist. Plan a SHORT, CONCISE newsletter.

Topic: ${topic}
Tone: ${tone} (${toneGuidelines})
Audience: ${audience}

CRITICAL: Total newsletter must be MAXIMUM ${targetWordCount} words including all sections.

Create an outline with ${sectionsCount} BRIEF sections. Each section needs:
1. Section title (compelling and specific)
2. 2-3 key points ONLY (be concise!)
3. Specific research queries needed
4. Target word count (TOTAL across ALL sections must not exceed ${targetWordCount} words)

RESPOND WITH ONLY VALID JSON - NO MARKDOWN, NO CODE BLOCKS, NO EXPLANATIONS.

Required JSON structure:
{
  "hook": "Opening line - punchy and specific",
  "sections": [
    {
      "title": "Section title",
      "keyPoints": ["point1", "point2"],
      "researchQueries": ["query1", "query2"],
      "targetWords": ${Math.floor(targetWordCount / sectionsCount)}
    }
  ],
  "cta": "Call to action - specific and brief"
}

RULES:
- Output ONLY the JSON object
- Use double quotes for all strings
- No trailing commas
- No comments
- Keep sections SHORT - Maximum ${targetWordCount} words total`;

  try {
    const result = await callAI(prompt, {
      maxTokens: config.get('ai.maxTokens'),
      temperature: config.get('ai.temperature'),
      format: 'json'  // Force JSON output for compatible providers
    });

    // Parse JSON from response with better cleaning
    let jsonString = result.trim();
    
    // Extract JSON from markdown code blocks if present
    const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    }
    
    // Extract JSON object - find the complete object
    const startIdx = jsonString.indexOf('{');
    if (startIdx === -1) {
      throw new Error('No JSON found in AI response');
    }
    
    // Find the matching closing brace
    let braceCount = 0;
    let endIdx = -1;
    let inString = false;
    let escapeNext = false;
    
    for (let i = startIdx; i < jsonString.length; i++) {
      const char = jsonString[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }
    }
    
    if (endIdx === -1) {
      throw new Error('Incomplete JSON in AI response - could not find closing brace');
    }
    
    jsonString = jsonString.substring(startIdx, endIdx);
    
    // Clean up common JSON errors while preserving string content
    jsonString = jsonString
      .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
      .replace(/:\s*'([^']*)'/g, ': "$1"');  // Replace single quotes with double quotes in values

    let plan;
    try {
      plan = JSON.parse(jsonString);
    } catch (parseError) {
      // Log the problematic JSON for debugging
      logger.error('JSON parse error', { 
        error: parseError.message, 
        jsonString: jsonString.substring(0, 500) 
      });
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }
    
    // Validate plan structure
    if (!plan.hook || !plan.sections || !Array.isArray(plan.sections)) {
      throw new Error('Invalid plan structure - missing required fields');
    }

    // Ensure all sections have required fields
    plan.sections = plan.sections.map((section, idx) => ({
      title: section.title || `Section ${idx + 1}`,
      keyPoints: Array.isArray(section.keyPoints) ? section.keyPoints : [],
      researchQueries: Array.isArray(section.researchQueries) ? section.researchQueries : [],
      targetWords: section.targetWords || Math.floor(targetWordCount / sectionsCount)
    }));

    logger.info('Newsletter plan created', { 
      sectionsCount: plan.sections.length,
      hook: plan.hook.substring(0, 50)
    });

    return plan;
  } catch (error) {
    logger.error('Error planning newsletter', { error: error.message });
    throw new Error(`Failed to plan newsletter: ${error.message}`);
  }
}
