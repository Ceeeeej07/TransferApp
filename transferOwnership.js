// const fs = require('fs');
// const { google } = require('googleapis');
// require('dotenv').config();

// // 🔹 Load OAuth2 Credentials
// const SCOPES = process.env.SCOPES.split(' ');
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const TOKEN_PATH = 'token.json';

// const FILE_ID = process.env.FILE_ID;
// const NEW_OWNER_EMAIL = process.env.NEW_OWNER_EMAIL;

// // 🔹 Set up OAuth2 Client
// const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// // 🔹 Check if token exists, else get new one
// fs.readFile(TOKEN_PATH, async (err, token) => {
//   if (err) {
//     console.log('🔹 No token found, getting a new one...');
//     return getAccessToken(oauth2Client);
//   }

//   oauth2Client.setCredentials(JSON.parse(token));
//   console.log('✅ Token loaded successfully!');

//   const drive = google.drive({ version: 'v3', auth: oauth2Client });

//   // Transfer Ownership after authentication
//   transferOwnership(drive);
// });

// // 🔹 Function to Transfer Ownership
// async function transferOwnership(drive) {
//   try {
//     console.log(`🔹 Requesting editor access for ${NEW_OWNER_EMAIL}...`);

//     // Step 1: Add new owner as an editor
//     const permission = await drive.permissions.create({
//       fileId: FILE_ID,
//       requestBody: {
//         type: 'user',
//         role: 'writer', // Required before ownership transfer
//         emailAddress: NEW_OWNER_EMAIL,
//       },
//       fields: 'id',
//     });

//     console.log(`✅ Editor access granted to ${NEW_OWNER_EMAIL}`);

//     console.log(`🔹 Requesting ownership transfer...`);

//     // Step 2: Transfer Ownership
//     await drive.permissions.update({
//       fileId: FILE_ID,
//       permissionId: permission.data.id, // Fetch permission ID dynamically
//       requestBody: { role: 'owner' },
//       transferOwnership: true,
//     });

//     console.log(
//       `✅ Ownership transfer request sent to ${NEW_OWNER_EMAIL} (pending acceptance)`
//     );
//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
//   }
// }

// // 🔹 Function to Get New Access Token (if missing)
// async function getAccessToken(oauth2Client) {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });

//   console.log(`🔹 Authorize this app by visiting: ${authUrl}`);
// }
