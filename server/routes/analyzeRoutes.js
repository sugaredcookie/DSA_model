const express = require("express");
const { analyzeController } = require("../controllers/analyzeController");

const router = express.Router();

router.post("/analyze", analyzeController);

module.exports = router;