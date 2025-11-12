# Deployment Checklist

Use this checklist when deploying the newsletter signup page to production.

## Pre-Deployment

### Code Changes
- [ ] All newsletter send methods mark status as "sent"
  - [x] `src/cli/send-to-all.js` - ✅ Already sets status
  - [x] `src/scheduler/cron.js` - ✅ Already sets status
  - [x] `src/cli/send-draft.js` - ✅ Fixed to set status
- [ ] Home server uses `PORT` env var (Railway compatible)
- [ ] Railway config files created:
  - [x] `railway.json` - Subscription server
  - [x] `railway-home.json` - Home server

### Configuration
- [ ] Update `config.json` with production URLs
- [ ] Set `subscription.baseUrl` to Subscription Server URL
- [ ] Verify `newsletter.name`, `newsletter.description` are set
- [ ] Verify `newsletter.authorImage` path is correct

### Testing
- [ ] Test home page locally (`npm run home`)
- [ ] Verify posts appear for sent newsletters
- [ ] Test subscription form
- [ ] Test post modal (click "Read now")
- [ ] Test "View more posts" pagination
- [ ] Test social sharing links
- [ ] Verify images load correctly
- [ ] Test mobile responsiveness

## Railway Deployment

### Service Setup
- [ ] Create Home Server service in Railway
  - [ ] Set start command: `node src/home/server.js`
  - [ ] Or use `railway-home.json` config
- [ ] Create Subscription Server service in Railway
  - [ ] Set start command: `node src/subscription/server.js`
  - [ ] Or use `railway.json` config

### Environment Variables
- [ ] Home Server:
  - [ ] `PORT` (auto-set by Railway)
  - [ ] `NODE_ENV=production` (optional)
- [ ] Subscription Server:
  - [ ] `SUBSCRIPTION_BASE_URL` (Subscription Server Railway URL)
  - [ ] `PORT` (auto-set by Railway)

### Domains
- [ ] Generate Railway domain for Home Server
- [ ] Generate Railway domain for Subscription Server
- [ ] Update `SUBSCRIPTION_BASE_URL` with Subscription Server URL
- [ ] (Optional) Set up custom domains

### Data Persistence
- [ ] Set up Railway volumes OR include in git:
  - [ ] `data/subscribers.db` - Subscriber database
  - [ ] `drafts/*.json` - Sent newsletters (for posts)
  - [ ] `src/home/public/images/posts/*` - Post images
  - [ ] `src/home/public/profile.jpg` - Profile image

## Post-Deployment Testing

### Home Server
- [ ] Visit Home Server URL
- [ ] Verify page loads correctly
- [ ] Check newsletter signup form works
- [ ] Verify sent newsletters appear as posts
- [ ] Test "Read now" button opens modal
- [ ] Verify images display correctly
- [ ] Test "View more posts" if multiple posts exist
- [ ] Test social sharing links
- [ ] Check mobile view

### Subscription Server
- [ ] Visit Subscription Server URL
- [ ] Test unsubscribe endpoint
- [ ] Verify database connectivity
- [ ] Test subscription form (if on home page)

### Integration
- [ ] Send test newsletter
- [ ] Verify newsletter appears on home page
- [ ] Check unsubscribe link in email works
- [ ] Verify subscriber added to database
- [ ] Test full workflow end-to-end

## Monitoring

- [ ] Set up Railway monitoring/alerts
- [ ] Check deployment logs for errors
- [ ] Monitor database size
- [ ] Track subscriber growth
- [ ] Monitor page load times

## Documentation

- [ ] Update team on deployment process
- [ ] Document Railway URLs
- [ ] Document environment variables
- [ ] Create runbook for common issues

## Rollback Plan

- [ ] Know how to rollback deployment
- [ ] Have backup of database
- [ ] Have backup of drafts/images
- [ ] Test rollback procedure

## Success Criteria

- [ ] Home page accessible at production URL
- [ ] Sent newsletters automatically appear as posts
- [ ] Images display correctly for posts with images
- [ ] Subscription form works and adds to database
- [ ] Unsubscribe links work from production URL
- [ ] Mobile responsive and fast loading
- [ ] No errors in Railway logs

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URLs:**
- Home Server: _______________
- Subscription Server: _______________

**Notes:**
_______________
_______________

