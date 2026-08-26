/**
 * Run this once to authorize Gmail access:
 *   npm run setup-gmail
 *
 * It will open a browser URL — paste the code back into the terminal.
 * After that, gmail-token.json is saved and the server can create drafts.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_PATH = path.join(__dirname, '../config/gmail-credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/gmail-token.json');

const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error(`
ERROR: gmail-credentials.json not found at:
  ${CREDENTIALS_PATH}

Steps to get it:
  1. Go to https://console.cloud.google.com/
  2. Create a project (or select existing)
  3. Enable "Gmail API"
  4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
  5. Application type: Desktop app
  6. Download the JSON file
  7. Save it as: config/gmail-credentials.json
  8. Run: npm run setup-gmail
`);
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const authUrl = auth.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

console.log('\n=== Gmail Authorization ===');
console.log('\nOpen this URL in your browser:\n');
console.log(authUrl);
console.log('');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Paste the authorization code here: ', (code) => {
  rl.close();
  auth.getToken(code.trim(), (err, token) => {
    if (err) {
      console.error('Error getting token:', err);
      process.exit(1);
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log('\nGmail authorized. Token saved to config/gmail-token.json');
    console.log('You can now start the server: npm start');
  });
});
