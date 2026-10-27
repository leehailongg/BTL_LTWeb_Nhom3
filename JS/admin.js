/**
 * REUSEHUB ADMIN - TOÀN BỘ LOGIC JAVASCRIPT THUẦN (VANILLA JS)
 * Xây dựng chính xác theo 8 trang trong file PDF tham chiếu "Giao diện admin.pdf"
 * Lưu trữ trạng thái với LocalStorage, biểu đồ trực quan với Chart.js
 */

// Đóng gói toàn bộ ứng dụng trong đối tượng app để tránh xung đột biến toàn cục
// KIỂM TRA ĐĂNG NHẬP
// KIỂM TRA ĐĂNG NHẬP
// KIỂM TRA ĐĂNG NHẬP
function layNguoiDungDangNhap() {
    try {
        const nguoiDung = JSON.parse(
            localStorage.getItem("nguoiDung") || "null"
        );

        if (
            nguoiDung &&
            typeof nguoiDung === "object" &&
            nguoiDung.email
        ) {
            return nguoiDung;
        }
    } catch (e) {
        console.error("Dữ liệu đăng nhập không hợp lệ:", e);
    }

    return null;
}

const nguoiDungAdmin = layNguoiDungDangNhap();

if (!nguoiDungAdmin) {
    alert("Bạn cần đăng nhập để sử dụng trang quản trị!");
    window.location.replace("login.html");
} else {
    khoiTaoTrangQuanTri();
}
const app = {
  // 1. DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA THEO PDF)
  initialData: {
    // Màn hình 2: Danh sách tin đăng mẫu
    posts: [
      { id: 1, title: 'Bàn học gỗ tự nhiên', author: 'Trần Thị Lan', category: 'Nội thất', date: '18/06/2025', status: 'Chờ duyệt', price: '450.000 đ', desc: 'Bàn học gỗ sồi tự nhiên, mặt bàn rộng 1m2, còn mới 90% không trầy xước.' },
      { id: 2, title: 'Nồi cơm điện mini', author: 'Nguyễn Minh', category: 'Gia dụng', date: '18/06/2025', status: 'Chờ duyệt', price: '250.000 đ', desc: 'Nồi 0.8L phù hợp cho sinh viên, dùng tốt, tặng kèm muôi xới cơm.' },
      { id: 3, title: 'Xe đạp cũ', author: 'Lê Hoàng', category: 'Di chuyển', date: '17/06/2025', status: 'Chờ duyệt', price: '600.000 đ', desc: 'Xe cào cào thể thao, lốp xe mới thay, phanh nhạy an toàn.' },
      { id: 4, title: 'Áo khoác denim', author: 'Phạm An', category: 'Thời trang', date: '17/06/2025', status: 'Chờ duyệt', price: '180.000 đ', desc: 'Size L, chất vải bò dày dặn, mặc được 2 lần còn rất mới.' },
      { id: 5, title: 'Đèn bàn học', author: 'Vũ Nam', category: 'Nội thất', date: '16/06/2025', status: 'Chờ duyệt', price: '90.000 đ', desc: 'Đèn LED chống cận thị 3 chế độ sáng, cắm cổng USB tiện lợi.' }
    ],

    // Màn hình 3: Danh sách báo cáo & khiếu nại mẫu
    reports: [
      { id: 'BC-2401', content: 'Tin đăng sai thông tin', author: 'Nguyễn Minh', date: '18/06/2025', severity: 'Cao', status: 'Mới', target: 'Tin đăng #TN-1029 (Bàn gỗ ép)', note: '' },
      { id: 'BC-2398', content: 'Nội dung không phù hợp', author: 'Trần Thị Lan', date: '18/06/2025', severity: 'Trung bình', status: 'Đang xử lý', target: 'Tin đăng #TN-1015', note: 'Đã nhắc nhở chủ tin đăng cập nhật hình ảnh.' },
      { id: 'BC-2395', content: 'Tài khoản giả mạo', author: 'Lê Hoàng', date: '17/06/2025', severity: 'Cao', status: 'Đang xử lý', target: 'Người dùng hoang_gia_99', note: 'Đang yêu cầu xác minh CCCD/số điện thoại.' },
      { id: 'BC-2387', content: 'Spam / quảng cáo', author: 'Phạm An', date: '16/06/2025', severity: 'Thấp', status: 'Đã giải quyết', target: 'Bình luận spam link cờ bạc', note: 'Đã xóa bình luận và khóa mõm tài khoản 7 ngày.' },
      { id: 'BC-2382', content: 'Giao dịch ngoài nền tảng', author: 'Vũ Nam', date: '15/06/2025', severity: 'Trung bình', status: 'Đã giải quyết', target: 'Người dùng namvu_trade', note: 'Cảnh cáo lần 1 theo quy chế hoạt động.' }
    ],

    // Màn hình 4: Danh sách người dùng mẫu
    users: [
      { id: 1, name: 'Nguyễn Minh', email: 'minh.nguyen@email.com', role: 'Người dùng', joined: '12/06/2025', status: 'Hoạt động' },
      { id: 2, name: 'Trần Thị Lan', email: 'lan.tran@email.com', role: 'Người dùng', joined: '09/06/2025', status: 'Hoạt động' },
      { id: 3, name: 'Lê Hoàng', email: 'hoang.le@email.com', role: 'Moderator', joined: '28/05/2025', status: 'Hoạt động' },
      { id: 4, name: 'Phạm An', email: 'an.pham@email.com', role: 'Người dùng', joined: '18/05/2025', status: 'Bị khóa' },
      { id: 5, name: 'Vũ Nam', email: 'nam.vu@email.com', role: 'Người dùng', joined: '11/05/2025', status: 'Hoạt động' }
    ],

    // Màn hình 5: Danh mục phân loại mẫu
    categories: [
      { id: 1, name: 'Nội thất', postCount: 328, created: '12/05/2025', status: 'Đang hoạt động' },
      { id: 2, name: 'Gia dụng', postCount: 246, created: '09/05/2025', status: 'Đang hoạt động' },
      { id: 3, name: 'Thời trang', postCount: 198, created: '28/04/2025', status: 'Đang hoạt động' },
      { id: 4, name: 'Di chuyển', postCount: 154, created: '18/04/2025', status: 'Đang hoạt động' },
      { id: 5, name: 'Điện tử', postCount: 116, created: '11/04/2025', status: 'Tạm ẩn' }
    ],

    // Màn hình 7: Nhật ký hoạt động mẫu
    activityLogs: [
      { time: '18/06 09:30', actor: 'Nguyễn Minh', action: 'Duyệt tin đăng', target: 'Bàn học gỗ', detail: 'Tin #TN-2841', status: 'Thành công' },
      { time: '18/06 09:12', actor: 'Trần Thị Lan', action: 'Khóa tài khoản', target: 'Phạm An', detail: 'Vi phạm chính sách', status: 'Thành công' },
      { time: '18/06 08:45', actor: 'Lê Hoàng', action: 'Cập nhật danh mục', target: 'Nội thất', detail: 'Đổi tên danh mục', status: 'Thành công' },
      { time: '17/06 16:20', actor: 'Phạm An', action: 'Xử lý báo cáo', target: '#BC-2395', detail: 'Đóng báo cáo', status: 'Thành công' },
      { time: '17/06 14:05', actor: 'Nguyễn Minh', action: 'Thay đổi quyền', target: 'Lê Hoàng', detail: 'Thêm quyền hỗ trợ', status: 'Thành công' },
      { time: '17/06 11:10', actor: 'Trần Thị Lan', action: 'Duyệt người dùng', target: 'Vũ Nam', detail: 'Kích hoạt tài khoản', status: 'Thành công' },
      { time: '16/06 15:40', actor: 'Nguyễn Minh', action: 'Duyệt tin đăng', target: 'Nồi cơm điện', detail: 'Tin #TN-2830', status: 'Thành công' },
      { time: '16/06 10:15', actor: 'Lê Hoàng', action: 'Xử lý báo cáo', target: '#BC-2387', detail: 'Xóa bình luận spam', status: 'Thành công' },
      { time: '15/06 14:20', actor: 'Trần Thị Lan', action: 'Cập nhật danh mục', target: 'Gia dụng', detail: 'Cập nhật biểu tượng', status: 'Thành công' },
      { time: '15/06 09:00', actor: 'Nguyễn Minh', action: 'Sao lưu hệ thống', target: 'Cơ sở dữ liệu', detail: 'Sao lưu tự động', status: 'Thành công' }
    ],

    // Màn hình 8: Quản trị viên và Vai trò
    systemAdmins: [
      { name: 'Nguyễn Minh', role: 'Super Admin', email: 'minh.nguyen@reusehub.vn' },
      { name: 'Trần Thị Lan', role: 'Moderator', email: 'lan.tran@reusehub.vn' },
      { name: 'Lê Hoàng', role: 'Nhân viên hỗ trợ', email: 'hoang.le@reusehub.vn' }
    ],

    roles: [
      { role: 'Super Admin', scope: 'Toàn hệ thống' },
      { role: 'Moderator', scope: 'Tin đăng, báo cáo' },
      { role: 'Hỗ trợ', scope: 'Người dùng, hỗ trợ' }
    ],

    // Thống kê tổng hợp (tự động cập nhật khi thao tác)
    stats: {
      pendingPosts: 126,
      approvedToday: 84,
      rejectedToday: 12,
      newReports: 38,
      processingReports: 21,
      resolvedReports: 146,
      totalUsers: 8642,
      newUsers: 1286,
      lockedUsers: 42,
      activeCategories: 24,
      hiddenCategories: 5,
      totalPosts: 926
    }
  },

  // Trạng thái hiện tại của ứng dụng
  state: {},
  currentPage: 'overview',
  activeChart1: null,
  activeChart2: null,
  activeChartPie: null,

  // Phân trang nhật ký hoạt động
  logPagination: {
    currentPage: 1,
    pageSize: 6,
    totalPages: 1
  },

  // 2. KHỞI TẠO ỨNG DỤNG (INIT)
  init() {
    this.loadStateFromStorage();
    this.bindEvents();
    this.handleRoute();
    this.renderCurrentView();
    this.updateHeaderStats();
  },

  // Lưu trữ và lấy dữ liệu LocalStorage
  loadStateFromStorage() {
    const saved = localStorage.getItem('REUSEHUB_ADMIN_STATE_V1');
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error('Lỗi phân tích LocalStorage, dùng dữ liệu mặc định:', e);
        this.state = JSON.parse(JSON.stringify(this.initialData));
        this.saveStateToStorage();
      }
    } else {
      this.state = JSON.parse(JSON.stringify(this.initialData));
      this.saveStateToStorage();
    }
  },

  saveStateToStorage() {
    localStorage.setItem('REUSEHUB_ADMIN_STATE_V1', JSON.stringify(this.state));
  },

  // Ghi nhật ký tự động vào màn hình 7
  logActivity(action, target, detail, status = 'Thành công') {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${day}/${month} ${hours}:${minutes}`;

    const newLog = {
      time: timeStr,
      actor: 'Nguyễn Minh', // Tên tài khoản Super Admin đang đăng nhập
      action: action,
      target: target,
      detail: detail,
      status: status
    };

    // Đưa lên đầu danh sách nhật ký
    this.state.activityLogs.unshift(newLog);
    this.saveStateToStorage();

    // Nếu đang ở màn hình nhật ký thì render lại ngay
    if (this.currentPage === 'activity-log') {
      this.renderActivityLog();
    }
  },

  // 3. ĐIỀU HƯỚNG MÀN HÌNH (ROUTING)
  navigateTo(pageId) {
    if (!pageId) return;
    this.currentPage = pageId;
    window.location.hash = pageId;

    // Cập nhật trạng thái active trên sidebar
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.dataset.page === pageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Ẩn tất cả các màn hình, chỉ hiển thị màn hình đích
    document.querySelectorAll('.screen-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Cập nhật tiêu đề thanh Header
    const titles = {
      'overview': 'Tổng quan',
      'moderation': 'Kiểm duyệt tin đăng',
      'reports': 'Báo cáo & khiếu nại',
      'users': 'Quản lý người dùng',
      'categories': 'Quản lý danh mục',
      'statistics': 'Báo cáo thống kê',
      'activity-log': 'Nhật ký hoạt động',
      'system': 'Quản trị hệ thống'
    };
    const titleEl = document.getElementById('pageHeaderTitle');
    if (titleEl) {
      titleEl.textContent = titles[pageId] || 'Tổng quan';
    }

    // Đóng sidebar nếu đang mở trên màn hình di động
    this.closeMobileSidebar();

    // Xóa từ khóa tìm kiếm toàn cục khi đổi trang
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';

    // Render dữ liệu của trang vừa chọn
    this.renderCurrentView();
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['overview', 'moderation', 'reports', 'users', 'categories', 'statistics', 'activity-log', 'system'];
    if (validPages.includes(hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo('overview');
    }
  },

  renderCurrentView() {
    switch (this.currentPage) {
      case 'overview':
        this.renderOverview();
        break;
      case 'moderation':
        this.renderModeration();
        break;
      case 'reports':
        this.renderReports();
        break;
      case 'users':
        this.renderUsers();
        break;
      case 'categories':
        this.renderCategories();
        break;
      case 'statistics':
        this.renderStatistics();
        break;
      case 'activity-log':
        this.renderActivityLog();
        break;
      case 'system':
        this.renderSystem();
        break;
    }
  },

  // 4. MÀN HÌNH 1: TỔNG QUAN (OVERVIEW)
  renderOverview() {
    // Cập nhật các chỉ số thẻ thống kê
    document.getElementById('ovStatPending').textContent = this.formatNumber(this.state.stats.pendingPosts);
    document.getElementById('ovStatReports').textContent = this.formatNumber(this.state.stats.newReports);
    document.getElementById('ovStatUsers').textContent = this.formatNumber(this.state.stats.totalUsers);
    document.getElementById('ovStatCategories').textContent = this.formatNumber(this.state.stats.activeCategories);

    // Cập nhật khối "Việc cần xử lý"
    document.getElementById('ovTodoPending').textContent = this.state.stats.pendingPosts;
    document.getElementById('ovTodoReports').textContent = this.state.stats.newReports;

    // Khởi tạo / vẽ biểu đồ Chart.js: Xu hướng vận hành 30 ngày
    const ctx = document.getElementById('overviewTrendChart');
    if (!ctx) return;

    if (this.activeChart1) {
      this.activeChart1.destroy();
    }

    this.activeChart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [
          {
            label: 'Tin đăng mới',
            data: [180, 215, 205, 242],
            borderColor: '#0d5c3a',
            backgroundColor: 'rgba(13, 92, 58, 0.08)',
            borderWidth: 2.5,
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#0d5c3a'
          },
          {
            label: 'Người dùng mới',
            data: [260, 310, 340, 376],
            borderColor: '#1f2937',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#1f2937'
          },
          {
            label: 'Báo cáo đã xử lý',
            data: [30, 42, 36, 38],
            borderColor: '#c2610c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#c2610c'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 6
          }
        },
        scales: {
          x: {
            display: false,
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: {
              color: '#9ca3af',
              font: { family: 'Inter', size: 11 }
            }
          }
        }
      }
    });
  },

  // 5. MÀN HÌNH 2: KIỂM DUYỆT TIN ĐĂNG (MODERATION)
  renderModeration() {
    document.getElementById('modStatPending').textContent = this.state.stats.pendingPosts;
    document.getElementById('modStatApproved').textContent = this.state.stats.approvedToday;
    document.getElementById('modStatRejected').textContent = this.state.stats.rejectedToday;

    const searchTerm = (document.getElementById('modFilterSearch').value || '').trim().toLowerCase();
    const filterCat = document.getElementById('modFilterCategory').value;
    const filterStatus = document.getElementById('modFilterStatus').value;
    const filterDate = document.getElementById('modFilterDate').value;

    let filtered = this.state.posts.filter(p => {
      const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm) || p.author.toLowerCase().includes(searchTerm);
      const matchCat = !filterCat || p.category === filterCat;
      const matchStatus = !filterStatus || p.status === filterStatus;
      let matchDate = true;
      if (filterDate === 'today') matchDate = p.date.includes('18/06');
      else if (filterDate === 'yesterday') matchDate = p.date.includes('17/06');
      else if (filterDate === 'older') matchDate = !p.date.includes('18/06') && !p.date.includes('17/06');
      return matchSearch && matchCat && matchStatus && matchDate;
    });

    const tbody = document.getElementById('modTableBody');
    const emptyState = document.getElementById('modEmptyState');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      // Định dạng badge trạng thái
      let badgeClass = 'badge-pending';
      if (item.status === 'Đã duyệt') badgeClass = 'badge-approved';
      if (item.status === 'Từ chối') badgeClass = 'badge-rejected';

      tr.innerHTML = `
        <td><strong>${item.title}</strong></td>
        <td>${item.author}</td>
        <td>${item.category}</td>
        <td>${item.date}</td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
        <td>
          <div class="table-actions-cell">
            ${item.status === 'Chờ duyệt' ? `
              <button class="btn-action-primary" onclick="app.approvePost(${item.id})">Duyệt</button>
              <button class="btn-action-link color-danger" onclick="app.openRejectModal(${item.id})">Từ chối</button>
            ` : `
              <button class="btn-action-link color-muted" onclick="app.viewPostDetail(${item.id})">Chi tiết</button>
            `}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  approvePost(id) {
    const post = this.state.posts.find(p => p.id === id);
    if (!post) return;

    post.status = 'Đã duyệt';
    this.state.stats.pendingPosts = Math.max(0, this.state.stats.pendingPosts - 1);
    this.state.stats.approvedToday += 1;

    this.logActivity('Duyệt tin đăng', post.title, `Tin ID #${post.id} do ${post.author} gửi`);
    this.saveStateToStorage();
    this.renderModeration();
    this.showToast(`Đã duyệt thành công tin: "${post.title}"`);
    this.closeModal('modPostModal');
  },

  openRejectModal(id) {
    const post = this.state.posts.find(p => p.id === id);
    if (!post) return;

    // Hiển thị thông tin lên modal
    document.getElementById('modPostModalTitle').textContent = 'Từ chối duyệt tin đăng';
    document.getElementById('modPostDetailTitle').textContent = post.title;
    document.getElementById('modPostDetailAuthor').textContent = post.author;
    document.getElementById('modPostDetailCategory').textContent = post.category;
    document.getElementById('modPostDetailDate').textContent = post.date;
    document.getElementById('modPostDetailPrice').textContent = post.price || 'Thỏa thuận';
    document.getElementById('modPostDetailDesc').textContent = post.desc || 'Không có mô tả thêm.';

    // Mở khung nhập lý do từ chối
    const rejectWrap = document.getElementById('modRejectReasonWrap');
    rejectWrap.style.display = 'block';
    document.getElementById('modRejectReasonInput').value = '';

    const btnConfirmReject = document.getElementById('modBtnConfirmReject');
    btnConfirmReject.style.display = 'inline-flex';
    btnConfirmReject.onclick = () => {
      const reason = document.getElementById('modRejectReasonInput').value.trim();
      if (!reason) {
        alert('Vui lòng nhập lý do từ chối để thông báo cho người đăng!');
        document.getElementById('modRejectReasonInput').focus();
        return;
      }
      post.status = 'Từ chối';
      post.rejectReason = reason;
      this.state.stats.pendingPosts = Math.max(0, this.state.stats.pendingPosts - 1);
      this.state.stats.rejectedToday += 1;

      this.logActivity('Từ chối tin đăng', post.title, `Lý do: ${reason}`);
      this.saveStateToStorage();
      this.renderModeration();
      this.closeModal('modPostModal');
      this.showToast(`Đã từ chối tin đăng: "${post.title}"`, 'warning');
    };

    document.getElementById('modBtnModalApprove').style.display = 'none';
    this.openModal('modPostModal');
  },

  viewPostDetail(id) {
    const post = this.state.posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('modPostModalTitle').textContent = 'Chi tiết tin đăng';
    document.getElementById('modPostDetailTitle').textContent = post.title;
    document.getElementById('modPostDetailAuthor').textContent = post.author;
    document.getElementById('modPostDetailCategory').textContent = post.category;
    document.getElementById('modPostDetailDate').textContent = post.date;
    document.getElementById('modPostDetailPrice').textContent = post.price || 'Thỏa thuận';
    document.getElementById('modPostDetailDesc').textContent = post.desc || 'Không có mô tả thêm.';

    document.getElementById('modRejectReasonWrap').style.display = 'none';
    document.getElementById('modBtnConfirmReject').style.display = 'none';

    const btnApprove = document.getElementById('modBtnModalApprove');
    if (post.status === 'Chờ duyệt') {
      btnApprove.style.display = 'inline-flex';
      btnApprove.onclick = () => this.approvePost(post.id);
    } else {
      btnApprove.style.display = 'none';
    }

    this.openModal('modPostModal');
  },

  // 6. MÀN HÌNH 3: BÁO CÁO & KHIẾU NẠI (REPORTS)
  renderReports() {
    document.getElementById('repStatNew').textContent = this.state.stats.newReports;
    document.getElementById('repStatProcessing').textContent = this.state.stats.processingReports;
    document.getElementById('repStatResolved').textContent = this.state.stats.resolvedReports;

    const searchTerm = (document.getElementById('repFilterSearch').value || '').trim().toLowerCase();
    const filterType = document.getElementById('repFilterType').value;
    const filterSeverity = document.getElementById('repFilterSeverity').value;
    const filterStatus = document.getElementById('repFilterStatus').value;

    let filtered = this.state.reports.filter(r => {
      const matchSearch = !searchTerm || r.id.toLowerCase().includes(searchTerm) || r.content.toLowerCase().includes(searchTerm) || r.author.toLowerCase().includes(searchTerm);
      const matchType = !filterType || r.content === filterType;
      const matchSeverity = !filterSeverity || r.severity === filterSeverity;
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchType && matchSeverity && matchStatus;
    });

    const tbody = document.getElementById('repTableBody');
    const emptyState = document.getElementById('repEmptyState');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      // Severity badge class
      let sevClass = 'badge-medium';
      if (item.severity === 'Cao') sevClass = 'badge-high';
      else if (item.severity === 'Thấp') sevClass = 'badge-low';

      // Status badge class
      let stClass = 'badge-pending';
      if (item.status === 'Đang xử lý') stClass = 'badge-processing';
      else if (item.status === 'Đã giải quyết') stClass = 'badge-resolved';

      tr.innerHTML = `
        <td><strong>#${item.id}</strong></td>
        <td>${item.content}</td>
        <td>${item.author}</td>
        <td>${item.date}</td>
        <td><span class="badge ${sevClass}">${item.severity}</span></td>
        <td><span class="badge ${stClass}">${item.status}</span></td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-action-primary" onclick="app.openReportModal('${item.id}', 'detail')">Chi tiết</button>
            <button class="btn-action-link color-muted" onclick="app.openReportModal('${item.id}', 'process')">Xử lý</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openReportModal(id, mode) {
    const report = this.state.reports.find(r => r.id === id);
    if (!report) return;

    document.getElementById('repModalCode').textContent = `#${report.id}`;
    document.getElementById('repModalContent').textContent = report.content;
    document.getElementById('repModalAuthor').textContent = report.author;
    document.getElementById('repModalDate').textContent = report.date;
    document.getElementById('repModalTargetUser').textContent = report.target || 'N/A';

    const sevBadge = document.getElementById('repModalSeverityBadge');
    sevBadge.textContent = report.severity;
    sevBadge.className = `badge ${report.severity === 'Cao' ? 'badge-high' : report.severity === 'Thấp' ? 'badge-low' : 'badge-medium'}`;

    document.getElementById('repActionSelect').value = report.status === 'Mới' ? 'Đang xử lý' : report.status;
    document.getElementById('repProcessNote').value = report.note || '';

    const btnSave = document.getElementById('repBtnSaveProcess');
    btnSave.onclick = () => {
      const newStatus = document.getElementById('repActionSelect').value;
      const note = document.getElementById('repProcessNote').value.trim();

      if (!note) {
        alert('Vui lòng nhập ghi chú xử lý để lưu vào hồ sơ báo cáo!');
        document.getElementById('repProcessNote').focus();
        return;
      }

      const oldStatus = report.status;
      report.status = newStatus.includes('Đã giải quyết') ? 'Đã giải quyết' : 'Đang xử lý';
      report.note = note;

      // Cập nhật thống kê
      if (oldStatus === 'Mới' && report.status === 'Đang xử lý') {
        this.state.stats.newReports = Math.max(0, this.state.stats.newReports - 1);
        this.state.stats.processingReports += 1;
      } else if (oldStatus === 'Mới' && report.status === 'Đã giải quyết') {
        this.state.stats.newReports = Math.max(0, this.state.stats.newReports - 1);
        this.state.stats.resolvedReports += 1;
      } else if (oldStatus === 'Đang xử lý' && report.status === 'Đã giải quyết') {
        this.state.stats.processingReports = Math.max(0, this.state.stats.processingReports - 1);
        this.state.stats.resolvedReports += 1;
      }

      this.logActivity('Xử lý báo cáo', `#${report.id}`, `Chuyển trạng thái sang ${report.status} (${note})`);
      this.saveStateToStorage();
      this.renderReports();
      this.closeModal('repProcessModal');
      this.showToast(`Đã lưu kết quả xử lý báo cáo #${report.id}`);
    };

    this.openModal('repProcessModal');
  },

  // 7. MÀN HÌNH 4: QUẢN LÝ NGƯỜI DÙNG (USERS)
  renderUsers() {
    document.getElementById('usrStatTotal').textContent = this.formatNumber(this.state.stats.totalUsers);
    document.getElementById('usrStatNew').textContent = this.formatNumber(this.state.stats.newUsers);
    document.getElementById('usrStatLocked').textContent = this.formatNumber(this.state.stats.lockedUsers);

    const searchTerm = (document.getElementById('usrFilterSearch').value || '').trim().toLowerCase();
    const filterRole = document.getElementById('usrFilterRole').value;
    const filterStatus = document.getElementById('usrFilterStatus').value;

    let filtered = this.state.users.filter(u => {
      const matchSearch = !searchTerm || u.name.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm);
      const matchRole = !filterRole || u.role === filterRole;
      const matchStatus = !filterStatus || u.status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });

    const tbody = document.getElementById('usrTableBody');
    const emptyState = document.getElementById('usrEmptyState');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(user => {
      const tr = document.createElement('tr');
      const isLocked = user.status === 'Bị khóa';
      const stBadge = isLocked ? 'badge-locked' : 'badge-active';

      tr.innerHTML = `
        <td><strong>${user.name}</strong></td>
        <td><a href="mailto:${user.email}" style="color: #4b5563;">${user.email}</a></td>
        <td>${user.role}</td>
        <td>${user.joined}</td>
        <td><span class="badge ${stBadge}">${user.status}</span></td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-action-text" onclick="app.viewUserDetail(${user.id})">Xem</button>
            ${isLocked ? `
              <button class="btn-action-link color-primary" onclick="app.toggleLockUser(${user.id}, false)">Mở khóa</button>
            ` : `
              <button class="btn-action-link color-danger" onclick="app.toggleLockUser(${user.id}, true)">Khóa</button>
            `}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openAddUserModal() {
    document.getElementById('usrModalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('usrInputName').value = '';
    document.getElementById('usrInputEmail').value = '';
    document.getElementById('usrInputRole').value = 'Người dùng';
    document.getElementById('usrInputStatus').value = 'Hoạt động';

    const btnSave = document.getElementById('usrBtnSave');
    btnSave.onclick = () => {
      const name = document.getElementById('usrInputName').value.trim();
      const email = document.getElementById('usrInputEmail').value.trim().toLowerCase();
      const role = document.getElementById('usrInputRole').value;
      const status = document.getElementById('usrInputStatus').value;

      if (!name || !email) {
        alert('Vui lòng điền đầy đủ Họ tên và Email!');
        return;
      }

      // Kiểm tra trùng email
      const exist = this.state.users.some(u => u.email.toLowerCase() === email);
      if (exist) {
        alert('Email này đã tồn tại trong hệ thống!');
        return;
      }

      const todayStr = '18/06/2025';
      const newUser = {
        id: Date.now(),
        name,
        email,
        role,
        joined: todayStr,
        status
      };

      this.state.users.unshift(newUser);
      this.state.stats.totalUsers += 1;
      this.state.stats.newUsers += 1;
      if (status === 'Bị khóa') this.state.stats.lockedUsers += 1;

      this.logActivity('Thêm người dùng', name, `Tạo tài khoản (${email}), vai trò ${role}`);
      this.saveStateToStorage();
      this.renderUsers();
      this.closeModal('usrFormModal');
      this.showToast(`Đã thêm thành công người dùng: ${name}`);
    };

    this.openModal('usrFormModal');
  },

  viewUserDetail(id) {
    const user = this.state.users.find(u => u.id === id);
    if (!user) return;
    alert(`THÔNG TIN NGƯỜI DÙNG:\n- Họ và tên: ${user.name}\n- Email: ${user.email}\n- Vai trò: ${user.role}\n- Ngày tham gia: ${user.joined}\n- Trạng thái: ${user.status}`);
  },

  toggleLockUser(id, lockAction) {
    const user = this.state.users.find(u => u.id === id);
    if (!user) return;

    const confirmMsg = lockAction
      ? `Bạn có chắc chắn muốn KHÓA tài khoản của "${user.name}" (${user.email})? Người dùng sẽ không thể đăng tin hay giao dịch.`
      : `Bạn có muốn MỞ KHÓA tài khoản cho "${user.name}"?`;

    if (confirm(confirmMsg)) {
      if (lockAction) {
        user.status = 'Bị khóa';
        this.state.stats.lockedUsers += 1;
        this.logActivity('Khóa tài khoản', user.name, 'Vi phạm điều khoản chính sách cộng đồng');
        this.showToast(`Đã khóa tài khoản: ${user.name}`, 'warning');
      } else {
        user.status = 'Hoạt động';
        this.state.stats.lockedUsers = Math.max(0, this.state.stats.lockedUsers - 1);
        this.logActivity('Mở khóa tài khoản', user.name, 'Kích hoạt lại trạng thái hoạt động');
        this.showToast(`Đã mở khóa tài khoản: ${user.name}`);
      }
      this.saveStateToStorage();
      this.renderUsers();
    }
  },

  // 8. MÀN HÌNH 5: QUẢN LÝ DANH MỤC (CATEGORIES)
  renderCategories() {
    document.getElementById('catStatActive').textContent = this.state.stats.activeCategories;
    document.getElementById('catStatHidden').textContent = this.state.stats.hiddenCategories;
    document.getElementById('catStatTotalPosts').textContent = this.formatNumber(this.state.stats.totalPosts);

    const searchTerm = (document.getElementById('catFilterSearch').value || '').trim().toLowerCase();
    const filterStatus = document.getElementById('catFilterStatus').value;

    let filtered = this.state.categories.filter(c => {
      const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm);
      const matchStatus = !filterStatus || c.status === filterStatus;
      return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('catTableBody');
    const emptyState = document.getElementById('catEmptyState');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(cat => {
      const tr = document.createElement('tr');
      const isHidden = cat.status === 'Tạm ẩn';
      const stBadge = isHidden ? 'badge-hidden' : 'badge-active';

      tr.innerHTML = `
        <td><strong>${cat.name}</strong></td>
        <td>${cat.postCount} tin đăng</td>
        <td>${cat.created}</td>
        <td><span class="badge ${stBadge}">${cat.status}</span></td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-action-text" onclick="app.openEditCategoryModal(${cat.id})">Sửa</button>
            <button class="btn-action-link color-danger" onclick="app.deleteCategory(${cat.id})">Xóa</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openAddCategoryModal() {
    document.getElementById('catModalTitle').textContent = 'Thêm danh mục mới';
    document.getElementById('catEditIndex').value = '-1';
    document.getElementById('catInputName').value = '';
    document.getElementById('catInputStatus').value = 'Đang hoạt động';

    const btnSave = document.getElementById('catBtnSave');
    btnSave.onclick = () => {
      const name = document.getElementById('catInputName').value.trim();
      const status = document.getElementById('catInputStatus').value;

      if (!name) {
        alert('Vui lòng nhập tên danh mục!');
        return;
      }

      const newCat = {
        id: Date.now(),
        name,
        postCount: 0,
        created: '18/06/2025',
        status
      };

      this.state.categories.push(newCat);
      if (status === 'Đang hoạt động') this.state.stats.activeCategories += 1;
      else this.state.stats.hiddenCategories += 1;

      this.logActivity('Thêm danh mục', name, `Trạng thái ban đầu: ${status}`);
      this.saveStateToStorage();
      this.renderCategories();
      this.closeModal('catFormModal');
      this.showToast(`Đã thêm danh mục mới: ${name}`);
    };

    this.openModal('catFormModal');
  },

  openEditCategoryModal(id) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;

    document.getElementById('catModalTitle').textContent = 'Chỉnh sửa danh mục';
    document.getElementById('catInputName').value = cat.name;
    document.getElementById('catInputStatus').value = cat.status;

    const btnSave = document.getElementById('catBtnSave');
    btnSave.onclick = () => {
      const newName = document.getElementById('catInputName').value.trim();
      const newStatus = document.getElementById('catInputStatus').value;

      if (!newName) {
        alert('Tên danh mục không được để trống!');
        return;
      }

      const oldName = cat.name;
      const oldStatus = cat.status;

      cat.name = newName;
      cat.status = newStatus;

      // Cập nhật thống kê nếu đổi trạng thái
      if (oldStatus !== newStatus) {
        if (newStatus === 'Đang hoạt động') {
          this.state.stats.activeCategories += 1;
          this.state.stats.hiddenCategories = Math.max(0, this.state.stats.hiddenCategories - 1);
        } else {
          this.state.stats.hiddenCategories += 1;
          this.state.stats.activeCategories = Math.max(0, this.state.stats.activeCategories - 1);
        }
      }

      this.logActivity('Cập nhật danh mục', newName, `Đổi từ "${oldName}" sang "${newName}" (${newStatus})`);
      this.saveStateToStorage();
      this.renderCategories();
      this.closeModal('catFormModal');
      this.showToast(`Đã cập nhật danh mục: ${newName}`);
    };

    this.openModal('catFormModal');
  },

  deleteCategory(id) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;

    if (cat.postCount > 0) {
      const confirmForce = confirm(`CẢNH BÁO: Danh mục "${cat.name}" hiện đang có ${cat.postCount} tin đăng liên kết!\n\nNếu xóa, các tin đăng này sẽ được tự động chuyển về danh mục "Khác" để bảo đảm an toàn dữ liệu.\n\nBạn có muốn tiếp tục xóa không?`);
      if (!confirmForce) return;
    } else {
      if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}" không?`)) return;
    }

    if (cat.status === 'Đang hoạt động') {
      this.state.stats.activeCategories = Math.max(0, this.state.stats.activeCategories - 1);
    } else {
      this.state.stats.hiddenCategories = Math.max(0, this.state.stats.hiddenCategories - 1);
    }

    this.state.categories = this.state.categories.filter(c => c.id !== id);
    this.logActivity('Xóa danh mục', cat.name, `Đã xóa danh mục (${cat.postCount} tin được bảo lưu)`);
    this.saveStateToStorage();
    this.renderCategories();
    this.showToast(`Đã xóa danh mục: ${cat.name}`, 'warning');
  },

  // 9. MÀN HÌNH 6: BÁO CÁO THỐNG KÊ (STATISTICS)
  renderStatistics() {
    // Biểu đồ 1: Tăng trưởng theo tuần (Tin đăng và Người dùng)
    const ctxWeekly = document.getElementById('weeklyGrowthChart');
    if (ctxWeekly) {
      if (this.activeChart2) this.activeChart2.destroy();
      this.activeChart2 = new Chart(ctxWeekly, {
        type: 'bar',
        data: {
          labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
          datasets: [
            {
              label: 'Tin đăng',
              data: [180, 215, 205, 242],
              backgroundColor: '#0d5c3a',
              borderRadius: 4,
              barPercentage: 0.5
            },
            {
              label: 'Người dùng',
              data: [260, 310, 340, 376],
              backgroundColor: '#1f2937',
              borderRadius: 4,
              barPercentage: 0.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111827',
              titleFont: { family: 'Inter' },
              bodyFont: { family: 'Inter' }
            }
          },
          scales: {
            x: {
              display: false,
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              ticks: { font: { family: 'Inter', size: 11 }, color: '#9ca3af' }
            }
          }
        }
      });
    }

    // Biểu đồ 2: Phân bổ theo danh mục (Donut chart bổ trợ)
    const ctxPie = document.getElementById('categoryPieChart');
    if (ctxPie) {
      if (this.activeChartPie) this.activeChartPie.destroy();
      this.activeChartPie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: ['Nội thất', 'Gia dụng', 'Thời trang', 'Di chuyển'],
          datasets: [{
            data: [328, 246, 198, 154],
            backgroundColor: ['#0d5c3a', '#10b981', '#f59e0b', '#9ca3af'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111827',
              titleFont: { family: 'Inter' },
              bodyFont: { family: 'Inter' }
            }
          },
          cutout: '68%'
        }
      });
    }
  },

  exportReportCsv() {
    const csvContent = "\uFEFF" + [
      ['BÁO CÁO THỐNG KÊ HOẠT ĐỘNG VẬN HÀNH REUSEHUB'],
      ['Kỳ báo cáo', '01/06/2025 - 30/06/2025'],
      [''],
      ['Chỉ số chính', 'Giá trị', 'Tăng trưởng'],
      ['Tin đăng mới', '842', '+18%'],
      ['Người dùng mới', '1.286', '+12%'],
      ['Tỷ lệ tái sử dụng', '78%', '+6%'],
      ['Điểm hài lòng', '4.8/5', ''],
      [''],
      ['Phân bổ theo danh mục', 'Số tin đăng'],
      ['Nội thất', '328'],
      ['Gia dụng', '246'],
      ['Thời trang', '198'],
      ['Di chuyển', '154'],
      [''],
      ['Kết luận', 'Tăng trưởng ổn định; Nội thất dẫn đầu hoạt động. Ưu tiên xử lý 126 tin đăng tồn và duy trì tỷ lệ tái sử dụng trên 75%.']
    ].map(e => e.join(',')).join('\n');

    this.downloadFile('Bao_Cao_Thong_Ke_ReuseHub_06_2025.csv', csvContent, 'text/csv;charset=utf-8;');
    this.logActivity('Xuất báo cáo', 'Thống kê tháng 06/2025', 'Đã tải xuống file CSV báo cáo');
    this.showToast('Đã xuất báo cáo CSV thành công!');
  },

  // 10. MÀN HÌNH 7: NHẬT KÝ HOẠT ĐỘNG (ACTIVITY LOG)
  renderActivityLog() {
    const filterTime = document.getElementById('logFilterTime').value;
    const filterActor = document.getElementById('logFilterActor').value;
    const filterAction = document.getElementById('logFilterAction').value;
    const searchTerm = (document.getElementById('logFilterSearch').value || '').trim().toLowerCase();

    let filtered = this.state.activityLogs.filter(log => {
      let matchTime = true;
      if (filterTime === 'today') matchTime = log.time.includes('18/06');
      else if (filterTime === 'yesterday') matchTime = log.time.includes('17/06');

      const matchActor = !filterActor || log.actor === filterActor;
      const matchAction = !filterAction || log.action === filterAction;
      const matchSearch = !searchTerm ||
        log.time.toLowerCase().includes(searchTerm) ||
        log.actor.toLowerCase().includes(searchTerm) ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.target.toLowerCase().includes(searchTerm) ||
        log.detail.toLowerCase().includes(searchTerm);

      return matchTime && matchActor && matchAction && matchSearch;
    });

    // Tính toán phân trang (Pagination)
    const totalItems = filtered.length;
    this.logPagination.totalPages = Math.max(1, Math.ceil(totalItems / this.logPagination.pageSize));
    if (this.logPagination.currentPage > this.logPagination.totalPages) {
      this.logPagination.currentPage = 1;
    }

    const startIndex = (this.logPagination.currentPage - 1) * this.logPagination.pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + this.logPagination.pageSize);

    const tbody = document.getElementById('logTableBody');
    const emptyState = document.getElementById('logEmptyState');
    tbody.innerHTML = '';

    if (pageItems.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      pageItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.time}</td>
          <td><strong>${item.actor}</strong></td>
          <td>${item.action}</td>
          <td>${item.target}</td>
          <td>${item.detail}</td>
          <td><span class="badge badge-approved">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Hiển thị thanh phân trang theo PDF: Trang 1 / 8 ‹ 1 2 3 ›
    const indicator = document.getElementById('logPageIndicator');
    indicator.textContent = `Trang ${this.logPagination.currentPage} / ${Math.max(8, this.logPagination.totalPages)}`;

    const controls = document.getElementById('logPaginationControls');
    controls.innerHTML = '';

    // Nút lùi ‹
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '‹';
    prevBtn.disabled = this.logPagination.currentPage === 1;
    prevBtn.onclick = () => {
      if (this.logPagination.currentPage > 1) {
        this.logPagination.currentPage -= 1;
        this.renderActivityLog();
      }
    };
    controls.appendChild(prevBtn);

    // Các nút số 1, 2, 3...
    const maxPageButtons = Math.min(3, Math.max(8, this.logPagination.totalPages));
    for (let i = 1; i <= maxPageButtons; i++) {
      const pageNumBtn = document.createElement('button');
      pageNumBtn.className = `page-btn ${this.logPagination.currentPage === i ? 'active' : ''}`;
      pageNumBtn.textContent = i;
      pageNumBtn.onclick = () => {
        this.logPagination.currentPage = i;
        this.renderActivityLog();
      };
      controls.appendChild(pageNumBtn);
    }

    // Nút tiến ›
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '›';
    nextBtn.disabled = this.logPagination.currentPage >= this.logPagination.totalPages;
    nextBtn.onclick = () => {
      if (this.logPagination.currentPage < this.logPagination.totalPages) {
        this.logPagination.currentPage += 1;
        this.renderActivityLog();
      }
    };
    controls.appendChild(nextBtn);
  },

  exportActivityLogCsv() {
    const csvRows = [
      ['Thời gian', 'Người thực hiện', 'Hành động', 'Đối tượng', 'Chi tiết', 'Trạng thái']
    ];

    this.state.activityLogs.forEach(log => {
      csvRows.push([
        `"${log.time}"`,
        `"${log.actor}"`,
        `"${log.action}"`,
        `"${log.target}"`,
        `"${log.detail}"`,
        `"${log.status}"`
      ]);
    });

    const csvContent = "\uFEFF" + csvRows.map(e => e.join(',')).join('\n');
    this.downloadFile('Nhat_Ky_Hoat_Dong_ReuseHub.csv', csvContent, 'text/csv;charset=utf-8;');
    this.showToast('Đã xuất toàn bộ nhật ký ra CSV thành công!');
  },

  // 11. MÀN HÌNH 8: QUẢN TRỊ HỆ THỐNG (SYSTEM)
  renderSystem() {
    // 1. Render danh sách Quản trị viên
    const adminListEl = document.getElementById('sysAdminList');
    adminListEl.innerHTML = '';
    this.state.systemAdmins.forEach(adm => {
      const row = document.createElement('div');
      row.className = 'admin-user-row';
      row.innerHTML = `
        <div class="admin-user-meta">
          <strong>${adm.name}</strong>
          <span>· ${adm.role}</span>
        </div>
        <small style="color: #9ca3af;">${adm.email}</small>
      `;
      adminListEl.appendChild(row);
    });

    // 2. Render bảng Vai trò & quyền truy cập
    const tbody = document.getElementById('sysRolesTableBody');
    tbody.innerHTML = '';
    this.state.roles.forEach((r, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.role}</strong></td>
        <td>${r.scope}</td>
        <td>
          <button class="btn-action-text" onclick="app.openEditRoleModal(${idx})">Sửa</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openEditRoleModal(index) {
    const roleItem = this.state.roles[index];
    if (!roleItem) return;

    document.getElementById('sysRoleIndex').value = index;
    document.getElementById('sysRoleNameInput').value = roleItem.role;
    document.getElementById('sysRoleScopeInput').value = roleItem.scope;

    const btnSave = document.getElementById('sysBtnSaveRole');
    btnSave.onclick = () => {
      const newRole = document.getElementById('sysRoleNameInput').value.trim();
      const newScope = document.getElementById('sysRoleScopeInput').value.trim();

      if (!newRole || !newScope) {
        alert('Vui lòng nhập đầy đủ thông tin vai trò và phạm vi quyền!');
        return;
      }

      const oldScope = roleItem.scope;
      roleItem.role = newRole;
      roleItem.scope = newScope;

      this.logActivity('Thay đổi quyền', newRole, `Phạm vi quyền cập nhật: ${newScope} (Cũ: ${oldScope})`);
      this.saveStateToStorage();
      this.renderSystem();
      this.closeModal('sysRoleModal');
      this.showToast(`Đã cập nhật phạm vi quyền cho vai trò ${newRole}`);
    };

    this.openModal('sysRoleModal');
  },

  openAddAdminModal() {
    document.getElementById('sysAdminNameInput').value = '';
    document.getElementById('sysAdminRoleSelect').value = 'Moderator';

    const btnSave = document.getElementById('sysBtnSaveAdmin');
    btnSave.onclick = () => {
      const name = document.getElementById('sysAdminNameInput').value.trim();
      const role = document.getElementById('sysAdminRoleSelect').value;

      if (!name) {
        alert('Vui lòng nhập họ tên quản trị viên!');
        return;
      }

      // Giới hạn bảo mật Frontend: Không tự ý tạo Super Admin mặc định
      if (role === 'Super Admin') {
        alert('Cảnh báo bảo mật: Bạn không thể phân quyền Super Admin cho tài khoản thông thường!');
        return;
      }

      const email = name.toLowerCase().replace(/\s+/g, '.') + '@reusehub.vn';
      this.state.systemAdmins.push({ name, role, email });

      this.logActivity('Thêm quản trị viên', name, `Bổ nhiệm vai trò ${role}`);
      this.saveStateToStorage();
      this.renderSystem();
      this.closeModal('sysAdminModal');
      this.showToast(`Đã bổ nhiệm ${name} làm ${role}`);
    };

    this.openModal('sysAdminModal');
  },

  openSettingsModal(type) {
    const titleEl = document.getElementById('sysSettingsModalTitle');
    const contentEl = document.getElementById('sysSettingsModalContent');

    if (type === 'rules') {
      titleEl.textContent = 'Cấu hình: Quy định đăng tin';
      contentEl.innerHTML = `
        <div class="form-group">
          <label class="form-label">Thời hạn hiển thị mặc định của tin đăng:</label>
          <select class="form-control" id="cfgDuration">
            <option value="30">30 ngày</option>
            <option value="60" selected>60 ngày</option>
            <option value="90">90 ngày</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Duyệt tin tự động bằng AI từ khóa nhạy cảm:</label>
          <select class="form-control" id="cfgAiMod">
            <option value="enabled" selected>Bật (Gắn cờ tin nghi vấn)</option>
            <option value="disabled">Tắt (Duyệt thủ công 100%)</option>
          </select>
        </div>
      `;
    } else if (type === 'notify') {
      titleEl.textContent = 'Cấu hình: Thông báo hệ thống';
      contentEl.innerHTML = `
        <div class="form-group">
          <label class="form-label">Email nhận cảnh báo khẩn cấp:</label>
          <input type="email" class="form-control" value="admin@reusehub.vn" id="cfgAlertEmail">
        </div>
        <div class="form-group">
          <label class="form-label">Gửi thông báo đẩy khi có báo cáo mức độ Cao:</label>
          <select class="form-control" id="cfgPushNotif">
            <option value="yes" selected>Có - Gửi ngay lập tức</option>
            <option value="no">Không</option>
          </select>
        </div>
      `;
    } else if (type === 'security') {
      titleEl.textContent = 'Cấu hình: Bảo mật hệ thống';
      contentEl.innerHTML = `
        <div class="form-group">
          <label class="form-label">Thời gian hết hạn phiên làm việc (Session Timeout):</label>
          <select class="form-control" id="cfgTimeout">
            <option value="15">15 phút</option>
            <option value="30" selected>30 phút</option>
            <option value="60">60 phút</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Bắt buộc xác thực hai yếu tố (2FA) đối với Admin:</label>
          <select class="form-control" id="cfg2Fa">
            <option value="mandatory" selected>Bắt buộc cho toàn bộ Ban Quản Trị</option>
            <option value="optional">Tùy chọn</option>
          </select>
        </div>
      `;
    }

    const btnSave = document.getElementById('sysBtnSaveConfig');
    btnSave.onclick = () => {
      this.logActivity('Cài đặt hệ thống', titleEl.textContent, 'Cập nhật cấu hình tham số hệ thống');
      this.closeModal('sysSettingsModal');
      this.showToast('Đã lưu cấu hình tham số thành công!');
    };

    this.openModal('sysSettingsModal');
  },

  triggerBackup() {
    if (confirm('Khởi chạy tiến trình sao lưu toàn bộ cơ sở dữ liệu ReuseHub ngay bây giờ?')) {
      this.logActivity('Sao lưu dữ liệu', 'Cơ sở dữ liệu toàn hệ thống', 'Sao lưu thủ công theo yêu cầu quản trị viên');
      this.showToast('Tiến trình sao lưu đã hoàn tất thành công!');
    }
  },

  // 12. TÌM KIẾM TOÀN CỤC & BỘ LỌC DÙNG CHUNG
  bindEvents() {
    // Click vào menu sidebar để chuyển trang
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = item.dataset.page;
        this.navigateTo(pageId);
      });
    });

    // Toggle menu di động
    const menuToggle = document.getElementById('menuToggleBtn');
    const overlay = document.getElementById('sidebarOverlay');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
        overlay.classList.toggle('open');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => this.closeMobileSidebar());
    }

    // Toggle dropdown Quản trị viên
    const adminPill = document.getElementById('adminPillBtn');
    const adminMenu = document.getElementById('adminDropdownMenu');
    if (adminPill && adminMenu) {
      adminPill.addEventListener('click', (e) => {
        e.stopPropagation();
        adminMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => {
        adminMenu.classList.remove('show');
      });
    }

    // Nút đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Tìm kiếm toàn cục ở Header
    const searchInput = document.getElementById('globalSearchInput');
    const clearSearch = document.getElementById('clearSearchBtn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearSearch) clearSearch.style.display = val ? 'block' : 'none';
        this.handleGlobalSearch(val);
      });
    }
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        this.handleGlobalSearch('');
      });
    }

    // Sự kiện bộ lọc Kiểm duyệt tin đăng (Page 2)
    const modBtnFilter = document.getElementById('modBtnFilter');
    if (modBtnFilter) {
      modBtnFilter.addEventListener('click', () => this.renderModeration());
    }
    const modReset = document.getElementById('modBtnReset');
    if (modReset) {
      modReset.addEventListener('click', () => {
        document.getElementById('modFilterSearch').value = '';
        document.getElementById('modFilterCategory').value = '';
        document.getElementById('modFilterStatus').value = '';
        document.getElementById('modFilterDate').value = '';
        this.renderModeration();
      });
    }
    const modSearchInput = document.getElementById('modFilterSearch');
    if (modSearchInput) {
      modSearchInput.addEventListener('input', () => this.renderModeration());
    }
    const modSelects = ['modFilterCategory', 'modFilterStatus', 'modFilterDate'];
    modSelects.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.renderModeration());
    });

    // Sự kiện bộ lọc Báo cáo (Page 3)
    const repSearch = document.getElementById('repFilterSearch');
    if (repSearch) repSearch.addEventListener('input', () => this.renderReports());
    ['repFilterType', 'repFilterSeverity', 'repFilterStatus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.renderReports());
    });
    const repReset = document.getElementById('repBtnReset');
    if (repReset) {
      repReset.addEventListener('click', () => {
        document.getElementById('repFilterSearch').value = '';
        document.getElementById('repFilterType').value = '';
        document.getElementById('repFilterSeverity').value = '';
        document.getElementById('repFilterStatus').value = '';
        this.renderReports();
      });
    }

    // Sự kiện bộ lọc Người dùng (Page 4)
    const usrSearch = document.getElementById('usrFilterSearch');
    if (usrSearch) usrSearch.addEventListener('input', () => this.renderUsers());
    ['usrFilterRole', 'usrFilterStatus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.renderUsers());
    });
    const usrReset = document.getElementById('usrBtnReset');
    if (usrReset) {
      usrReset.addEventListener('click', () => {
        document.getElementById('usrFilterSearch').value = '';
        document.getElementById('usrFilterRole').value = '';
        document.getElementById('usrFilterStatus').value = '';
        this.renderUsers();
      });
    }
    const usrBtnAdd = document.getElementById('usrBtnAdd');
    if (usrBtnAdd) usrBtnAdd.addEventListener('click', () => this.openAddUserModal());

    // Sự kiện bộ lọc Danh mục (Page 5)
    const catSearch = document.getElementById('catFilterSearch');
    if (catSearch) catSearch.addEventListener('input', () => this.renderCategories());
    const catStatus = document.getElementById('catFilterStatus');
    if (catStatus) catStatus.addEventListener('change', () => this.renderCategories());
    const catReset = document.getElementById('catBtnReset');
    if (catReset) {
      catReset.addEventListener('click', () => {
        document.getElementById('catFilterSearch').value = '';
        document.getElementById('catFilterStatus').value = '';
        this.renderCategories();
      });
    }
    const catBtnAdd = document.getElementById('catBtnAdd');
    if (catBtnAdd) catBtnAdd.addEventListener('click', () => this.openAddCategoryModal());

    // Sự kiện Thống kê (Page 6)
    const statExportCsv = document.getElementById('statBtnExportCsv');
    if (statExportCsv) statExportCsv.addEventListener('click', () => this.exportReportCsv());
    const statPrintPdf = document.getElementById('statBtnPrintPdf');
    if (statPrintPdf) statPrintPdf.addEventListener('click', () => window.print());

    // Sự kiện Nhật ký (Page 7)
    const logSearch = document.getElementById('logFilterSearch');
    if (logSearch) logSearch.addEventListener('input', () => {
      this.logPagination.currentPage = 1;
      this.renderActivityLog();
    });
    ['logFilterTime', 'logFilterActor', 'logFilterAction'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => {
        this.logPagination.currentPage = 1;
        this.renderActivityLog();
      });
    });
    const logExport = document.getElementById('logBtnExport');
    if (logExport) logExport.addEventListener('click', () => this.exportActivityLogCsv());

    // Sự kiện Quản trị hệ thống (Page 8)
    const sysBtnAddAdmin = document.getElementById('sysBtnAddAdmin');
    if (sysBtnAddAdmin) sysBtnAddAdmin.addEventListener('click', () => this.openAddAdminModal());
  },

  handleGlobalSearch(query) {
    query = (query || '').trim().toLowerCase();
    // Đồng bộ vào ô tìm kiếm của trang đang hoạt động
    if (this.currentPage === 'moderation') {
      const el = document.getElementById('modFilterSearch');
      if (el) { el.value = query; this.renderModeration(); }
    } else if (this.currentPage === 'reports') {
      const el = document.getElementById('repFilterSearch');
      if (el) { el.value = query; this.renderReports(); }
    } else if (this.currentPage === 'users') {
      const el = document.getElementById('usrFilterSearch');
      if (el) { el.value = query; this.renderUsers(); }
    } else if (this.currentPage === 'categories') {
      const el = document.getElementById('catFilterSearch');
      if (el) { el.value = query; this.renderCategories(); }
    } else if (this.currentPage === 'activity-log') {
      const el = document.getElementById('logFilterSearch');
      if (el) { el.value = query; this.logPagination.currentPage = 1; this.renderActivityLog(); }
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  },

  // 13. CÁC HÀM TIỆN ÍCH DÙNG CHUNG (HELPERS)
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('vi-VN');
  },

  downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  },

  handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi Trang Quản Trị ReuseHub?')) {
      this.showToast('Đang đăng xuất khỏi hệ thống...', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  },

  updateHeaderStats() {
    // Cập nhật timestamp thời gian thực tế nếu muốn
    const ts = document.getElementById('overviewTimestamp');
    if (ts) {
      ts.textContent = 'Cập nhật dữ liệu: 18/06/2025 09:30';
    }
  }
};

// Khởi chạy trang quản trị sau khi kiểm tra đăng nhập
function khoiTaoTrangQuanTri() {
    document.addEventListener("DOMContentLoaded", () => {
        app.init();
    });
}

// Hàm hỗ trợ điều hướng showView
function showView(view) {
    if (!view || view === "home" || view === "overview") {
        app.navigateTo("overview");
    } else {
        app.navigateTo(view);
    }
}

