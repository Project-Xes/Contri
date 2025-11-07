# EmailJS Troubleshooting Guide

## ✅ Fixed Issues

1. **EmailJS Call Syntax** - Now using `emailjs.init(PUBLIC_KEY)` then `emailjs.send()` without public key
2. **Environment Variables** - Updated `.env.local` with your actual credentials
3. **Error Handling** - Better error messages with specific fixes
4. **Template Variables** - Added multiple variable names for compatibility

## 🔍 Check These First

### 1. Verify Environment Variables are Loaded

Open browser console and check if you see:
```
[EmailJS] Sending email with config: {
  service: "service_cq8t6ag",
  template: "template_p4gww2p",
  email: "your@email.com",
  publicKeyConfigured: true
}
```

If `publicKeyConfigured: false`, restart your dev server after updating `.env.local`.

### 2. Check EmailJS Template Variables

Your EmailJS template must use these variable names:
- `{{to_email}}` or `{{email}}` - Recipient email
- `{{otp}}` or `{{otp_code}}` - The OTP code
- `{{user_email}}` - User email (optional)
- `{{user_name}}` - Username part (optional)

**Template Example:**
```
Subject: Your KYC Verification OTP

Hello,

Your KYC verification OTP is: {{otp}}

This OTP is valid for 10 minutes.

If you didn't request this, please ignore this email.
```

### 3. Verify EmailJS Service Connection

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Check **Email Services** → Verify your service is connected
3. Test the service by sending a test email

### 4. Check Domain Authorization

1. Go to EmailJS Dashboard → **Account** → **Security**
2. Under **Authorized domains**, add:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (when deployed)

Without this, EmailJS will block requests!

### 5. Check Template ID and Service ID

Verify these match exactly:
- Service ID: `service_cq8t6ag`
- Template ID: `template_p4gww2p`
- Public Key: `T-PeC-2Ni-NUtAClR`

## 🐛 Common Errors and Fixes

### Error: "Invalid public key" or 401

**Fix:**
- Check `.env.local` has correct PUBLIC_KEY
- Restart dev server: `npm run dev`
- Verify public key in EmailJS dashboard matches

### Error: "Template not found" or 404

**Fix:**
- Verify Template ID matches exactly
- Check template exists in EmailJS dashboard
- Ensure template is linked to the correct service

### Error: "Service not found"

**Fix:**
- Verify Service ID matches exactly
- Check service is connected in EmailJS dashboard
- Ensure service is active

### Error: CORS or "Request blocked"

**Fix:**
- Add your domain to EmailJS authorized domains
- For localhost: add `localhost` and `127.0.0.1`
- Wait a few minutes after adding (cache)

### Error: "Email quota exceeded"

**Fix:**
- Free plan: 200 emails/month
- Check usage in EmailJS dashboard
- Upgrade plan or wait for reset

### No Error but Email Not Received

**Check:**
1. **Spam folder** - Check spam/junk folder
2. **EmailJS logs** - Dashboard → Logs → Check delivery status
3. **Email address** - Verify correct email entered
4. **Service connection** - Test service connection in dashboard

## 🧪 Testing Steps

1. **Test EmailJS Configuration:**
   ```javascript
   // Open browser console and run:
   console.log('EmailJS Config:', {
     service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
     template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
     publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.substring(0, 10) + '...'
   });
   ```

2. **Test EmailJS Send:**
   - Enter your email in the form
   - Click "Send OTP"
   - Check browser console for detailed logs
   - Check EmailJS dashboard logs for delivery

3. **Verify Template Variables:**
   - Check EmailJS template uses: `{{otp}}` or `{{otp_code}}`
   - Check template uses: `{{to_email}}` or `{{email}}`

## 📝 Debug Checklist

- [ ] Environment variables loaded (check console)
- [ ] EmailJS service connected
- [ ] Template created and linked to service
- [ ] Template variables match (`{{otp}}`, `{{to_email}}`)
- [ ] Domain authorized in EmailJS security settings
- [ ] Public key matches EmailJS dashboard
- [ ] Service ID and Template ID are correct
- [ ] Email quota not exceeded
- [ ] Check spam folder
- [ ] Check EmailJS dashboard logs

## 🔧 Quick Fixes

### Restart Dev Server
After changing `.env.local`:
```bash
# Stop server (Ctrl+C)
npm run dev  # Restart
```

### Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear cache and reload

### Test EmailJS Directly
```javascript
// In browser console:
import emailjs from '@emailjs/browser';
emailjs.init('T-PeC-2Ni-NUtAClR');
emailjs.send('service_cq8t6ag', 'template_p4gww2p', {
  to_email: 'test@example.com',
  otp: '123456'
}).then(console.log).catch(console.error);
```

## 📞 Still Not Working?

1. Check EmailJS dashboard logs for specific error
2. Check browser console for detailed error messages
3. Verify all credentials match EmailJS dashboard exactly
4. Test with a different email address
5. Check EmailJS service status page

## ✅ Success Indicators

When working correctly, you'll see:
- ✅ Green "EmailJS configured" message in UI
- ✅ Console log: "Email sent successfully"
- ✅ Toast notification: "OTP Sent"
- ✅ Email received within 1-2 minutes
- ✅ EmailJS dashboard shows successful delivery

---

**Note:** If emails still fail, use the OTP shown in the toast notification for testing. The system will allow you to verify with the displayed OTP in development mode.

