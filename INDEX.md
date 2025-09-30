# 📖 Documentation Index

Welcome to the Newsletter Automation System documentation!

## 🎯 Start Here

New to this project? **Read these in order:**

1. **[START_HERE.md](START_HERE.md)** ← Begin here!
   - Quick overview
   - Essential commands
   - 3-minute summary

2. **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Setup walkthrough
   - Step-by-step setup guide (15 minutes)
   - Screenshots and examples
   - Troubleshooting tips

3. **[Generate your first newsletter!](#quick-start)**
   - Run `npm run generate`
   - Follow the prompts
   - Review and send!

---

## 📚 Full Documentation

### For New Users

| Document | What's Inside | Read If... |
|----------|---------------|------------|
| **[START_HERE.md](START_HERE.md)** | Quick start overview | You're brand new |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Detailed setup guide | Setting up for the first time |
| **[SETUP.md](SETUP.md)** | Installation instructions | Need step-by-step setup |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Command cheat sheet | Need a quick reference |

### For Regular Users

| Document | What's Inside | Read If... |
|----------|---------------|------------|
| **[README.md](README.md)** | Complete documentation | Want comprehensive info |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Commands & config | Forgot a command |
| **[CHANGELOG.md](CHANGELOG.md)** | Version history | Want to know what's new |

### For Developers

| Document | What's Inside | Read If... |
|----------|---------------|------------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design & flow | Want technical details |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Project overview | Want the big picture |
| **[package.json](package.json)** | Dependencies & scripts | Need to modify scripts |

---

## 🚀 Quick Start

### Absolute Beginner (First Time)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your API keys

# 3. Set up Gmail
npm run auth

# 4. Test
npm test
npm run test-send

# 5. Generate!
npm run generate
```

**Time needed:** 15 minutes (one-time setup)

### Regular Use (Every Time)

```bash
npm run generate
```

**Time needed:** 5 minutes (topic to sent)

---

## 📁 Project Structure

```
newsletter-automation/
│
├── 📖 DOCUMENTATION (you are here!)
│   ├── INDEX.md              ← This file
│   ├── START_HERE.md         ← Read first
│   ├── GETTING_STARTED.md    ← Setup guide
│   ├── README.md             ← Full docs
│   ├── QUICK_REFERENCE.md    ← Cheat sheet
│   ├── SETUP.md              ← Setup details
│   ├── ARCHITECTURE.md       ← Technical docs
│   ├── PROJECT_SUMMARY.md    ← Overview
│   └── CHANGELOG.md          ← Version history
│
├── ⚙️ CONFIGURATION
│   ├── .env.example          ← Template (copy to .env)
│   ├── config.json           ← Settings (edit this!)
│   └── package.json          ← Dependencies
│
├── 💾 DATA
│   ├── drafts/               ← Your newsletters
│   └── logs/                 ← App logs
│
└── 💻 SOURCE CODE
    └── src/                  ← All code here
```

---

## 🎯 Common Tasks

### I want to...

**...generate a newsletter**
```bash
npm run generate
```
📖 See: [GETTING_STARTED.md](GETTING_STARTED.md)

**...send a test email**
```bash
npm run test-send
```
📖 See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**...change recipients**
- Edit `config.json` → `email.recipients`
📖 See: [README.md](README.md#configuration)

**...schedule automatic sends**
- Edit `config.json` → `scheduler.enabled = true`
- Run `npm run schedule`
📖 See: [README.md](README.md#scheduled-sending)

**...customize the tone**
- Edit `config.json` → `tones`
📖 See: [README.md](README.md#customization)

**...fix setup problems**
```bash
npm test
```
📖 See: [GETTING_STARTED.md](GETTING_STARTED.md#troubleshooting)

**...understand how it works**
📖 See: [ARCHITECTURE.md](ARCHITECTURE.md)

**...modify the email template**
- Edit `src/email/templates/newsletter.hbs`
📖 See: [README.md](README.md#customization)

---

## 🆘 Troubleshooting

### Quick Fixes

| Problem | Solution | Details |
|---------|----------|---------|
| Can't send emails | `npm run auth` | [GETTING_STARTED.md](GETTING_STARTED.md) |
| API key errors | Check `.env` file | [SETUP.md](SETUP.md) |
| Gmail not working | Re-auth Gmail | [README.md](README.md#gmail-setup) |
| Setup incomplete | `npm test` | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |

### Detailed Help

1. **Run diagnostics:**
   ```bash
   npm test
   ```

2. **Check error logs:**
   ```bash
   # Windows
   type logs\error.log
   
   # Mac/Linux
   cat logs/error.log
   ```

3. **Review setup:**
   - [GETTING_STARTED.md](GETTING_STARTED.md) - Step-by-step
   - [SETUP.md](SETUP.md) - Detailed instructions

---

## 📊 Documentation Map

```
START_HERE.md
    │
    ├─→ GETTING_STARTED.md (first-time setup)
    │       │
    │       ├─→ SETUP.md (detailed steps)
    │       └─→ npm run generate (create newsletter!)
    │
    ├─→ QUICK_REFERENCE.md (daily use)
    │
    ├─→ README.md (comprehensive guide)
    │       │
    │       ├─→ Configuration
    │       ├─→ Usage
    │       ├─→ Customization
    │       └─→ Troubleshooting
    │
    └─→ ARCHITECTURE.md (for developers)
            │
            ├─→ System Design
            ├─→ Component Details
            └─→ Extensibility
```

---

## 🎓 Learning Path

### Beginner Track

**Day 1: Setup (15 minutes)**
1. Read [START_HERE.md](START_HERE.md)
2. Follow [GETTING_STARTED.md](GETTING_STARTED.md)
3. Run `npm test`
4. Send test email

**Day 1: First Newsletter (5 minutes)**
1. Run `npm run generate`
2. Follow prompts
3. Review preview
4. Send!

**Day 2: Customization (10 minutes)**
1. Read [README.md](README.md#customization)
2. Try different tones
3. Adjust settings in `config.json`

**Week 2: Automation (5 minutes)**
1. Read [README.md](README.md#scheduled-sending)
2. Enable scheduler
3. Start `npm run schedule`

### Advanced Track

**For Developers**
1. Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review source code in `src/`
3. Understand component flow
4. Modify prompts or templates

**For Power Users**
1. Create custom tone presets
2. Modify email templates
3. Adjust AI parameters
4. Set up monitoring

---

## 📱 Command Reference

### Essential Commands

```bash
npm run generate    # Generate newsletter
npm run preview     # Preview latest draft
npm run test-send   # Send test email
npm run auth        # Set up Gmail
npm run schedule    # Start automation
npm test           # Verify setup
```

📖 Full reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🔗 External Resources

### APIs Used

- **Anthropic Claude**: https://console.anthropic.com/
- **Brave Search**: https://brave.com/search/api/
- **Google Cloud**: https://console.cloud.google.com/

### Useful Tools

- **Email Testing**: https://mail-tester.com/
- **Cron Expression**: https://crontab.guru/
- **Markdown Guide**: https://www.markdownguide.org/

---

## 📝 File Guide

### Configuration Files

| File | Purpose | Edit? |
|------|---------|-------|
| `.env` | API keys | ✅ Yes |
| `config.json` | Settings | ✅ Yes |
| `credentials.json` | Gmail OAuth | ❌ No (download) |
| `token.json` | Gmail token | ❌ No (auto) |

### Output Files

| Location | Contains | Manage |
|----------|----------|--------|
| `drafts/*.json` | Newsletters | Keep or delete |
| `logs/*.log` | App logs | Auto-rotated |

### Source Code

| Directory | Contains |
|-----------|----------|
| `src/ai/` | AI generation |
| `src/email/` | Email system |
| `src/preview/` | Preview server |
| `src/cli/` | Commands |
| `src/scheduler/` | Automation |
| `src/utils/` | Helpers |

---

## ✅ Setup Checklist

Use this to verify your setup:

- [ ] Node.js 18+ installed
- [ ] Ran `npm install`
- [ ] Created `.env` from `.env.example`
- [ ] Added Anthropic API key to `.env`
- [ ] Added Brave API key to `.env`
- [ ] Downloaded `credentials.json` from Google Cloud
- [ ] Ran `npm run auth` successfully
- [ ] Ran `npm test` (all green ✅)
- [ ] Ran `npm run test-send` (received email)
- [ ] Edited `config.json` with your settings
- [ ] Ready to run `npm run generate`!

---

## 🎯 Next Steps

**You're ready to go!**

1. **Generate your first newsletter:**
   ```bash
   npm run generate
   ```

2. **Customize settings:**
   - Edit `config.json`
   - Try different tones

3. **Enable automation:**
   - Set `scheduler.enabled = true`
   - Run `npm run schedule`

4. **Keep learning:**
   - Read [README.md](README.md) for advanced features
   - Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

---

## 💡 Tips

- **Bookmark** [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for daily use
- **Check logs** if something goes wrong (`logs/error.log`)
- **Run tests** when in doubt (`npm test`)
- **Start simple** with test mode enabled
- **Experiment** with tones and topics

---

## 📞 Getting Help

**First, try these:**

1. Run `npm test` to diagnose issues
2. Check `logs/error.log` for details
3. Review the relevant documentation:
   - Setup issues → [GETTING_STARTED.md](GETTING_STARTED.md)
   - Usage questions → [README.md](README.md)
   - Commands → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
   - Technical → [ARCHITECTURE.md](ARCHITECTURE.md)

**Common fixes:**
- Re-authenticate: `npm run auth`
- Verify setup: `npm test`
- Check logs: `logs/error.log`
- Review config: `config.json` and `.env`

---

**Happy newsletter writing! 🎉**

*For the best starting point, go to [START_HERE.md](START_HERE.md)*
