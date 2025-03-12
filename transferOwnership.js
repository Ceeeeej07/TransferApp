const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = process.env.SCOPES.split(' ');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TOKEN_PATH = 'token.json';
const FILE_ID = process.env.FILE_ID;
const NEW_OWNER_EMAIL = process.env.NEW_OWNER_EMAIL;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

fs.readFile(TOKEN_PATH, async (err, token) => {
  if (err) return getAccessToken();

  oauth2Client.setCredentials(JSON.parse(token));
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  transferOwnership(drive);
});

function getAccessToken() {
  console.log(
    'Authorize this app:',
    oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
  );
}

async function transferOwnership(drive) {
  try {
    const permission = await drive.permissions.create({
      fileId: FILE_ID,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: NEW_OWNER_EMAIL,
      },
      fields: 'id',
      sendNotificationEmail: true,
    });

    await drive.permissions.update({
      fileId: FILE_ID,
      permissionId: permission.data.id,
      requestBody: { role: 'writer', pendingOwner: true },
      fields: 'id',
    });

    const { data } = await drive.permissions.list({
      fileId: FILE_ID,
      fields: 'permissions(emailAddress, pendingOwner)',
    });

    const pendingOwner = data.permissions.find((p) => p.pendingOwner);
    console.log(
      pendingOwner
        ? `${pendingOwner.emailAddress} is the new pending owner`
        : 'No pending owner.'
    );
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
