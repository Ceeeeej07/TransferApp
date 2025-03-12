const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = process.env.SCOPES.split(' ');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FILE_ID = process.env.FILE_ID;
const NEW_OWNER_EMAIL = process.env.NEW_OWNER_EMAIL;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function transferOwnership() {
  try {
    console.log(
      `🚀 Initiating transfer for ${NEW_OWNER_EMAIL} on file ${FILE_ID}...`
    );
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    console.log(`🔄 Granting editor access to ${NEW_OWNER_EMAIL}...`);
    const { data: permission } = await drive.permissions.create({
      fileId: FILE_ID,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: NEW_OWNER_EMAIL,
      },
      fields: 'id',
      sendNotificationEmail: true,
    });

    console.log(`✅ Editor access granted. Requesting ownership transfer...`);
    await drive.permissions.update({
      fileId: FILE_ID,
      permissionId: permission.id,
      requestBody: { role: 'writer', pendingOwner: true },
    });

    console.log(`🔍 Verifying ownership transfer...`);
    const { data } = await drive.permissions.list({
      fileId: FILE_ID,
      fields: 'permissions(emailAddress, pendingOwner)',
    });

    const pendingOwner = data.permissions.find((p) => p.pendingOwner);
    if (pendingOwner) {
      console.log(
        `🎉 Success! ${pendingOwner.emailAddress} is now the pending owner.`
      );
    } else {
      console.log(
        `⚠️ Transfer pending, but no pending owner detected. Please check manually.`
      );
    }
  } catch (error) {
    console.error(`❌ Transfer failed:`, error.response?.data || error.message);
  }
}

transferOwnership();
