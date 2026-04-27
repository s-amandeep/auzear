require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();


const insightRoutes = require("./routes/insightRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api", apiLimiter);
// app.use(cors());
app.use(cors({
  origin: "*", // for MVP (later restrict)
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auzear API running");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/v2/teaching", require("./routes/teachingRoutesV2"));
app.use("/api/v2/session", require("./routes/sessionRoutesV2"));
app.use("/api/v2/topics", require("./routes/topicRoutesV2"));

app.use("/api/insights", insightRoutes);

app.use(errorHandler); // 🔥 MUST be last

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});