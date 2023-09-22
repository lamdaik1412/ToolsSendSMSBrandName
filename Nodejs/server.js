const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { startApp } = require("./app");
const { cancelAndRescheduleJob } = require("./schedules/scheduler");
const logger = require('./utils/logger');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    const { id } = socket;
    logger.info(`User connected: ${id}`);
    socket.on("cancelAndRescheduleJob", ({ id, message }) => {
        logger.info(message);
        cancelAndRescheduleJob(id);
    });
});

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
    startApp();
}); 