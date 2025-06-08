const { calendar } = require("./calendarClient");

async function listEvents() {
  const res = await calendar.events.list({
    calendarId: "primary",
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items;
  if (events.length === 0) {
    console.log("Tidak ada event dalam waktu dekat.");
    return;
  }

  console.log("📅 Event terdekat:");
  events.forEach((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${i + 1}. ${start} — ${event.summary}`);
  });
}

listEvents().catch(console.error);
