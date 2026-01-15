const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes (ALL must export a router)
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/satellite-images", require("./routes/satelliteRoutes"));
app.use("/api/generate-video", require("./routes/videoRoutes"));
app.use("/api/analyze", require("./routes/analysisRoutes"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
