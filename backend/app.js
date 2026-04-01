require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const teachingRoutes = require("./routes/teachingRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auzear API running");
});

app.use("/api/teaching", teachingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});