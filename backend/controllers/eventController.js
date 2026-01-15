const axios = require("axios");

exports.getLiveEvents = async (req, res) => {
  try {
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      { timeout: 10000 }
    );

    const events = response.data.features.slice(0, 8).map((eq, index) => ({
      id: index + 1,
      title: eq.properties.place,
      category: "Earthquake",
      magnitude: eq.properties.mag,
      date: new Date(eq.properties.time).toISOString(),
      coordinates: {
        lat: eq.geometry.coordinates[1],
        lon: eq.geometry.coordinates[0]
      }
    }));

    res.json(events);
  } catch (error) {
    console.error("USGS ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch earthquake events" });
  }
};
