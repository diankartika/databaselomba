require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline");

(async () => {
  const open = (await import("open")).default;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "urn:ietf:wg:oauth:2.0:oob"
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log("Authorize this app by visiting this URL:\n", authUrl);
  await open(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", async (code) => {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      console.log("Your refresh token:\n", tokens.refresh_token);
    } catch (err) {
      console.error("Failed to get token:", err.response?.data || err.message);
    }
    rl.close();
  });
})();
