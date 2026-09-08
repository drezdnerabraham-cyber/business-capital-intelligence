const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../config/gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../config/gmail-credentials.json');

function getOAuth2Client() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('gmail-credentials.json not found. Run: npm run setup-gmail');
  }
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function getAuthorizedClient() {
  const auth = getOAuth2Client();
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error('Gmail not authorized yet. Run: npm run setup-gmail');
  }
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  auth.setCredentials(token);
  return auth;
}

function buildEmailBody(application, lender) {
  const {
    business_name,
    owner_name,
    owner_email,
    owner_phone,
    monthly_revenue,
    time_in_business_months,
    credit_score,
    loan_amount_requested,
    industry,
    state,
    use_of_funds,
    additional_notes,
  } = application;

  const timeYears = Math.floor(time_in_business_months / 12);
  const timeMonths = time_in_business_months % 12;
  const timeStr = [
    timeYears > 0 ? `${timeYears} year${timeYears > 1 ? 's' : ''}` : '',
    timeMonths > 0 ? `${timeMonths} month${timeMonths > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(', ') || 'N/A';

  return `Hi ${lender.contact_name},

Please see the attached application for your review:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business Name:        ${business_name || 'N/A'}
Owner Name:           ${owner_name || 'N/A'}
State:                ${state || 'N/A'}
Industry:             ${industry || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monthly Revenue:      $${Number(monthly_revenue).toLocaleString()}
Time in Business:     ${timeStr}
Credit Score:         ${credit_score || 'N/A'}
Amount Requested:     $${Number(loan_amount_requested).toLocaleString()}
Use of Funds:         ${use_of_funds || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Owner Email:          ${owner_email || 'N/A'}
Owner Phone:          ${owner_phone || 'N/A'}

${additional_notes ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nADDITIONAL NOTES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${additional_notes}\n` : ''}
Please let me know if you need any additional documentation.

Best regards,
Backstone Capital`;
}

function encodeMimeMessage({ to, subject, body }) {
  const mime = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ].join('\r\n');

  return Buffer.from(mime).toString('base64url');
}

async function createDraft(application, lender) {
  const auth = getAuthorizedClient();
  const gmail = google.gmail({ version: 'v1', auth });

  const subject = `MCA Application – ${application.business_name} – $${Number(application.loan_amount_requested).toLocaleString()}`;
  const body = buildEmailBody(application, lender);

  const raw = encodeMimeMessage({
    to: `${lender.contact_name} <${lender.contact_email}>`,
    subject,
    body,
  });

  const response = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw } },
  });

  return {
    draft_id: response.data.id,
    lender_name: lender.name,
    lender_email: lender.contact_email,
    subject,
  };
}

module.exports = { createDraft };
