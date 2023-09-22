const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require("socket.io");

const { connectToDatabase } = require('./data/database');
const { setupScheduler, getDanhSachHenTaiKham_86147, reloadJob } = require('./schedules/scheduler');
const { GuiTinNhan } = require('./schedules/sender');
const logger = require('./utils/logger');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});




io.on('connection', (socket) => {
    //all of our things  we are going to use in sockets, different pipelines 
    console.log("User connected: " + socket.id);
    socket.on('reloadJob', (data) => {
        logger.info(data.message)
        reloadJob(data.id)
    });
    socket.on("Alert", (data) => {
        console.log(data);
    })
});
 
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


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
