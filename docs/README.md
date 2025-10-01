# SIRA Newsletter Documentation

Welcome to the SIRA Newsletter documentation! This is your comprehensive guide to understanding, setting up, and using the AI-powered newsletter automation system.

## 📚 Documentation Structure

### 🚀 Setup & Getting Started
Start here if you're new to the project:

- **[START_HERE.md](setup/START_HERE.md)** - Your first stop! Quick orientation guide
- **[GETTING_STARTED.md](setup/GETTING_STARTED.md)** - Complete setup walkthrough
- **[SETUP.md](setup/SETUP.md)** - Detailed installation instructions
- **[WELCOME.md](setup/WELCOME.md)** - Welcome guide and overview
- **[QUICK_START_OLLAMA.md](setup/QUICK_START_OLLAMA.md)** - Quick start with Ollama (local LLM)
- **[OLLAMA_SETUP.md](setup/OLLAMA_SETUP.md)** - Detailed Ollama configuration
- **[NO_SEARCH_SETUP.md](setup/NO_SEARCH_SETUP.md)** - Setup without search functionality

### 📖 User Guides
How-to guides and references for common tasks:

- **[QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)** - Quick command and feature reference
- **[SUBSCRIBER_MANAGEMENT.md](guides/SUBSCRIBER_MANAGEMENT.md)** - Managing your subscriber list
- **[FOOTER_CONFIG.md](guides/FOOTER_CONFIG.md)** - Customizing email footers

### 🏗️ Architecture & Technical Details
Understanding how the system works:

- **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** - System architecture and design
- **[PROJECT_SUMMARY.md](architecture/PROJECT_SUMMARY.md)** - High-level project overview
- **[WHAT_WAS_BUILT.md](architecture/WHAT_WAS_BUILT.md)** - Complete feature inventory
- **[INDEX.md](INDEX.md)** - Original project index

### 📝 Changelog & Updates
Version history and recent changes:

- **[CHANGELOG.md](changelog/CHANGELOG.md)** - Version history
- **[CHANGES_SUMMARY.md](changelog/CHANGES_SUMMARY.md)** - Summary of recent changes
- **[LATEST_UPDATES.md](changelog/LATEST_UPDATES.md)** - Most recent updates
- **[BUILD_COMPLETE.md](changelog/BUILD_COMPLETE.md)** - Build completion notes
- **[AUTOMATION_FIX.md](changelog/AUTOMATION_FIX.md)** - Automation fixes
- **[UNSUBSCRIBE_UPDATE.md](changelog/UNSUBSCRIBE_UPDATE.md)** - Unsubscribe feature updates

## 🎯 Quick Navigation

### New User?
1. Read [START_HERE.md](setup/START_HERE.md)
2. Follow [GETTING_STARTED.md](setup/GETTING_STARTED.md)
3. Check [QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)

### Need to...
- **Set up the system?** → [setup/](setup/)
- **Understand the architecture?** → [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md)
- **Manage subscribers?** → [guides/SUBSCRIBER_MANAGEMENT.md](guides/SUBSCRIBER_MANAGEMENT.md)
- **Customize email templates?** → [guides/FOOTER_CONFIG.md](guides/FOOTER_CONFIG.md)
- **See what's new?** → [changelog/LATEST_UPDATES.md](changelog/LATEST_UPDATES.md)

### Developer?
- System architecture: [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md)
- What was built: [architecture/WHAT_WAS_BUILT.md](architecture/WHAT_WAS_BUILT.md)
- Project overview: [architecture/PROJECT_SUMMARY.md](architecture/PROJECT_SUMMARY.md)

## 🔑 Key Concepts

### AI Pipeline
The system uses a 4-stage AI pipeline:
1. **Planner** - Creates content outline
2. **Researcher** - Gathers information
3. **Writer** - Drafts content
4. **Editor** - Refines and finalizes

### AI Providers
- **Anthropic Claude** - Cloud-based, high quality
- **Ollama** - Local LLM, privacy-focused, free

### Subscriber Management
- Import from CSV
- Web-based unsubscribe
- SQLite database + JSON backup
- Status tracking (active/unsubscribed)

### Email System
- Gmail API integration
- Handlebars templates
- Preview server for testing
- Draft system before sending

## 🛠️ Common Commands

```bash
# Generate newsletter
npm run generate

# Send test email
npm run test-send

# Start automated system
npm start

# Preview newsletter
npm run preview

# Manage subscribers
npm run manage-subscribers

# Import subscribers from CSV
npm run import-csv
```

## 📂 Project Structure

```
sira-newsletter/
├── src/
│   ├── ai/              - AI content generation
│   ├── email/           - Email sending & templates
│   ├── database/        - Subscriber database
│   ├── subscription/    - Subscription management
│   ├── scheduler/       - Automation & scheduling
│   └── utils/           - Utilities & helpers
├── docs/                - Documentation (you are here!)
├── drafts/              - Newsletter drafts
├── data/                - Subscriber data
├── config.json          - Main configuration
└── README.md            - Project README
```

## 🆘 Getting Help

If you're stuck:
1. Check the [QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)
2. Review relevant guides in [guides/](guides/)
3. Check [architecture/](architecture/) for technical details
4. Review [changelog/](changelog/) for recent updates

## 📄 License & Contributing

See the main [README.md](../README.md) in the project root for license and contribution guidelines.

---

**Last Updated**: October 2025

