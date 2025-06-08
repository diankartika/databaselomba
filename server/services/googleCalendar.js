const { google } = require("googleapis");
const readline = require("readline");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob" // redirect manual
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("🌐 Buka URL berikut dan paste kodenya di bawah:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("📥 Masukkan kode: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ REFRESH TOKEN:", tokens.refresh_token);
  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err.message);
  }
  rl.close();
});
