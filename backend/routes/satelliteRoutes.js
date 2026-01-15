const express = require("express");
const router = express.Router();
const { fetchSatelliteImages } = require("../controllers/satelliteController");

router.post("/", fetchSatelliteImages);

module.exports = router;
