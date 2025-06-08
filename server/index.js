require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Logger semua request
app.use((req, res, next) => {
  console.log(`🔍 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Import routes
const lombaRoutes = require("./routes/lomba");
app.use("/api/lomba", lombaRoutes);

// Connect ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server berjalan di http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error("❌ DB Error:", err));
