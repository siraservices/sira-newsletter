# Email Footer Configuration

## Overview
The newsletter footer now includes professional branding, legal disclaimers, and a working unsubscribe mechanism.

## Configuration

All footer settings are configured in `config.json` under the `email` section:

```json
{
  "email": {
    "from": "your-email@gmail.com",
    "fromName": "Your Newsletter Name",
    "companyName": "Your Company, LLC",
    "companyAddress": "123 Your Street, City, State, ZIP, Country",
    "recipients": [],
    "testMode": true,
    "testRecipient": "your-email@gmail.com"
  }
}
```

### Settings

- **`companyName`**: Your company or personal brand name
- **`companyAddress`**: Full physical mailing address (required for CAN-SPAM compliance)
- **`from`**: The email address that will receive unsubscribe requests
- **`fromName`**: The name that appears in the email header

## Unsubscribe Functionality

### How It Works

When users click the "Unsubscribe" link, it will:
1. Open their default email client
2. Pre-populate an email to your configured `from` address
3. Include "Unsubscribe" in the subject line
4. Include a message requesting to be unsubscribed

### Processing Unsubscribe Requests

You'll need to manually process unsubscribe requests by:

1. Receiving the unsubscribe email
2. Removing the user's email from your `recipients` list in `config.json`
3. Keeping a record of unsubscribed emails to ensure compliance

### Future Enhancement Options

For automated unsubscribe handling, consider:
- Using a dedicated email marketing service (Mailchimp, SendGrid, etc.)
- Implementing a web-based unsubscribe page
- Creating a database to manage subscribers and unsubscribes

## Footer Sections

The footer includes:

1. **Company Information**: Name and address
2. **Legal Disclaimer**: Covers hypothetical scenarios and outcomes
3. **Unsubscribe Links**: Both "Update Preferences" and "Unsubscribe" 
4. **Responsibility Disclaimer**: Covers professional advice and decision-making

## Customization

### Modifying Disclaimer Text

To change the legal disclaimers, edit the footer sections in:
- `src/email/templates/newsletter.hbs`
- `src/email/templates/newsletter-hormozi.hbs`

### Styling

All footer styles are inline for email client compatibility. To modify:
- Font sizes: `font-size: 11px;` or `font-size: 13px;`
- Colors: `color: #666666;` or `color: #999999;`
- Spacing: `margin: 16px 0 0 0;`

## Legal Compliance

### CAN-SPAM Act Requirements

Your footer now includes:
- ✅ Physical mailing address
- ✅ Clear unsubscribe mechanism
- ✅ Honest subject lines (ensure your subjects are accurate)

### Additional Recommendations

1. Honor unsubscribe requests within 10 business days
2. Don't sell or transfer unsubscribed email addresses
3. Monitor your unsubscribe process regularly
4. Keep records of when users subscribed and unsubscribed

## Testing

To test the unsubscribe functionality:

```bash
npm run test-send
```

This will send a test email to your configured `testRecipient`. Click the unsubscribe link to verify it opens your email client correctly.

## Troubleshooting

### Unsubscribe Link Not Working

- Verify `email.from` is set correctly in `config.json`
- Check that your email client is configured as the default mailto handler
- Test with different email clients (Gmail, Outlook, etc.)

### Footer Not Displaying Correctly

- Ensure `companyName` and `companyAddress` are set in `config.json`
- Check that you're using the latest template files
- Preview in multiple email clients for compatibility

## Questions?

For issues or questions:
1. Check the logs in `logs/combined.log`
2. Review the template files in `src/email/templates/`
3. Consult the main README.md for general setup
