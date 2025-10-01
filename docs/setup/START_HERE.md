# 👋 START HERE

## Welcome to Your Newsletter Automation System!

This system generates professional AI-powered newsletters in under 5 minutes.

## First Time Setup (15 minutes)

### Step 1: Install
```bash
npm install
```

### Step 2: Configure

1. Get API keys:
   - Anthropic: https://console.anthropic.com/
   - Brave Search: https://brave.com/search/api/

2. Create `.env` file:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. Edit `.env` and add your keys

### Step 3: Set Up Gmail

1. Go to: https://console.cloud.google.com/
2. Create project → Enable Gmail API → Create OAuth credentials
3. Download as `credentials.json`
4. Run: `npm run auth`

### Step 4: Test
```bash
npm test
npm run test-send
```

## Generate Your First Newsletter

```bash
npm run generate
```

Follow the prompts, review in browser, approve and send!

---

**📖 Detailed Setup Guide:** See `GETTING_STARTED.md`
**📚 Full Documentation:** See `README.md`
**🏗️ Architecture:** See `ARCHITECTURE.md`

**Questions?** Run `npm test` to diagnose issues.
