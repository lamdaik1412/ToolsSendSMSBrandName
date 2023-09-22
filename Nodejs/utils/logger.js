const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const logFormat = printf(({ level, message, timestamp }) => {
    const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
    return `${formattedTimestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    format: combine(timestamp(), logFormat),
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/tool-sms-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
        }),
        new transports.Console(),
    ],
});

module.exports = logger;
