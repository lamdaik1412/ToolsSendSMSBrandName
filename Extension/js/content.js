const API = 'https://apibatso.vnptvinhlong.vn/api/SMS_Brandname/'
const ID = 86019

const InitButton = () => {
    let btnSave = ` <input name="saveSMS" type="button" id="saveSMS" value="Gửi tin nhắn" class="button_shadow height_1" style="width:120px"> `;
    $("#ngayhen").after(btnSave)
}

$(document).ready(function () {
    InitButton()
    
    $(document).on("click", "#saveSMS", function () {
        let thongTinBenhNhan = GetThongTinBenhNhan();
        Save(thongTinBenhNhan)
    })

    function GetThongTinBenhNhan() {
        let thongTinBenhNhan = {
            id_donvi: `${ID}`,
            hoten: $("#hoten").val(),
            myt: $("#mayte").val(),
            bhyt: $("#bhyt").val(),
            diachi: $("#diachi").val(),
            ngayhen: $("#ngayhen").val(),
            sdt: $("#sdt_benhnhan").val()
        }
        return thongTinBenhNhan
    }




    function Save(thongTinBenhNhan) {
        if (thongTinBenhNhan.hoten == '' || thongTinBenhNhan.hoten == null || thongTinBenhNhan.hoten == undefined) {
            alert("Vui lòng kiểm tra lại tên bệnh nhân")
            return
        } else if (thongTinBenhNhan.sdt == '' || thongTinBenhNhan.sdt == null || thongTinBenhNhan.sdt == undefined || thongTinBenhNhan.sdt.length < 10) {
            alert("Bệnh nhân không có số điện thoại hợp lệ.")
            return
        } else if (thongTinBenhNhan.ngayhen == '' || thongTinBenhNhan.ngayhen == null || thongTinBenhNhan.ngayhen == undefined || thongTinBenhNhan.ngayhen.length != 10) {
            alert("Vui lòng kiểm tra lại ngày hẹn")
            return
        } else {
            $.ajax({
                url: API + 'LuuLichGui',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(thongTinBenhNhan),
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
