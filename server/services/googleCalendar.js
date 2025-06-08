const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Set credentials from saved refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

async function createEvent(lomba) {
  const event = {
    summary: lomba.title,
    description: lomba.notes || "",
    start: {
      dateTime: new Date(lomba.deadline).toISOString(),
      timeZone: "Asia/Jakarta",
    },
    end: {
      dateTime: new Date(new Date(lomba.deadline).getTime() + 3600000).toISOString(), // +1 jam
      timeZone: "Asia/Jakarta",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      resource: event,
    });
    return response.data.id; // eventId
  } catch (error) {
    console.error("Failed to create calendar event:", error.message);
    return null;
  }
}

module.exports = { createEvent };
