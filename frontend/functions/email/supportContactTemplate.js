const { LOGO_URL } = require("./documentRequestTemplate");

const SUPPORT_INBOX = "support@drstethos.com";

const supportContactTemplate = {
  enabled: true,
  description: "Contact form submission from the public website",
  recipient: SUPPORT_INBOX,
  subject: "New contact form message from {{fromName}}",
  text:
    "New message from the DrStethos contact form\n\n" +
    "Name: {{fromName}}\n" +
    "Email: {{fromEmail}}\n\n" +
    "Message:\n{{message}}\n\n" +
    "Reply directly to {{fromEmail}} to respond.",
  html:
    '<div style="font-family:Segoe UI,Arial,sans-serif;background-color:#f4f8ff;padding:20px">' +
    '<div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px;border:1px solid #dce6ff">' +
    `<div style="text-align:center;margin-bottom:20px"><img src="${LOGO_URL}" alt="DrStethos" width="75" height="75" style="border-radius:10px" /></div>` +
    '<h2 style="color:#1d4ed8;text-align:center;font-weight:600;margin:0 0 16px;font-size:22px">New Contact Form Message</h2>' +
    '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">You received a new message from the DrStethos website.</p>' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;font-size:14px;color:#334155">' +
    "<tr><td style=\"padding:6px 0;width:80px;font-weight:600\">Name</td><td>{{fromName}}</td></tr>" +
    "<tr><td style=\"padding:6px 0;font-weight:600\">Email</td><td><a href=\"mailto:{{fromEmail}}\" style=\"color:#1d4ed8;text-decoration:none\">{{fromEmail}}</a></td></tr>" +
    "</table>" +
    '<div style="background-color:#f1f5ff;border-left:4px solid #1d4ed8;padding:12px 16px;margin:20px 0;border-radius:6px">' +
    '<p style="color:#334155;font-size:14px;margin:0;white-space:pre-wrap">{{message}}</p>' +
    "</div>" +
    '<p style="color:#64748b;font-size:13px;margin:0">Reply directly to the sender&rsquo;s email address above.</p>' +
    "</div></div>",
};

module.exports = { supportContactTemplate, SUPPORT_INBOX };
