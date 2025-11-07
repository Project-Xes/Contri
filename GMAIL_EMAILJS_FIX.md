# Fix Gmail Authentication Scope Error (412)

## Error Message
```
Gmail_API: Request had insufficient authentication scopes.
Status: 412
```

## 🔧 Quick Fix Steps

### Option 1: Reconnect Gmail Service (Recommended)

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Services**
3. Find your Gmail service (`service_cq8t6ag`)
4. Click **Edit** or **Reconnect**
5. Click **Connect Account** or **Re-authorize**
6. When Google asks for permissions, **grant all requested permissions**
7. Make sure you see "Connected" status
8. Save the service

### Option 2: Use App Password (If 2FA Enabled)

If your Google account has 2-Factor Authentication:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new App Password for "Mail"
5. Copy the 16-character password
6. Go to EmailJS Dashboard → Email Services
7. Edit your Gmail service
8. Use the App Password instead of your regular password
9. Save

### Option 3: Use Different Email Service

If Gmail continues to have issues, switch to another provider:

1. **SMTP Service** (more reliable):
   - Go to EmailJS → Add New Service
   - Choose **SMTP** or **Custom SMTP Server**
   - Use any email provider (Outlook, Yahoo, custom SMTP)
   - Configure with SMTP credentials

2. **Outlook/Hotmail**:
   - More reliable than Gmail for EmailJS
   - Similar setup process

## ✅ After Fixing

1. **Test the service** in EmailJS dashboard (send test email)
2. **Restart your dev server** (if needed)
3. **Try sending OTP again** from your app

## 📝 Current Workaround

The app already shows the OTP in the toast notification when email fails, so you can:
1. Use the OTP shown in the toast for testing
2. Verify with that OTP to continue testing
3. Fix EmailJS configuration later

## 🔍 Verify Fix Worked

After reconnecting, you should see:
- ✅ No error in browser console
- ✅ EmailJS dashboard shows "Connected" status
- ✅ Test email sent successfully from EmailJS dashboard
- ✅ OTP email received in your inbox

## ⚠️ Common Gmail Issues

1. **"Less secure app access" disabled** - Google no longer supports this
2. **2FA enabled** - Must use App Password, not regular password
3. **Permissions not granted** - Reconnect and grant all permissions
4. **Service disconnected** - Reconnect the service

---

**Note:** This is a Gmail/Google security feature, not a bug in the code. Gmail requires specific authentication scopes to send emails via third-party services like EmailJS.

