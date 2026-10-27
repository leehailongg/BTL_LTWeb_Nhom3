
/* ================= JAVASCRIPT TRANG CÀI ĐẶT TÀI KHOẢN REUSEHUB ================= */

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử trên giao diện
    const thongBao = document.getElementById("thongBao");
    const formTaiKhoan = document.getElementById("formTaiKhoan");
    const nutDangXuat = document.getElementById("nutDangXuat");
    const roleButton = document.getElementById("roleButton");
    const roleMenu = document.getElementById("roleMenu");

    // Các ô nhập liệu
    const hoTen = document.getElementById("hoTen");
    const email = document.getElementById("email");
    const khuVuc = document.getElementById("khuVuc");
    const gioiThieu = document.getElementById("gioiThieu");

    // Các vị trí hiển thị thông tin
    const tenHienThi = document.getElementById("tenHienThi");
    const emailHienThi = document.getElementById("emailHienThi");
    const vaiTro = document.getElementById("vaiTro");
    const anhDaiDien = document.getElementById("anhDaiDien");

    // Đọc tài khoản hiện tại từ LocalStorage
    let nguoiDung = null;

    try {
        nguoiDung = JSON.parse(
            localStorage.getItem("nguoiDung") || "null"
        );
    } catch (error) {
        console.error("Không thể đọc dữ liệu tài khoản:", error);
        nguoiDung = null;
    }

    // Kiểm tra trạng thái đăng nhập
    if (
        !nguoiDung ||
        typeof nguoiDung !== "object" ||
        typeof nguoiDung.email !== "string" ||
        nguoiDung.email.trim() === ""
    ) {
        // Không tự tạo tài khoản mặc định
        const settingsMain = document.querySelector(".settings-main");

        if (settingsMain) {
            settingsMain.innerHTML = `
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
                        margin-bottom: 12px;
                    ">
                        Bạn chưa đăng nhập
                    </h2>

                    <p style="
                        color: #666666;
                        line-height: 1.6;
                        margin-bottom: 24px;
                    ">
                        Vui lòng đăng nhập để xem và chỉnh sửa thông tin tài khoản.
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
        }

        return;
    }

    // Chuẩn hóa dữ liệu người dùng
    nguoiDung.hoTen =
        nguoiDung.hoTen ||
        nguoiDung.name ||
        "";

    nguoiDung.name =
        nguoiDung.name ||
        nguoiDung.hoTen;

    nguoiDung.khuVuc = nguoiDung.khuVuc || "";
    nguoiDung.gioiThieu = nguoiDung.gioiThieu || "";

    // Hiển thị thông báo
    function hienThongBao(noiDung, thanhCong) {
        if (!thongBao) return;

        thongBao.textContent = noiDung;
        thongBao.className = thanhCong
            ? "thanh-cong"
            : "loi";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Chuyển mã vai trò thành tên hiển thị
    function layTenVaiTro(user) {
        const role = String(
            user.vaiTro || user.role || "member"
        ).toLowerCase();

        if (role === "admin" || role === "quản trị viên") {
            return "Quản trị viên";
        }

        if (role === "seller" || role === "người bán") {
            return "Người bán ReuseHub";
        }

        if (role === "repairer" || role === "người sửa chữa") {
            return "Người sửa chữa";
        }

        return "Thành viên ReuseHub (Người mua)";
    }

    // Tạo chữ viết tắt cho avatar
    function layChuVietTat(hoTen) {
        const words = String(hoTen || "RU")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length >= 2) {
            return (
                words[0].charAt(0) +
                words[words.length - 1].charAt(0)
            ).toUpperCase();
        }

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return "RU";
    }

    // Hiển thị thông tin tài khoản
    function hienThongTin() {
        if (tenHienThi) {
            tenHienThi.textContent =
                nguoiDung.hoTen || "Chưa cập nhật họ tên";
        }

        if (emailHienThi) {
            emailHienThi.textContent =
                nguoiDung.email || "Email chưa cập nhật";
        }

        if (vaiTro) {
            vaiTro.textContent = layTenVaiTro(nguoiDung);
        }

        if (anhDaiDien) {
            anhDaiDien.textContent = layChuVietTat(
                nguoiDung.hoTen
            );
        }

        // Điền dữ liệu hiện tại vào form
        if (hoTen) {
            hoTen.value = nguoiDung.hoTen || "";
        }

        if (email) {
            email.value = nguoiDung.email || "";
        }

        if (khuVuc) {
            khuVuc.value = nguoiDung.khuVuc || "";
        }

        if (gioiThieu) {
            gioiThieu.value = nguoiDung.gioiThieu || "";
        }
    }

    // Xử lý lưu thông tin tài khoản
    if (formTaiKhoan) {
        formTaiKhoan.addEventListener("submit", function (event) {
            event.preventDefault();

            const tenMoi = hoTen
                ? hoTen.value.trim()
                : "";

            const emailMoi = email
                ? email.value.trim().toLowerCase()
                : "";

            if (!tenMoi || !emailMoi) {
                hienThongBao(
                    "Vui lòng nhập đầy đủ họ tên và email.",
                    false
                );
                return;
            }

            // Kiểm tra định dạng email cơ bản
            const mauEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!mauEmail.test(emailMoi)) {
                hienThongBao(
                    "Vui lòng nhập địa chỉ email hợp lệ.",
                    false
                );
                return;
            }

            // Cập nhật thông tin tài khoản hiện tại
            nguoiDung.hoTen = tenMoi;
            nguoiDung.name = tenMoi;
            nguoiDung.email = emailMoi;
            nguoiDung.khuVuc = khuVuc
                ? khuVuc.value.trim()
                : "";
            nguoiDung.gioiThieu = gioiThieu
                ? gioiThieu.value.trim()
                : "";

            try {
                localStorage.setItem(
                    "nguoiDung",
                    JSON.stringify(nguoiDung)
                );

                hienThongTin();

                hienThongBao(
                    "Cập nhật thông tin tài khoản thành công!",
                    true
                );
            } catch (error) {
                console.error("Lỗi lưu tài khoản:", error);

                hienThongBao(
                    "Không thể lưu thông tin. Vui lòng thử lại.",
                    false
                );
            }
        });
    }

    // Xử lý đăng xuất
    if (nutDangXuat) {
        nutDangXuat.addEventListener("click", function () {
            const xacNhan = confirm(
                "Bạn có chắc chắn muốn đăng xuất không?"
            );

            if (!xacNhan) return;

            // Chỉ xóa thông tin phiên hiện tại
            localStorage.removeItem("nguoiDung");

            alert("Đã đăng xuất tài khoản.");

            window.location.href = "index.html";
        });
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

    // Hiển thị thông tin khi tải trang
    hienThongTin();
});
