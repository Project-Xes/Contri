# EmailJS Setup Guide for KYC OTP

This guide will help you set up EmailJS to send OTP emails for the KYC verification system.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions:
   - For Gmail: Click "Connect Account" and authorize
   - For other providers: Enter SMTP credentials
5. Note your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. In EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Choose the service you just created
4. Configure the template:

   **Template Settings:**
   - **Template Name:** KYC OTP Verification
   - **Subject:** Your KYC Verification OTP

   **Email Content:**
   ```html
   <h2>KYC Verification OTP</h2>
   <p>Hello,</p>
   <p>Your KYC verification OTP is:</p>
   <h1 style="font-size: 32px; color: #4F46E5; letter-spacing: 5px;">{{otp}}</h1>
   <p>This OTP is valid for 10 minutes. Please enter it to verify your email address.</p>
   <p style="color: #6B7280;">If you didn't request this OTP, please ignore this email.</p>
   <hr>
   <p style="color: #6B7280; font-size: 12px;">Best regards,<br>KYC Verification System</p>
   ```

5. Click **Save**
6. Note your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. In EmailJS dashboard, go to **Account** → **General**
2. Find your **Public Key** (e.g., `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)
3. Copy this key

## Step 5: Configure Environment Variables

Add the following to your `.env.local` file in the `glow-contrib` folder:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Example:**
```env
VITE_EMAILJS_SERVICE_ID=service_gmail123
VITE_EMAILJS_TEMPLATE_ID=template_kyc456
VITE_EMAILJS_PUBLIC_KEY=aBcDeFgHiJkLmNoPqRsTuVwXyZ123
```

## Step 6: Set EmailJS Security (Important!)

1. Go to **Account** → **Security**
2. Add your domain to **Authorized domains**:
   - For development: `localhost`, `127.0.0.1`
   - For production: your actual domain
3. Save changes

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   cd glow-contrib
   npm run dev
   ```

2. Navigate to the Profile page
3. Click "KYC Verification" button
4. Enter your email and click "Send OTP"
5. Check your email for the 6-digit OTP
6. Enter the OTP to verify

## Free Plan Limits

EmailJS free plan includes:
- ✅ 200 emails per month
- ✅ 2 email services
- ✅ All features needed for KYC

For production use with higher volume, consider upgrading to a paid plan.

## Troubleshooting

### Emails not sending?

1. **Check browser console** for errors
2. **Verify environment variables** are loaded correctly:
   - Look for warnings in console about EmailJS not configured
   - Ensure `.env.local` is in the `glow-contrib` folder
3. **Check EmailJS dashboard** logs for delivery status
4. **Verify authorized domains** include your current domain

### Getting "EmailJS not configured" message?

This means the environment variables are not set. In development mode, the OTP will be displayed in the browser console and shown in a toast message.

### Test mode vs Production

- **Development:** If EmailJS is not configured, OTP is shown in toast/console
- **Production:** Always configure EmailJS with real credentials

## Email Template Variables

The EmailJS template uses these variables:
- `{{otp}}` - The 6-digit OTP code
- `{{to_email}}` - Recipient email address
- `{{user_email}}` - User's email (same as to_email)

These are automatically populated by the `EmailVerification.tsx` component.

## Next Steps

Once EmailJS is configured:
1. Users can verify their email via OTP
2. After verification, they can upload KYC documents
3. Admin can approve/reject KYC requests in the Admin Dashboard
4. Verified users get full access to all features

For any issues, check the EmailJS documentation: https://www.emailjs.com/docs/

