const schedule = require('node-schedule')
const { SMS_LayDanhSach_ThoiDiemGui_TheoDonVi, SMS_LayThongTin_CauHinh } = require('../data/storedProcedure')
const { GuiTinNhan } = require('./sender')
const logger = require('../utils/logger')
const { default: axios } = require('axios')

const scheduledJobs = {}

async function reloadJob(jobToCancel) {
    console.log(scheduledJobs['86019']);
    if (scheduledJobs[jobToCancel]) {
        scheduledJobs[jobToCancel].cancel();
        delete scheduledJobs[jobToCancel]; // Remove the canceled job from the data structure
        logger.info(`Huỷ job có name: ${jobToCancel}`)
        const thoiDiemGuiArray = await SMS_LayDanhSach_ThoiDiemGui_TheoDonVi()
        thoiDiemGuiArray.forEach(async (thoiDiem) => {
            if (`${thoiDiem.id_donvi}` == jobToCancel) {
                const [gio, phut] = thoiDiem.thoidiemgui.split(':')
                addScheduler(jobToCancel,gio,phut)
            }
        })
    } else {
        console.log(`Không tìm thấy job có name: ${jobToCancel}`);
    }
}

async function addScheduler(idDonVi, gio, phut) {
    scheduledJobs[idDonVi] = schedule.scheduleJob(`${idDonVi}`, { hour: parseInt(gio), minute: parseInt(phut) }, async () => {
        logger.info(`Gửi SMS vào thời điểm đã đặt: (${gio}:${phut}, ${idDonVi})`)
        await GuiTinNhan(thoiDiem.id_donvi)
    })
    logger.info(`Đặt lịch gửi: (${gio}:${phut}, ${idDonVi})`)
}

async function setupScheduler() {
    const thoiDiemGuiArray = await SMS_LayDanhSach_ThoiDiemGui_TheoDonVi()
    if (thoiDiemGuiArray) {
        for (const key in scheduledJobs) {
            scheduledJobs[key].cancel()
            logger.info(`Huỷ job có name: ${scheduledJobs[key].name}`)
        }
        thoiDiemGuiArray.forEach(async (thoiDiem) => {
            const [gio, phut] = thoiDiem.thoidiemgui.split(':')
            addScheduler(thoiDiem.id_donvi, gio, phut)
        })
    }
}

async function getDanhSachHenTaiKham_86147() {
    const ID = 86147
    const config = await SMS_LayThongTin_CauHinh(ID)
    const numberDayToSend = config.songayguitruoc ?? 1
    const date = new Date()
    date.setDate(date.getDate() + numberDayToSend)
    const searchDate = date.toLocaleDateString('en-GB')
    const formData = new FormData()
    formData.append('tendn', process.env.HIS_USERNAME)
    formData.append('matkhau', process.env.HIS_PASSWORD)
    axios.post(process.env.HIS_API_LOGIN_HIS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then((response) => {
            if (response.data === 'SUCCESS') {
                const cookies = response.headers['set-cookie']
                const cookieHeader = cookies.join('; ')
                const queryParams = {
                    hentaikhamtungay: searchDate,
                    hentaikhamdenngay: searchDate,
                    _search: false,
                    dvtt: ID
                }

                axios
                    .get(process.env.HIS_API_GET_LICH_HEN + new URLSearchParams(queryParams), {
                        headers: {
                            Cookie: cookieHeader,
                        },
                    })
                    .then((response) => {
                        const dsBenhNhan = response.data
                        if (dsBenhNhan.length === 0) {
                            logger.info(`Danh sách bệnh nhân có ngày hẹn ${searchDate} trống`)
                        } else {
                            dsBenhNhan.forEach(async benhNhan => {
                                const thongTinBenhNhan = {
                                    id_donvi: `${ID}`,
                                    hoten: benhNhan.TEN_BENH_NHAN,
                                    myt: `${benhNhan.MA_BENH_NHAN}`,
                                    bhyt: benhNhan.SO_THE_BHYT,
                                    diachi: benhNhan.DIA_CHI,
                                    ngayhen: benhNhan.NGAY_HEN,
                                    sdt: benhNhan.SO_DIEN_THOAI
                                }
                                axios
                                    .post(process.env.API_VNPT_SMS + 'LuuLichGui', thongTinBenhNhan, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    })
                                    .then((response) => {
                                        console.log(response.data);
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error.response.data);
                                    });
                            })
                        }
                    })
                    .catch((error) => {
                        logger.error('Lỗi khi gọi API danh sách bệnh nhân: ' + error.toString())
                    })
            } else {
                logger.error('Lỗi khi đăng nhập: ' + response.data)
            }
        })
        .catch((error) => {
            logger.error('Lỗi khi đăng nhập: ' + error.response.statusText)
        })
}

schedule.scheduleJob(process.env.SCHEDULE_RELOAD_LIST, () => {
    logger.info(`Gọi hàm setupScheduler mỗi ${process.env.SCHEDULE_RELOAD_LIST}`)
    setupScheduler()
})
//NGỌC NHÂN
schedule.scheduleJob(process.env.SCHEDULE_86147, () => {
    logger.info(`Gọi hàm getDanhSachHenTaiKham_86147 mỗi ${process.env.SCHEDULE_86147}`)
    getDanhSachHenTaiKham_86147()
})

// Xuất hàm setupScheduler để sử dụng trong app.js
module.exports = { setupScheduler, getDanhSachHenTaiKham_86147, reloadJob }