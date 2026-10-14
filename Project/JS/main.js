const sanPham = [
    {
        id: 0,
        ten: "Ghế gỗ vintage",
        danhMuc: "Nội thất",
        moTa: "Ghế gỗ phong cách vintage, còn sử dụng tốt.",
        gia: 450000,
        sao: 4.6,
        anh: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500"
    },
    {
        id: 1,
        ten: "Xe đạp thể thao",
        danhMuc: "Đồ cá nhân",
        moTa: "Xe đạp thể thao phù hợp đi học và tập luyện.",
        gia: 2200000,
        sao: 4.8,
        anh: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500"
    },
    {
        id: 2,
        ten: "Áo khoác denim",
        danhMuc: "Đồ cá nhân",
        moTa: "Áo khoác denim phong cách trẻ trung.",
        gia: 350000,
        sao: 4.5,
        anh: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500"
    },
    {
        id: 3,
        ten: "Bình giữ nhiệt",
        danhMuc: "Đồ cá nhân",
        moTa: "Bình giữ nhiệt tiện lợi khi đi học và đi làm.",
        gia: 180000,
        sao: 3,
        anh: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
    },
    {
        id: 4,
        ten: "Đèn bàn tối giản",
        danhMuc: "Đồ điện",
        moTa: "Đèn bàn thiết kế đơn giản, phù hợp góc học tập.",
        gia: 280000,
        sao: 2,
        anh: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    },
    {
        id: 5,
        ten: "Ba lô canvas",
        danhMuc: "Đồ cá nhân",
        moTa: "Ba lô canvas tiện dụng, phù hợp sử dụng hằng ngày.",
        gia: 320000,
        sao: 4.7,
        anh: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    }
];

function dinhDangGia(gia) {
    return gia.toLocaleString("vi-VN") + "đ";
}

function hienThi(ds) {
    const danhSach = document.getElementById("danhSach");
    const soLuong = document.getElementById("soLuong");

    if (ds.length === 0) {
        danhSach.innerHTML = `
            <div class="khong-co-sp">
                <span>🌿</span>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi từ khóa hoặc điều kiện lọc nhé.</p>
            </div>
        `;
        soLuong.textContent = "Có 0 sản phẩm";
        return;
    }

    danhSach.innerHTML = ds.map(sp => `
        <article class="sanpham">
            <img
                src="${sp.anh}"
                alt="${sp.ten}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/400x400/e8efe8/286448?text=ReUseHub'"
            >

            <div class="thongtin">
                <h3>${sp.ten}</h3>

                <p class="gia">${dinhDangGia(sp.gia)}</p>

                <div class="danhgia">
                    <span class="sao" aria-label="${sp.sao} trên 5 sao">★★★★★</span>
                    <span class="diem">${sp.sao.toFixed(1)}</span>
                </div>

                <button class="xem" onclick="xemChiTiet(${sp.id})">
                    Xem chi tiết
                </button>
            </div>
        </article>
    `).join("");

    soLuong.textContent = `Có ${ds.length} sản phẩm`;
}

function locSanPham() {
    const tuKhoa = document
        .getElementById("timKiem")
        .value.trim()
        .toLocaleLowerCase("vi");

    const danhMuc = document.getElementById("danhMuc").value;
    const mucGia = document.getElementById("MucGia").value;
    const xepHang = Number(document.getElementById("xepHang").value);

    let ketQua = sanPham.filter(sp => {
        const noiDungTimKiem =
            (sp.ten + " " + sp.moTa + " " + sp.danhMuc)
                .toLocaleLowerCase("vi");

        const dungTuKhoa = noiDungTimKiem.includes(tuKhoa);

        const dungDanhMuc =
            danhMuc === "Tất cả" || sp.danhMuc === danhMuc;

        const dungXepHang =
            xepHang === 0 || sp.sao >= xepHang / 10;

        return dungTuKhoa && dungDanhMuc && dungXepHang;
    });

    if (mucGia === "thấp đến cao") {
        ketQua.sort((a, b) => a.gia - b.gia);
    } else if (mucGia === "cao đến thấp") {
        ketQua.sort((a, b) => b.gia - a.gia);
    }

    hienThi(ketQua);
}

function xemChiTiet(id) {
    const sp = sanPham.find(item => item.id === id);

    if (!sp) return;

    alert(
        "Tên sản phẩm: " + sp.ten +
        "\nDanh mục: " + sp.danhMuc +
        "\nGiá: " + dinhDangGia(sp.gia) +
        "\nĐánh giá: " + sp.sao.toFixed(1) + "/5 sao" +
        "\nMô tả: " + sp.moTa
    );
}

document.getElementById("timKiem").addEventListener("input", locSanPham);
document.getElementById("danhMuc").addEventListener("change", locSanPham);
document.getElementById("MucGia").addEventListener("change", locSanPham);
document.getElementById("xepHang").addEventListener("change", locSanPham);

hienThi(sanPham);