/**
 * REUSEHUB - JAVASCRIPT THUẦN (VANILLA JS)
 * Xây dựng đầy đủ luồng 13 màn hình theo thiết kế PDF
 */

// ========================================================
// 1. CƠ SỞ DỮ LIỆU MẪU & KHỞI TẠO LOCALSTORAGE
// ========================================================
// KIỂM TRA ĐĂNG NHẬP
let nguoiDung = null;

try {
    nguoiDung = JSON.parse(localStorage.getItem("nguoiDung"));
} catch (e) {
    nguoiDung = null;
}

if (!nguoiDung || !nguoiDung.email) {
    alert("Bạn cần đăng nhập để sử dụng chức năng này!");
    window.location.href = "login.html";
    throw new Error("Chưa đăng nhập");
}

const STORAGE_KEYS = {
    PRODUCTS: "reusehub_seller_products",
    DRAFTS: "reusehub_seller_drafts",
    ORDERS: "reusehub_seller_orders"
};

// Dữ liệu sản phẩm mẫu chuẩn theo PDF
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Bàn học gỗ",
        category: "Nội thất",
        price: 450000,
        date: "12/06/2024",
        status: "Đang bán",
        location: "Hà Nội - Cầu Giấy",
        condition: "Đã qua sử dụng (90%)",
        description: "Bàn học gỗ ép công nghiệp cao cấp, bề mặt phủ melamine chống trầy, chắc chắn và phù hợp cho học sinh, sinh viên.",
        icon: "🪑"
    },
    {
        id: 2,
        name: "Nồi cơm điện",
        category: "Gia dụng",
        price: 250000,
        date: "11/06/2024",
        status: "Chờ duyệt",
        location: "TP. Hồ Chí Minh - Quận 1",
        condition: "Đã qua sử dụng (90%)",
        description: "Nồi cơm điện mini Sharp dung tích 1.2L, mâm nhiệt còn mới, nấu cơm dẻo và giữ ấm tốt.",
        icon: "🍚"
    },
    {
        id: 3,
        name: "Điện thoại cũ",
        category: "Điện tử",
        price: 800000,
        date: "10/06/2024",
        status: "Chờ lấy hàng",
        location: "Đà Nẵng - Hải Châu",
        condition: "Đã qua sử dụng (80%)",
        description: "Điện thoại Android máy phụ màn hình 6.5 inch, pin 5000mAh trâu, nghe gọi lướt web mượt mà.",
        icon: "📱"
    },
    {
        id: 4,
        name: "Kệ sách",
        category: "Nội thất",
        price: 300000,
        date: "08/06/2024",
        status: "Đã bán",
        location: "Hà Nội - Thanh Xuân",
        condition: "Mới 99% (Như mới)",
        description: "Kệ sách 4 tầng gỗ cao su tự nhiên đã ráp sẵn, gọn gàng, tháo lắp vận chuyển dễ dàng.",
        icon: "📚"
    },
    {
        id: 5,
        name: "Máy xay sinh tố",
        category: "Gia dụng",
        price: 350000,
        date: "07/06/2024",
        status: "Bị từ chối",
        location: "Hải Phòng - Lê Chân",
        condition: "Đã qua sử dụng (90%)",
        description: "Máy xay sinh tố đa năng cối thủy tinh chịu lực, lưỡi dao inox 6 cánh sắc bén.",
        icon: "🥤",
        rejectReason: "Hình ảnh chụp bị mờ, không nhìn rõ tem thông số kỹ thuật và thiếu ảnh phụ kiện đi kèm. Vui lòng chụp lại ảnh rõ nét dưới ánh sáng tự nhiên."
    },
    {
        id: 6,
        name: "Túi du lịch",
        category: "Phụ kiện",
        price: 200000,
        date: "05/06/2024",
        status: "Đang bán",
        location: "Cần Thơ - Ninh Kiều",
        condition: "Mới 99% (Như mới)",
        description: "Túi du lịch cỡ trung vải dù chống thấm nước, nhiều ngăn chứa đồ tiện ích khi đi công tác, du lịch.",
        icon: "🧳"
    }
];

// Danh sách bản nháp mẫu theo PDF
const INITIAL_DRAFTS = [
    {
        id: "draft-1",
        name: "Bàn phím cơ DareU EK87",
        category: "Điện tử",
        price: 180000,
        condition: "Đã qua sử dụng (90%)",
        location: "Hà Nội - Cầu Giấy",
        description: "Bàn phím cơ switch Blue gõ nảy, LED phím sáng đều, dùng được 6 tháng hoạt động bình thường...",
        dateSaved: "14:30 15/06/2024"
    },
    {
        id: "draft-2",
        name: "Quạt bàn mini Senko",
        category: "Gia dụng",
        price: 90000,
        condition: "Mới 99% (Như mới)",
        location: "TP. Hồ Chí Minh - Quận 7",
        description: "Quạt bàn chạy rất êm, nhỏ gọn để bàn học hoặc bàn làm việc rất tiện lợi...",
        dateSaved: "09:15 14/06/2024"
    }
];

// Danh sách đơn hàng mẫu theo PDF
const INITIAL_ORDERS = [
    {
        id: "DH00012",
        productName: "Nồi cơm điện",
        buyerName: "Nguyễn Văn An",
        buyerPhone: "0912 345 678",
        date: "12/06/2024",
        price: 250000,
        status: "Đơn mới",
        isUrgent: true,
        address: "Số 123 Cầu Giấy, Hà Nội"
    },
    {
        id: "DH00011",
        productName: "Bàn học gỗ",
        buyerName: "Trần Thị Mai",
        buyerPhone: "0988 765 432",
        date: "11/06/2024",
        price: 450000,
        status: "Chờ xác nhận",
        isUrgent: true,
        address: "45 Nguyễn Trãi, Thanh Xuân, Hà Nội"
    },
    {
        id: "DH00010",
        productName: "Điện thoại cũ",
        buyerName: "Lê Hoàng Nam",
        buyerPhone: "0905 112 233",
        date: "10/06/2024",
        price: 800000,
        status: "Đã xác nhận",
        isUrgent: false,
        address: "78 Lê Duẩn, Hải Châu, Đà Nẵng"
    },
    {
        id: "DH00009",
        productName: "Túi du lịch",
        buyerName: "Phạm Thu Hà",
        buyerPhone: "0933 445 566",
        date: "09/06/2024",
        price: 200000,
        status: "Đang giao",
        isUrgent: false,
        address: "12 Bến Vân Đồn, Quận 4, TP.HCM"
    },
    {
        id: "DH00008",
        productName: "Kệ sách",
        buyerName: "Vũ Đức Minh",
        buyerPhone: "0977 889 900",
        date: "08/06/2024",
        price: 300000,
        status: "Hoàn tất",
        isUrgent: false,
        address: "99 Hoàng Hoa Thám, Ba Đình, Hà Nội"
    },
    {
        id: "DH00007",
        productName: "Máy sấy tóc Philips",
        buyerName: "Hoàng Thị Yến",
        buyerPhone: "0945 667 788",
        date: "07/06/2024",
        price: 150000,
        status: "Đơn mới",
        isUrgent: true,
        address: "234 Hai Bà Trưng, Quận 1, TP.HCM"
    },
    {
        id: "DH00006",
        productName: "Tai nghe chụp tai Sony",
        buyerName: "Đặng Tuấn Anh",
        buyerPhone: "0966 223 344",
        date: "06/06/2024",
        price: 180000,
        status: "Chờ xác nhận",
        isUrgent: false,
        address: "56 Trần Hưng Đạo, TP. Huế"
    }
];

// Quản lý trạng thái ứng dụng trong bộ nhớ (State)
let productsState = loadState(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
let draftsState = loadState(STORAGE_KEYS.DRAFTS, INITIAL_DRAFTS);
let ordersState = loadState(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

// Biến lưu trữ tạm thời cho ảnh tải lên & đơn hàng đang thao tác
let uploadedImages = [];
let pendingProductToSubmit = null;
let currentRejectOrderId = null;
let currentActiveScreen = "1";

function loadState(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

function saveState(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn("Không thể lưu LocalStorage:", e);
    }
}

// ========================================================
// 2. TIỆN ÍCH (HELPERS)
// ========================================================

function formatPrice(number) {
    return new Intl.NumberFormat("vi-VN").format(Number(number)) + "đ";
}

function normalizeSearch(text) {
    return (text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .trim();
}

function getFormattedDateNow() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
}

function getFormattedTimeNow() {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${mins} ${getFormattedDateNow()}`;
}

function getCategoryIcon(cat) {
    switch (cat) {
        case "Nội thất": return "🪑";
        case "Gia dụng": return "🍚";
        case "Điện tử": return "📱";
        case "Phụ kiện": return "🧳";
        case "Thời trang": return "👕";
        case "Sách & VPP": return "📚";
        default: return "📦";
    }
}

function getStatusClass(status) {
    switch (status) {
        case "Đang bán": return "live";
        case "Chờ duyệt": return "pending";
        case "Chờ lấy hàng": return "pickup";
        case "Đã bán": return "sold";
        case "Bị từ chối": return "rejected";
        case "Đơn mới": return "pending";
        case "Chờ xác nhận": return "pickup";
        case "Đã xác nhận": return "live";
        case "Đang giao": return "pickup";
        case "Hoàn tất": return "live";
        case "Đã hủy": return "rejected";
        default: return "pending";
    }
}

let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ========================================================
// 3. ĐIỀU HƯỚNG SPA & CHUYỂN MÀN HÌNH (13 MÀN HÌNH)
// ========================================================

function navigateToScreen(screenKey) {
    currentActiveScreen = String(screenKey);

    // Xử lý các màn hình popup đặc biệt (2, 4, 5, 6)
    if (screenKey === "2") {
        // Mở popup chi tiết của sản phẩm đầu tiên hoặc đang chọn
        const prod = productsState[0] || INITIAL_PRODUCTS[0];
        openProductDetail(prod.id);
        return;
    }
    if (screenKey === "4") {
        openDraftsModal();
        return;
    }
    if (screenKey === "5") {
        // Mở popup xác nhận đăng
        openConfirmPostModal({
            name: "Bàn học gỗ mẫu",
            category: "Nội thất",
            price: 450000
        });
        return;
    }
    if (screenKey === "6") {
        // Mở popup thành công
        const dlg = document.getElementById("successPostDialog");
        if (dlg) dlg.showModal();
        return;
    }

    // Ẩn tất cả các màn hình chính
    document.querySelectorAll(".screen-view").forEach(view => {
        view.classList.remove("active");
    });

    // Hiện màn hình được chọn
    const targetView = document.getElementById(`screen-${screenKey}`);
    if (targetView) {
        targetView.classList.add("active");
    } else {
        // Mặc định về màn 1 nếu không tìm thấy
        document.getElementById("screen-1")?.classList.add("active");
    }

    // Cập nhật trạng thái active trên thanh điều hướng topbar
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.dataset.screen === screenKey) {
            link.classList.add("active");
        }
    });

    // Cập nhật trạng thái active trên thanh chip 13 màn hình
    document.querySelectorAll("[data-screen-btn]").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.screenBtn === screenKey) {
            btn.classList.add("active");
        }
    });

    // Cuộn mượt lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Render lại dữ liệu cho màn hình được mở
    renderCurrentScreen(screenKey);
}

function renderCurrentScreen(screenKey) {
    switch (screenKey) {
        case "1":
            renderScreen1();
            break;
        case "7":
            renderScreen7();
            break;
        case "8":
            renderScreen8();
            break;
        case "9":
            renderScreen9();
            break;
        case "10":
            renderScreen10();
            break;
        case "11":
            renderScreen11();
            break;
        case "12":
            renderScreen12();
            break;
        case "13":
            renderScreen13();
            break;
        default:
            break;
    }
}

// ========================================================
// 4. RENDER VÀ ĐỒNG BỘ DỮ LIỆU CÁC MÀN HÌNH
// ========================================================

// Đồng bộ toàn bộ dữ liệu & thống kê
function syncAllData() {
    saveState(STORAGE_KEYS.PRODUCTS, productsState);
    saveState(STORAGE_KEYS.DRAFTS, draftsState);
    saveState(STORAGE_KEYS.ORDERS, ordersState);

    updateDraftBadges();
    renderScreen1();
    renderScreen7();
    renderScreen8();
    renderScreen9();
    renderScreen10();
    renderScreen11();
    renderScreen12();
    renderScreen13();
}

function updateDraftBadges() {
    const count = draftsState.length;
    const badgeTop = document.getElementById("draftCountBadge");
    if (badgeTop) badgeTop.textContent = count;
    const summary = document.getElementById("draftQuickSummary");
    if (summary) {
        summary.textContent = `Bạn có ${count} bản nháp chưa hoàn tất. Nhấn vào để viết tiếp bất kỳ lúc nào.`;
    }
}

// --------------------------------------------------------
// MÀN HÌNH 1: QUẢN LÝ BÁN HÀNG
// --------------------------------------------------------
function renderScreen1() {
    // 1. Thống kê sản phẩm
    const total = productsState.length;
    const live = productsState.filter(p => p.status === "Đang bán").length;
    const pending = productsState.filter(p => p.status === "Chờ duyệt").length;
    const pickup = productsState.filter(p => p.status === "Chờ lấy hàng").length;
    const sold = productsState.filter(p => p.status === "Đã bán").length;
    const rejected = productsState.filter(p => p.status === "Bị từ chối").length;

    document.getElementById("statTotalProducts").textContent = total;
    document.getElementById("statLiveProducts").textContent = live;
    document.getElementById("statPendingProducts").textContent = pending;
    document.getElementById("statPickupProducts").textContent = pickup;
    document.getElementById("statSoldProducts").textContent = sold;
    document.getElementById("statRejectedProducts").textContent = rejected;

    // 2. Biểu đồ cột sản phẩm
    const maxBar = Math.max(20, total, live, pending, pickup, sold);
    const setBar = (barId, tipId, val) => {
        const bar = document.getElementById(barId);
        const tip = document.getElementById(tipId);
        if (bar && tip) {
            const pct = Math.min(100, Math.round((val / maxBar) * 100));
            bar.style.height = `${pct}%`;
            tip.textContent = val;
        }
    };
    setBar("barLive", "tipLive", live);
    setBar("barPending", "tipPending", pending);
    setBar("barPickup", "tipPickup", pickup);
    setBar("barSold", "tipSold", sold);

    // 3. Biểu đồ Donut Đã bán / Tổng sản phẩm
    const soldRate = total > 0 ? ((sold / total) * 100).toFixed(1) : 0;
    const remainRate = (100 - soldRate).toFixed(1);

    const donutArc = document.getElementById("donutSoldArc");
    if (donutArc) {
        const circumference = 367;
        const offset = circumference - (circumference * (soldRate / 100));
        donutArc.style.strokeDashoffset = offset;
    }
    const soldTxt = document.getElementById("donutSoldText");
    const remainTxt = document.getElementById("donutRemainText");
    if (soldTxt) soldTxt.innerHTML = `Đã bán<br><strong>${soldRate.replace(".", ",")}%</strong>`;
    if (remainTxt) remainTxt.innerHTML = `Còn lại<br><strong>${remainRate.replace(".", ",")}%</strong>`;

    // 4. Thống kê đơn hàng trong panel biểu đồ
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countPickup = ordersState.filter(o => o.status === "Đang giao").length;
    const countCompleted = ordersState.filter(o => o.status === "Hoàn tất").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("sumConfirmed").textContent = countConfirmed;
    document.getElementById("sumPickup").textContent = countPickup;
    document.getElementById("sumCompleted").textContent = countCompleted;
    document.getElementById("sumUrgent").textContent = countUrgent;

    // 5. Bảng sản phẩm trang Dashboard
    const searchVal = normalizeSearch(document.getElementById("dashSearch")?.value || "");
    const statusVal = document.getElementById("dashStatusFilter")?.value || "all";

    const filtered = productsState.filter(p => {
        const matchName = !searchVal || normalizeSearch(p.name).includes(searchVal) || normalizeSearch(p.category).includes(searchVal);
        const matchStatus = statusVal === "all" || p.status === statusVal;
        return matchName && matchStatus;
    });

    const tbody = document.getElementById("dashProductRows");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(p => `
        <tr data-id="${p.id}">
            <td><div class="photo-placeholder">${p.icon || getCategoryIcon(p.category)}</div></td>
            <td class="col-name">${p.name}</td>
            <td>${p.category}</td>
            <td class="col-price">${formatPrice(p.price)}</td>
            <td class="col-date">${p.date}</td>
            <td><span class="status-pill ${getStatusClass(p.status)}">${p.status}</span></td>
            <td class="col-action">
                <button type="button" class="table-btn btn-view-detail" data-id="${p.id}">
                    Xem chi tiết
                </button>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 7: SẢN PHẨM ĐANG ĐĂNG BÁN (CARDS GRID)
// --------------------------------------------------------
let currentTabFilter = "all";

function renderScreen7() {
    const total = productsState.length;
    const pending = productsState.filter(p => p.status === "Chờ duyệt").length;
    const live = productsState.filter(p => p.status === "Đang bán").length;
    const rejected = productsState.filter(p => p.status === "Bị từ chối").length;

    document.getElementById("tabCountAll").textContent = total;
    document.getElementById("tabCountPending").textContent = pending;
    document.getElementById("tabCountLive").textContent = live;
    document.getElementById("tabCountRejected").textContent = rejected;

    const query = normalizeSearch(document.getElementById("productCardSearch")?.value || "");
    const sortVal = document.getElementById("productSortFilter")?.value || "newest";

    let list = productsState.filter(p => {
        const matchTab = currentTabFilter === "all" || p.status === currentTabFilter;
        const matchQuery = !query ||
            normalizeSearch(p.name).includes(query) ||
            normalizeSearch(p.category).includes(query) ||
            normalizeSearch(p.location).includes(query);
        return matchTab && matchQuery;
    });

    // Sắp xếp
    if (sortVal === "price-asc") {
        list.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-desc") {
        list.sort((a, b) => b.price - a.price);
    } else {
        list.sort((a, b) => b.id - a.id);
    }

    const container = document.getElementById("productCardsContainer");
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; background: #fff; border-radius: 12px; border: 1px dashed var(--border-color);">
                <div style="font-size: 40px; margin-bottom: 12px;">📦</div>
                <h3 style="margin: 0 0 6px; color: var(--green-dark);">Không có sản phẩm nào</h3>
                <p style="color: var(--text-muted); margin: 0 0 16px;">Không tìm thấy bài đăng nào trong mục này.</p>
                <button type="button" class="btn btn-primary" data-screen="3">＋ Đăng bán sản phẩm mới</button>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(p => `
        <article class="product-card">
            <div class="product-card-media">
                <span>${p.icon || getCategoryIcon(p.category)}</span>
                <span class="card-status-badge status-pill ${getStatusClass(p.status)}">
                    ${p.status}
                </span>
            </div>

            <div class="product-card-body">
                <span class="card-category">${p.category}</span>
                <h3 class="card-title">${p.name}</h3>
                <div class="card-price">${formatPrice(p.price)}</div>

                <div class="card-meta">
                    <span><strong>Tình trạng:</strong> ${p.condition || "Đã qua sử dụng"}</span>
                    <span><strong>Khu vực:</strong> ${p.location || "Toàn quốc"}</span>
                    <span><strong>Ngày đăng:</strong> ${p.date}</span>
                </div>

                <div class="product-card-actions">
                    ${p.status === "Chờ duyệt" ? `
                        <button type="button" class="table-btn primary btn-approve-product" data-id="${p.id}" data-order-code="${p.orderCode || ''}">
                            Duyệt đơn
                        </button>
                    ` : ""}
                    <button type="button" class="table-btn btn-view-detail" data-id="${p.id}">
                        Xem chi tiết
                    </button>
                    <button type="button" class="table-btn btn-edit-product" data-id="${p.id}">
                        Chỉnh sửa
                    </button>

                    ${p.status === "Bị từ chối" ? `
                        <button type="button" class="table-btn danger btn-view-reject-reason" data-id="${p.id}">
                            Xem lý do từ chối
                        </button>
                        <button type="button" class="table-btn primary btn-resubmit-audit" data-id="${p.id}">
                            Gửi duyệt lại
                        </button>
                    ` : ""}
                </div>
            </div>
        </article>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 8: THEO DÕI ĐƠN HÀNG
// --------------------------------------------------------
function renderScreen8() {
    const total = ordersState.length;
    const pending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const shipping = ordersState.filter(o => o.status === "Đang giao").length;
    const completed = ordersState.filter(o => o.status === "Hoàn tất").length;

    document.getElementById("trackTotalOrders").textContent = total;
    document.getElementById("trackPendingConfirm").textContent = pending;
    document.getElementById("trackShipping").textContent = shipping;
    document.getElementById("trackCompleted").textContent = completed;

    const query = normalizeSearch(document.getElementById("orderSearchInput")?.value || "");
    const statusVal = document.getElementById("orderStatusSelect")?.value || "all";

    const filtered = ordersState.filter(o => {
        const matchQ = !query ||
            normalizeSearch(o.id).includes(query) ||
            normalizeSearch(o.productName).includes(query) ||
            normalizeSearch(o.buyerName).includes(query) ||
            normalizeSearch(o.buyerPhone).includes(query);
        const matchStatus = statusVal === "all" || o.status === statusVal;
        return matchQ && matchStatus;
    });

    const tbody = document.getElementById("ordersTrackingTbody");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px;">Không có đơn hàng nào phù hợp.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.buyerPhone}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill ${getStatusClass(o.status)}">${o.status}</span></td>
            <td>
                <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                    Xem chi tiết
                </button>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 9: QUẢN LÝ VÀ TIẾP NHẬN ĐƠN HÀNG
// --------------------------------------------------------
function renderScreen9() {
    const countNew = ordersState.filter(o => o.status === "Đơn mới").length;
    const countPending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("mgmtStatNew").textContent = countNew;
    document.getElementById("mgmtStatPending").textContent = countPending;
    document.getElementById("mgmtStatConfirmed").textContent = countConfirmed;
    document.getElementById("mgmtStatUrgent").textContent = countUrgent;

    document.getElementById("badgeSubNew").textContent = countNew;
    document.getElementById("badgeSubPending").textContent = countPending;
    document.getElementById("badgeSubConfirmed").textContent = countConfirmed;
    document.getElementById("badgeSubUrgent").textContent = countUrgent;

    const query = normalizeSearch(document.getElementById("mgmtSearchInput")?.value || "");
    const filtered = ordersState.filter(o => {
        return !query ||
            normalizeSearch(o.id).includes(query) ||
            normalizeSearch(o.productName).includes(query) ||
            normalizeSearch(o.buyerName).includes(query);
    });

    const tbody = document.getElementById("mgmtOrdersTbody");
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px;">Không có đơn hàng nào cần tiếp nhận.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill ${getStatusClass(o.status)}">${o.status}</span></td>
            <td>
                <div class="action-group">
                    ${o.status === "Đơn mới" ? `
                        <button type="button" class="table-btn primary btn-accept-order" data-id="${o.id}">
                            Tiếp nhận đơn
                        </button>
                    ` : ""}
                    ${o.status === "Chờ xác nhận" ? `
                        <button type="button" class="table-btn primary btn-confirm-order" data-id="${o.id}">
                            Duyệt đơn
                        </button>
                    ` : ""}
                    ${o.status === "Đã xác nhận" ? `
                        <button type="button" class="table-btn primary btn-prepare-shipping" data-id="${o.id}">
                            Chuẩn bị giao
                        </button>
                    ` : ""}
                    ${o.status === "Chờ xác nhận" || o.status === "Đơn mới" ? `
                        <button type="button" class="table-btn danger btn-reject-order-modal" data-id="${o.id}">
                            Từ chối
                        </button>
                    ` : ""}
                    <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                        Xem chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 10: ĐƠN MỚI
// --------------------------------------------------------
function renderScreen10() {
    const countNew = ordersState.filter(o => o.status === "Đơn mới").length;
    const countPending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("screen10StatNew").textContent = countNew;
    document.getElementById("screen10StatPending").textContent = countPending;
    document.getElementById("screen10StatConfirmed").textContent = countConfirmed;
    document.getElementById("screen10StatUrgent").textContent = countUrgent;

    const query = normalizeSearch(document.getElementById("screen10Search")?.value || "");
    const list = ordersState.filter(o => o.status === "Đơn mới" && (!query || normalizeSearch(o.id).includes(query) || normalizeSearch(o.productName).includes(query)));

    const tbody = document.getElementById("screen10Tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px;">Không có đơn hàng mới nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.buyerPhone}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill pending">${o.status}</span></td>
            <td>
                <div class="action-group">
                    <button type="button" class="table-btn primary btn-accept-order" data-id="${o.id}">
                        Tiếp nhận đơn
                    </button>
                    <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                        Xem chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 11: CHỜ XÁC NHẬN
// --------------------------------------------------------
function renderScreen11() {
    const countNew = ordersState.filter(o => o.status === "Đơn mới").length;
    const countPending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("screen11StatNew").textContent = countNew;
    document.getElementById("screen11StatPending").textContent = countPending;
    document.getElementById("screen11StatConfirmed").textContent = countConfirmed;
    document.getElementById("screen11StatUrgent").textContent = countUrgent;

    const query = normalizeSearch(document.getElementById("screen11Search")?.value || "");
    const list = ordersState.filter(o => o.status === "Chờ xác nhận" && (!query || normalizeSearch(o.id).includes(query) || normalizeSearch(o.productName).includes(query)));

    const tbody = document.getElementById("screen11Tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px;">Không có đơn hàng nào chờ xác nhận.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.buyerPhone}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill pickup">${o.status}</span></td>
            <td>
                <div class="action-group">
                    <button type="button" class="table-btn primary btn-confirm-order" data-id="${o.id}">
                        Duyệt đơn
                    </button>
                    <button type="button" class="table-btn danger btn-reject-order-modal" data-id="${o.id}">
                        Từ chối
                    </button>
                    <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                        Xem chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 12: ĐÃ XÁC NHẬN
// --------------------------------------------------------
function renderScreen12() {
    const countNew = ordersState.filter(o => o.status === "Đơn mới").length;
    const countPending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("screen12StatNew").textContent = countNew;
    document.getElementById("screen12StatPending").textContent = countPending;
    document.getElementById("screen12StatConfirmed").textContent = countConfirmed;
    document.getElementById("screen12StatUrgent").textContent = countUrgent;

    const query = normalizeSearch(document.getElementById("screen12Search")?.value || "");
    const list = ordersState.filter(o => o.status === "Đã xác nhận" && (!query || normalizeSearch(o.id).includes(query) || normalizeSearch(o.productName).includes(query)));

    const tbody = document.getElementById("screen12Tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px;">Không có đơn hàng nào đã xác nhận đang chờ giao.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.buyerPhone}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill live">${o.status}</span></td>
            <td>
                <div class="action-group">
                    <button type="button" class="table-btn primary btn-prepare-shipping" data-id="${o.id}">
                        Chuẩn bị giao
                    </button>
                    <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                        Xem chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// --------------------------------------------------------
// MÀN HÌNH 13: CẦN XỬ LÝ (URGENT ORDERS)
// --------------------------------------------------------
function renderScreen13() {
    const countNew = ordersState.filter(o => o.status === "Đơn mới").length;
    const countPending = ordersState.filter(o => o.status === "Chờ xác nhận").length;
    const countConfirmed = ordersState.filter(o => o.status === "Đã xác nhận").length;
    const countUrgent = ordersState.filter(o => o.isUrgent).length;

    document.getElementById("screen13StatNew").textContent = countNew;
    document.getElementById("screen13StatPending").textContent = countPending;
    document.getElementById("screen13StatConfirmed").textContent = countConfirmed;
    document.getElementById("screen13StatUrgent").textContent = countUrgent;

    const query = normalizeSearch(document.getElementById("screen13Search")?.value || "");
    const list = ordersState.filter(o => o.isUrgent && (!query || normalizeSearch(o.id).includes(query) || normalizeSearch(o.productName).includes(query)));

    const tbody = document.getElementById("screen13Tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px;">Không có đơn hàng nào cần xử lý gấp. Tuyệt vời!</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${o.productName}</td>
            <td>${o.buyerName}</td>
            <td>${o.buyerPhone}</td>
            <td>${o.date}</td>
            <td><strong>${formatPrice(o.price)}</strong></td>
            <td><span class="status-pill urgent">⚠️ Cần xử lý sớm</span></td>
            <td>
                <div class="action-group">
                    ${o.status === "Chờ xác nhận" ? `
                        <button type="button" class="table-btn primary btn-confirm-order" data-id="${o.id}">
                            Duyệt đơn
                        </button>
                    ` : `
                        <button type="button" class="table-btn primary btn-prepare-shipping" data-id="${o.id}">
                            Chuẩn bị giao
                        </button>
                    `}
                    <button type="button" class="table-btn btn-view-order" data-id="${o.id}">
                        Xem chi tiết
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// ========================================================
// 5. MÀN HÌNH 2: MODAL CHI TIẾT SẢN PHẨM
// ========================================================

function openProductDetail(productId) {
    const prod = productsState.find(p => p.id == productId) || productsState[0];
    if (!prod) return;

    document.getElementById("detailProductPhoto").textContent = prod.icon || getCategoryIcon(prod.category);
    document.getElementById("detailName").textContent = prod.name;
    document.getElementById("detailPrice").textContent = formatPrice(prod.price);
    document.getElementById("detailCategory").textContent = prod.category;
    document.getElementById("detailCondition").textContent = prod.condition || "Đã qua sử dụng (90%)";
    document.getElementById("detailLocation").textContent = prod.location || "Hà Nội - Cầu Giấy";
    document.getElementById("detailDate").textContent = prod.date;
    document.getElementById("detailDesc").textContent = prod.description || "Không có mô tả chi tiết.";

    const pill = document.getElementById("detailStatusPill");
    pill.className = `status-pill ${getStatusClass(prod.status)}`;
    pill.textContent = prod.status;

    // Nút Duyệt đơn nhanh trong Modal chi tiết sản phẩm
    const btnApproveProd = document.getElementById("btnModalApproveProd");
    if (btnApproveProd) {
        if (prod.status === "Chờ duyệt") {
            btnApproveProd.style.display = "inline-flex";
            btnApproveProd.onclick = () => {
                approveProduct(prod.id, prod.orderCode);
                document.getElementById("detailDialog")?.close();
            };
        } else {
            btnApproveProd.style.display = "none";
        }
    }

    document.getElementById("detailStatusText").textContent =
        prod.status === "Bị từ chối" ? `Bị từ chối: ${prod.rejectReason || "Chưa đạt yêu cầu"}` :
        prod.status === "Chờ duyệt" ? "Đang chờ quản trị viên kiểm duyệt thông tin" :
        prod.status === "Đang bán" ? "Đang hiển thị công khai trên ReuseHub" : prod.status;

    const dialog = document.getElementById("detailDialog");
    if (dialog) dialog.showModal();
}

// ========================================================
// 6. MÀN HÌNH 4: QUẢN LÝ BẢN NHÁP (DRAFTS MODAL)
// ========================================================

function openDraftsModal() {
    renderDraftsList();
    const dialog = document.getElementById("draftsDialog");
    if (dialog) dialog.showModal();
}

function renderDraftsList() {
    const container = document.getElementById("draftsListContainer");
    if (!container) return;

    if (draftsState.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 32px; color: var(--text-muted);">
                Chưa có bản nháp nào được lưu.
            </div>
        `;
        return;
    }

    container.innerHTML = draftsState.map(d => `
        <div class="draft-item" data-draft-id="${d.id}">
            <div class="draft-info">
                <h4>${d.name || "Bản nháp chưa đặt tên"}</h4>
                <div class="draft-meta">
                    <span>Giá: <strong>${d.price ? formatPrice(d.price) : "Chưa đặt giá"}</strong></span>
                    <span>Tình trạng: ${d.condition || "Chưa chọn"}</span>
                    <span>Lưu lúc: ${d.dateSaved || "Gần đây"}</span>
                </div>
                <p style="margin: 4px 0 0; font-size: 12px; color: var(--text-muted);">
                    ${d.description ? d.description.substring(0, 90) + "..." : "Chưa có mô tả"}
                </p>
            </div>

            <div class="draft-actions">
                <button type="button" class="btn btn-sm btn-primary btn-resume-draft" data-draft-id="${d.id}">
                    Viết tiếp
                </button>
                <button type="button" class="btn btn-sm btn-danger btn-delete-draft" data-draft-id="${d.id}">
                    Xóa
                </button>
            </div>
        </div>
    `).join("");
}

function resumeDraft(draftId) {
    const draft = draftsState.find(d => d.id === draftId);
    if (!draft) return;

    // Điền dữ liệu bản nháp vào form đăng bán (Màn hình 3)
    document.getElementById("formProductName").value = draft.name || "";
    document.getElementById("formProductCategory").value = draft.category || "";
    document.getElementById("formProductCondition").value = draft.condition || "";
    document.getElementById("formProductPrice").value = draft.price || "";
    document.getElementById("formProductLocation").value = draft.location || "";
    document.getElementById("formProductDesc").value = draft.description || "";

    const pricePreview = document.getElementById("pricePreviewText");
    if (pricePreview) {
        pricePreview.textContent = draft.price ? `Hiển thị: ${formatPrice(draft.price)}` : "Hiển thị: 0đ";
    }

    // Đóng popup bản nháp và chuyển sang Màn 3
    document.getElementById("draftsDialog")?.close();
    navigateToScreen("3");
    showToast(`Đã khôi phục dữ liệu bản nháp: "${draft.name || 'Không tên'}"`);
}

function deleteDraft(draftId) {
    const draft = draftsState.find(d => d.id === draftId);
    const draftTitle = draft ? draft.name : "bản nháp này";

    if (confirm(`Bạn có chắc chắn muốn xóa bản nháp "${draftTitle}"?`)) {
        draftsState = draftsState.filter(d => d.id !== draftId);
        saveState(STORAGE_KEYS.DRAFTS, draftsState);
        updateDraftBadges();
        renderDraftsList();
        showToast("Đã xóa bản nháp.");
    }
}

function saveFormAsDraft() {
    const name = document.getElementById("formProductName").value.trim();
    const category = document.getElementById("formProductCategory").value;
    const condition = document.getElementById("formProductCondition").value;
    const price = document.getElementById("formProductPrice").value;
    const location = document.getElementById("formProductLocation").value;
    const description = document.getElementById("formProductDesc").value.trim();

    if (!name && !description) {
        alert("Vui lòng nhập ít nhất Tên sản phẩm hoặc Mô tả trước khi lưu bản nháp.");
        return;
    }

    const newDraft = {
        id: "draft-" + Date.now(),
        name: name || "Bản nháp " + getFormattedDateNow(),
        category,
        condition,
        price: Number(price) || 0,
        location,
        description,
        dateSaved: getFormattedTimeNow()
    };

    draftsState.unshift(newDraft);
    saveState(STORAGE_KEYS.DRAFTS, draftsState);
    updateDraftBadges();

    showToast("Đã lưu bản nháp thành công!");
}

// ========================================================
// 7. MÀN HÌNH 3 & 5 & 6: TẢI ẢNH, VALIDATION VÀ ĐĂNG BÁN
// ========================================================

// Xử lý tải ảnh sản phẩm
function initImageUpload() {
    const dropzone = document.getElementById("uploadDropzone");
    const fileInput = document.getElementById("productImagesInput");
    const previewGrid = document.getElementById("imagePreviewsGrid");

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files) {
            handleSelectedFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files) {
            handleSelectedFiles(fileInput.files);
        }
    });

    function handleSelectedFiles(files) {
        const remainingSlots = 6 - uploadedImages.length;
        if (remainingSlots <= 0) {
            alert("Bạn chỉ có thể tải lên tối đa 6 ảnh cho mỗi sản phẩm.");
            return;
        }

        const countToAdd = Math.min(files.length, remainingSlots);
        for (let i = 0; i < countToAdd; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                uploadedImages.push({ file, url });
            }
        }

        renderImagePreviews();
    }

    function renderImagePreviews() {
        if (!previewGrid) return;
        previewGrid.innerHTML = uploadedImages.map((img, idx) => `
            <div class="image-preview-item">
                <img src="${img.url}" alt="Ảnh sản phẩm ${idx + 1}">
                <button type="button" class="image-preview-remove" data-remove-index="${idx}" title="Xóa ảnh">×</button>
            </div>
        `).join("");

        previewGrid.querySelectorAll(".image-preview-remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.removeIndex, 10);
                uploadedImages.splice(index, 1);
                renderImagePreviews();
            });
        });
    }
}

// Xử lý gửi biểu mẫu đăng bán (Màn hình 3 -> Màn hình 5)
function initPostProductForm() {
    const form = document.getElementById("postProductForm");
    const priceInput = document.getElementById("formProductPrice");
    const pricePreview = document.getElementById("pricePreviewText");

    if (priceInput && pricePreview) {
        priceInput.addEventListener("input", () => {
            const val = Number(priceInput.value);
            pricePreview.textContent = val > 0 ? `Hiển thị: ${formatPrice(val)}` : "Hiển thị: 0đ";
        });
    }

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("formProductName").value.trim();
        const category = document.getElementById("formProductCategory").value;
        const condition = document.getElementById("formProductCondition").value;
        const price = Number(document.getElementById("formProductPrice").value);
        const location = document.getElementById("formProductLocation").value;
        const description = document.getElementById("formProductDesc").value.trim();
        const agreed = document.getElementById("formProductAgreement").checked;

        // Kiểm tra hợp lệ (Validation)
        if (!name) {
            alert("Vui lòng nhập tên sản phẩm.");
            return;
        }
        if (!category) {
            alert("Vui lòng chọn danh mục sản phẩm.");
            return;
        }
        if (!condition) {
            alert("Vui lòng chọn tình trạng sản phẩm.");
            return;
        }
        if (!price || price < 1000) {
            alert("Vui lòng nhập giá bán hợp lệ (tối thiểu 1.000 VNĐ).");
            return;
        }
        if (!location) {
            alert("Vui lòng chọn khu vực.");
            return;
        }
        if (!description) {
            alert("Vui lòng nhập mô tả chi tiết sản phẩm.");
            return;
        }
        if (!agreed) {
            alert("Vui lòng tích chọn cam kết sản phẩm đúng mô tả.");
            return;
        }

        // Lưu dữ liệu vào biến tạm để chờ xác nhận (Màn hình 5)
        pendingProductToSubmit = {
            id: Date.now(),
            name,
            category,
            condition,
            price,
            location,
            description,
            date: getFormattedDateNow(),
            status: "Chờ duyệt",
            icon: getCategoryIcon(category)
        };

        // Mở Màn hình 5 (Hộp thoại xác nhận đăng sản phẩm)
        openConfirmPostModal(pendingProductToSubmit);
    });
}

// MÀN HÌNH 5: HỘP THOẠI XÁC NHẬN ĐĂNG
function openConfirmPostModal(product) {
    const previewBox = document.getElementById("confirmPreviewBox");
    if (previewBox) {
        previewBox.innerHTML = `
            <strong>${product.name}</strong><br>
            <span style="color:var(--text-muted);">Danh mục: ${product.category} · Giá: </span>
            <strong style="color:var(--green-primary);">${formatPrice(product.price)}</strong>
        `;
    }
    const dialog = document.getElementById("confirmPostDialog");
    if (dialog) dialog.showModal();
}

// Xác nhận đăng thành công (Màn hình 5 -> Màn hình 6)
function executeSubmitProduct() {
    if (!pendingProductToSubmit) return;

    // Bổ sung vào danh sách sản phẩm với trạng thái Chờ duyệt
    productsState.unshift(pendingProductToSubmit);
    saveState(STORAGE_KEYS.PRODUCTS, productsState);

    // Đóng Màn hình 5
    document.getElementById("confirmPostDialog")?.close();

    // Reset Form đăng bán và danh sách ảnh tạm
    document.getElementById("postProductForm")?.reset();
    uploadedImages = [];
    const previewGrid = document.getElementById("imagePreviewsGrid");
    if (previewGrid) previewGrid.innerHTML = "";
    document.getElementById("pricePreviewText").textContent = "Hiển thị: 0đ";

    // Cập nhật lại toàn bộ bảng & số liệu thống kê
    syncAllData();

    // Mở MÀN HÌNH 6: THÔNG BÁO ĐĂNG THÀNH CÔNG
    const successDialog = document.getElementById("successPostDialog");
    if (successDialog) successDialog.showModal();

    showToast("Đăng sản phẩm thành công! Đang chờ admin duyệt.");
    pendingProductToSubmit = null;
}

// ========================================================
// 8. XỬ LÝ ĐƠN HÀNG (MÀN HÌNH 8, 9, 10, 11, 12, 13)
// ========================================================

// Đồng bộ trạng thái đơn hàng sang bộ nhớ người mua (localStorage reusehub_buyer_orders)
function syncOrderToBuyerStorage(order) {
    try {
        const raw = localStorage.getItem("reusehub_buyer_orders");
        if (raw) {
            let buyerOrders = JSON.parse(raw);
            let found = buyerOrders.find(b => b.code === order.id || b.id === order.id || b.code === order.code);
            if (found) {
                found.status = order.status;
                localStorage.setItem("reusehub_buyer_orders", JSON.stringify(buyerOrders));
            }
        }
    } catch (e) {
        console.warn("Lỗi đồng bộ đơn hàng sang buyer:", e);
    }
}

function acceptOrder(orderId) {
    const order = ordersState.find(o => o.id === orderId);
    if (!order) return;

    order.status = "Chờ xác nhận";
    syncAllData();
    syncOrderToBuyerStorage(order);
    showToast(`Đã tiếp nhận đơn hàng #${orderId}. Đang chờ xác nhận hàng tồn kho.`);
}

// Duyệt sản phẩm / đơn hàng từ mục "Chờ admin duyệt" (Screen 7)
function approveProduct(productId, orderCode) {
    const prod = productsState.find(p => String(p.id) === String(productId));
    if (prod) {
        prod.status = "Đang bán";
    }

    const targetOrderCode = orderCode || (prod && prod.orderCode);
    if (targetOrderCode) {
        const order = ordersState.find(o => o.id === targetOrderCode || o.code === targetOrderCode);
        if (order) {
            order.status = "Đang giao";
            order.isUrgent = false;
            syncOrderToBuyerStorage(order);
        }
    }

    syncAllData();
    showToast(`Đã duyệt thành công! Trạng thái đơn hàng chuyển sang "Đang giao".`);
}

function confirmOrder(orderId) {
    const order = ordersState.find(o => o.id === orderId);
    if (!order) return;

    // Người bán duyệt đơn hàng -> Chuyển sang "Đang giao"
    order.status = "Đang giao";
    order.isUrgent = false;

    // Đồng bộ sản phẩm tương ứng trong productsState (mục Chờ admin duyệt) nếu có
    const linkedProd = productsState.find(p => p.orderCode === orderId || String(p.id) === String(orderId) || String(p.id) === "order-" + orderId);
    if (linkedProd) {
        linkedProd.status = "Đang bán";
    }

    syncAllData();
    syncOrderToBuyerStorage(order);
    showToast(`Đã duyệt đơn hàng #${orderId} thành công! Đơn hàng đã chuyển sang trạng thái "Đang giao".`);
}

function prepareShipping(orderId) {
    const order = ordersState.find(o => o.id === orderId);
    if (!order) return;

    order.status = "Đang giao";
    order.isUrgent = false;
    syncAllData();
    syncOrderToBuyerStorage(order);
    showToast(`Đơn hàng #${orderId} đã được bàn giao cho đơn vị vận chuyển (Đang giao).`);
}

function openRejectOrderModal(orderId) {
    currentRejectOrderId = orderId;
    const dialog = document.getElementById("confirmRejectOrderDialog");
    if (dialog) dialog.showModal();
}

function executeRejectOrder() {
    if (!currentRejectOrderId) return;
    const order = ordersState.find(o => o.id === currentRejectOrderId);
    if (order) {
        order.status = "Đã hủy";
        order.isUrgent = false;
        syncAllData();
        syncOrderToBuyerStorage(order);
        showToast(`Đã từ chối đơn hàng #${currentRejectOrderId}.`);
    }
    document.getElementById("confirmRejectOrderDialog")?.close();
    currentRejectOrderId = null;
}

function openOrderDetail(orderId) {
    const order = ordersState.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById("orderModalCode").textContent = order.id;
    document.getElementById("orderBuyerName").textContent = order.buyerName;
    document.getElementById("orderBuyerPhone").textContent = order.buyerPhone;
    document.getElementById("orderBuyerAddress").textContent = order.address || "123 Cầu Giấy, Hà Nội";
    document.getElementById("orderDatePlaced").textContent = order.date;
    document.getElementById("orderProductName").textContent = order.productName;
    document.getElementById("orderProductPrice").textContent = formatPrice(order.price);

    const pill = document.getElementById("orderStatusPill");
    pill.className = `status-pill ${getStatusClass(order.status)}`;
    pill.textContent = order.status;

    // Nút Duyệt đơn nhanh trong Modal chi tiết đơn hàng
    const btnApprove = document.getElementById("btnModalApproveOrder");
    if (btnApprove) {
        if (order.status === "Chờ xác nhận" || order.status === "Đơn mới") {
            btnApprove.style.display = "inline-flex";
            btnApprove.onclick = () => {
                confirmOrder(order.id);
                document.getElementById("orderDetailDialog")?.close();
            };
        } else {
            btnApprove.style.display = "none";
        }
    }

    // Cập nhật thanh tiến trình 5 bước
    const steps = [
        document.getElementById("stepPoint1"),
        document.getElementById("stepPoint2"),
        document.getElementById("stepPoint3"),
        document.getElementById("stepPoint4"),
        document.getElementById("stepPoint5")
    ];

    steps.forEach(s => {
        if (s) {
            s.classList.remove("step-done", "step-active");
        }
    });

    const statusMap = {
        "Đơn mới": 1,
        "Chờ xác nhận": 2,
        "Đã xác nhận": 3,
        "Đang giao": 4,
        "Hoàn tất": 5
    };

    const currentStep = statusMap[order.status] || 1;
    for (let i = 0; i < currentStep; i++) {
        if (steps[i]) steps[i].classList.add("step-done");
    }

    const dialog = document.getElementById("orderDetailDialog");
    if (dialog) dialog.showModal();
}

// ========================================================
// 9. SỰ KIỆN TOÀN CỤC & TƯƠNG TÁC NGƯỜI DÙNG
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Khởi tạo SPA và render ban đầu
    syncAllData();
    initImageUpload();
    initPostProductForm();

    // Lắng nghe thay đổi đơn hàng khi Người mua đặt hàng từ trang index.html
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEYS.ORDERS || e.key === "reusehub_buyer_orders") {
            ordersState = loadState(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
            syncAllData();
        }
    });

    // 2. Chuyển màn hình từ thanh điều hướng trên cùng (Topbar)
    document.getElementById("mainNav")?.addEventListener("click", (e) => {
        const link = e.target.closest("[data-screen]");
        if (link) {
            e.preventDefault();
            navigateToScreen(link.dataset.screen);
        }
    });

    // 3. Logo thương hiệu bấm quay về Trang 1
    document.querySelector(".brand")?.addEventListener("click", (e) => {
        e.preventDefault();
        navigateToScreen("1");
    });

    // 4. Thanh chip chọn nhanh 13 màn hình
    document.querySelectorAll("[data-screen-btn]").forEach(btn => {
        btn.addEventListener("click", () => {
            navigateToScreen(btn.dataset.screenBtn);
        });
    });

    // 5. Các nút liên kết nội dung có data-screen
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-screen]");
        if (target && !target.classList.contains("nav-link") && !target.classList.contains("brand")) {
            e.preventDefault();
            navigateToScreen(target.dataset.screen);
        }
    });

    // 6. Đóng các dialog bằng nút [data-close]
    document.querySelectorAll("[data-close]").forEach(btn => {
        btn.addEventListener("click", () => {
            const dialog = document.getElementById(btn.dataset.close);
            if (dialog) dialog.close();
        });
    });

    // 7. Nhấn backdrop để đóng dialog
    document.querySelectorAll("dialog").forEach(dialog => {
        dialog.addEventListener("click", (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });

    // 8. Tương tác form đăng bán & bản nháp (Màn hình 3 & 4)
    document.getElementById("btnSaveDraft")?.addEventListener("click", saveFormAsDraft);
    document.getElementById("btnViewDraftsTop")?.addEventListener("click", openDraftsModal);
    document.getElementById("btnOpenDraftModalQuick")?.addEventListener("click", openDraftsModal);

    // Xác nhận đăng (Màn hình 5)
    document.getElementById("btnConfirmYes")?.addEventListener("click", executeSubmitProduct);

    // 9. Nút điều hướng sau khi đăng thành công (Màn hình 6)
    document.getElementById("btnSuccessGoHome")?.addEventListener("click", () => {
        document.getElementById("successPostDialog")?.close();
        navigateToScreen("1");
    });
    document.getElementById("btnSuccessGoList")?.addEventListener("click", () => {
        document.getElementById("successPostDialog")?.close();
        navigateToScreen("7");
    });

    // 10. Tương tác trên danh sách bản nháp (Màn hình 4)
    document.getElementById("draftsListContainer")?.addEventListener("click", (e) => {
        const resumeBtn = e.target.closest(".btn-resume-draft");
        if (resumeBtn) {
            resumeDraft(resumeBtn.dataset.draftId);
            return;
        }
        const delBtn = e.target.closest(".btn-delete-draft");
        if (delBtn) {
            deleteDraft(delBtn.dataset.draftId);
            return;
        }
    });

    // 11. Tabs lọc trạng thái sản phẩm (Màn hình 7)
    document.getElementById("productTabs")?.addEventListener("click", (e) => {
        const tab = e.target.closest(".tab-item");
        if (tab) {
            document.querySelectorAll("#productTabs .tab-item").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTabFilter = tab.dataset.tab;
            renderScreen7();
        }
    });

    // Tìm kiếm & sắp xếp thẻ sản phẩm (Màn hình 7)
    document.getElementById("productCardSearch")?.addEventListener("input", renderScreen7);
    document.getElementById("productSortFilter")?.addEventListener("change", renderScreen7);

    // 12. Tìm kiếm trên trang Dashboard (Màn hình 1)
    document.getElementById("dashSearch")?.addEventListener("input", renderScreen1);
    document.getElementById("dashStatusFilter")?.addEventListener("change", renderScreen1);

    // Ô tìm kiếm toàn trang (Topbar Search) đồng bộ sang trang hiện tại
    document.getElementById("topSearch")?.addEventListener("input", (e) => {
        const val = e.target.value;
        const dashSearch = document.getElementById("dashSearch");
        const cardSearch = document.getElementById("productCardSearch");
        const orderSearch = document.getElementById("orderSearchInput");

        if (dashSearch) dashSearch.value = val;
        if (cardSearch) cardSearch.value = val;
        if (orderSearch) orderSearch.value = val;

        renderCurrentScreen(currentActiveScreen);
    });

    // 13. Tìm kiếm đơn hàng (Màn hình 8, 9, 10, 11, 12, 13)
    document.getElementById("orderSearchInput")?.addEventListener("input", renderScreen8);
    document.getElementById("orderStatusSelect")?.addEventListener("change", renderScreen8);
    document.getElementById("mgmtSearchInput")?.addEventListener("input", renderScreen9);
    document.getElementById("screen10Search")?.addEventListener("input", renderScreen10);
    document.getElementById("screen11Search")?.addEventListener("input", renderScreen11);
    document.getElementById("screen12Search")?.addEventListener("input", renderScreen12);
    document.getElementById("screen13Search")?.addEventListener("input", renderScreen13);

    // 14. Thao tác trên bảng và thẻ sản phẩm (Xem chi tiết, Chỉnh sửa, Từ chối, Gửi duyệt lại)
    document.addEventListener("click", (e) => {
        // Duyệt đơn hàng từ thẻ sản phẩm (Screen 7 mục Chờ admin duyệt)
        const approveProdBtn = e.target.closest(".btn-approve-product");
        if (approveProdBtn) {
            approveProduct(approveProdBtn.dataset.id, approveProdBtn.dataset.orderCode);
            return;
        }

        // Xem chi tiết sản phẩm
        const detailBtn = e.target.closest(".btn-view-detail");
        if (detailBtn) {
            openProductDetail(detailBtn.dataset.id);
            return;
        }

        // Chỉnh sửa sản phẩm
        const editBtn = e.target.closest(".btn-edit-product");
        if (editBtn) {
            const prod = productsState.find(p => p.id == editBtn.dataset.id);
            if (prod) {
                document.getElementById("formProductName").value = prod.name;
                document.getElementById("formProductCategory").value = prod.category;
                document.getElementById("formProductCondition").value = prod.condition || "Đã qua sử dụng (90%)";
                document.getElementById("formProductPrice").value = prod.price;
                document.getElementById("formProductLocation").value = prod.location || "";
                document.getElementById("formProductDesc").value = prod.description;
                document.getElementById("pricePreviewText").textContent = `Hiển thị: ${formatPrice(prod.price)}`;
                navigateToScreen("3");
                showToast(`Đang chỉnh sửa: "${prod.name}"`);
            }
            return;
        }

        // Xem lý do từ chối
        const rejectReasonBtn = e.target.closest(".btn-view-reject-reason");
        if (rejectReasonBtn) {
            const prod = productsState.find(p => p.id == rejectReasonBtn.dataset.id);
            if (prod) {
                document.getElementById("rejectReasonTitle").textContent = prod.name;
                document.getElementById("rejectReasonContent").textContent =
                    prod.rejectReason || "Hình ảnh mờ, không đạt yêu cầu tiêu chuẩn kiểm duyệt.";
                document.getElementById("btnResubmitAudit").dataset.id = prod.id;
                document.getElementById("rejectReasonDialog")?.showModal();
            }
            return;
        }

        // Gửi duyệt lại
        const resubmitBtn = e.target.closest(".btn-resubmit-audit");
        if (resubmitBtn) {
            const prod = productsState.find(p => p.id == resubmitBtn.dataset.id);
            if (prod) {
                prod.status = "Chờ duyệt";
                document.getElementById("rejectReasonDialog")?.close();
                syncAllData();
                showToast(`Đã gửi lại yêu cầu kiểm duyệt cho: "${prod.name}"`);
            }
            return;
        }

        // Xem chi tiết đơn hàng
        const viewOrderBtn = e.target.closest(".btn-view-order");
        if (viewOrderBtn) {
            openOrderDetail(viewOrderBtn.dataset.id);
            return;
        }

        // Tiếp nhận đơn hàng
        const acceptOrderBtn = e.target.closest(".btn-accept-order");
        if (acceptOrderBtn) {
            acceptOrder(acceptOrderBtn.dataset.id);
            return;
        }

        // Xác nhận đơn hàng
        const confirmOrderBtn = e.target.closest(".btn-confirm-order");
        if (confirmOrderBtn) {
            confirmOrder(confirmOrderBtn.dataset.id);
            return;
        }

        // Chuẩn bị giao hàng
        const prepShippingBtn = e.target.closest(".btn-prepare-shipping");
        if (prepShippingBtn) {
            prepareShipping(prepShippingBtn.dataset.id);
            return;
        }

        // Mở popup từ chối đơn hàng
        const rejectOrderModalBtn = e.target.closest(".btn-reject-order-modal");
        if (rejectOrderModalBtn) {
            openRejectOrderModal(rejectOrderModalBtn.dataset.id);
            return;
        }
    });

    // Nút xác nhận từ chối đơn hàng
    document.getElementById("btnExecuteRejectOrder")?.addEventListener("click", executeRejectOrder);

    // 15. Form liên hệ hỗ trợ & hồ sơ
    document.getElementById("supportForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Cảm ơn bạn! Yêu cầu hỗ trợ đã được gửi đến ban quản trị.");
        e.target.reset();
    });

    document.getElementById("profileForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Đã cập nhật thông tin hồ sơ cửa hàng thành công!");
    });
});

