# Subscriber Management System

## Overview

Your newsletter system now has a **fully automated subscriber management system** with:

✅ **SQLite Database** - All subscribers stored in a local database  
✅ **Web-based Unsubscribe** - Beautiful unsubscribe page (like the design you requested)  
✅ **Automated Status Updates** - Unsubscribe requests update the database instantly  
✅ **CSV Import** - Easily import subscribers from CSV files  
✅ **API Endpoints** - RESTful API for subscription management  

---

## 🚀 Quick Start

### 1. Start the Subscription Server

The subscription server handles unsubscribe requests and API calls:

```bash
npm run subscription-server
```

This starts the server on **http://localhost:3001**

**Keep this running** when sending emails so unsubscribe links work!

### 2. Send a Test Email

```bash
npm run test-send
```

This sends a test email to `julioaira4@gmail.com` with a working unsubscribe link.

---

## 📊 Current Statistics

- **Total Subscribers**: 115 (imported from CSV)
- **Active Subscribers**: 115
- **Unsubscribed**: 0
- **Database Location**: `data/subscribers.db`

---

## 🎯 How It Works

### When You Send a Newsletter

1. System gets all **active** subscribers from the database
2. For each subscriber, generates a **unique unsubscribe token**
3. Creates a personalized unsubscribe link: `http://localhost:3001/unsubscribe?token=ABC123`
4. Sends the email with the unsubscribe link in the footer

### When Someone Clicks Unsubscribe

1. Opens the beautiful unsubscribe page you saw
2. Shows "Unsubscribe" and "Keep Subscription" buttons
3. If they confirm unsubscribe:
   - Updates database: `subscribed = 0`
   - Records unsubscribe timestamp
   - Shows success message
4. Future emails **automatically skip** unsubscribed users

---

## 📋 Managing Subscribers

### Interactive Management Tool

```bash
npm run manage-subscribers
```

This opens an interactive menu where you can:

- 📈 View Statistics
- ➕ Add Subscriber
- 📋 List Active Subscribers
- 🔄 Migrate from config.json
- ❌ Exit

### Adding Subscribers Manually

```bash
npm run manage-subscribers
```

Then select "Add Subscriber" and enter the email address.

### Importing from CSV

```bash
npm run import-csv path/to/your-file.csv
```

**CSV Format:**
- First column should be email addresses
- Will skip invalid emails automatically
- Shows detailed import summary

**Your recent import:**
```
✅ Successfully added:  115
⚠️  Invalid emails:     3
```

---

## 🔧 Configuration

### config.json Settings

```json
{
  "email": {
    "testMode": true,          // true = only send to testRecipient
    "testRecipient": "julioaira4@gmail.com"
  },
  "subscription": {
    "port": 3001,
    "baseUrl": "http://localhost:3001",
    "useDatabase": true        // true = use database, false = use config.json
  }
}
```

### Production Settings

When ready to send to all subscribers:

1. Set `"testMode": false` in config.json
2. Make sure subscription server is running
3. Run your newsletter generation/send commands

---

## 🌐 API Endpoints

The subscription server provides these endpoints:

### Unsubscribe Page
```
GET /unsubscribe?token=<TOKEN>
```
Shows the unsubscribe confirmation page

### Unsubscribe Action
```
POST /api/unsubscribe
Body: { "token": "<TOKEN>" }
```
Unsubscribes the user

### Subscribe (for future forms)
```
POST /api/subscribe
Body: { "email": "user@example.com" }
```
Adds a new subscriber

### Statistics
```
GET /api/stats
```
Returns subscriber statistics

### Migration
```
POST /api/migrate
```
Migrates recipients from config.json to database

---

## 📁 Database Schema

### subscribers table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| email | TEXT | Email address (unique) |
| token | TEXT | Unsubscribe token (unique) |
| subscribed | INTEGER | 1 = active, 0 = unsubscribed |
| subscribed_at | DATETIME | When they subscribed |
| unsubscribed_at | DATETIME | When they unsubscribed (null if active) |
| created_at | DATETIME | When record was created |
| updated_at | DATETIME | Last update timestamp |

**Indexes:**
- email (for fast lookups)
- token (for unsubscribe links)
- subscribed (for active subscriber queries)

---

## 🎨 Unsubscribe Page Features

The unsubscribe page matches the design you requested:

- ✅ Clean, modern UI
- ✅ Email icon at top
- ✅ Clear "Unsubscribe" headline
- ✅ Red "Unsubscribe" button
- ✅ "Keep Subscription" button
- ✅ Loading states
- ✅ Success/error messages
- ✅ Responsive design (mobile-friendly)

**File Location:** `src/subscription/public/unsubscribe.html`

---

## 🔄 Workflow Examples

### Daily Newsletter Send

```bash
# 1. Start subscription server (keep running)
npm run subscription-server

# 2. In another terminal, generate newsletter
npm run generate

# The system will:
# - Get 115 active subscribers from database
# - Generate personalized unsubscribe links
# - Send to all active subscribers
# - Skip any unsubscribed users automatically
```

### Add New Subscribers

**Option 1: Interactive**
```bash
npm run manage-subscribers
# Choose "Add Subscriber"
# Enter email address
```

**Option 2: Import CSV**
```bash
npm run import-csv data/new-subscribers.csv
```

### Check Subscriber Stats

```bash
npm run manage-subscribers
# Choose "View Statistics"
```

Or visit:
```
http://localhost:3001/api/stats
```

---

## 🚨 Important Notes

### 1. Keep Subscription Server Running

When sending emails, the subscription server **must be running** so unsubscribe links work:

```bash
# Terminal 1: Keep this running
npm run subscription-server

# Terminal 2: Send your emails
npm run test-send
```

### 2. Production Deployment

For production (sending to real subscribers):

1. Deploy the subscription server to a hosting service (Heroku, Railway, etc.)
2. Update `config.json` with your production URL:
   ```json
   {
     "subscription": {
       "baseUrl": "https://your-domain.com"
     }
   }
   ```
3. Set `"testMode": false`

### 3. Legal Compliance

- ✅ Unsubscribe links are generated automatically
- ✅ Unsubscribes are processed immediately
- ✅ Timestamps are recorded
- ✅ Once unsubscribed, users are automatically excluded

**CAN-SPAM Compliance:**
- Physical address in footer ✅ (from config.json)
- Working unsubscribe link ✅
- Processed within 10 days ✅ (instant)

---

## 📞 Troubleshooting

### Problem: Unsubscribe Link Not Working

**Solution:** Make sure subscription server is running:
```bash
npm run subscription-server
```

### Problem: "No recipients configured"

**Solution:** 
- Check that subscribers are in database: `npm run manage-subscribers`
- Verify `"useDatabase": true` in config.json
- Or add subscribers via CSV import

### Problem: Test Email Uses Old mailto: Link

**Solution:**
- Verify subscription server is running
- Check `"useDatabase": true` in config.json
- Restart test send

### Problem: Can't Access Unsubscribe Page

**Solution:**
- Subscription server must be running on port 3001
- Check if another app is using port 3001
- Verify URL: `http://localhost:3001/unsubscribe?token=<TOKEN>`

---

## 🎯 Next Steps

### 1. Test the Unsubscribe Flow

1. Check your email (julioaira4@gmail.com)
2. Click the unsubscribe link
3. You should see the beautiful unsubscribe page
4. Click "Unsubscribe" to test
5. Verify in database: `npm run manage-subscribers` → View Statistics

### 2. Add a Subscription Form (Future)

You can create a web form that POSTs to:
```
POST http://localhost:3001/api/subscribe
Body: { "email": "newuser@example.com" }
```

### 3. Deploy to Production

When ready:
- Deploy subscription server to a hosting service
- Update baseUrl in config.json
- Set testMode to false
- Start sending to your 115 subscribers!

---

## 📚 File Reference

**Database:**
- `src/database/subscribers.js` - Database model and methods
- `data/subscribers.db` - SQLite database file

**Server:**
- `src/subscription/server.js` - Express server with API endpoints
- `src/subscription/public/unsubscribe.html` - Unsubscribe page

**Management:**
- `src/subscription/manage.js` - Interactive CLI tool
- `src/subscription/import-csv.js` - CSV import script

**Email Integration:**
- `src/email/sender.js` - Updated to use database and generate tokens
- `src/email/test-send.js` - Send test emails

---

## ✨ What's New

Compared to the old system (manual config.json editing):

| Feature | Old System | New System |
|---------|-----------|------------|
| Subscriber Storage | config.json array | SQLite database |
| Unsubscribe Method | mailto: link | Web-based page |
| Unsubscribe Processing | Manual removal | Automatic |
| Add Subscribers | Edit JSON file | CLI tool + CSV import |
| Status Tracking | None | Full timestamps |
| Scalability | Limited | Unlimited |
| User Experience | Opens email app | Beautiful web page |

---

## 🎉 Summary

You now have a **professional, automated subscriber management system**!

- ✅ 115 subscribers imported and ready
- ✅ Beautiful unsubscribe page (matching your design)
- ✅ Automatic database updates
- ✅ Easy subscriber management
- ✅ Production-ready infrastructure

**Test email sent successfully!** Check your inbox at julioaira4@gmail.com and click the unsubscribe link to see it in action! 🚀

