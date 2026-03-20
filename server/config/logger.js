const { createLogger, format, transports } = require("winston");

const { combine, timestamp, errors, printf, json } = format;

// Custom format (for dev readability)
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }), // log stack traces
    json() // use JSON for production
  ),
  defaultMeta: { service: "monitor-service" },
  transports: [
    // Save errors separately
    new transports.File({ filename: "logs/error.log", level: "error" }),

    // Save all logs
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// 👇 Console logging (only in dev)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}

module.exports = logger;