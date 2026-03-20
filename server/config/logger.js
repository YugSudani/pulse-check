const { createLogger, format, transports } = require("winston");

const { combine, timestamp, errors, printf, json } = format;

// Pretty format for dev
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

const isProd = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    isProd ? json() : devFormat
  ),
  transports: [
    // ✅ ALWAYS required for Render
    new transports.Console(),

    // ✅ Only in development
    ...(!isProd
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
});

module.exports = logger;