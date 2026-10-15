let tabDangNhap = document.getElementById("tabDangNhap");
let tabDangKy = document.getElementById("tabDangKy");
let formDangNhap = document.getElementById("formDangNhap");
let formDangKy = document.getElementById("formDangKy");

function hienDangNhap() {
    formDangNhap.classList.remove("an");
    formDangKy.classList.add("an");

    tabDangNhap.classList.add("active");
    tabDangKy.classList.remove("active");

    document.getElementById("tieuDe").textContent = "Chào mừng trở lại";
    document.getElementById("loiMoi").innerHTML =
        'Chưa có tài khoản? <a href="#" id="chuyenDangKy">Đăng ký</a>';

    ganSuKienDangKy();
}

function hienDangKy() {
    formDangNhap.classList.add("an");
    formDangKy.classList.remove("an");

    tabDangKy.classList.add("active");
    tabDangNhap.classList.remove("active");

    document.getElementById("tieuDe").textContent = "Tạo tài khoản mới";
    document.getElementById("loiMoi").innerHTML =
        'Đã có tài khoản? <a href="#" id="chuyenDangNhap">Đăng nhập</a>';

    ganSuKienDangNhap();
}

function ganSuKienDangKy() {
    let nut = document.getElementById("chuyenDangKy");

    if (nut) {
        nut.onclick = function(event) {
            event.preventDefault();
            hienDangKy();
        };
    }
}

function ganSuKienDangNhap() {
    let nut = document.getElementById("chuyenDangNhap");

    if (nut) {
        nut.onclick = function(event) {
            event.preventDefault();
            hienDangNhap();
        };
    }
}

tabDangNhap.onclick = hienDangNhap;
tabDangKy.onclick = hienDangKy;

formDangNhap.onsubmit = function(event) {
    event.preventDefault();

    document.getElementById("thongBao").textContent =
        "Giao diện mẫu: chức năng đăng nhập cần kết nối hệ thống tài khoản.";
};

formDangKy.onsubmit = function(event) {
    event.preventDefault();

    document.getElementById("thongBao").textContent =
        "Giao diện mẫu: chức năng đăng ký cần kết nối hệ thống tài khoản.";
};

document.getElementById("quenMatKhau").onclick = function(event) {
    event.preventDefault();

    document.getElementById("thongBao").textContent =
        "Vui lòng liên hệ quản trị viên để được hỗ trợ lấy lại mật khẩu.";
};

document.getElementById("google").onclick = function() {
    document.getElementById("thongBao").textContent =
        "Đăng nhập Google cần được tích hợp thêm.";
};

ganSuKienDangKy();
