# 🚀 Production Deployment Guide

Complete guide for deploying SIRA Newsletter to production.

---

## 📋 Pre-Deployment Checklist

### 1. Configuration Review

**Environment Variables (.env)**
```env
# Production settings
AI_PROVIDER=anthropic  # or ollama if self-hosting
ANTHROPIC_API_KEY=sk-...  # if using Anthropic
SEARCH_PROVIDER=none  # or brave/serper with API key
FROM_EMAIL=your-newsletter@gmail.com
FROM_NAME=Your Newsletter Name
NODE_ENV=production
```

**Config.json Updates**
```json
{
  "email": {
    "testMode": false,  // ⚠️ IMPORTANT: Set to false for production
    "recipients": [],   // Not used if useDatabase=true
    "from": "your-newsletter@gmail.com",
    "fromName": "Your Newsletter Name",
    "companyName": "Your Company LLC",
    "companyAddress": "123 Main St, City, State ZIP"
  },
  "subscription": {
    "baseUrl": "https://your-domain.com",  // Your production URL
    "useDatabase": true
  }
}
```

### 2. Content Preparation

- [ ] Customize landing page (src/home/public/index.html)
  - Update title and meta descriptions
  - Update company name
  - Update tagline and benefits
  - Update colors/branding if needed

- [ ] Review email template (src/email/templates/newsletter-hormozi.hbs)
  - Verify footer information
  - Check unsubscribe link
  - Test rendering in multiple email clients

- [ ] Prepare first newsletter content
  - Topic defined
  - Tone selected
  - Audience identified

### 3. Database Setup

- [ ] Import initial subscriber list (if any)
```bash
npm run import-csv
# Then select your CSV file
```

- [ ] Verify database integrity
```bash
npm run manage-subscribers
# View statistics
```

---

## 🌐 Deployment Options

### Option A: Railway (Recommended for Quick Deploy)

**Pros:**
- ✅ Fast deployment (5 minutes)
- ✅ Automatic HTTPS
- ✅ Free tier available ($5/month credit)
- ✅ GitHub integration
- ✅ Easy environment variables

**Cons:**
- ❌ Can't run Ollama (need Anthropic API)
- ❌ Costs ~$5-10/month after free tier

**Steps:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Link to Existing Project** (if already created on Railway)
```bash
railway link
```

5. **Add Environment Variables**
```bash
# Add all required variables
railway variables set AI_PROVIDER=anthropic
railway variables set ANTHROPIC_API_KEY=your_key_here
railway variables set SEARCH_PROVIDER=none
railway variables set FROM_EMAIL=your-email@gmail.com
railway variables set FROM_NAME="Your Newsletter"
railway variables set NODE_ENV=production
```

6. **Deploy**
```bash
railway up
```

7. **Configure Services**

Railway needs to run 2 services:
- **Home Server** (landing page + signup): `npm run home`
- **Unsubscribe Server**: `npm start`

Create a `railway.json` or use Railway dashboard to configure:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run home",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

8. **Set Up Domain** (Optional)
- Go to Railway dashboard → Settings
- Add custom domain or use provided railway.app subdomain
- Update `config.json` with your production URL

---

### Option B: Heroku

**Similar to Railway, good alternative**

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create your-newsletter-app
```

3. **Set Environment Variables**
```bash
heroku config:set AI_PROVIDER=anthropic
heroku config:set ANTHROPIC_API_KEY=your_key_here
heroku config:set FROM_EMAIL=your-email@gmail.com
# ... add all other variables
```

4. **Create Procfile**
```
web: npm run home
worker: npm start
```

5. **Deploy**
```bash
git push heroku main
```

6. **Scale Dynos**
```bash
heroku ps:scale web=1 worker=1
```

---

### Option C: VPS (DigitalOcean, Linode, AWS EC2)

**Pros:**
- ✅ Can run Ollama (100% free AI)
- ✅ Full control
- ✅ Best for high volume

**Cons:**
- ❌ More setup required
- ❌ Manual SSL configuration
- ❌ Need to manage server

**Steps:**

1. **Create VPS** (Ubuntu 22.04 LTS recommended)
   - Minimum: 2GB RAM, 1 CPU for Ollama
   - Recommended: 4GB RAM, 2 CPU for better performance

2. **SSH into Server**
```bash
ssh root@your-server-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install Ollama** (if using)
```bash
curl https://ollama.ai/install.sh | sh
ollama pull llama3.1:8b
```

5. **Clone Repository**
```bash
cd /var/www
git clone your-repo-url newsletter
cd newsletter
npm install
```

6. **Create .env File**
```bash
nano .env
# Add all environment variables
```

7. **Set Up PM2** (Process Manager)
```bash
npm install -g pm2

# Start services
pm2 start npm --name "newsletter-home" -- run home
pm2 start npm --name "newsletter-unsub" -- start

# Make services start on boot
pm2 save
pm2 startup
```

8. **Configure Nginx** (Reverse Proxy)
```bash
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/newsletter
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Home page
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Unsubscribe service
    location /unsubscribe {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

9. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/newsletter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Set Up SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

11. **Set Up Firewall**
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

### Option D: Docker (Any Platform)

**Coming soon - Docker configuration**

---

## 🔐 Gmail API Setup for Production

**Important**: Gmail API has sending limits.

### Gmail Sending Limits

- **Personal Gmail**: 500 emails/day
- **Google Workspace**: 2,000 emails/day

### For Higher Volume

Consider switching to:
- **SendGrid**: 100 emails/day free, then paid
- **Mailgun**: 5,000 emails/month free
- **Amazon SES**: Very cheap at scale
- **Postmark**: Great for transactional emails

### Current Gmail Setup

If staying with Gmail:
1. Create dedicated newsletter Gmail account
2. Enable 2FA
3. Create OAuth credentials (already done)
4. Store `credentials.json` and `token.json` securely
5. Never commit these to git!

**For Railway/Heroku**: 
- Convert credentials.json to base64 and store as env variable
- Decode at runtime

---

## 📊 Monitoring & Maintenance

### Logs

**Local/VPS:**
```bash
# View logs
tail -f logs/combined.log
tail -f logs/error.log

# PM2 logs
pm2 logs newsletter-home
pm2 logs newsletter-unsub
```

**Railway/Heroku:**
```bash
railway logs
# or
heroku logs --tail
```

### Health Checks

Create health check endpoints (already implemented):
- Home server: `GET /health`
- Subscription server: Built-in

### Database Backups

**Important**: Back up your subscriber database regularly!

```bash
# Backup
cp data/subscribers.db data/subscribers.db.backup-$(date +%Y%m%d)

# Or set up automated backups
crontab -e
# Add: 0 2 * * * cp /path/to/data/subscribers.db /path/to/backups/subscribers.db.$(date +\%Y\%m\%d)
```

### Monitoring Checklist

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor email deliverability
- [ ] Check logs daily for errors
- [ ] Review subscriber growth weekly
- [ ] Test all endpoints monthly

---

## 🚨 Security Best Practices

### Environment Variables

- ✅ Never commit .env to git
- ✅ Use different credentials for production
- ✅ Rotate API keys regularly
- ✅ Use environment-specific configs

### Database

- ✅ Regular backups
- ✅ Restrict access
- ✅ Use HTTPS for all API calls
- ✅ Validate all inputs

### Gmail OAuth

- ✅ Use service account or OAuth (not passwords)
- ✅ Store tokens securely
- ✅ Set up refresh token rotation
- ✅ Monitor for unauthorized access

### API Rate Limits

- ✅ Implement rate limiting on public endpoints
- ✅ Add CAPTCHA to signup form (recommended)
- ✅ Monitor for spam signups
- ✅ Implement email verification (optional)

---

## 🎯 Post-Deployment Testing

### 1. Test Landing Page
- [ ] Visit your production URL
- [ ] Test signup form
- [ ] Verify subscriber count updates
- [ ] Check mobile responsiveness
- [ ] Test in multiple browsers

### 2. Test Newsletter Generation
```bash
# SSH into server or run locally
npm run generate
# Generate test newsletter
```

### 3. Test Email Sending
- [ ] Generate a newsletter
- [ ] Preview it
- [ ] Send to test list
- [ ] Check inbox rendering
- [ ] Test unsubscribe link

### 4. Test Unsubscribe Flow
- [ ] Click unsubscribe link in email
- [ ] Verify unsubscribe page loads
- [ ] Confirm unsubscribe works
- [ ] Check database updated

### 5. Verify Database
```bash
npm run manage-subscribers
# Check stats and verify data
```

---

## 📈 Scaling Considerations

### When to Scale

Monitor these metrics:
- Subscriber count approaching 500 (Gmail limit)
- Server CPU/memory usage > 80%
- Email send times > 5 minutes
- Page load times > 2 seconds

### How to Scale

1. **Email Provider**: Switch to SendGrid/Mailgun
2. **Database**: Migrate to PostgreSQL for 10k+ subscribers
3. **AI Provider**: Use Anthropic API or self-host Ollama on dedicated server
4. **Servers**: Add load balancer and multiple instances
5. **CDN**: Use Cloudflare for static assets

---

## ✅ Go-Live Checklist

Before announcing your newsletter:

### Configuration
- [ ] testMode = false in config.json
- [ ] Production URL in config.json
- [ ] Company address updated
- [ ] FROM_EMAIL and FROM_NAME set correctly
- [ ] All environment variables in production

### Content
- [ ] Landing page customized
- [ ] First newsletter ready
- [ ] Email template tested
- [ ] Tone and style verified

### Technical
- [ ] All servers running
- [ ] HTTPS configured
- [ ] Domain pointed correctly
- [ ] Gmail API tested
- [ ] Database backed up
- [ ] Logs accessible

### Testing
- [ ] End-to-end test completed
- [ ] Mobile testing done
- [ ] Cross-browser testing done
- [ ] Unsubscribe tested
- [ ] All links work

### Legal/Compliance
- [ ] Privacy policy link (if required)
- [ ] Terms of service (if required)
- [ ] CAN-SPAM compliance (company address in footer)
- [ ] GDPR compliance (if EU subscribers)

---

## 🎉 You're Ready!

Once all items are checked:
1. Import your initial subscribers
2. Send your first newsletter
3. Share your landing page URL
4. Monitor for the first 24 hours
5. Respond to any unsubscribes promptly

**Good luck with your launch! 🚀**

---

## 🆘 Support Resources

- **Logs**: Check `logs/combined.log` for errors
- **Tests**: Run `npm test` to verify setup
- **Documentation**: Review `docs/` folder
- **Community**: Check GitHub issues for similar problems

---

**Remember**: Start small, test thoroughly, scale gradually. Your MVP is production-ready! 📰
