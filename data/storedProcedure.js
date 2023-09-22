const { sql } = require('./database');
const logger = require('../utils/logger')

async function SMS_LayDanhSach_ThoiDiemGui_TheoDonVi() {
    try {
        logger.info("Gọi stored SMS_LayDanhSach_ThoiDiemGui_TheoDonVi")
        const result = await sql.query`SMS_LayDanhSach_ThoiDiemGui_TheoDonVi`;
        if (result.recordset.length > 0) {
            return result.recordset;
        } else {
            logger.error('Không tìm thấy dữ liệu');
            return null;
        }
    } catch (err) {
        logger.error('Lỗi khi truy vấn SQL:', err);
        return null;
    }
}

async function SMS_LayDanhSach_LichGui(idDonVi) {
    try {
        logger.info("Gọi stored SMS_LayDanhSach_LichGui")
        const result = await sql.query`SMS_LayDanhSach_LichGui ${idDonVi}`;
        if (result.recordset.length > 0) {
            return result.recordset;
        } else {
            logger.error('Không tìm thấy dữ liệu');
            return null;
        }
    } catch (err) {
        logger.error('Lỗi khi truy vấn SQL:', err);
        return null;
    }
}
 
async function SMS_Luu_Log(idDonVi, xml, noiDung, sdt, myt, ketQua, id) {
    try {
        const request = new sql.Request();
        request.input('id_donvi', sql.NVarChar(10), idDonVi);
        request.input('xml', sql.NVarChar(1000), xml);
        request.input('noidung', sql.NVarChar(2000), noiDung);
        request.input('sdt', sql.VarChar(20), sdt);
        request.input('myt', sql.VarChar(20), myt);   
        request.input('ketqua', sql.NVarChar(150), ketQua);
        request.input('id', sql.Int, id);
        logger.info("Gọi stored SMS_Luu_Log")
        return request.execute('SMS_Luu_Log');
    } catch (err) {
        logger.error('Lỗi khi truy vấn SQL:', err);
        return null;
    }
} 

async function SMS_LayThongTin_CauHinh(idDonVi) {
    try {
        const request = new sql.Request();
        request.input('id_donvi', sql.Int, idDonVi);
        logger.info("Gọi stored SMS_LayThongTin_CauHinh")
        return (await request.execute('SMS_LayThongTin_CauHinh')).recordset[0];
    } catch (err) {
        logger.error('Lỗi khi truy vấn SQL:', err);
        return null;
    }
}
module.exports = { SMS_LayDanhSach_ThoiDiemGui_TheoDonVi, SMS_LayDanhSach_LichGui, SMS_Luu_Log, SMS_LayThongTin_CauHinh };
