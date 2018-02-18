const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = format.printf(info => {
  return `${info.timestamp} [${process.env.NODE_ENV}] ${info.level}: ${info.message}`;
});


const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({ level: 'error' }),
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    new transports.File({ filename: 'log/combined.log' })
  ]
});


module.exports = logger;

