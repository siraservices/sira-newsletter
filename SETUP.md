# 🚀 Quick Setup Guide (15 Minutes)

Follow these steps to get your newsletter automation system running.

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

## Step 2: Get API Keys (5 minutes)

### Anthropic API Key (Required)
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys
4. Create a new key
5. Copy the key (starts with `sk-ant-`)

### Brave Search API Key (Required)
1. Go to https://brave.com/search/api/
2. Sign up for free tier (2,000 queries/month)
3. Get your API key
4. Copy the key

## Step 3: Configure Environment (2 minutes)

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` with your favorite text editor:

```env
# Paste your API keys here
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

SEARCH_PROVIDER=brave
BRAVE_API_KEY=your-brave-key-here

# Your Gmail address
FROM_EMAIL=yourname@gmail.com
FROM_NAME=Your Newsletter Name
```

3. Save the file

## Step 4: Configure Settings (1 minute)

Edit `config.json`:

```json
{
  "email": {
    "from": "yourname@gmail.com",
    "fromName": "Your Newsletter",
    "recipients": [],
    "testMode": true,
    "testRecipient": "yourname@gmail.com"
  }
}
```

**Important**: Keep `testMode: true` until you've tested everything!

## Step 5: Set Up Gmail (5 minutes)

### Get Google Cloud Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable the Gmail API:
   - Go to **APIs & Services** → **Library**
   - Search "Gmail API"
   - Click **Enable**

4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Configure consent screen if prompted:
     - User Type: **External**
     - App name: "Newsletter Automation"
     - Add your email to test users
   - Create OAuth client ID:
     - Application type: **Desktop app**
     - Name: "Newsletter Automation"
   - Click **Create**

5. Download the JSON file
6. Save it as `credentials.json` in your project root

### Authenticate

```bash
npm run auth
```

This will:
- Open your browser
- Ask you to sign in to Google
- Request permission to send emails
- Save your token

Click **Allow** to continue.

## Step 6: Test Everything (2 minutes)

### Run Integration Test
```bash
npm test
```

You should see all green checkmarks ✅

### Send Test Email
```bash
npm run test-send
```

Check your inbox - you should receive a test newsletter!

## Step 7: Generate Your First Newsletter! 🎉

```bash
npm run generate
```

Follow the prompts:
- **Topic**: Try something like "3 Productivity Hacks That Actually Work"
- **Tone**: Select Alex Hormozi or Chris Williamson
- **Audience**: "Professionals seeking productivity tips"

The system will:
1. Plan the structure ⚡
2. Research the topic 🔍
3. Write the content ✍️
4. Open a preview 👀

Review it and click **Approve & Send** (it will only send to yourself in test mode).

## ✅ You're Done!

Your newsletter automation system is now ready.

### Next Steps

1. **Test with different topics** to see the AI in action
2. **Adjust the tone** in `config.json` if needed
3. **Add recipients** when you're ready to send for real:
   ```json
   "email": {
     "recipients": ["subscriber1@example.com", "subscriber2@example.com"],
     "testMode": false
   }
   ```
4. **Enable scheduling** for automatic Monday sends:
   ```json
   "scheduler": {
     "enabled": true
   }
   ```

### Common Issues

**"credentials.json not found"**
- Make sure you downloaded the OAuth credentials from Google Cloud
- Save it as `credentials.json` in the project root (same folder as package.json)

**"API key not set"**
- Check your `.env` file
- Make sure there are no spaces around the `=` sign
- Make sure the file is named `.env` not `.env.txt`

**Newsletter tone doesn't match**
- Try adjusting `temperature` in `config.json` (0.5-0.9)
- Edit the tone guidelines in `config.json` → `tones` section

**Test email not arriving**
- Check spam folder
- Verify `FROM_EMAIL` in `.env` matches your Gmail address
- Make sure test mode is enabled in `config.json`

### Need Help?

1. Check `logs/error.log` for detailed error messages
2. Review the main README.md for troubleshooting
3. Run `npm test` to diagnose setup issues

---

**Happy newsletter writing! 📰✨**
