/**
 * ==========================================================================
 * ReUseHub - Quản lý Trang Sửa chữa (Repairer Script - Tự chứa)
 * Dự án BTL Lập trình Web - Nhóm 3
 * ==========================================================================
 */

// Hàm thông báo Toast tiếng Việt độc lập
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
function showToast(title, message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Đóng">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 250);
  };

  closeBtn.addEventListener('click', removeToast);
  container.appendChild(toast);
  if (duration > 0) setTimeout(removeToast, duration);
}

// Dữ liệu mẫu chuẩn PDF 2 trang
const DEFAULT_PENDING_ORDERS = [
  {
    id: 1,
    title: 'Ghế gỗ',
    detailTitle: 'Sửa ghế gỗ kêu cót két',
    desc: 'Ghế bị lỏng ốc, kêu cót két khi ngồi.',
    extraDesc: 'Cần siết lại các chốt và gia cố ốc vít khung chân ghế.',
    notes: 'Mong anh/chị sửa trong ngày giúp mình vì đang cần dùng để làm việc. Cảm ơn bạn!',
    user: 'Nguyễn Thị Lan',
    verified: true,
    location: 'Quận 3, TP. Hồ Chí Minh',
    timeAgo: '2 giờ trước',
    datePosted: 'Hôm nay',
    budget: '150.000đ',
    budgetRange: '120.000 - 150.000đ',
    budgetNum: 150000,
    phone: '0903 888 123',
    email: 'lan.nguyen@email.com',
    memberSince: '03/2024',
    image: '../assets/images/chair.svg',
    avatar: '../assets/images/avatar-lan.svg',
    tags: ['all', 'new', 'nearby', 'priority']
  },
  {
    id: 2,
    title: 'Nồi cơm điện',
    detailTitle: 'Sửa nồi cơm điện',
    desc: 'Nồi không vào điện, cắm điện không có đèn báo.',
    extraDesc: 'Đã thử đổi ổ cắm nhưng vẫn không hoạt động.',
    notes: 'Mong được kiểm tra và sửa nhanh giúp mình.\nCảm ơn bạn!',
    user: 'Nguyễn Minh Anh',
    altUser: 'Trần Minh Hoàng',
    verified: true,
    location: 'Quận 3, TP. Hồ Chí Minh',
    altLocation: 'Tân Bình, TP. Hồ Chí Minh',
    timeAgo: '5 giờ trước',
    datePosted: 'Hôm nay',
    budget: '250.000đ',
    budgetRange: '150.000 - 250.000đ',
    budgetNum: 250000,
    phone: '0901 234 567',
    email: 'minhanh.nguyen@email.com',
    memberSince: '05/2024',
    image: '../assets/images/rice-cooker.svg',
    avatar: '../assets/images/avatar-anh.svg',
    tags: ['all', 'new', 'high-budget', 'priority']
  },
  {
    id: 3,
    title: 'Balo vải',
    detailTitle: 'Thay khóa kéo balo vải',
    desc: 'Khóa kéo bị hỏng, kéo không đóng được.',
    extraDesc: 'Dây kéo chính bị kẹt vải và tuột răng khóa.',
    notes: 'Balo đi học của bé, mong được thay khóa loại bền tốt một chút. Xin cảm ơn!',
    user: 'Lê Hoàng Yến',
    verified: true,
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    timeAgo: '7 giờ trước',
    datePosted: 'Hôm nay',
    budget: '120.000đ',
    budgetRange: '100.000 - 120.000đ',
    budgetNum: 120000,
    phone: '0918 777 654',
    email: 'yen.le@email.com',
    memberSince: '01/2024',
    image: '../assets/images/backpack.svg',
    avatar: '../assets/images/avatar-yen.svg',
    tags: ['all', 'new']
  }
];

const DEFAULT_CLAIMED_ORDERS = [
  {
    id: 4,
    title: 'Đèn bàn học',
    desc: 'Đèn chập chờn khi bật.',
    user: 'Phạm Quốc Bảo',
    verified: true,
    location: 'Bình Thạnh, TP. Hồ Chí Minh',
    claimedDate: '22/05/2024\n10:30',
    status: 'Đang xử lý',
    budget: '180.000đ',
    budgetNum: 180000,
    image: '../assets/images/lamp.svg',
    avatar: '../assets/images/avatar-bao.svg'
  }
];

const RepairStorage = {
  getPendingOrders() {
    const raw = localStorage.getItem('reusehub_repair_pending');
    if (!raw) {
      localStorage.setItem('reusehub_repair_pending', JSON.stringify(DEFAULT_PENDING_ORDERS));
      return DEFAULT_PENDING_ORDERS;
    }
    try { return JSON.parse(raw); } catch (e) { return DEFAULT_PENDING_ORDERS; }
  },

  getClaimedOrders() {
    const raw = localStorage.getItem('reusehub_repair_claimed');
    if (!raw) {
      localStorage.setItem('reusehub_repair_claimed', JSON.stringify(DEFAULT_CLAIMED_ORDERS));
      return DEFAULT_CLAIMED_ORDERS;
    }
    try { return JSON.parse(raw); } catch (e) { return DEFAULT_CLAIMED_ORDERS; }
  },

  savePendingOrders(data) { localStorage.setItem('reusehub_repair_pending', JSON.stringify(data)); },
  saveClaimedOrders(data) { localStorage.setItem('reusehub_repair_claimed', JSON.stringify(data)); },

  claimOrder(orderId) {
    const pending = this.getPendingOrders();
    const claimed = this.getClaimedOrders();

    const targetIndex = pending.findIndex(o => o.id === orderId);
    if (targetIndex === -1) return null;

    const [targetOrder] = pending.splice(targetIndex, 1);

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newClaimedItem = {
      id: targetOrder.id,
      title: targetOrder.title,
      desc: targetOrder.desc,
      user: targetOrder.user,
      verified: targetOrder.verified,
      location: targetOrder.location,
      claimedDate: `${dateStr}\n${timeStr}`,
      status: 'Đang xử lý',
      budget: targetOrder.budget,
      budgetNum: targetOrder.budgetNum,
      image: targetOrder.image,
      avatar: targetOrder.avatar
    };

    claimed.unshift(newClaimedItem);
    this.savePendingOrders(pending);
    this.saveClaimedOrders(claimed);

    return targetOrder;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const viewOrdersList = document.getElementById('viewOrdersList');
  const viewOrderDetail = document.getElementById('viewOrderDetail');
  const detailContainer = document.getElementById('repairDetailContent');

  const ordersGrid = document.getElementById('repairOrdersGrid');
  const claimedTableBody = document.getElementById('claimedOrdersTableBody');
  const searchInput = document.getElementById('repairSearchInput');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const btnToggleFilter = document.getElementById('btnToggleFilter');
  const filterDrawer = document.getElementById('filterDrawer');
  const areaFilter = document.getElementById('areaFilter');
  const priceFilter = document.getElementById('priceFilter');

  const roleBtn = document.getElementById('roleDropdownBtn');
  const roleMenu = document.getElementById('roleDropdownMenu');
  const mobileToggle = document.getElementById('navMobileToggle');
  const navMenu = document.getElementById('repairNavMenu');

  let activeTab = 'all';
  let searchTerm = '';
  let selectedArea = 'all';
  let selectedPrice = 'all';

  // 1. Navigation & Dropdown
  if (roleBtn && roleMenu) {
    roleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      roleMenu.classList.toggle('show');
    });
    document.addEventListener('click', () => roleMenu.classList.remove('show'));
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.style.display = (navMenu.style.display === 'flex') ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
    });
  }

  // 2. Chuyển đổi giữa Chế độ Danh sách và Chi tiết trong 1 file repairer.html
  function showListView() {
    viewOrdersList.style.display = 'block';
    viewOrderDetail.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderPendingList();
    renderClaimedTable();
  }

  function showDetailView(orderId = 2) {
    const pending = RepairStorage.getPendingOrders();
    const claimed = RepairStorage.getClaimedOrders();

    let order = pending.find(o => o.id === orderId) || claimed.find(o => o.id === orderId);
    if (!order) order = DEFAULT_PENDING_ORDERS[1];

    const isAlreadyClaimed = claimed.some(o => o.id === order.id);

    detailContainer.innerHTML = `
      <div class="order-detail-card">
        <!-- Ảnh bên trái -->
        <div class="detail-image-box">
          <img src="${order.image}" alt="${order.detailTitle || order.title}">
        </div>

        <!-- Thông tin bên phải -->
        <div class="detail-info-col">
          <h2 class="detail-item-title">${order.detailTitle || ('Sửa ' + order.title)}</h2>

          <!-- Lưới 4 ô meta -->
          <div class="detail-meta-grid">
            <div class="meta-field">
              <span class="meta-field-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Người đăng
              </span>
              <span class="meta-field-value">${order.user}</span>
            </div>

            <div class="meta-field">
              <span class="meta-field-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Khu vực
              </span>
              <span class="meta-field-value">${order.location}</span>
            </div>

            <div class="meta-field">
              <span class="meta-field-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Ngày đăng
              </span>
              <span class="meta-field-value">${order.datePosted || 'Hôm nay'}</span>
            </div>

            <div class="meta-field">
              <span class="meta-field-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle></svg>
                Ngân sách dự kiến
              </span>
              <span class="meta-field-value">${order.budgetRange || order.budget}</span>
            </div>
          </div>

          <!-- 2 Hộp mô tả & ghi chú -->
          <div class="detail-desc-row">
            <div class="desc-card">
              <div class="desc-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                Mô tả tình trạng
              </div>
              <div class="desc-card-content">
                <p>${order.desc}</p>
                ${order.extraDesc ? `<p style="margin-top: 6px;">${order.extraDesc}</p>` : ''}
              </div>
            </div>

            <div class="desc-card">
              <div class="desc-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Ghi chú / Yêu cầu của khách hàng
              </div>
              <div class="desc-card-content">
                <p style="white-space: pre-line;">${order.notes || 'Mong được kiểm tra và sửa nhanh giúp mình.\nCảm ơn bạn!'}</p>
              </div>
            </div>
          </div>

          <!-- Khối Thông tin người đăng -->
          <div class="sender-info-card">
            <div class="sender-card-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Thông tin người đăng
            </div>
            <div class="sender-card-body">
              <div class="sender-profile-left">
                <img src="${order.avatar}" alt="${order.user}" class="sender-avatar-large">
                <div>
                  <div class="sender-name">${order.user}</div>
                  <div class="sender-contact-row">
                    <span>&#128222; ${order.phone || '0901 234 567'}</span>
                    <span>&#9993; ${order.email || 'minhanh.nguyen@email.com'}</span>
                  </div>
                </div>
              </div>

              <div class="sender-profile-right">
                <div>&#128205; ${order.location}</div>
                <div>&#9201; Tham gia ReUseHub từ ${order.memberSince || '05/2024'}</div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn-view-map"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
                  Xem bản đồ
                </a>
              </div>
            </div>
          </div>

          <!-- Nút Nhận đơn -->
          <div class="detail-action-bar">
            <button 
              type="button" 
              id="btnClaimDetailAction" 
              class="btn-claim-detail"
              ${isAlreadyClaimed ? 'disabled' : ''}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              ${isAlreadyClaimed ? 'Đơn hàng đã được nhận' : 'Nhận đơn'}
            </button>
          </div>

        </div>
      </div>
    `;

    // Cập nhật huy hiệu trạng thái góc trên
    const badgeContainer = document.getElementById('detailStatusBadgeContainer');
    if (badgeContainer) {
      badgeContainer.innerHTML = isAlreadyClaimed ? `
        <span class="status-pill processing" style="padding: 6px 14px; font-size: 0.875rem;">
          ● Đang xử lý
        </span>
      ` : `
        <span class="badge-order-status">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Đơn hàng chờ nhận
        </span>
      `;
    }

    // Sự kiện nút nhận đơn trong chi tiết
    const btnClaim = document.getElementById('btnClaimDetailAction');
    if (btnClaim && !isAlreadyClaimed) {
      btnClaim.addEventListener('click', () => {
        openConfirmClaimModal(order.id, () => {
          showDetailView(order.id);
        });
      });
    }

    viewOrdersList.style.display = 'none';
    viewOrderDetail.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Nút quay lại danh sách từ trang chi tiết
  const btnBackToList = document.getElementById('btnBackToList');
  if (btnBackToList) {
    btnBackToList.addEventListener('click', (e) => {
      e.preventDefault();
      showListView();
    });
  }

  // 3. Render danh sách chờ nhận
  function renderPendingList() {
    const orders = RepairStorage.getPendingOrders();

    const filtered = orders.filter(item => {
      if (activeTab === 'new' && !item.tags.includes('new')) return false;
      if (activeTab === 'priority' && !item.tags.includes('priority')) return false;
      if (activeTab === 'nearby' && !item.tags.includes('nearby')) return false;
      if (activeTab === 'high-budget' && !item.tags.includes('high-budget')) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const match = item.title.toLowerCase().includes(term) ||
                      item.desc.toLowerCase().includes(term) ||
                      item.user.toLowerCase().includes(term) ||
                      item.location.toLowerCase().includes(term);
        if (!match) return false;
      }

      if (selectedArea !== 'all' && !item.location.includes(selectedArea)) return false;
      if (selectedPrice === 'under150' && item.budgetNum > 150000) return false;
      if (selectedPrice === '150to250' && (item.budgetNum < 150000 || item.budgetNum > 250000)) return false;
      if (selectedPrice === 'above250' && item.budgetNum <= 250000) return false;

      return true;
    });

    if (filtered.length === 0) {
      ordersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 40px; text-align: center;">
          <p style="font-size: 1.1rem; color: #64748b; font-weight: 600;">Không tìm thấy đơn hàng sửa chữa phù hợp</p>
          <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 6px;">Vui lòng thử chọn lại tab hoặc đổi từ khóa tìm kiếm.</p>
        </div>
      `;
      return;
    }

    ordersGrid.innerHTML = filtered.map(order => `
      <article class="repair-card">
        <div>
          <div class="card-top-row">
            <img src="${order.image}" alt="${order.title}" class="card-item-thumb">
            <div class="card-user-info">
              <div class="card-user-header">
                <img src="${order.avatar}" alt="${order.user}" class="card-user-avatar">
                <span class="card-user-name">${order.user}</span>
                ${order.verified ? `<span class="badge-verified">&#10003; Đã xác minh</span>` : ''}
              </div>
              <div class="card-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${order.location}</span>
              </div>
            </div>
          </div>

          <h3 class="card-item-title">${order.title}</h3>
          <p class="card-item-desc">${order.desc}</p>
        </div>

        <div>
          <div class="card-meta-row">
            <div class="card-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Đăng lúc: ${order.timeAgo}</span>
            </div>
            <div class="card-budget">
              <span class="card-budget-label">Ngân sách: </span>
              <span class="card-budget-value">${order.budget}</span>
            </div>
          </div>

          <div class="card-actions-row">
            <button type="button" class="btn-claim-order" data-id="${order.id}">Nhận đơn sửa</button>
            <button type="button" class="btn-view-detail" data-id="${order.id}">Xem chi tiết</button>
          </div>
        </div>
      </article>
    `).join('');

    // Sự kiện nút Nhận đơn
    ordersGrid.querySelectorAll('.btn-claim-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openConfirmClaimModal(id, () => {
          renderPendingList();
          renderClaimedTable();
        });
      });
    });

    // Sự kiện nút Xem chi tiết (Chuyển sang view chi tiết)
    ordersGrid.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        showDetailView(id);
      });
    });
  }

  // 4. Render bảng Đơn hàng đã nhận
  function renderClaimedTable() {
    const claimed = RepairStorage.getClaimedOrders();
    if (!claimedTableBody) return;

    if (claimed.length === 0) {
      claimedTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#94a3b8;">Chưa có đơn hàng nào được nhận.</td></tr>`;
      return;
    }

    claimedTableBody.innerHTML = claimed.map(item => `
      <tr>
        <td>
          <div class="table-item-cell">
            <img src="${item.image}" alt="${item.title}" class="table-item-thumb">
            <div>
              <div class="table-item-title">${item.title}</div>
              <div class="table-item-desc">${item.desc}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${item.avatar}" alt="${item.user}" style="width:24px; height:24px; border-radius:50%;">
            <div>
              <span style="font-weight:600; font-size:0.9rem;">${item.user}</span>
              ${item.verified ? `<div style="font-size:0.75rem; color:#166534;">&#10003; Đã xác minh</div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:4px; font-size:0.85rem; color:#4b5563;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
            <span>${item.location}</span>
          </div>
        </td>
        <td style="font-size:0.85rem; color:#4b5563; white-space:pre-line;">${item.claimedDate}</td>
        <td>
          <span class="status-pill processing">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#0284c7;"></span>
            ${item.status}
          </span>
        </td>
        <td style="font-weight:700; color:#111827;">${item.budget}</td>
        <td>
          <span class="table-action-link" data-id="${item.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Xem chi tiết
          </span>
        </td>
      </tr>
    `).join('');

    claimedTableBody.querySelectorAll('.table-action-link').forEach(link => {
      link.addEventListener('click', () => {
        const id = parseInt(link.getAttribute('data-id'), 10);
        showDetailView(id);
      });
    });
  }

  // 5. Tabs & Search
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderPendingList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderPendingList();
    });
  }

  if (btnToggleFilter && filterDrawer) {
    btnToggleFilter.addEventListener('click', () => {
      btnToggleFilter.classList.toggle('active');
      filterDrawer.classList.toggle('show');
    });
  }

  if (areaFilter) {
    areaFilter.addEventListener('change', (e) => {
      selectedArea = e.target.value;
      renderPendingList();
    });
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      selectedPrice = e.target.value;
      renderPendingList();
    });
  }

  // 6. Modals
  const guideModal = document.getElementById('guideModal');
  const btnOpenGuide = document.getElementById('btnOpenGuide');
  const confirmModal = document.getElementById('confirmClaimModal');

  if (btnOpenGuide && guideModal) {
    btnOpenGuide.addEventListener('click', () => guideModal.classList.add('show'));
  }

  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (guideModal) guideModal.classList.remove('show');
      if (confirmModal) confirmModal.classList.remove('show');
    });
  });

  window.addEventListener('click', (e) => {
    if (guideModal && e.target === guideModal) guideModal.classList.remove('show');
    if (confirmModal && e.target === confirmModal) confirmModal.classList.remove('show');
  });

  function openConfirmClaimModal(orderId, onSuccess) {
    const pending = RepairStorage.getPendingOrders();
    const order = pending.find(o => o.id === orderId);
    if (!order) {
      showToast('Thông báo', 'Đơn hàng này không còn trong danh sách chờ nhận.', 'info');
      return;
    }

    document.getElementById('modalConfirmItemTitle').textContent = order.title;
    document.getElementById('modalConfirmItemUser').textContent = `${order.user} (${order.location})`;
    document.getElementById('modalConfirmItemBudget').textContent = order.budget;

    confirmModal.classList.add('show');

    const btnConfirm = document.getElementById('btnModalConfirmClaim');
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);

    newBtn.addEventListener('click', () => {
      const claimed = RepairStorage.claimOrder(orderId);
      confirmModal.classList.remove('show');
      if (claimed) {
        showToast('Nhận đơn thành công!', `Bạn đã tiếp nhận đơn sửa chữa "${claimed.title}". Hãy liên hệ người đăng để hẹn kiểm tra.`, 'success', 3500);
        if (typeof onSuccess === 'function') onSuccess();
      }
    });
  }

  // Khởi chạy mặc định danh sách
  renderPendingList();
  renderClaimedTable();
});

