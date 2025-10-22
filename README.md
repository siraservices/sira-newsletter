# 📰 Newsletter Automation System

An AI-powered newsletter generation system that runs locally and sends professional newsletters via Gmail. Go from idea to sent newsletter in under 5 minutes.

## ✨ Features

- **AI-Powered Content Generation**: Uses Claude (Anthropic) OR **Ollama (FREE local AI)** to plan, research, and write engaging newsletters
- **Web Research Integration**: Automatically finds and cites relevant sources using Brave Search API
- **Multiple Tone Presets**: Alex Hormozi (direct, ROI-focused) or Chris Williamson (thoughtful, research-driven) styles
- **Professional HTML Email Templates**: Mobile-responsive with dark mode support
- **Live Preview Server**: Review your newsletter before sending
- **Gmail Integration**: Send via Gmail API (free tier)
- **Automated Scheduling**: Optional cron scheduler for Monday 2 AM EST sends
- **100% Local**: All drafts and logs stored locally, no external database needed
- **Free Option**: Use Ollama for **$0 cost** (completely free!) or Claude for faster/higher quality

## 📚 Documentation

**🎉 NEW: System is configured and ready to use!**

### Quick Start
- **⚡ Ready to use?** See [`QUICK_START.md`](QUICK_START.md) - Get running in 5 minutes
- **📊 MVP Status?** Check [`MVP_STATUS.md`](MVP_STATUS.md) - Complete system overview
- **🚀 Ready to deploy?** Read [`MVP_GUIDE.md`](MVP_GUIDE.md) - Full feature guide

### Detailed Documentation
- **New to this project?** Start with [`docs/setup/START_HERE.md`](docs/setup/START_HERE.md)
- **Need setup help?** See [`docs/setup/GETTING_STARTED.md`](docs/setup/GETTING_STARTED.md)
- **Deploying to production?** Read [`docs/setup/PRODUCTION_DEPLOYMENT.md`](docs/setup/PRODUCTION_DEPLOYMENT.md)
- **Quick reference?** Check [`docs/guides/QUICK_REFERENCE.md`](docs/guides/QUICK_REFERENCE.md)
- **Architecture details?** Read [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
- **Full documentation index:** [`docs/README.md`](docs/README.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Gmail account
- **Choose your AI provider:**
  - **Option A (Paid):** Anthropic API key ([get here](https://console.anthropic.com)) - ~$0.10-0.25 per newsletter
  - **Option B (FREE):** Ollama local AI ([setup guide](OLLAMA_SETUP.md)) - $0 cost!
- Brave Search API key ([get here](https://brave.com/search/api)) - Free tier
- Google Cloud credentials for Gmail ([setup below](#gmail-setup)) - Free

### Installation

1. **Clone or download this project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here

SEARCH_PROVIDER=brave
BRAVE_API_KEY=your_brave_search_api_key_here

FROM_EMAIL=your-email@gmail.com
FROM_NAME=Your Newsletter Name
```

4. **Configure settings**

Edit `config.json` to customize:
- Default tone (hormozi, williamson, or custom)
- Target word count
- Number of sections
- Email recipients
- Scheduler settings

5. **Set up Gmail authentication** (one-time setup)

```bash
npm run auth
```

Follow the Gmail Setup section below for detailed instructions.

6. **Test your setup**

```bash
npm test
```

7. **Generate your first newsletter!**

```bash
npm run generate
```

## 🦙 Using Ollama (FREE Alternative)

**Want to run completely free?** You can use Ollama instead of Anthropic!

- ✅ **$0 cost** - No API fees
- ✅ **100% private** - Everything runs locally
- ✅ **No rate limits** - Generate unlimited newsletters

**Quick setup:**
```bash
# 1. Install Ollama
curl https://ollama.ai/install.sh | sh  # Mac/Linux
# Or download from: https://ollama.ai/download (Windows)

# 2. Download a model
ollama pull llama3.1:8b

# 3. Configure
# Edit .env: AI_PROVIDER=ollama

# 4. Test
npm run test-ollama

# 5. Generate!
npm run generate
```

**See the full guide:** [OLLAMA_SETUP.md](OLLAMA_SETUP.md)

---

## 📧 Gmail Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Newsletter Automation"

### Step 2: Enable Gmail API

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search for "Gmail API"
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in required fields (app name, support email)
   - Add your email to test users
   - Save and continue
4. Back to Create OAuth client ID:
   - Application type: **Desktop app**
   - Name: "Newsletter Automation"
   - Click **Create**
5. Download the credentials JSON file
6. Save it as `credentials.json` in your project root

### Step 4: Authenticate

Run the authentication setup:
```bash
npm run auth
```

This will:
- Open your browser for Google OAuth
- Request permission to send emails via your Gmail account
- Save a refresh token to `token.json`

**You only need to do this once.** The token will be refreshed automatically.

### Step 5: Test Email Sending

```bash
npm run test-send
```

This sends a test email to yourself. Check your inbox to confirm it works!

## 🎯 Usage

### Generate a Newsletter

```bash
npm run generate
```

You'll be prompted for:
1. **Topic**: "The AI Mistake Costing Small Businesses $100K"
2. **Tone**: Select Alex Hormozi, Chris Williamson, or Custom
3. **Audience**: "Small business owners (1-50 employees)"

The system will:
1. Plan the newsletter structure (3-4 sections)
2. Research each topic with web searches
3. Write all sections in parallel
4. Consolidate and edit for consistency
5. Generate a compelling subject line
6. Open a preview in your browser

### Preview and Send

After generation, a browser window opens showing:
- **HTML preview** (what recipients will see)
- **Plain text version** (fallback)
- **Metadata** (subject length, word count, read time)
- **Citations** (all sources referenced)

Click **"Approve & Send"** to send immediately, or **"Cancel"** to discard.

### Scheduled Sending

To enable Monday 2 AM EST automated sends:

1. Edit `config.json`:
```json
{
  "scheduler": {
    "enabled": true,
    "cronPattern": "0 2 * * 1",
    "timezone": "America/New_York"
  }
}
```

2. Start the scheduler:
```bash
npm run schedule
```

The scheduler will:
- Check for approved drafts every Monday at 2 AM EST
- Send any newsletters with status "approved"
- Log all activities
- Email you a confirmation

To approve a draft for scheduled sending, manually edit the draft JSON file and set `metadata.status` to `"approved"`.

## 📁 Project Structure

```
newsletter-automation/
├── src/
│   ├── cli/
│   │   └── trigger.js           # Main CLI interface
│   ├── ai/
│   │   ├── planner.js           # Newsletter structure planning
│   │   ├── researcher.js        # Web research with Brave/Serper
│   │   ├── writer.js            # Content generation
│   │   └── editor.js            # Consolidation & editing
│   ├── email/
│   │   ├── templates/
│   │   │   └── newsletter.hbs   # Handlebars email template
│   │   ├── template-renderer.js # HTML rendering
│   │   ├── gmail.js             # Gmail API wrapper
│   │   ├── sender.js            # Email sending logic
│   │   ├── setup-auth.js        # OAuth setup script
│   │   └── test-send.js         # Test email sender
│   ├── preview/
│   │   ├── server.js            # Express preview server
│   │   └── public/
│   │       └── preview.html     # Preview interface
│   ├── scheduler/
│   │   └── cron.js              # Cron scheduler
│   ├── test/
│   │   └── integration.js       # Integration tests
│   └── utils/
│       ├── config.js            # Configuration manager
│       ├── logger.js            # Winston logger
│       └── helpers.js           # Utility functions
├── drafts/                       # Generated newsletter drafts (JSON)
├── logs/                         # Execution logs
├── .env                          # Environment variables (API keys)
├── .env.example                  # Environment template
├── config.json                   # User preferences
├── credentials.json              # Gmail OAuth credentials (download from Google)
├── token.json                    # Gmail refresh token (auto-generated)
├── package.json
└── README.md
```

## ⚙️ Configuration

### config.json

```json
{
  "ai": {
    "provider": "anthropic",              // anthropic or openai
    "model": "claude-sonnet-4-5-20250929",
    "temperature": 0.7,                   // 0-1, higher = more creative
    "maxTokens": 4000
  },
  "email": {
    "from": "your-email@gmail.com",
    "fromName": "Your Newsletter",
    "recipients": [],                     // Add recipient emails
    "testMode": true,                     // false to send to all recipients
    "testRecipient": "your-email@gmail.com"
  },
  "search": {
    "provider": "brave",                  // brave or serper
    "maxResults": 5,
    "timeout": 5000
  },
  "newsletter": {
    "defaultTone": "hormozi",             // hormozi, williamson, or custom
    "targetWordCount": 900,               // Total words across all sections
    "sectionsCount": 4                    // Number of sections
  },
  "scheduler": {
    "enabled": false,                     // true to enable cron
    "cronPattern": "0 2 * * 1",          // Monday 2 AM
    "timezone": "America/New_York"
  },
  "preview": {
    "port": 3000,
    "autoOpen": true,                     // Auto-open browser
    "timeout": 1800000                    // 30 min timeout
  }
}
```

### Tone Presets

**Alex Hormozi**
- Direct and punchy
- ROI-focused with specific numbers
- Actionable frameworks
- Short sentences, no fluff

**Chris Williamson**
- Thoughtful and nuanced
- Research-backed insights
- Explores multiple perspectives
- Engaging questions

**Custom**
- Professional and informative
- Clear and concise
- Data-supported
- Practical value

## 📊 Cost Breakdown

All services used have generous free tiers:

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|------------------------|
| Anthropic Claude API | Pay-as-you-go | ~$2-5 for 10-20 newsletters |
| Brave Search API | 2,000 queries/month | $0 (well within limits) |
| Gmail API | Unlimited | $0 |
| Node.js (local) | - | $0 |

**Total estimated cost**: $2-5/month for active use

## 🔧 Troubleshooting

### "credentials.json not found"

Download OAuth credentials from Google Cloud Console and save as `credentials.json` in the project root.

### "token.json not found"

Run `npm run auth` to authenticate with Gmail.

### "API key not set"

Check your `.env` file. Make sure:
- No extra spaces around `=`
- API keys are complete
- File is named `.env` (not `.env.txt`)

### Email not rendering correctly

The template is tested with:
- Gmail (web, iOS, Android)
- Outlook (web, desktop)
- Apple Mail

If issues persist, check the HTML in `/src/email/templates/newsletter.hbs`

### Newsletter feels off-tone

Try adjusting in `config.json`:
- Increase `temperature` for more creativity (0.8-0.9)
- Decrease for more consistency (0.5-0.6)
- Edit tone guidelines in `config.json` → `tones` section

### Search results not relevant

- Use more specific research queries
- Try different search provider (brave vs serper)
- Edit `researchQueries` in the planner prompt

## 🛡️ Security & Privacy

- **API keys**: Stored in `.env`, never committed to git
- **Gmail tokens**: Stored locally in `token.json`
- **Drafts**: All data stays on your machine
- **No external database**: Everything is local JSON files
- **OAuth 2.0**: Secure Gmail authentication with refresh tokens

**Important**: Never commit `.env`, `credentials.json`, or `token.json` to version control!

## 🧪 Testing

Run the integration test to verify setup:
```bash
npm test
```

This checks:
- Configuration files exist
- API keys are set
- Gmail authentication is complete
- Required directories exist

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate a new newsletter (interactive CLI) |
| `npm run preview` | Preview the most recent draft |
| `npm run test-send` | Send a test email to yourself |
| `npm run auth` | Set up Gmail OAuth (one-time) |
| `npm run schedule` | Start the cron scheduler |
| `npm test` | Run integration tests |

## 🎨 Customization

### Modify Email Template

Edit `src/email/templates/newsletter.hbs` to change:
- Colors and branding
- Layout and structure
- Typography
- Footer content

The template uses inline CSS for maximum email client compatibility.

### Add New Tone Preset

In `config.json`, add to the `tones` object:
```json
"professional": {
  "name": "Professional",
  "description": "Formal, data-driven business writing",
  "guidelines": "Write in a professional tone with formal language..."
}
```

### Change AI Provider

To use OpenAI instead of Anthropic:

1. Update `.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
```

2. Update `config.json`:
```json
"ai": {
  "provider": "openai",
  "model": "gpt-4",
  ...
}
```

## 🚢 Deployment Options

This runs locally by default, but you can deploy to:

### Run on a VPS (Digital Ocean, Linode, etc.)
- Set up Node.js on the server
- Use `pm2` to keep scheduler running
- Configure cron jobs for automated sends

### Run on Raspberry Pi
- Perfect for 24/7 scheduled sends
- Low power consumption
- Same setup as local

### GitHub Actions (Advanced)
- Trigger newsletter generation via workflow
- Store credentials in GitHub Secrets
- Schedule runs with GitHub Actions cron

## 🤝 Contributing

This is a template project. Feel free to:
- Fork and customize
- Add new features
- Improve prompts
- Share your improvements

## 📄 License

MIT License - feel free to use and modify for your needs.

## 🙏 Acknowledgments

Built with:
- [Anthropic Claude](https://www.anthropic.com/) for AI generation
- [Brave Search API](https://brave.com/search/api) for web research
- [Gmail API](https://developers.google.com/gmail/api) for email sending
- [Express](https://expressjs.com/) for preview server
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) for CLI interface
- [Handlebars](https://handlebarsjs.com/) for email templates

---

**Questions or issues?** Check the troubleshooting section or review the logs in `logs/combined.log`.

**Ready to send your first newsletter?** Run `npm run generate` and let AI do the heavy lifting! 🚀
