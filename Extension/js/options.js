const API = 'https://apibatso.vnptvinhlong.vn/api/SMS_Brandname/'
const ID = 86019
let DEFAULT_CURRENT_CONFIG = {
    thoidiemgui: '07:00',
    songayguitruoc: 1
}
let NEW_CONFIG = {
    id_donvi: `${ID}`
}
const loadConfig = () => {
    $.ajax({
        url: API + 'SMSLayThongTinCauHinh',
        type: 'GET',
        data: {
            donvi: '86019'
        },
        // xhrFields: {
        //     withCredentials: true
        // },
        // headers: {
        //     'Access-Control-Allow-Origin': '*',
        //     // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        //     // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        // },
        success: function (response) {
            if (response.length >= 0) {
                let config = response[0]
                $("#time").val(config.thoidiemgui)
                $("#number").val(config.songayguitruoc)
                console.log("Server config loaded")
            } else {
                $("#time").val(DEFAULT_CURRENT_CONFIG.thoidiemgui)
                $("#number").val(DEFAULT_CURRENT_CONFIG.songayguitruoc)
                console.log("Default config loaded")
            }
        },
        error: function (xhr, status, error) {
            $("#time").val(DEFAULT_CURRENT_CONFIG.thoidiemgui)
            $("#number").val(DEFAULT_CURRENT_CONFIG.songayguitruoc)
        }
    });
}
const resetInput = () => {
    $("#password").val(null)
}

$(document).ready(function () {
    loadConfig()
    //#region Event click
    //CHỈNH THỜI GIAN
    $(document).on("click", "#btnSave", function () {
        NEW_CONFIG.thoidiemgui = $("#time").val()
        NEW_CONFIG.songayguitruoc = $("#number").val()
        if (NEW_CONFIG.thoidiemgui == '' || NEW_CONFIG.thoidiemgui == null || NEW_CONFIG.thoidiemgui == undefined) {
            $.notify("Vui lòng nhập thời điểm", "error")
            return
        }
        else if (NEW_CONFIG.songayguitruoc == '' || NEW_CONFIG.songayguitruoc == null || NEW_CONFIG.songayguitruoc == undefined) {
            $.notify("Vui lòng nhập số ngày", "error")
            return
        }

        $("#modalConfirmSave").modal('show')
        setTimeout(function () {
            $("#password").focus()
        }, 500)
    })

    //ĐÓNG MODAL NHẬP MẬT KHẨU
    $(document).on("click", ".btnClose", function () {
        $("#modalConfirmSave").modal('hide')
    })

    //ĐỔI MẬT KHẨU
    $(document).on("click", "#btnSavePassword", function () {
        let password = {
            id_donvi: `${ID}`,
            password: $("#oldPassword").val(),
            password_new: $("#newPassword").val()
        }
        if (password.password != password.password_new) {
            //đổi mật khẩu
            if (password.password_new == '' || password.password_new == null || password.password_new == undefined) {
                $.notify("Vui lòng nhập mật khẩu.", "error")
                return
            } else if (password.password_new.length < 8) {
                $.notify("Vui lòng nhập mật khẩu có độ dài từ 8 ký tự.", "error")
                return
            } else {
                $.ajax({
                    url: API + 'DoiMatKhau',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(password),
                    // xhrFields: {
                    //     withCredentials: true
                    // },
                    // headers: {
                    //     'Access-Control-Allow-Origin': '*',
                    //     'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    //     'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                    // },
                    success: function (response) {
                        if (response.length == 0) {
                            $.notify("Đổi mật khẩu không thành công, kiểm tra lại mật khẩu cũ!", 'error')
                        } else if (response.length > 0) {
                            $.notify("Đổi mật khẩu thành công!", 'success')
                            $("#oldPassword").val(null)
                            $("#newPassword").val(null)
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error:', error);
                    }
                });
            }
        } else {
            $.notify("Mật khẩu mới không được trùng với mật khẩu cũ.", "error")
            return
        }
    })

    //XÁC NHẬN CẬP NHẬT THỜI GIAN
    $(document).on("click", ".btnConfirm", function () {
        NEW_CONFIG.password = $("#password").val()
        if (NEW_CONFIG.password == '' || NEW_CONFIG.password == null || NEW_CONFIG.password == undefined) {
            $.notify("Vui lòng nhập mật khẩu", "error")
            $("#password").focus()
            return
        } else {
            let jsonData = JSON.stringify(NEW_CONFIG)
            $.ajax({
                url: API + 'LuuThongTinCauHinh',
                type: 'POST',
                contentType: 'application/json',
                data: jsonData,
                // xhrFields: {
                //     withCredentials: true
                // },
                // headers: {
                //     'Access-Control-Allow-Origin': '*',
                //     'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                //     'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                // },
                success: function (response) {
                    if (response.length > 0) {
                        $.notify("Cập nhật thành công!", "success")
                        loadConfig();
                    } else {
                        $.notify("Cập nhật không thành công, vui lòng kiểm tra lại mật khẩu", "error")
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                }
            });
            resetInput()
            $("#modalConfirmSave").modal('hide')
        }

    })
    //#endregion
})