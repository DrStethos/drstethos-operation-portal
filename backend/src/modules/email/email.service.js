"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
});
const sendInvitationEmail = async (to, token, role = 'MANAGER') => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const inviteLink = `${frontendUrl}/accept-invitation?token=${token}`;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'support@trizenventures.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'DrStethos Operations Portal';
    const replyTo = process.env.EMAIL_REPLY_TO || fromAddress;
    const roleTitle = role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Operations Manager';
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DrStethos Operations Portal Access</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9; padding:40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="100%" max-width="580" cellspacing="0" cellpadding="0" border="0" style="max-width:580px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 16px rgba(15, 23, 42, 0.06); border:1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#0f172a; padding:32px 36px; text-align:left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-block; vertical-align:middle; width:36px; height:36px; background-color:#2563eb; border-radius:10px; text-align:center; line-height:36px; color:#ffffff; font-size:18px; font-weight:bold; margin-right:12px;">
                      &#x2695;
                    </div>
                    <div style="display:inline-block; vertical-align:middle;">
                      <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">DrStethos</h1>
                      <p style="margin:0; font-size:11px; font-weight:600; color:#60a5fa; text-transform:uppercase; letter-spacing:1px;">Operations Portal</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:36px 36px 28px 36px;">
              <h2 style="margin:0 0 14px 0; font-size:21px; font-weight:700; color:#0f172a; letter-spacing:-0.4px;">
                DrStethos Operations Portal Access
              </h2>
              <p style="margin:0 0 22px 0; font-size:14px; line-height:1.6; color:#475569;">
                You have been granted access to the <strong>Doctor Stethos Hospital Operations Portal</strong>. Your administrative workspace has been provisioned and is ready for onboarding.
              </p>

              <!-- Access Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:26px; padding:18px 20px;">
                <tr>
                  <td style="padding-bottom:10px;">
                    <span style="font-size:11px; font-weight:600; text-transform:uppercase; color:#64748b; letter-spacing:0.5px;">Recipient Email:</span>
                    <div style="font-size:13px; font-weight:600; color:#0f172a; margin-top:2px;">${to}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;">
                    <span style="font-size:11px; font-weight:600; text-transform:uppercase; color:#64748b; letter-spacing:0.5px;">Assigned Access Role:</span>
                    <div style="font-size:13px; font-weight:700; color:#2563eb; margin-top:2px;">${roleTitle}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size:11px; font-weight:600; text-transform:uppercase; color:#64748b; letter-spacing:0.5px;">Link Expiration:</span>
                    <div style="font-size:13px; font-weight:500; color:#0f172a; margin-top:2px;">Valid for 24 hours</div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#475569;">
                Please click the button below to set your secure password and activate your operational access:
              </p>

              <!-- Primary Call To Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 28px auto;">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#2563eb;">
                    <a href="${inviteLink}" target="_blank" style="display:inline-block; padding:14px 34px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px; background-color:#2563eb; letter-spacing:-0.2px;">
                      Accept Invitation &amp; Access Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <div style="padding-top:18px; border-top:1px solid #f1f5f9;">
                <p style="margin:0 0 8px 0; font-size:12px; color:#64748b;">
                  If the button above does not work, copy and paste this direct link into your browser:
                </p>
                <p style="margin:0; font-size:11px; color:#2563eb; word-break:break-all; background-color:#f8fafc; padding:10px 14px; border-radius:6px; border:1px solid #e2e8f0; font-family:monospace;">
                  <a href="${inviteLink}" style="color:#2563eb; text-decoration:none;">${inviteLink}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td style="padding:0 36px 28px 36px;">
              <div style="background-color:#eff6ff; border-left:3px solid #3b82f6; border-radius:4px; padding:12px 14px; font-size:12px; color:#1e40af; line-height:1.5;">
                <strong>Security Reminder:</strong> Never share this invitation link with anyone. If you were not expecting this invitation, you can safely ignore this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:22px 36px; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:11px; font-weight:600; color:#475569;">
                Doctor Stethos Hospital Operations Portal
              </p>
              <p style="margin:0; font-size:10px; color:#94a3b8; line-height:1.4;">
                This is an automated system email sent from Doctor Stethos Operations.<br>
                &copy; ${new Date().getFullYear()} DrStethos. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
    const text = `
DrStethos Operations Portal Access

You have been granted access to the Doctor Stethos Hospital Operations Portal.
Recipient: ${to}
Assigned Role: ${roleTitle}
Expiration: Valid for 24 hours

Please click the link below to set your password and access your account:
${inviteLink}

If you did not expect this invitation, please ignore this email.
© ${new Date().getFullYear()} DrStethos. All rights reserved.
  `.trim();
    const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        replyTo: replyTo,
        to,
        subject: 'DrStethos Operations Portal Access - Invitation',
        text,
        html,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitation email sent to ${to} (${roleTitle})`);
    }
    catch (error) {
        console.error('Error sending invitation email:', error);
        throw error;
    }
};
exports.sendInvitationEmail = sendInvitationEmail;
//# sourceMappingURL=email.service.js.map