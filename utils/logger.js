const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file')

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');



let logger = createLogger({
    format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
            const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
            return `${formattedTimestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new (transports.DailyRotateFile)({
            filename: 'logs/tool-sms-%DATE%.log',
            datePattern: 'YYYY-MM-DD-hh-mm',
            zippedArchive: true,
            maxSize: '20m',
        }),
        new transports.Console()
    ]
});
 
module.exports = logger;
