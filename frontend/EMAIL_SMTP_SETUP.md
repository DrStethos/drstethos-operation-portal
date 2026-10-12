# Secure Email (Gmail SMTP + Cloud Functions)

Admin emails (approval, rejection, document reminders) are sent by the callable Cloud Function `sendEmail` using **Gmail SMTP + Nodemailer**. Templates live in Firestore. Gmail credentials stay in **Functions secrets** only.

## Architecture

```
Admin UI (authenticated + isAdmin)
  → callable sendEmail
  → load emailTemplates/{templateId}
  → replace {{variables}}
  → Nodemailer → smtp.gmail.com:465
  → recipient
```

## Required secrets

| Secret | Value |
|---|---|
| `GMAIL_USER` | Full Gmail address (e.g. `stethosabhisha@gmail.com`) |
| `GMAIL_APP_PASSWORD` | Google **App Password** (not the normal Gmail password) |

### Create a Google App Password

1. Use a Google account with 2-Step Verification enabled.
2. Google Account → Security → App passwords.
3. Create an app password for “Mail”.
4. Copy the 16-character password.

### Set secrets (run from `DrStethos_Admin`)

```bash
firebase login
firebase use drstethos-app

firebase functions:secrets:set GMAIL_USER
firebase functions:secrets:set GMAIL_APP_PASSWORD
```

Paste the values when prompted.

## Seed Firestore templates

Collection: `emailTemplates`

Documents:

- `doctorApproval`
- `hospitalApproval`
- `doctorRejection`
- `hospitalRejection`
- `documentRequest`

Each document fields: `subject`, `html`, optional `text`, `enabled` (boolean).

### Option A — script

```bash
cd functions
npm install
# Place Firebase Admin key as functions/service-account-key.json
set GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json
npm run seed:templates
```

### Option B — Console

Create the documents manually using `functions/emailTemplates.seed.json`.

## Deploy functions

```bash
cd DrStethos_Admin
cd functions && npm install && npm run build && cd ..
firebase deploy --project drstethos-app --only functions
```

To deploy only email:

```bash
firebase deploy --project drstethos-app --only functions:sendEmail
```

## Frontend usage

```ts
import { sendEmail } from "@/helpers/cloudEmailHelper";

await sendEmail({
  templateId: "documentRequest",
  recipient: "doctor@example.com",
  variables: {
    doctorName: "Dr. John",
    message: "Please upload your missing documents.",
    messageHtml: "Please upload your missing documents.",
  },
});
```

Approval / rejection still go through `emailHelper.tsx`, which:

1. Tries Cloud Function first
2. Falls back to EmailJS if the function fails (temporary)

Public Support contact form still uses EmailJS (not admin-only).

## Security notes

- Callable requires Firebase Auth + `users/{uid}.isAdmin === true`
- Rate limit: 30 emails / minute / admin
- Client cannot pass SMTP host/user/password
- Secrets are never returned to the client
- Recommended Firestore rules: clients should **not** write `emailTemplates`, `email_logs`, `email_errors`, or `email_rate_limits`

## Verify

1. Seed templates and set secrets.
2. Deploy `sendEmail`.
3. Log in as an admin in the Admin UI.
4. Approve a test profile or send a document reminder.
5. Confirm inbox delivery and check Functions logs:

```bash
firebase functions:log --only sendEmail
```

Also check Firestore `email_logs` / `email_errors`.
