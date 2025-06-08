const { google } = require("googleapis");

function authorizeGoogle() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return oAuth2Client;
}

async function createEvent(data) {
  const auth = authorizeGoogle();
  const calendar = google.calendar({ version: "v3", auth });

  const startDateTime = new Date(data.deadline);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 jam kemudian

  const event = {
    summary: data.title,
    description: data.description,
    location: data.location,
    start: {
      dateTime: startDateTime.toISOString(),  // ⬅ ISO UTC
      timeZone: "Asia/Jakarta",               // ⬅ Google akan konversi ini
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "Asia/Jakarta",
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: event,
  });

  return response.data.id;
}

module.exports = { createEvent };
