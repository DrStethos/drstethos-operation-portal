const { LOGO_URL } = require("./documentRequestTemplate");

const rejectionHtml =
  '<div style="font-family:Segoe UI,Arial,sans-serif;background-color:#f4f8ff;padding:20px">' +
  '<div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px;border:1px solid #dce6ff">' +
  `<div style="text-align:center;margin-bottom:20px"><img src="${LOGO_URL}" alt="DrStethos" width="75" height="75" style="border-radius:10px" /></div>` +
  '<h2 style="color:#1d4ed8;text-align:center;font-weight:600;margin:0 0 16px;font-size:22px;line-height:1.3">' +
  "Update on Your {{profileType}} Profile Verification" +
  "</h2>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">Dear <strong>{{profileName}}</strong>,</p>' +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "Thank you for submitting your <strong>{{profileType}}</strong> profile for verification on " +
  "<strong>DrStethos</strong>. We appreciate the time and effort you invested in completing your details." +
  "</p>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "After a thorough review, we were unable to approve your profile at this time. " +
  "Below is the reason provided by our verification team:" +
  "</p>" +
  '<div style="background-color:#f1f5ff;border-left:4px solid #ef4444;padding:12px 16px;margin:20px 0;border-radius:6px">' +
  '<p style="color:#ef4444;font-size:14px;margin:0"><strong>Reason:</strong> {{rejectionReason}}</p>' +
  "</div>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "We encourage you to review the above details and update your profile accordingly. " +
  "Once the necessary corrections or documents are provided, you may resubmit for verification at any time." +
  "</p>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "If you need clarification or further assistance, our support team will be happy to help. Contact us at " +
  '<a href="mailto:support@drstethos.com" style="color:#1d4ed8;text-decoration:none">support@drstethos.com</a>.' +
  "</p>" +
  '<p style="color:#334155;font-size:14px;margin-top:20px;margin-bottom:0">' +
  "Thank you for your understanding.<br/><strong style=\"color:#1d4ed8\">Team DrStethos</strong></p>" +
  "</div></div>";

const rejectionText =
  "Dear {{profileName}},\n\n" +
  "Thank you for submitting your {{profileType}} profile for verification on DrStethos.\n\n" +
  "After review, we were unable to approve your profile at this time.\n\n" +
  "Reason: {{rejectionReason}}\n\n" +
  "Please update your profile and resubmit when ready. Contact support@drstethos.com if you need help.\n\n" +
  "Thank you for your understanding.\nTeam DrStethos";

const doctorRejectionTemplate = {
  enabled: true,
  description: "Sent when a doctor profile is rejected",
  subject: "Update on your DrStethos doctor profile verification",
  text: rejectionText,
  html: rejectionHtml,
};

const hospitalRejectionTemplate = {
  enabled: true,
  description: "Sent when a hospital profile is rejected",
  subject: "Update on your DrStethos hospital profile verification",
  text: rejectionText,
  html: rejectionHtml,
};

module.exports = {
  doctorRejectionTemplate,
  hospitalRejectionTemplate,
};
