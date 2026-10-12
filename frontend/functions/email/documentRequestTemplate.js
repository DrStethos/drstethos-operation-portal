const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/drstethos-app.firebasestorage.app/o/branding%2Flogo.png?alt=media&token=ed47366a-0bce-4f88-9c94-83e4c50c69fc";

const documentRequestTemplate = {
  enabled: true,
  description: "Reminder to upload missing documents",
  subject: "Action required: Complete your DrStethos profile",
  text:
    "Hi {{doctorName}},\n\n" +
    "We reviewed your DrStethos profile and found the following items missing or incomplete:\n\n" +
    "{{missingDocuments}}\n\n" +
    "Please open the DrStethos app, add the missing information, and make sure everything is saved successfully.\n\n" +
    "If you have already submitted these, please double-check that your profile shows them correctly.\n\n" +
    "Regards,\nDrStethos Admin Team",
  html:
    '<div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:32px 16px">' +
    "<tr><td align=\"center\">" +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
    '<tr><td style="background-color:#0040FF;padding:28px 24px;text-align:center">' +
    `<img src="${LOGO_URL}" alt="DrStethos" width="56" height="56" style="display:block;margin:0 auto 12px;border-radius:12px" />` +
    '<p style="margin:0;color:#ffffff;font-size:18px;font-weight:600">DrStethos</p>' +
    "</td></tr>" +
    '<tr><td style="padding:32px 28px;color:#1e293b;font-size:15px;line-height:1.6">' +
    "<p style=\"margin:0 0 16px\">Hi <strong>{{doctorName}}</strong>,</p>" +
    "<p style=\"margin:0 0 8px\">We reviewed your profile and noticed the following items are still missing or incomplete:</p>" +
    "{{missingDocumentsList}}" +
    "<p style=\"margin:16px 0\">Please open the DrStethos app, add the missing information, and make sure everything is saved successfully.</p>" +
    '<p style="margin:0 0 24px;color:#64748b;font-size:14px">If you have already submitted these, please double-check that your profile shows them correctly.</p>' +
    '<table role="presentation" cellspacing="0" cellpadding="0"><tr>' +
    '<td style="border-radius:8px;background-color:#0040FF">' +
    '<a href="https://drstethos.com" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600">Open DrStethos</a>' +
    "</td></tr></table>" +
    "</td></tr>" +
    '<tr><td style="padding:20px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;line-height:1.5">' +
    "<p style=\"margin:0\">Regards,<br/>DrStethos Admin Team</p>" +
    "</td></tr></table></td></tr></table></div>",
};

module.exports = { documentRequestTemplate, LOGO_URL };
