const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const destroyer = require("server-destroy");
require("dotenv").config();

async function main() {
  // ⬅️ Import open() hanya di dalam fungsi async
  const open = (await import("open")).default;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/oauth2callback"
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  const server = http
    .createServer(async (req, res) => {
      if (req.url.includes("/oauth2callback")) {
        const qs = new url.URL(req.url, "http://localhost:3000").searchParams;
        const code = qs.get("code");

        res.end("✅ Login berhasil, silakan kembali ke terminal.");
        server.destroy();

        const { tokens } = await oAuth2Client.getToken(code);
        console.log("✅ Your refresh token:\n", tokens.refresh_token);
      }
    })
    .listen(3000, () => {
      console.log("🌐 Membuka browser...");
      open(authorizeUrl, { wait: false });
    });

  destroyer(server);
}

main().catch(console.error);
