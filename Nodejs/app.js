const { connectToDatabase } = require('./data/database');
const { setupScheduler, getAppointmentList } = require('./schedules/scheduler');
const logger = require('./utils/logger');

async function connectAndSetup() {
    logger.info("Kết nối database");
    if (await connectToDatabase()) {
        logger.info("Khởi chạy setupScheduler");
        await getAppointmentList();
        await setupScheduler();
    }
}

async function startApp() {
    logger.info("Khởi chạy app");
    await connectAndSetup();
}

module.exports = { startApp };
  