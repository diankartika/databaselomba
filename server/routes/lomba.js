const express = require("express");
const router = express.Router();
const Lomba = require("../models/Lomba");
const { createEvent } = require("../services/googleCalendar");

router.post("/", async (req, res) => {
  try {
    console.log("✅ POST /api/lomba hit, req.body:", req.body);

    const newLomba = new Lomba(req.body);
    console.log("🔄 Calling createEvent()...");

    const eventId = await createEvent(req.body);
    console.log("📥 Event ID returned:", eventId);

    if (eventId) newLomba.gcalEventId = eventId;

    await newLomba.save();
    res.status(201).json(newLomba);
  } catch (err) {
    console.error("🔥 ERROR in POST /api/lomba:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/test", (req, res) => {
  console.log("🎯 POST /api/lomba/test HIT");
  res.json({ message: "Test success" });
});


router.get("/", async (req, res) => {
  try {
    const lombas = await Lomba.find();
    res.json(lombas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/ping", (req, res) => {
  console.log("🎯 GET /api/lomba/ping HIT");
  res.json({ message: "pong" });
});

module.exports = router;
