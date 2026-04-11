require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const teachingRoutes = require("./routes/teachingRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const questionRoutes = require("./routes/questionRoutes");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auzear API running");
});

app.use("/api/teaching", teachingRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/revision", revisionRoutes);
app.use("/api/questions", questionRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});