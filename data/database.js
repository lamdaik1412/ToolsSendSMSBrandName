const sql = require('mssql');
const logger = require('../utils/logger')
require('dotenv').config();

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST, // Địa chỉ server SQL Server (ví dụ: 'localhost' hoặc '127.0.0.1')
    database: process.env.DB_NAME, // Tên cơ sở dữ liệu
    port: parseInt(process.env.DB_PORT), // Cổng mặc định của SQL Server
    options: {
        encrypt: false, // Nếu bạn sử dụng kết nối qua SSL, đặt giá trị này thành true
    },
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        logger.info('Kết nối thành công đến SQL Server');
        return true;
    } catch (err) {
        logger.error('Lỗi khi kết nối đến SQL Server:', err);
        return false;
    }
}

process.on('SIGINT', () => {
    sql.close();
    logger.info('Đã đóng kết nối đến SQL Server');
    process.exit();
});

module.exports = { connectToDatabase, sql };
