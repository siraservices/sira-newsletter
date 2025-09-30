# Newsletter Automation Fix

## Problem
The newsletter automation was failing with JSON parsing errors when using Ollama:
```
Error: Failed to plan newsletter: Expected ',' or ']' after array element in JSON
```

## Root Cause
1. Ollama was generating formatted JSON with inconsistent whitespace
2. The simple regex-based JSON extraction was cutting off incomplete JSON
3. No JSON format enforcement for Ollama API calls

## Fixes Applied

### 1. Improved JSON Extraction (`src/ai/planner.js`)
- **Better brace matching**: Implemented proper bracket counting algorithm that:
  - Tracks opening and closing braces
  - Handles escaped characters
  - Respects string boundaries
  - Extracts complete JSON objects even with whitespace
  
- **Safer cleaning**: 
  - Preserves newlines within strings
  - Only removes trailing commas
  - Handles single quotes conversion carefully

### 2. Ollama JSON Format Mode (`src/ai/providers/ollama.js`)
- Added automatic detection of JSON requests
- Sends `format: "json"` parameter to Ollama API
- Forces Ollama to output valid JSON structure

### 3. Better Error Handling
- Logs problematic JSON (first 500 chars) for debugging
- Validates plan structure with fallbacks
- Provides clearer error messages

## Testing
Try generating a newsletter:
```bash
npm run generate
```

The system should now:
1. ✅ Generate valid JSON from Ollama
2. ✅ Parse it correctly even with formatting
3. ✅ Handle edge cases gracefully
4. ✅ Provide better error messages if something fails

## Additional Notes

### If you still get errors:
1. **Check Ollama version**: Run `ollama --version` - you need v0.1.30+
2. **Update model**: Try `ollama pull llama3.2:latest`
3. **Check logs**: Look at `logs/error.log` for detailed error info
4. **Lower temperature**: In `config.json`, try setting `"temperature": 0.5`

### Alternative: Use Anthropic Claude
If Ollama continues to have issues, you can switch to Claude (more reliable JSON):
1. Get API key from https://console.anthropic.com
2. Create `.env` file:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your_key_here
   ```
3. Update `config.json`:
   ```json
   {
     "ai": {
       "provider": "anthropic",
       "model": "claude-sonnet-4-20250514"
     }
   }
   ```

## Files Modified
- ✅ `src/ai/planner.js` - Improved JSON parsing
- ✅ `src/ai/providers/ollama.js` - Added JSON format support
