const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GIBS_BASE =
  "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi";

// Build NASA GIBS image URL
function buildGibsUrl(date, bbox) {
  return (
    `${GIBS_BASE}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0` +
    `&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor` +
    `&FORMAT=image/jpeg` +
    `&CRS=EPSG:4326` +
    `&WIDTH=800&HEIGHT=800` +
    `&TIME=${date}` +
    `&BBOX=${bbox}`
  );
}

// Shift date by N days
function shiftDate(baseDate, days) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

exports.fetchSatelliteImages = async (req, res) => {
  try {
    const { lat, lon, date } = req.body;

    // Bounding box around event
    const delta = 1.5;
    const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;

    const eventDate = new Date(date);
    const today = new Date();

    // ✅ BEFORE images (unchanged – already working)
    const beforeDates = [
      shiftDate(eventDate, -20),
      shiftDate(eventDate, -15),
      shiftDate(eventDate, -10)
    ];

    // ✅ AFTER images (FIXED: safer offsets)
    const rawAfterDates = [
      shiftDate(eventDate, +7),
      shiftDate(eventDate, +14),
      shiftDate(eventDate, +21)
    ];

    // ❗ Prevent future dates (black images)
    let afterDates = rawAfterDates.filter(
  d => new Date(d) <= today
);

// 🔁 Fallback for very recent events
if (afterDates.length === 0) {
  afterDates = [
    shiftDate(eventDate, -1),
    shiftDate(eventDate, -2),
    shiftDate(eventDate, -3)
  ];
}


    const beforeDir = path.join(__dirname, "../uploads/before");
    const afterDir = path.join(__dirname, "../uploads/after");

    fs.mkdirSync(beforeDir, { recursive: true });
    fs.mkdirSync(afterDir, { recursive: true });

    const beforeImages = [];
    const afterImages = [];

    // Download BEFORE images
    for (let i = 0; i < beforeDates.length; i++) {
      const url = buildGibsUrl(beforeDates[i], bbox);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 20000
      });

      const filePath = path.join(beforeDir, `before_${i}.jpg`);
      fs.writeFileSync(filePath, response.data);
      beforeImages.push(`/uploads/before/before_${i}.jpg`);
    }

    // Download AFTER images (FIXED)
    for (let i = 0; i < afterDates.length; i++) {
      const url = buildGibsUrl(afterDates[i], bbox);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 20000
      });

      const filePath = path.join(afterDir, `after_${i}.jpg`);
      fs.writeFileSync(filePath, response.data);
      afterImages.push(`/uploads/after/after_${i}.jpg`);
    }

    res.json({
      beforeImages,
      afterImages
    });

  } catch (error) {
    console.error("Satellite fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch satellite images" });
  }
};
