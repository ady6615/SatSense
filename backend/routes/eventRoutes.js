const express = require("express");
const router = express.Router();
const { getLiveEvents } = require("../controllers/eventController");

router.get("/", getLiveEvents);

module.exports = router;
