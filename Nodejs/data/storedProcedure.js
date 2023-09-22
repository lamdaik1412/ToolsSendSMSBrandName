const { sql } = require('./database');
const logger = require('../utils/logger');

const executeStoredProcedure = async (storedProcedureName, parameters) => {
    try {
        const request = new sql.Request();
        if (parameters) {
            for (const paramName in parameters) {
                if (parameters.hasOwnProperty(paramName)) {
                    request.input(paramName, parameters[paramName].type, parameters[paramName].value);
                }
            }
        }
        logger.info(`Gọi stored ${storedProcedureName}`);
        const result = await request.execute(storedProcedureName);
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
};

const SMS_LayDanhSach_ThoiDiemGui_TheoDonVi = async () => {
    return await executeStoredProcedure('SMS_LayDanhSach_ThoiDiemGui_TheoDonVi');
};

const SMS_LayDanhSach_LichGui = async (idDonVi) => {
    return await executeStoredProcedure('SMS_LayDanhSach_LichGui', { idDonVi: { type: sql.Int, value: idDonVi } });
};

const SMS_Luu_Log = async (idDonVi, xml, noiDung, sdt, myt, ketQua, id) => {
    const parameters = {
        id_donvi: { type: sql.NVarChar(10), value: idDonVi },
        xml: { type: sql.NVarChar(1000), value: xml },
        noidung: { type: sql.NVarChar(2000), value: noiDung },
        sdt: { type: sql.VarChar(20), value: sdt },
        myt: { type: sql.VarChar(20), value: myt },
        ketqua: { type: sql.NVarChar(150), value: ketQua },
        id: { type: sql.Int, value: id },
    };
    return await executeStoredProcedure('SMS_Luu_Log', parameters);
};

const SMS_LayThongTin_CauHinh = async (idDonVi) => {
    return await executeStoredProcedure('SMS_LayThongTin_CauHinh', { id_donvi: { type: sql.Int, value: idDonVi } });
};

module.exports = { SMS_LayDanhSach_ThoiDiemGui_TheoDonVi, SMS_LayDanhSach_LichGui, SMS_Luu_Log, SMS_LayThongTin_CauHinh };
