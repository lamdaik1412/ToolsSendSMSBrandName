const API_URL = 'https://apibatso.vnptvinhlong.vn/api/SMS_Brandname/'
const UNIT_ID = 86019

const InitButton = () => {
    let btnSave = ` <input name="saveSMS" type="button" id="saveSMS" value="Gửi tin nhắn" class="button_shadow height_1" style="width:120px"> `;
    $("#ngayhen").after(btnSave)
}

$(document).ready(function () {
    InitButton()

    $(document).on("click", "#saveSMS", function () {
        let patientInfo = getPatientInfo();
        save(patientInfo)
    })

    function getPatientInfo() {
        let patientInfo = {
            id_donvi: `${UNIT_ID}`,
            hoten: $("#hoten").val(),
            myt: $("#mayte").val(),
            bhyt: $("#bhyt").val(),
            diachi: $("#diachi").val(),
            ngayhen: $("#ngayhen").val(),
            sdt: $("#sdt_benhnhan").val()
        }
        return patientInfo
    }

    function save(patientInfo) {
        if (patientInfo.hoten === '' || patientInfo.hoten === null || patientInfo.hoten === undefined) {
            alert("Vui lòng kiểm tra lại tên bệnh nhân")
            return
        } else if (patientInfo.sdt === '' || patientInfo.sdt === null || patientInfo.sdt === undefined || patientInfo.sdt.length < 10) {
            alert("Bệnh nhân không có số điện thoại hợp lệ.")
            return
        } else if (patientInfo.ngayhen === '' || patientInfo.ngayhen === null || patientInfo.ngayhen === undefined || patientInfo.ngayhen.length != 10) {
            alert("Vui lòng kiểm tra lại ngày hẹn")
            return
        } else {
            $.ajax({
                url: API_URL + 'LuuLichGui',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(patientInfo),
                success: function (response) {
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                }
            });
        }
    }
})
