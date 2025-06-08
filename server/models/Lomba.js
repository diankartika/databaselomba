const mongoose = require("mongoose");

const LombaSchema = new mongoose.Schema({
  title: String,
  organizer: String,
  deadline: Date,
  team: [String],
  notes: String,
  gcalEventId: String
});

module.exports = mongoose.model("Lomba", LombaSchema);
