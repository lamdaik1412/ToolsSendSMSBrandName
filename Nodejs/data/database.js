const sql = require('mssql');
const logger = require('../utils/logger');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
    },
};

const connectToDatabase = async () => {
    try {
        await sql.connect(config);
        logger.info('Kết nối thành công đến SQL Server');
        return true;
    } catch (err) {
        logger.error('Lỗi khi kết nối đến SQL Server:', err);
        return false;
    }
};

const closeDatabaseConnection = () => {
    sql.close();
    logger.info('Đã đóng kết nối đến SQL Server');
};

process.on('SIGINT', closeDatabaseConnection);

module.exports = { connectToDatabase, sql };
