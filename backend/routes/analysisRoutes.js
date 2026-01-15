const express = require("express");
const router = express.Router();
const { analyzeEvent } = require("../controllers/analysisController");

router.post("/", analyzeEvent);

module.exports = router;
