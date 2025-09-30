# 🏗️ Architecture Documentation

## System Overview

The Newsletter Automation System is a Node.js application that generates AI-powered newsletters using a multi-stage pipeline approach.

```
┌─────────────┐
│   CLI       │  User inputs topic, tone, audience
│  Interface  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         AI Planning Stage               │
│  • Analyzes topic and audience          │
│  • Creates 3-4 section outline          │
│  • Generates research queries           │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Web Research Stage                 │
│  • Executes search queries in parallel  │
│  • Scores results by relevance          │
│  • Extracts citations                   │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Content Generation Stage           │
│  • Writes all sections in parallel      │
│  • Applies tone guidelines              │
│  • Integrates citations                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Editing & Consolidation Stage      │
│  • Ensures consistent voice             │
│  • Smooths transitions                  │
│  • Generates title & preview text       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Template Rendering Stage           │
│  • Converts markdown to HTML            │
│  • Applies email-safe styles            │
│  • Renders Handlebars template          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Preview & Approval Stage           │
│  • Starts Express server                │
│  • Shows HTML + plain text preview      │
│  • Waits for user approval              │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Email Sending Stage                │
│  • Authenticates with Gmail API         │
│  • Sends to recipients                  │
│  • Logs results                         │
└─────────────────────────────────────────┘
```

## Component Breakdown

### 1. CLI Interface (`src/cli/trigger.js`)

**Purpose**: User interaction and workflow orchestration

**Flow**:
1. Prompts user for topic, tone, audience
2. Validates inputs
3. Orchestrates the entire generation pipeline
4. Saves draft to JSON
5. Launches preview server

**Key Functions**:
- `generate()`: Main entry point

### 2. AI Planner (`src/ai/planner.js`)

**Purpose**: Creates structured outline for the newsletter

**Input**:
- Topic (string)
- Tone (hormozi/williamson/custom)
- Audience (string)

**Output** (JSON):
```json
{
  "hook": "Opening line",
  "sections": [
    {
      "title": "Section title",
      "keyPoints": ["point1", "point2"],
      "researchQueries": ["query1"],
      "targetWords": 200
    }
  ],
  "cta": "Call to action"
}
```

**AI Prompt Strategy**:
- Provides context about tone and audience
- Requests specific structure (JSON)
- Emphasizes research query specificity

### 3. Web Researcher (`src/ai/researcher.js`)

**Purpose**: Finds relevant sources via search APIs

**Providers Supported**:
- Brave Search API (default)
- Serper API (Google results)

**Process**:
1. Execute search queries sequentially (rate limiting)
2. Score results by relevance (keyword matching)
3. Extract top N results per query
4. Format with citation numbers

**Output**:
```json
[
  {
    "query": "AI adoption statistics 2024",
    "sources": [
      {
        "citation": 1,
        "title": "Article title",
        "url": "https://...",
        "snippet": "Relevant text..."
      }
    ]
  }
]
```

### 4. Content Writer (`src/ai/writer.js`)

**Purpose**: Generates section content with citations

**Process**:
1. Takes one section plan + research data
2. Constructs detailed prompt with tone guidelines
3. Calls AI to generate markdown content
4. Extracts citation references [1], [2], etc.

**Parallelization**:
- All sections written simultaneously via `Promise.all()`
- Significantly reduces total generation time

**Output per Section**:
```json
{
  "title": "Section title",
  "content": "Markdown content with [1] citations",
  "citations": [
    { "number": 1, "title": "...", "url": "..." }
  ]
}
```

### 5. Editor/Consolidator (`src/ai/editor.js`)

**Purpose**: Polish and finalize the newsletter

**Functions**:
- `consolidateNewsletter()`: Merges sections, adds intro/conclusion
- `generateTitle()`: Creates compelling subject line
- `generatePreviewText()`: Email preview text
- `compileCitations()`: Deduplicates and sorts citations

**Strategy**:
- Lower temperature for consistency
- Preserves citation markers
- Maintains tone throughout

### 6. Email Template System

#### Template Renderer (`src/email/template-renderer.js`)

**Purpose**: Convert markdown to email-safe HTML

**Process**:
1. Parse markdown with `marked`
2. Add inline CSS to all HTML elements
3. Render Handlebars template
4. Generate plain text version

**Email Client Compatibility**:
- Inline CSS only (no external stylesheets)
- Table-based layout for Outlook
- Dark mode support via media queries
- Mobile-responsive design

#### Newsletter Template (`src/email/templates/newsletter.hbs`)

**Features**:
- Responsive grid layout
- Dark mode support
- Citation footer
- Unsubscribe link
- Preview text optimization

### 7. Gmail Integration (`src/email/gmail.js`)

**Authentication Flow**:
1. User runs `npm run auth` (one-time)
2. Browser opens to Google OAuth consent
3. User grants permissions
4. Refresh token saved to `token.json`
5. Token auto-refreshes on subsequent uses

**Sending Process**:
1. Initialize OAuth2 client with credentials
2. Load refresh token
3. Build MIME multipart message (HTML + plain text)
4. Base64 encode
5. Send via Gmail API
6. Handle rate limiting (100ms between sends)

**Security**:
- Credentials stored locally only
- OAuth 2.0 with offline access
- Scopes limited to sending only

### 8. Preview Server (`src/preview/server.js`)

**Purpose**: Local web interface for review and approval

**Endpoints**:
- `GET /` - Preview interface
- `GET /api/draft` - Draft data and rendered HTML
- `POST /api/approve` - Send newsletter
- `POST /api/cancel` - Cancel and close

**Features**:
- Auto-opens browser
- Real-time stats (word count, subject length, etc.)
- Side-by-side HTML/plain text view
- 30-minute auto-timeout

### 9. Scheduler (`src/scheduler/cron.js`)

**Purpose**: Automated newsletter sending

**Cron Pattern**: `0 2 * * 1` (Monday 2 AM)

**Process**:
1. Check `drafts/` folder for JSON files
2. Find drafts with `status: "approved"`
3. Send via Gmail API
4. Update status to `"sent"`
5. Log results
6. Send confirmation email to user

**Timezone Handling**:
- Uses `node-cron` with timezone support
- Configurable in `config.json`

## Data Flow

### Draft File Structure

```json
{
  "metadata": {
    "topic": "Original topic",
    "tone": "hormozi",
    "audience": "Target audience",
    "subject": "Email subject line",
    "previewText": "Email preview text",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "status": "pending | approved | sent",
    "sentAt": "2024-01-01T00:00:00.000Z",
    "sentResults": []
  },
  "content": "Full markdown content",
  "citations": [
    { "number": 1, "title": "...", "url": "..." }
  ],
  "plan": { /* Original plan from AI */ }
}
```

### Configuration Management

**config.json** - User preferences (committed to git)
**.env** - API keys and secrets (never committed)

Config is loaded via singleton pattern:
```javascript
import config from './utils/config.js';
config.get('email.from');
config.set('scheduler.enabled', true);
```

## Error Handling Strategy

### Retry Logic

All AI and API calls use exponential backoff:
```javascript
async function retry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### Graceful Degradation

- If search fails → Use AI's general knowledge
- If title generation fails → Use topic as fallback
- If preview text fails → Use truncated content

### Logging

Winston logger with multiple transports:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Format: JSON with timestamps for machine parsing

## Performance Optimizations

### Parallel Processing

Sections are written in parallel:
```javascript
const sections = await Promise.all(
  plan.sections.map(section => writeSection(section))
);
```

Typical speedup: 4 sections in ~30s vs ~2 minutes sequential

### Rate Limiting

- Search API: 1 second between queries
- Gmail API: 100ms between sends
- Respects free tier limits

### Caching

Currently none - potential future optimization:
- Cache search results for repeated queries
- Cache AI responses for similar sections

## Security Considerations

### API Key Protection

- Stored in `.env` (gitignored)
- Never logged or exposed in errors
- Loaded only at runtime

### Gmail Token Security

- `credentials.json` and `token.json` gitignored
- OAuth 2.0 with offline access
- Refresh token stored locally only
- Minimal scopes (send only)

### Input Validation

- Email addresses validated with regex
- File paths sanitized
- User inputs escaped before AI prompts

## Testing Strategy

### Integration Tests (`src/test/integration.js`)

Checks:
- Configuration files exist
- API keys are set
- Gmail authentication complete
- Required directories exist

### Manual Testing

- `npm run test-send` - Test Gmail sending
- `npm run generate` - End-to-end generation

### Future Test Ideas

- Unit tests for helpers
- Mock AI responses for faster tests
- Email rendering tests (snapshot)
- Spam score testing

## Extensibility

### Adding New AI Providers

1. Create provider module in `src/ai/`
2. Implement `callAI(prompt, options)` interface
3. Add to config switch in planner/writer/editor
4. Update docs

### Adding New Search Providers

1. Add provider function in `src/ai/researcher.js`
2. Return standardized format: `{ title, url, snippet }`
3. Add to provider switch
4. Update config

### Adding New Tone Presets

Simply add to `config.json`:
```json
"tones": {
  "mynewstyle": {
    "name": "My Style",
    "description": "...",
    "guidelines": "..."
  }
}
```

## Deployment Considerations

### Local Development
- Default mode
- All data local
- Manual triggers

### Server Deployment
- Use `pm2` for process management
- Set `NODE_ENV=production`
- Configure firewall for port 3000 (if remote preview needed)
- Set up logrotate for log files

### Scheduled Sends
- Run `npm run schedule` as background process
- Use systemd or supervisor for auto-restart
- Monitor logs for failures
- Set up email alerts

## Performance Metrics

Typical generation time (4 sections):
- Planning: ~5-10 seconds
- Research: ~15-20 seconds (rate limited)
- Writing: ~30-40 seconds (parallel)
- Editing: ~10-15 seconds
- **Total: 60-85 seconds**

## Future Enhancements

Potential improvements:
- [ ] A/B testing subject lines
- [ ] Image generation for newsletter headers
- [ ] Subscriber management system
- [ ] Analytics tracking (open rates, clicks)
- [ ] Template variations
- [ ] Multi-language support
- [ ] RSS feed integration
- [ ] Social media cross-posting

---

**For implementation details, see the inline code comments in each module.**
