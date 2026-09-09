const winston = require("winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Directory where logs are stored. LOG_DIR allows deployment-specific overrides.
const logDir = process.env.LOG_DIR || path.join(__dirname, "logs");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || "kafka-tutorials" },
  transports: [
    // Write all logs with level >= error to error.log
    new winstonDailyRotateFile({
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      dirname: logDir,
      maxFiles: "14d",
      zippedArchive: false,
      maxSize: "20m",
    }),
    // Write all logs with level >= info to combined.log
    new winstonDailyRotateFile({
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      maxFiles: "14d",
      zippedArchive: false,
      maxSize: "20m",
    }),
    // Print to console so docker logs / container orchestration can capture it.
    // Structured JSON is preferred by log aggregators (ELK, Datadog, etc.).
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
        ),
      ),
    }),
  ],
  exceptionHandlers: [
    new winstonDailyRotateFile({
      filename: "exception-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      maxFiles: "14d",
    }),
  ],
  rejectionHandlers: [
    new winstonDailyRotateFile({
      filename: "rejection-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      maxFiles: "14d",
    }),
  ],
});

module.exports = logger;
