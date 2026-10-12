# EmailJS Setup Guide

This guide will help you set up EmailJS to enable the contact form to send emails to stethosabisha@gmail.com.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended for stethosabisha@gmail.com)
4. Click **Connect Account** and sign in with stethosabisha@gmail.com
5. Give your service a name (e.g., "DrStethos Gmail")
6. Copy the **Service ID** - you'll need this later

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template content:

### Template Configuration:

**Template Name:** Contact Form Submission

**Subject:** New Contact Form Message from {{from_name}}

**Content:**
```
Hello,

You have received a new message from the DrStethos website contact form.

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from the DrStethos website contact form.
```

4. Click **Save**
5. Copy the **Template ID** - you'll need this later

## Step 4: Get Public Key

1. Go to **Account** section in the dashboard
2. Find your **Public Key** in the API Keys section
3. Copy the **Public Key**

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual credentials from steps 2, 3, and 4

## Step 6: Update Support Component (Optional - Already Done)

The Support.tsx component has already been configured to use environment variables. No changes needed.

## Step 7: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Testing

1. Go to the Support/Contact section on your website
2. Fill in the form with test data
3. Click "Send Message"
4. Check stethosabisha@gmail.com inbox for the test email
5. If successful, you'll see a success message on the website

## Troubleshooting

### Email not sending?
- Check that all three environment variables are correctly set
- Verify the Service ID, Template ID, and Public Key are correct
- Check browser console for error messages
- Make sure you restarted the dev server after creating .env file

### Getting CORS errors?
- Make sure you're using the Public Key, not the Private Key
- EmailJS automatically handles CORS, so this shouldn't be an issue

### Still having issues?
- Check EmailJS dashboard for error logs
- Verify the Gmail account is properly connected in Email Services
- Try creating a new template with simpler content

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email services
- 5 email templates

This should be sufficient for a contact form. If you need more, consider upgrading to a paid plan.

## Security Note

The `.env` file contains sensitive credentials and is excluded from git (via .gitignore). Never commit this file to version control.
