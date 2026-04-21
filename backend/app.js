require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

const teachingRoutes = require("./routes/teachingRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const insightRoutes = require("./routes/insightRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api", apiLimiter);
// app.use(cors());
app.use(cors({
  origin: "*", // for MVP (later restrict)
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auzear API running");
});

app.use("/api/teaching", teachingRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/revision", revisionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});