const express = require("express");
const router = express.Router();
const { generateTeaching } = require("../controllers/teachingController");

router.post("/", generateTeaching);
  
module.exports = router;