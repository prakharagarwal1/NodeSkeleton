const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: __dirname + "/.env" });
const helmet = require("helmet");
const bodyParser = require("body-parser");
const logger = require("./logger");

// IMPORTANT: register CORS BEFORE helmet. Helmet's default
// Cross-Origin-Resource-Policy / Cross-Origin-Opener-Policy headers will
// otherwise block legitimate browser fetches even when CORS is enabled.
app.use(cors());
app.use(helmet());

app.use(bodyParser.json()); // Import the database connection

// Log every request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  logger.info("Root endpoint hit");
  res.send("Project is running successfully");
});

// Global error handler — always respond with JSON so callers (and Postman)
// get a meaningful message instead of an HTML stack-trace page.
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    error: err.message,
    name: err.name,
    code: err.code,
    keyValue: err.keyValue,
    stack: err.stack,
  });
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
