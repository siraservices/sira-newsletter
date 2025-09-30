# 🚀 Getting Started - Your First Newsletter in 5 Minutes

Welcome! This guide will walk you through creating your first AI-powered newsletter.

## Before You Start

You'll need:
- ✅ Node.js 18+ installed
- ✅ A Gmail account
- ✅ 15 minutes for initial setup (one-time)
- ✅ 5 minutes for each newsletter after that

## Quick Start Checklist

### ☐ Step 1: Install Dependencies (1 minute)

Open your terminal in this directory and run:

```bash
npm install
```

Wait for all packages to install...

### ☐ Step 2: Get Your API Keys (5 minutes)

You need two free API keys:

#### Anthropic API Key (for AI writing)

1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Click "API Keys" in the left menu
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-`)
6. Keep it handy for the next step

#### Brave Search API Key (for research)

1. Visit: https://brave.com/search/api/
2. Click "Get Started"
3. Sign up for the free tier (2,000 queries/month)
4. Copy your API key
5. Keep it handy for the next step

### ☐ Step 3: Configure Your Environment (2 minutes)

1. **Create your .env file:**

   Windows:
   ```bash
   copy .env.example .env
   ```

   Mac/Linux:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** with a text editor (Notepad, VS Code, etc.):

   ```env
   # Paste your Anthropic key here
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   
   # Paste your Brave key here
   SEARCH_PROVIDER=brave
   BRAVE_API_KEY=your-brave-key-here
   
   # Your Gmail address
   FROM_EMAIL=yourname@gmail.com
   FROM_NAME=Your Newsletter Name
   ```

3. **Save the file**

### ☐ Step 4: Set Up Gmail (5 minutes)

This is a one-time setup to allow the app to send emails via your Gmail account.

#### A. Get Google Cloud Credentials

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: "Newsletter Automation"
4. Click "Create"

5. **Enable Gmail API:**
   - In the search bar, type "Gmail API"
   - Click on "Gmail API"
   - Click "Enable"

6. **Create OAuth Credentials:**
   - Click "APIs & Services" → "Credentials"
   - Click "Configure Consent Screen"
     - Choose "External"
     - Fill in:
       - App name: "Newsletter Automation"
       - User support email: your email
       - Developer contact: your email
     - Click "Save and Continue" (skip scopes)
     - Add yourself as a test user
     - Click "Save and Continue"
   
   - Go back to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Desktop app**
   - Name: "Newsletter Automation"
   - Click "Create"
   
   - **Download the JSON file**
   - Save it in this project folder as `credentials.json`

#### B. Authenticate Your Gmail Account

In your terminal, run:

```bash
npm run auth
```

This will:
- Open your browser
- Ask you to sign in to Google
- Show a scary warning (click "Advanced" → "Go to Newsletter Automation")
- Ask for permission to send emails
- Click "Allow"

You'll see "✅ Authentication successful!" in your terminal.

**You only need to do this once!**

### ☐ Step 5: Test Your Setup (1 minute)

Run the integration test:

```bash
npm test
```

You should see:
```
✅ Configuration files
✅ API Keys
✅ Gmail Authentication
✅ Required directories

🎉 All tests passed!
```

If you see any ❌, check the error message and fix it before continuing.

### ☐ Step 6: Send a Test Email (1 minute)

```bash
npm run test-send
```

Check your inbox - you should receive a test newsletter!

## 🎉 You're Ready! Generate Your First Newsletter

Now for the fun part:

```bash
npm run generate
```

### The System Will Ask You:

1. **Newsletter topic:**
   ```
   Example: "3 Mistakes That Are Killing Your Productivity"
   ```

2. **Select tone:**
   - **Alex Hormozi** - Direct, ROI-focused, specific numbers
   - **Chris Williamson** - Thoughtful, research-driven, nuanced
   - **Custom** - Professional and balanced

3. **Target audience:**
   ```
   Example: "Busy professionals aged 25-45"
   ```

4. **Confirm:** Type "Y" and press Enter

### What Happens Next (Automated):

The system will:

1. ✅ Plan the newsletter structure (3-4 sections)
   - *Takes ~10 seconds*

2. ✅ Research your topic on the web
   - *Takes ~20 seconds*

3. ✅ Write all sections with AI
   - *Takes ~30 seconds*

4. ✅ Edit and polish the content
   - *Takes ~15 seconds*

5. ✅ Generate a compelling subject line
   - *Takes ~5 seconds*

6. ✅ Open a preview in your browser
   - *Instant*

**Total time: ~90 seconds**

### Review Your Newsletter

A browser window will open showing:

- 📧 **HTML Preview** - What your subscribers will see
- 📝 **Plain Text** - Fallback version
- 📊 **Stats** - Word count, read time, subject length

**Check these things:**
- ✅ Subject line is under 60 characters
- ✅ Content matches your tone
- ✅ Citations look good
- ✅ No typos or errors

### Send It!

Click **"✅ Approve & Send"**

Since you're in test mode, it will only send to yourself. Check your inbox!

## What's Next?

### Send to Real Subscribers

1. Edit `config.json`:
   ```json
   {
     "email": {
       "recipients": [
         "subscriber1@example.com",
         "subscriber2@example.com"
       ],
       "testMode": false
     }
   }
   ```

2. Generate and send:
   ```bash
   npm run generate
   ```

### Set Up Automated Weekly Sends

1. Edit `config.json`:
   ```json
   {
     "scheduler": {
       "enabled": true
     }
   }
   ```

2. Start the scheduler:
   ```bash
   npm run schedule
   ```

3. The system will automatically send approved newsletters every Monday at 2 AM EST

### Customize Your Tone

Edit `config.json` to adjust the writing style:

```json
{
  "tones": {
    "custom": {
      "guidelines": "Your custom tone instructions here..."
    }
  }
}
```

## Common Issues & Solutions

### ❌ "credentials.json not found"

**Problem:** Google OAuth credentials not set up

**Solution:**
1. Follow Step 4 above carefully
2. Make sure the file is named exactly `credentials.json`
3. Make sure it's in the project root (same folder as package.json)

### ❌ "ANTHROPIC_API_KEY not set"

**Problem:** Environment variables not configured

**Solution:**
1. Make sure you created `.env` from `.env.example`
2. Check that your API key is pasted correctly
3. No spaces around the `=` sign
4. Save the file after editing

### ❌ "No newsletters found" when testing

**Problem:** Haven't generated any newsletters yet

**Solution:** Run `npm run generate` first

### ❌ Newsletter tone doesn't match expectations

**Problem:** AI temperature or guidelines need adjustment

**Solution:**
1. Edit `config.json`
2. Change `"temperature"` (0.5 = consistent, 0.9 = creative)
3. Edit the tone guidelines in the `tones` section

### ❌ Email looks weird in Outlook

**Problem:** Email client compatibility issue

**Solution:** The template is tested with major clients, but if you see issues:
1. Check `src/email/templates/newsletter.hbs`
2. Make sure you're using inline CSS only
3. Test with mail-tester.com

## Tips for Great Newsletters

### Choose Specific Topics

❌ Bad: "Productivity tips"
✅ Good: "3 Time-Blocking Methods That Actually Work for Remote Workers"

### Know Your Audience

Be specific about who you're writing for:
- Demographics (age, profession)
- Pain points
- Goals

### Pick the Right Tone

- **Alex Hormozi** - Best for business, sales, direct advice
- **Chris Williamson** - Best for personal development, thoughtful analysis
- **Custom** - Best for general professional topics

### Review Before Sending

Always:
- ✅ Read the full preview
- ✅ Check all citations work
- ✅ Test subject line length (under 60 chars)
- ✅ Send a test to yourself first

## Need More Help?

- 📖 **Full Documentation:** See `README.md`
- 🏗️ **Technical Details:** See `ARCHITECTURE.md`
- 🔧 **Troubleshooting:** Check `logs/error.log`
- ✅ **Verify Setup:** Run `npm test`

## Command Reference

| Command | What It Does |
|---------|-------------|
| `npm run generate` | Create a new newsletter (interactive) |
| `npm run preview` | Preview the latest draft |
| `npm run test-send` | Send a test email to yourself |
| `npm run auth` | Set up Gmail (one-time) |
| `npm run schedule` | Start automated weekly sends |
| `npm test` | Check if everything is set up correctly |

---

## 🎊 Congratulations!

You now have a fully automated AI newsletter system!

**What you can do:**
- ✅ Generate professional newsletters in 90 seconds
- ✅ Research and cite sources automatically
- ✅ Send via your Gmail account
- ✅ Schedule weekly automated sends
- ✅ Customize tone and style
- ✅ All for ~$2-5/month in API costs

**Go create something amazing! 🚀**

---

*Having issues? Run `npm test` to diagnose problems, or check the logs in `logs/error.log`.*
