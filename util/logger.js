const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(function(info) {
  return `${info.timestamp} [${process.env.NODE_ENV}] ${info.level}: ${info.message}`;
});


const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({ level: 'error' }),
    new transports.File({
      filename: 'log/error.log',
      level: 'error'
    }),
    new transports.File({ filename: 'log/combined.log' })
  ]
});


module.exports = logger;

