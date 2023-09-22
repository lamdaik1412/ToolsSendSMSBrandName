const { connectToDatabase } = require('./data/database');
const { setupScheduler, getDanhSachHenTaiKham_86147 } = require('./schedules/scheduler');
const { GuiTinNhan } = require('./schedules/sender');
const logger = require('./utils/logger')

async function startApp() {
    logger.info("Khởi chạy app")
    logger.info("Kết nối database")
    if (await connectToDatabase()) {
        logger.info("Khởi chạy setupScheduler")
        await getDanhSachHenTaiKham_86147()
        await setupScheduler();
    }
}

startApp();
