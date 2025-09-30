# Changelog

## [1.0.0] - 2025-09-30

### Initial Release

#### ✨ Features

**Core Functionality**
- AI-powered newsletter generation with Claude (Anthropic)
- Web research integration with Brave Search API
- Multi-section content planning and generation
- Automated citation tracking and formatting
- Professional HTML email templates with dark mode support
- Local preview server with approval workflow
- Gmail API integration for email sending
- Automated scheduling with node-cron

**User Interface**
- Interactive CLI with inquirer prompts
- Live progress indicators with ora spinner
- Color-coded console output with chalk
- Browser-based preview interface

**Content Generation**
- Multiple tone presets (Alex Hormozi, Chris Williamson, Custom)
- Parallel section generation for faster processing
- Automated title and preview text generation
- Research-backed content with citations
- Markdown to HTML conversion

**Email System**
- Gmail OAuth 2.0 authentication
- Multi-part MIME emails (HTML + plain text)
- Mobile-responsive email templates
- Dark mode support for email clients
- Citation footer with working links
- Batch sending with rate limiting

**Automation**
- Cron-based scheduling for Monday 2 AM EST sends
- Draft status management (pending/approved/sent)
- Automatic notification emails
- Comprehensive logging with Winston

#### 🛠️ Technical Stack

- **Runtime:** Node.js 18+ (ES modules)
- **AI:** Anthropic Claude API (claude-sonnet-4-5-20250929)
- **Search:** Brave Search API
- **Email:** Gmail API with OAuth 2.0
- **Templating:** Handlebars
- **Markdown:** marked
- **Server:** Express.js
- **Scheduler:** node-cron
- **CLI:** inquirer, ora, chalk
- **Logging:** winston

#### 📦 Components

**AI Modules**
- Planner: Newsletter structure and outline generation
- Researcher: Web search and citation extraction
- Writer: Section content generation with citations
- Editor: Content consolidation and polishing

**Email Modules**
- Template renderer: Markdown to email-safe HTML
- Gmail client: OAuth authentication and sending
- Sender: Email preparation and delivery
- Templates: Responsive HTML email template

**Infrastructure**
- Config manager: JSON and environment variable management
- Logger: File and console logging
- Helper utilities: Date formatting, text processing, retry logic
- Preview server: Local web interface for review

**CLI & Automation**
- Trigger: Interactive newsletter generation
- Setup auth: Gmail OAuth configuration
- Test send: Email sending verification
- Scheduler: Automated weekly sends
- Integration tests: Setup verification

#### 📚 Documentation

- README.md: Comprehensive project documentation
- GETTING_STARTED.md: Step-by-step setup guide
- START_HERE.md: Quick start reference
- SETUP.md: Detailed setup instructions
- ARCHITECTURE.md: Technical architecture documentation
- CHANGELOG.md: Version history

#### 🔒 Security

- API keys stored in .env (gitignored)
- Gmail OAuth with refresh tokens
- Local-only data storage
- Minimal API scopes (send-only for Gmail)
- Input validation and sanitization

#### 📊 Configuration

**Default Settings**
- 4 sections per newsletter
- 900 word target
- Hormozi tone preset
- Test mode enabled
- Preview auto-open enabled
- Scheduler disabled by default

**Customizable Options**
- AI provider and model
- Search provider
- Email recipients
- Tone presets and guidelines
- Word count targets
- Section count
- Cron schedule
- Timezone

#### 🧪 Testing

- Integration test suite
- Test email sending script
- Configuration validation
- API key verification
- Gmail authentication check

#### 💰 Cost Optimization

- Uses only free API tiers
- Rate limiting for API compliance
- Parallel processing for efficiency
- Estimated cost: $2-5/month for regular use

#### 🎨 User Experience

- End-to-end generation in ~90 seconds
- User input to preview in under 4 minutes
- Auto-opening browser preview
- Real-time progress indicators
- Helpful error messages
- Comprehensive setup guides

---

### Known Limitations

- Gmail API has daily sending limits (free tier: ~500/day)
- Brave Search API: 2,000 queries/month free tier
- Anthropic API: Pay-as-you-go (no free tier)
- Requires manual approval for each newsletter (unless scheduled)
- No built-in subscriber management system
- No analytics/tracking (opens, clicks)

### Future Enhancements

Potential improvements for future versions:
- A/B testing for subject lines
- Image generation for headers
- Subscriber management dashboard
- Email analytics integration
- Template variations
- Multi-language support
- RSS feed integration
- Social media cross-posting
- Webhook integrations
- API for external triggers
