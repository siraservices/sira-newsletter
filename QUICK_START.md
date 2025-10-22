# ⚡ Quick Start - Get Running in 5 Minutes

**Status**: ✅ System is configured and tested

---

## 🎯 Your System is Ready!

Everything is configured and tested. Here's what you can do right now:

---

## 🚀 Generate Your First Newsletter

```bash
npm run generate
```

This will:
1. Prompt you for a topic
2. Let you choose a tone (Hormozi, Williamson, Custom)
3. Generate the newsletter using AI (takes 30-60 seconds)
4. Open a preview in your browser
5. Let you approve and send

**Example topics:**
- "How AI is transforming small business operations"
- "5 productivity hacks for busy entrepreneurs"
- "The future of remote work in 2025"

---

## 📧 Test Email Sending

```bash
npm run test-send
```

Sends a test newsletter to: julioaira4@gmail.com

---

## 🏠 Start Your Landing Page

```bash
npm run home
```

Then visit: **http://localhost:3002**

This is your public-facing signup page where people can subscribe.

---

## 🔗 Start Unsubscribe Server

```bash
npm start
```

Runs on **http://localhost:3001**

Handles unsubscribe requests from newsletter links.

---

## 👥 Manage Subscribers

```bash
npm run manage-subscribers
```

Options:
- View statistics
- Add subscribers
- List active subscribers
- Migrate from config.json

---

## 📊 System Status

```bash
npm test
```

Verifies:
- ✅ Configuration files
- ✅ API keys (Ollama doesn't need one!)
- ✅ Gmail authentication
- ✅ Required directories

---

## 🎨 Customization

### Landing Page
Edit: `src/home/public/index.html`
- Change title, tagline, colors
- Update company info
- Modify benefits section

### Email Template
Edit: `src/email/templates/newsletter-hormozi.hbs`
- Customize header/footer
- Change colors/branding
- Modify layout

### Newsletter Settings
Edit: `config.json`
```json
{
  "newsletter": {
    "defaultTone": "hormozi",     // Change default tone
    "targetWordCount": 250,       // Adjust length
    "sectionsCount": 3            // Number of sections
  }
}
```

---

## 📝 Current Configuration

**AI**: Ollama (llama3.2) - FREE local AI
**Search**: None - Uses AI's built-in knowledge
**Email**: Gmail API (julioaira4@gmail.com)
**Mode**: Test mode (safe to test)
**Subscribers**: 1 active

---

## 🎯 Next Steps

### Option 1: Test Locally
1. Generate a newsletter: `npm run generate`
2. Preview it in your browser
3. Send to yourself
4. Test the unsubscribe link

### Option 2: Customize
1. Update landing page with your branding
2. Customize email template
3. Add more subscribers
4. Test with real content

### Option 3: Deploy
1. Choose a deployment platform (Railway, VPS, etc.)
2. Update production settings
3. Set up your domain
4. Go live!

**See**: `MVP_GUIDE.md` for full deployment instructions

---

## 💡 Tips for Success

### Content Strategy
- **Consistency**: Pick a schedule (weekly/monthly) and stick to it
- **Value First**: Every newsletter should provide actionable value
- **Tone**: Pick one and stay consistent
- **Length**: Start with 250-500 words (quick reads perform better)

### Growth Strategy
- Share landing page on social media
- Add signup form to your website
- Include in email signature
- Cross-promote with other newsletters

### Testing Strategy
- Always preview before sending
- Send test emails to yourself first
- Test on mobile devices
- Check multiple email clients

---

## 🔧 Common Commands

| Command | What it does |
|---------|-------------|
| `npm run generate` | Generate a new newsletter |
| `npm run preview` | Preview latest draft |
| `npm run test-send` | Send test email |
| `npm run home` | Start landing page server |
| `npm start` | Start unsubscribe server |
| `npm run manage-subscribers` | Manage subscriber list |
| `npm test` | Run system tests |
| `npm run test-ollama` | Test Ollama connection |

---

## 📖 Documentation

- **MVP Guide**: `MVP_GUIDE.md` - Complete feature overview
- **Deployment**: `docs/setup/PRODUCTION_DEPLOYMENT.md`
- **Architecture**: `docs/architecture/ARCHITECTURE.md`
- **Quick Reference**: `docs/guides/QUICK_REFERENCE.md`

---

## 🆘 Troubleshooting

### Ollama not running?
```bash
ollama serve
```

### Email not sending?
```bash
npm run test-send
# Check logs/combined.log for errors
```

### Port already in use?
Change port in `.env`:
```env
PORT=3001
HOME_PORT=3003
```

### Need to reset?
```bash
# Re-run tests
npm test

# View logs
cat logs/combined.log
```

---

## ✨ You're All Set!

Your newsletter system is:
- ✅ Configured
- ✅ Tested
- ✅ Ready to use

**Start with**: `npm run generate`

Then customize and deploy when you're ready!

---

**Questions?** Check `MVP_GUIDE.md` or review documentation in `docs/` folder.

**Happy newsletter-ing! 📰**
