const winston = require("winston");
const { combine, timestamp, prettyPrint, printf } = winston.format;
const { LOG_LEVEL } = require("./environment");

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: myFormat,
    })
  );
}

module.exports = logger;
