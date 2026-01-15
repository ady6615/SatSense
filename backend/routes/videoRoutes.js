const express = require("express");
const router = express.Router();
const { generateVideo } = require("../controllers/videoController");

router.post("/", generateVideo);

module.exports = router;
