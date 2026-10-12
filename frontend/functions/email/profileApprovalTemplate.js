const { LOGO_URL } = require("./documentRequestTemplate");

const approvalHtml =
  '<div style="font-family:Segoe UI,Arial,sans-serif;background-color:#f4f8ff;padding:20px">' +
  '<div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;border-radius:10px;border:1px solid #dce6ff">' +
  `<div style="text-align:center;margin-bottom:20px"><img src="${LOGO_URL}" alt="DrStethos" width="75" height="75" style="border-radius:10px" /></div>` +
  '<h2 style="color:#1d4ed8;text-align:center;font-weight:600;margin:0 0 16px;font-size:22px;line-height:1.3">' +
  "Congratulations! Your {{profileType}} Profile Has Been Approved" +
  "</h2>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">Dear <strong>{{profileName}}</strong>,</p>' +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "We&rsquo;re delighted to inform you that your <strong>{{profileType}}</strong> profile has been " +
  '<strong style="color:#1d4ed8">successfully verified and approved</strong> on <strong>DrStethos</strong>.' +
  "</p>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "You are now officially part of a rapidly growing digital healthcare ecosystem designed to empower doctors, hospitals, and medical professionals with enhanced visibility, trust, and patient engagement tools." +
  "</p>" +
  '<div style="text-align:center;margin:30px 0">' +
  '<a href="{{dashboardLink}}" style="background-color:#1d4ed8;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;display:inline-block;box-shadow:0 3px 10px rgba(29,78,216,0.25)">' +
  "Go to Your Dashboard" +
  "</a></div>" +
  '<p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  "From here, you can manage your profile, update information, and explore upcoming features that will further strengthen your online presence and streamline engagement with patients." +
  "</p>" +
  '<p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 12px">' +
  'If you need assistance, our support team is always here to help. Contact us at ' +
  '<a href="mailto:support@drstethos.com" style="color:#1d4ed8;text-decoration:none">support@drstethos.com</a>.' +
  "</p>" +
  '<p style="color:#334155;font-size:14px;margin-top:20px;margin-bottom:0">' +
  "Warm regards,<br/><strong style=\"color:#1d4ed8\">Team DrStethos</strong></p>" +
  "</div></div>";

const approvalText =
  "Dear {{profileName}},\n\n" +
  "Congratulations! Your {{profileType}} profile has been successfully verified and approved on DrStethos.\n\n" +
  "Open your dashboard: {{dashboardLink}}\n\n" +
  "If you need assistance, contact support@drstethos.com.\n\n" +
  "Warm regards,\nTeam DrStethos";

const doctorApprovalTemplate = {
  enabled: true,
  description: "Sent when a doctor profile is approved",
  subject: "Welcome to DrStethos — your doctor profile is approved",
  text: approvalText,
  html: approvalHtml,
};

const hospitalApprovalTemplate = {
  enabled: true,
  description: "Sent when a hospital profile is approved",
  subject: "Welcome to DrStethos — your hospital profile is approved",
  text: approvalText,
  html: approvalHtml,
};

module.exports = {
  doctorApprovalTemplate,
  hospitalApprovalTemplate,
};
