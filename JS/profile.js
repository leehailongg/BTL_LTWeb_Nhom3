
/* ================= JAVASCRIPT TRANG HỒ SƠ REUSEHUB ================= */

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử trên giao diện
    const thongBao = document.getElementById("thongBao");
    const roleButton = document.getElementById("roleButton");
    const roleMenu = document.getElementById("roleMenu");

    const tenHienThi = document.getElementById("tenHienThi");
    const emailHienThi = document.getElementById("emailHienThi");
    const khuVucHienThi = document.getElementById("khuVucHienThi");
    const vaiTroHienThi = document.getElementById("vaiTro");
    const gioiThieuHienThi = document.getElementById("gioiThieu");
    const anhDaiDien = document.getElementById("anhDaiDien");

    // Đọc tài khoản hiện tại
    let currentUser = null;

    try {
        const storedUser = localStorage.getItem("nguoiDung");

        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Không thể đọc dữ liệu tài khoản:", error);
        currentUser = null;
    }

    // Kiểm tra dữ liệu tài khoản
    if (
        !currentUser ||
        typeof currentUser !== "object" ||
        !currentUser.email ||
        typeof currentUser.email !== "string"
    ) {
        // Xóa dữ liệu đăng nhập không hợp lệ
        localStorage.removeItem("nguoiDung");

        // Hiển thị thông báo yêu cầu đăng nhập
        const profileContainer =
            document.querySelector("main") ||
            document.querySelector(".profile-container");

        const loginMessage = `
            <div style="
                max-width: 500px;
                margin: 60px auto;
                padding: 35px 24px;
                text-align: center;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
            ">
                <h2 style="
                    color: #193b31;
                    margin: 0 0 12px;
                ">
                    Bạn chưa đăng nhập
                </h2>

                <p style="
                    color: #666666;
                    line-height: 1.6;
                    margin-bottom: 24px;
                ">
                    Vui lòng đăng nhập để xem thông tin hồ sơ của bạn.
                </p>

                <a href="login.html" style="
                    display: inline-block;
                    padding: 12px 26px;
                    background: #0d5c46;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 7px;
                    font-weight: bold;
                ">
                    Đăng nhập
                </a>

                <div style="margin-top: 18px;">
                    <a href="index.html" style="
                        color: #0d5c46;
                        text-decoration: none;
                    ">
                        Quay về trang chủ
                    </a>
                </div>
            </div>
        `;

        if (profileContainer) {
            profileContainer.innerHTML = loginMessage;
        } else {
            document.body.innerHTML = loginMessage;
        }

        return;
    }

    // Chuẩn hóa dữ liệu hiển thị
    const tenNguoiDung =
        currentUser.hoTen ||
        currentUser.name ||
        "Người dùng ReuseHub";

    const emailNguoiDung = currentUser.email;

    const khuVucNguoiDung =
        currentUser.khuVuc || "Chưa cập nhật khu vực";

    const gioiThieuNguoiDung =
        currentUser.gioiThieu || "Chưa có lời giới thiệu.";

    // Hiển thị tên, email, khu vực và giới thiệu
    if (tenHienThi) {
        tenHienThi.textContent = tenNguoiDung;
    }

    if (emailHienThi) {
        emailHienThi.textContent = emailNguoiDung;
    }

    if (khuVucHienThi) {
        khuVucHienThi.textContent = khuVucNguoiDung;
    }

    if (gioiThieuHienThi) {
        gioiThieuHienThi.textContent = gioiThieuNguoiDung;
    }

    // Hiển thị vai trò
    if (vaiTroHienThi) {
        const vaiTro = String(
            currentUser.vaiTro || currentUser.role || ""
        ).toLowerCase();

        if (
            vaiTro === "admin" ||
            vaiTro === "quản trị viên"
        ) {
            vaiTroHienThi.textContent = "Quản trị viên";
        } else if (
            vaiTro === "seller" ||
            vaiTro === "người bán"
        ) {
            vaiTroHienThi.textContent = "Người bán ReuseHub";
        } else if (
            vaiTro === "repairer" ||
            vaiTro === "người sửa chữa"
        ) {
            vaiTroHienThi.textContent = "Người sửa chữa";
        } else {
            vaiTroHienThi.textContent =
                "Thành viên ReuseHub (Người mua)";
        }
    }

    // Tạo chữ viết tắt cho avatar
    if (anhDaiDien) {
        const cacTu = tenNguoiDung.trim().split(/\s+/);
        let chuVietTat = "RU";

        if (cacTu.length >= 2) {
            chuVietTat =
                cacTu[0].charAt(0) +
                cacTu[cacTu.length - 1].charAt(0);
        } else if (cacTu.length === 1 && cacTu[0].length > 0) {
            chuVietTat = cacTu[0].substring(0, 2);
        }

        anhDaiDien.textContent = chuVietTat.toUpperCase();
    }

    // Xử lý menu dropdown Vai trò
    if (roleButton && roleMenu) {
        roleButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            roleMenu.classList.toggle("show");
        });

        roleMenu.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function (event) {
            if (
                !roleButton.contains(event.target) &&
                !roleMenu.contains(event.target)
            ) {
                roleMenu.classList.remove("show");
            }
        });
    }

    // Hàm thông báo nếu trang có sử dụng
    function hienThongBao(noiDung, loai) {
        if (thongBao) {
            thongBao.textContent = noiDung;
            thongBao.className = loai;
        }
    }
});
