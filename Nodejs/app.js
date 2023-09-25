const { connectToDatabase } = require('./data/database');
const { setupScheduler, getAppointmentList } = require('./schedules/scheduler');
const { SendSMSMessages } = require('./schedules/sender');
const logger = require('./utils/logger');

async function connectAndSetup() {
    logger.info("Kết nối database");
    if (await connectToDatabase()) {
        logger.info("Khởi chạy setupScheduler");
        await getAppointmentList();
        await setupScheduler();
        SendSMSMessages(86019)
    }
}

async function startApp() {
    logger.info("Khởi chạy app");
    await connectAndSetup();
}

module.exports = { startApp };
 