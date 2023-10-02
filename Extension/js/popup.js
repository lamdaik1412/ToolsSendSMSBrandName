const API_URL = 'https://apibatso.vnptvinhlong.vn/api/SMS_Brandname/'
const UNIT_ID = 86019
//const socket = io.connect('http://localhost:8823')
const socket = io.connect('http://113.161.196.10:8823/')
const DEFAULT_CONFIG = { thoidiemgui: '07:00', songayguitruoc: 1 }
const NEW_CONFIG = { id_donvi: `${UNIT_ID}` }

const loadConfig = () => {
    $.ajax({
        url: API_URL + 'SMSLayThongTinCauHinh',
        type: 'GET',
        data: { donvi: '86019' },
        success: function (response) {
            const config = response.length >= 0 ? response[0] : DEFAULT_CONFIG
            $("#time").val(config.thoidiemgui)
            $("#number").val(config.songayguitruoc)
            console.log("Config loaded from server")
        },
        error: function () {
            $("#time").val(DEFAULT_CONFIG.thoidiemgui)
            $("#number").val(DEFAULT_CONFIG.songayguitruoc)
        }
    })
}

const resetInput = () => {
    $("#password").val(null)
}

$(document).ready(function () {
    loadConfig()

    $(document).on("click", "#btnSave", function () {
        NEW_CONFIG.thoidiemgui = $("#time").val()
        NEW_CONFIG.songayguitruoc = $("#number").val()
        const thoidiemgui = NEW_CONFIG.thoidiemgui
        const songayguitruoc = NEW_CONFIG.songayguitruoc

        if (!thoidiemgui || !songayguitruoc) {
            $.notify("Vui lòng nhập thời điểm và số ngày", "error")
            return
        }

        $("#modalConfirmSave").modal('show')
        setTimeout(() => $("#password").focus(), 500)
    })

    $(document).on("click", ".btnClose", function () {
        $("#modalConfirmSave").modal('hide')
    })

    $(document).on("click", "#btnSavePassword", function () {
        const oldPassword = $("#oldPassword").val()
        const newPassword = $("#newPassword").val()

        if (oldPassword === newPassword) {
            $.notify("Mật khẩu mới không được trùng với mật khẩu cũ", "error")
            return
        }

        if (!newPassword || newPassword.length < 8) {
            $.notify("Vui lòng nhập mật khẩu có độ dài từ 8 ký tự", "error")
            return
        }

        const passwordData = {
            id_donvi: `${UNIT_ID}`,
            password: oldPassword,
            password_new: newPassword
        }

        $.ajax({
            url: API_URL + 'DoiMatKhau',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(passwordData),
            success: function (response) {
                if (response.length === 0) {
                    $.notify("Đổi mật khẩu không thành công, kiểm tra lại mật khẩu cũ!", 'error')
                } else {
                    $.notify("Đổi mật khẩu thành công!", 'success')
                    $("#oldPassword").val(null)
                    $("#newPassword").val(null)
                }
            },
            error: function () {
                console.error('Error during password change')
            }
        })
    })

    $(document).on("click", ".btnConfirm", function () {
        save()
    })

    // Bắt sự kiện nhấn phím Enter trong trường có id="password"
    $("#password").keydown(function (e) {
        if (e.which === 13) { // Kiểm tra phím Enter
            save()
        }
    });

    function save() {
        NEW_CONFIG.password = $("#password").val()

        if (!NEW_CONFIG.password) {
            $.notify("Vui lòng nhập mật khẩu", "error")
            $("#password").focus()
            return
        }

        const jsonData = JSON.stringify(NEW_CONFIG)

        $.ajax({
            url: API_URL + 'LuuThongTinCauHinh',
            type: 'POST',
            contentType: 'application/json',
            data: jsonData,
            success: function (response) {
                if (response.length > 0) {
                    $.notify("Cập nhật thành công!", "success")
                    socket.emit('cancelAndRescheduleJob', { message: 'Khách hàng cấu hình thời điểm gửi tin nhắn', id: 86019 })
                    loadConfig()
                } else {
                    $.notify("Cập nhật không thành công, vui lòng kiểm tra lại mật khẩu", "error")
                }
            },
            error: function () {
                console.error('Error during configuration update')
            }
        })

        resetInput()
        $("#modalConfirmSave").modal('hide')
    }
})
