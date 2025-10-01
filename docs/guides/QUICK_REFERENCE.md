# Quick Reference Guide

## Essential Commands

```bash
# Generate a newsletter (main command)
npm run generate

# Preview latest draft
npm run preview

# Send test email
npm run test-send

# Set up Gmail (first time only)
npm run auth

# Start automated scheduler
npm run schedule

# Verify setup
npm test
```

## File Locations

```
Configuration:
  .env                    API keys and secrets
  config.json            User preferences

Gmail Setup:
  credentials.json       OAuth credentials (download from Google)
  token.json            Refresh token (auto-generated)

Output:
  drafts/               Generated newsletters (JSON)
  logs/                 Application logs

Templates:
  src/email/templates/  Email HTML templates
```

## Configuration Quick Edit

### Change Email Recipients

Edit `config.json`:
```json
{
  "email": {
    "recipients": ["email1@example.com", "email2@example.com"],
    "testMode": false
  }
}
```

### Change Default Tone

Edit `config.json`:
```json
{
  "newsletter": {
    "defaultTone": "hormozi"  // or "williamson" or "custom"
  }
}
```

### Enable Automated Sending

Edit `config.json`:
```json
{
  "scheduler": {
    "enabled": true,
    "cronPattern": "0 2 * * 1",  // Monday 2 AM
    "timezone": "America/New_York"
  }
}
```

### Adjust AI Creativity

Edit `config.json`:
```json
{
  "ai": {
    "temperature": 0.7  // 0.5 = consistent, 0.9 = creative
  }
}
```

## Environment Variables

Required in `.env`:
```env
# AI (choose one)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Search (choose one)
SEARCH_PROVIDER=brave
BRAVE_API_KEY=xxxxx

# Email
FROM_EMAIL=you@gmail.com
FROM_NAME=Your Newsletter
```

## Cron Patterns

Common scheduling patterns:
```
0 2 * * 1     Every Monday at 2 AM
0 8 * * 1     Every Monday at 8 AM
0 2 * * 5     Every Friday at 2 AM
0 2 1 * *     First day of month at 2 AM
0 2 * * 1-5   Weekdays at 2 AM
```

## Troubleshooting Quick Fixes

### Can't send emails
```bash
npm run auth  # Re-authenticate
```

### API key errors
```bash
# Check .env file has no spaces around =
# Example: API_KEY=xxxxx (not API_KEY = xxxxx)
```

### Test if setup is correct
```bash
npm test
```

### Check error logs
```bash
# Windows
type logs\error.log

# Mac/Linux
cat logs/error.log
```

## Draft File Structure

Location: `drafts/newsletter-*.json`

```json
{
  "metadata": {
    "status": "pending",  // or "approved" or "sent"
    "subject": "Email subject",
    "topic": "Original topic",
    "tone": "hormozi"
  },
  "content": "Markdown content...",
  "citations": []
}
```

To approve a draft for scheduled sending:
1. Open the draft JSON file
2. Change `"status": "pending"` to `"status": "approved"`
3. Save the file
4. The scheduler will send it on the next scheduled run

## API Usage Limits

| Service | Free Tier | Your Usage |
|---------|-----------|------------|
| Brave Search | 2,000/month | ~20 per newsletter |
| Gmail API | 500/day | Depends on recipient count |
| Anthropic | Pay-as-you-go | ~$0.20-0.50 per newsletter |

## Common File Edits

### Add custom tone guidelines
`config.json` → `tones` → add your custom tone

### Change word count target
`config.json` → `newsletter.targetWordCount`

### Change number of sections
`config.json` → `newsletter.sectionsCount`

### Modify email template
`src/email/templates/newsletter.hbs`

### Change preview port
`config.json` → `preview.port`

## Status Codes

Draft statuses:
- `pending` - Created but not approved
- `approved` - Ready to send (scheduler will send)
- `sent` - Already sent

## Log Files

```
logs/combined.log   All logs
logs/error.log      Errors only
```

Logs are rotated at 5MB, keeping 5 files.

## Keyboard Shortcuts

In CLI prompts:
- `↑/↓` - Navigate options
- `Enter` - Select/Confirm
- `Ctrl+C` - Cancel/Exit

In preview browser:
- Click "Approve & Send" to send
- Click "Cancel" to close without sending

## Getting Help

1. Run `npm test` to diagnose setup issues
2. Check `logs/error.log` for detailed errors
3. Review `GETTING_STARTED.md` for setup help
4. See `README.md` for full documentation

## Quick Setup Checklist

- [ ] `npm install`
- [ ] Create `.env` from `.env.example`
- [ ] Add API keys to `.env`
- [ ] Download `credentials.json` from Google Cloud
- [ ] Run `npm run auth`
- [ ] Run `npm test`
- [ ] Run `npm run test-send`
- [ ] Run `npm run generate`

## Performance Tips

- Parallel section generation: ~60-90 seconds total
- Research queries: ~1-2 seconds each
- Preview opens automatically
- Full workflow: 4-5 minutes from start to sent

## Security Reminders

**Never commit:**
- `.env`
- `credentials.json`
- `token.json`
- `drafts/*.json` (if containing sensitive data)

**Keep safe:**
- API keys
- Gmail OAuth tokens
- Subscriber email lists

## Example Newsletter Topics

Good topics are specific and value-driven:

✅ "3 Email Mistakes Costing You Customers"
✅ "The 5-Minute Morning Routine That Changed My Productivity"
✅ "Why Your Pricing Strategy Is Backwards (And How to Fix It)"

❌ "Email tips" (too vague)
❌ "Productivity" (too broad)
❌ "Business advice" (not specific)

---

**For detailed info, see the full README.md**
