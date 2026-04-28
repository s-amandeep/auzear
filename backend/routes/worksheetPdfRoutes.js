const express = require("express");
const router = express.Router();
const checkApiKey = require("../middleware/authMiddleware");

const {
  handleWorksheetPDF,
} = require("../controllers/worksheetPdfController");

router.post("/", checkApiKey, handleWorksheetPDF);

module.exports = router;
