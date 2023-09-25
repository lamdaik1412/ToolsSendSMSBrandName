const schedule = require('node-schedule');
const { SMS_LayDanhSach_ThoiDiemGui_TheoDonVi, SMS_LayThongTin_CauHinh } = require('../data/storedProcedure');
const { SendSMSMessages } = require('./sender');
const logger = require('../utils/logger');
const axios = require('axios');

const scheduledJobs = {};

async function scheduleMessageSending(idDonVi, hour, minute) {
    scheduledJobs[idDonVi] = schedule.scheduleJob(`${idDonVi}`, { hour: parseInt(hour), minute: parseInt(minute) }, async () => {
        logger.info(`Gửi SMS vào thời điểm đã đặt: (${hour}:${minute}, ${idDonVi})`);
        await SendSMSMessages(idDonVi);
    });
    logger.info(`Đặt lịch gửi: (${hour}:${minute}, ${idDonVi})`);
}

async function cancelAndRescheduleJob(jobName) {
    if (scheduledJobs[jobName]) {
        const canceledJob = scheduledJobs[jobName];
        canceledJob.cancel();
        delete scheduledJobs[jobName]
        logger.info(`Huỷ và đặt lại công việc: ${jobName}`);

        const thoiDiemGuiArray = await SMS_LayDanhSach_ThoiDiemGui_TheoDonVi();
        thoiDiemGuiArray.forEach(async (thoiDiem) => {
            if (thoiDiem.id_donvi == jobName) {
                const [gio, phut] = thoiDiem.thoidiemgui.split(':');
                scheduleMessageSending(jobName, gio, phut);
            }
        });
    } else {
        console.log(`Không tìm thấy công việc có tên: ${jobName}`);
    }
}

async function setupScheduler() {
    try {
        const timeToSendArray = await SMS_LayDanhSach_ThoiDiemGui_TheoDonVi();

        // Huỷ tất cả các công việc đã lên lịch
        Object.values(scheduledJobs).forEach((job) => {
            job.cancel();
            logger.info(`Huỷ công việc có tên: ${job.name}`);
        });

        // Đặt lịch lại các công việc dựa trên danh sách thời điểm
        timeToSendArray.forEach(async (timeToSend) => {
            const [hour, minute] = timeToSend.thoidiemgui.split(':');
            scheduleMessageSending(timeToSend.id_donvi, hour, minute);
        });
    } catch (error) {
        logger.error('Lỗi khi thiết lập lịch: ' + error.toString());
    }
}

// for 86147
async function getAppointmentList() {
    const unitID = 86147
    const config = await SMS_LayThongTin_CauHinh(unitID);
    const daysBeforeSend = config.songayguitruoc ?? 1;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysBeforeSend);
    const searchDate = currentDate.toLocaleDateString('en-GB');
    const formData = new FormData();
    formData.append('tendn', process.env.HIS_USERNAME);
    formData.append('matkhau', process.env.HIS_PASSWORD);

    try {
        const loginResponse = await axios.post(process.env.HIS_API_LOGIN, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (loginResponse.data === 'SUCCESS') {
            const cookies = loginResponse.headers['set-cookie'];
            const cookieHeader = cookies.join('; ');
            const queryParams = {
                hentaikhamtungay: searchDate,
                hentaikhamdenngay: searchDate,
                _search: false,
                dvtt: unitID
            };

            const appointmentResponse = await axios.get(process.env.HIS_API_GET_LICH_HEN + new URLSearchParams(queryParams), {
                headers: {
                    Cookie: cookieHeader,
                },
            });

            const appointmentList = appointmentResponse.data;
            if (appointmentList.length === 0) {
                logger.info(`Danh sách bệnh nhân có ngày hẹn ${searchDate} trống`);
            } else {
                appointmentList.forEach(async benhNhan => {
                    const patientInfo  = {
                        id_donvi: `${unitID}`,
                        hoten: benhNhan.TEN_BENH_NHAN,
                        myt: `${benhNhan.MA_BENH_NHAN}`,
                        bhyt: benhNhan.SO_THE_BHYT,
                        diachi: benhNhan.DIA_CHI,
                        ngayhen: benhNhan.NGAY_HEN,
                        sdt: benhNhan.SO_DIEN_THOAI
                    };
                    try {
                        const response = await axios.post(process.env.API_VNPT_SMS + 'LuuLichGui', patientInfo , {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        console.log(response.data);
                    } catch (error) {
                        console.error('Error:', error.response.data);
                    }
                });
            }
        } else {
            logger.error('Lỗi khi đăng nhập: ' + loginResponse.data);
        }
    } catch (error) {
        logger.error('Lỗi khi đăng nhập: ' + error.response.statusText);
    }
}

schedule.scheduleJob(process.env.SCHEDULE_RELOAD_LIST, () => {
    logger.info(`Gọi hàm setupScheduler mỗi ${process.env.SCHEDULE_RELOAD_LIST}`);
    setupScheduler();
});

// NGỌC NHÂN
schedule.scheduleJob(process.env.SCHEDULE_86147, () => {
    logger.info(`Gọi hàm getAppointmentList mỗi ${process.env.SCHEDULE_86147}`);
    getAppointmentList();
});

module.exports = { setupScheduler, getAppointmentList, cancelAndRescheduleJob };
