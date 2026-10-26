/**
 * ==========================================================================
 * ReUseHub - Xử lý Chức năng Đăng bài Sửa chữa dành cho Người dùng
 * Dựa sát vào file PDF "Người đăng bài sửa chưa.pdf"
 * Tệp JS: repair.js (Tự chứa toàn bộ dữ liệu & logic luồng 4 màn hình)
 * ==========================================================================
 */

// Hàm thông báo Toast tiếng Việt
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

// Danh sách dữ liệu mẫu 3 Người sửa chữa phù hợp theo PDF
const REPAIRERS_DATA = [
  {
    id: 1,
    name: 'Phạm Đức Chiến',
    initials: 'NT',
    colorClass: 'avatar-color-green',
    specialty: 'Thợ điện gia dụng',
    location: 'Quận 3',
    distance: '2,4 km',
    rating: '4.9',
    reviewsCount: 126,
    verified: true,
    availableToday: true,
    bio: 'Nhận sửa chữa thiết bị điện gia dụng tại nhà, tư vấn rõ ràng và báo giá trước khi thực hiện.',
    experience: '5 năm',
    services: 'Điện gia dụng, nồi cơm điện, quạt, bếp',
    hours: '08:00 – 20:00, Thứ 2 – Chủ nhật',
    phone: '0903 888 123'
  },
  {
    id: 2,
    name: 'Văn Toàn',
    initials: 'LM',
    colorClass: 'avatar-color-mint',
    specialty: 'Sửa nồi cơm điện',
    location: 'Quận 1',
    distance: '3,1 km',
    rating: '4.8',
    reviewsCount: 98,
    verified: true,
    availableToday: true,
    bio: 'Chuyên sửa chữa các loại nồi cơm điện tử, cao tần, cơ; thay rơ le, bo mạch chính hãng.',
    experience: '4 năm',
    services: 'Nồi cơm điện tử, nồi cao tần Cuckoo, Toshiba, Sharp',
    hours: '08:30 – 19:30, Thứ 2 – Thứ 7',
    phone: '0912 345 678'
  },
  {
    id: 3,
    name: 'Hải Long',
    initials: 'HP',
    colorClass: 'avatar-color-teal',
    specialty: 'Điện tử & gia dụng',
    location: 'Quận Bình Thạnh',
    distance: '4,6 km',
    rating: '4.8',
    reviewsCount: 74,
    verified: true,
    availableToday: true,
    bio: 'Chuyên bảo trì, sửa chữa đồ điện tử gia dụng, quạt máy, lò vi sóng, máy hút bụi.',
    experience: '6 năm',
    services: 'Quạt máy, lò vi sóng, máy hút bụi, bàn ủi',
    hours: '08:00 – 21:00, Thứ 2 – Chủ nhật',
    phone: '0988 776 543'
  }
];

// Trạng thái bài đăng hiện tại của người dùng
let currentPostData = {
  issueTitle: 'Nồi cơm điện không vào điện',
  issueDesc: 'Cần kiểm tra và sửa tại nhà',
  serviceType: 'Điện gia dụng',
  location: 'Quận 3',
  budget: '200.000',
  postedDate: 'Đã đăng hôm nay',
  uploadedImages: []
};

// Quản lý người thợ đang được xem / nhắn tin
let activeRepairer = REPAIRERS_DATA[0];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Quản lý các View (Màn hình)
  const viewPost = document.getElementById('viewPostRepair');
  const viewMatched = document.getElementById('viewMatchedRepairers');
  const viewProfile = document.getElementById('viewRepairerProfile');
  const viewChat = document.getElementById('viewChatScreen');

  function switchView(target) {
    viewPost.style.display = 'none';
    viewMatched.style.display = 'none';
    viewProfile.style.display = 'none';
    viewChat.style.display = 'none';

    if (target === 'post') {
      viewPost.style.display = 'block';
    } else if (target === 'matched') {
      viewMatched.style.display = 'block';
      renderMatchedRepairersList();
    } else if (target === 'profile') {
      viewProfile.style.display = 'block';
      renderProfileDetails();
    } else if (target === 'chat') {
      viewChat.style.display = 'block';
      renderChatConversation();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 2. Xử lý Thanh điều hướng & Dropdown Vai trò
  const roleDropdownBtn = document.getElementById('roleDropdownBtn');
  const roleDropdownMenu = document.getElementById('roleDropdownMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksList = document.getElementById('navLinksList');

  if (roleDropdownBtn && roleDropdownMenu) {
    roleDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      roleDropdownMenu.classList.toggle('show');
    });
    document.addEventListener('click', () => roleDropdownMenu.classList.remove('show'));
  }

  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksList.style.display = (navLinksList.style.display === 'flex') ? 'none' : 'flex';
      navLinksList.style.flexDirection = 'column';
    });
  }

  // Điều hướng nút menu Header
  const navLinkHome = document.getElementById('navLinkHome');
  const navLinkRepair = document.getElementById('navLinkRepair');
  if (navLinkRepair) {
    navLinkRepair.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('post');
    });
  }
  if (navLinkHome) {
    navLinkHome.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('post');
      showToast('Trang chủ', 'Bạn đang ở cổng dịch vụ Sửa chữa đồ dùng ReUseHub.', 'info');
    });
  }

  // 3. Xử lý Form Đăng bài sửa chữa (Màn hình 1)
  const formPostRepair = document.getElementById('formPostRepair');
  const descInput = document.getElementById('postProblemDesc');
  const serviceSelect = document.getElementById('postServiceType');
  const areaSelect = document.getElementById('postLocation');
  const budgetInput = document.getElementById('postBudget');

  const descError = document.getElementById('descError');
  const serviceError = document.getElementById('serviceError');
  const areaError = document.getElementById('areaError');
  const budgetError = document.getElementById('budgetError');

  // Xóa lỗi khi gõ/chọn
  if (descInput) descInput.addEventListener('input', () => descError.classList.remove('show'));
  if (serviceSelect) serviceSelect.addEventListener('change', () => serviceError.classList.remove('show'));
  if (areaSelect) areaSelect.addEventListener('change', () => areaError.classList.remove('show'));
  if (budgetInput) budgetInput.addEventListener('input', () => budgetError.classList.remove('show'));

  // Tải ảnh xem trước
  const fileInput = document.getElementById('fileUploadInput');
  const btnChooseFile = document.getElementById('btnChooseFile');
  const previewContainer = document.getElementById('previewImagesContainer');

  if (btnChooseFile && fileInput) {
    btnChooseFile.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const imgUrl = evt.target.result;
          currentPostData.uploadedImages.push(imgUrl);
          renderImagePreviews();
        };
        reader.readAsDataURL(file);
      });
      fileInput.value = '';
    });
  }

  function renderImagePreviews() {
    if (!previewContainer) return;
    previewContainer.innerHTML = currentPostData.uploadedImages.map((src, index) => `
      <div class="preview-thumb-wrap">
        <img src="${src}" alt="Ảnh đính kèm">
        <button type="button" class="btn-remove-thumb" data-index="${index}" title="Xóa ảnh">&times;</button>
      </div>
    `).join('');

    previewContainer.querySelectorAll('.btn-remove-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        currentPostData.uploadedImages.splice(idx, 1);
        renderImagePreviews();
      });
    });
  }

  // Gửi Form Đăng bài
  if (formPostRepair) {
    formPostRepair.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      const descVal = descInput.value.trim();
      const serviceVal = serviceSelect.value;
      const areaVal = areaSelect.value;
      const budgetVal = budgetInput.value.trim();

      if (!descVal) {
        descError.textContent = 'Vui lòng mô tả vấn đề của món đồ.';
        descError.classList.add('show');
        hasError = true;
      } else if (descVal.length < 6) {
        descError.textContent = 'Mô tả cần chi tiết hơn (tối thiểu 6 ký tự).';
        descError.classList.add('show');
        hasError = true;
      }

      if (!serviceVal) {
        serviceError.textContent = 'Vui lòng chọn loại dịch vụ phù hợp.';
        serviceError.classList.add('show');
        hasError = true;
      }

      if (!areaVal) {
        areaError.textContent = 'Vui lòng chọn khu vực của bạn.';
        areaError.classList.add('show');
        hasError = true;
      }

      if (budgetVal && (isNaN(budgetVal) || Number(budgetVal) < 0)) {
        budgetError.textContent = 'Ngân sách không hợp lệ (phải là số dương).';
        budgetError.classList.add('show');
        hasError = true;
      }

      if (hasError) return;

      // Lưu trữ dữ liệu bài đăng động
      const lines = descVal.split('\n').filter(l => l.trim().length > 0);
      currentPostData.issueTitle = lines[0] || 'Yêu cầu sửa chữa đồ dùng';
      currentPostData.issueDesc = lines.slice(1).join(' ') || 'Cần thợ kiểm tra và sửa chữa tại nhà.';
      currentPostData.serviceType = serviceVal;
      currentPostData.location = areaVal;
      currentPostData.budget = budgetVal ? Number(budgetVal).toLocaleString('vi-VN') + 'đ' : 'Thỏa thuận';
      currentPostData.postedDate = 'Đã đăng hôm nay';

      showToast('Đăng bài thành công!', 'Hệ thống đã tìm thấy 3 người sửa chữa phù hợp gần bạn.', 'success', 2500);

      // Chuyển sang Màn hình 2
      switchView('matched');
    });
  }

  // 4. Màn hình 2: Danh sách Người sửa chữa phù hợp
  function renderMatchedRepairersList() {
    // Cập nhật thẻ tóm tắt bài đăng của bạn
    const sumTitle = document.getElementById('summaryPostTitle');
    const sumDesc = document.getElementById('summaryPostDesc');
    const sumMeta = document.getElementById('summaryPostMeta');

    if (sumTitle) sumTitle.textContent = currentPostData.issueTitle;
    if (sumDesc) sumDesc.textContent = currentPostData.issueDesc;
    if (sumMeta) sumMeta.textContent = `Khu vực: ${currentPostData.location} · ${currentPostData.postedDate}`;

    // Render danh sách thẻ 3 thợ
    const repairersListEl = document.getElementById('matchedRepairersListContainer');
    if (!repairersListEl) return;

    repairersListEl.innerHTML = REPAIRERS_DATA.map(worker => `
      <article class="repairer-match-card">
        <div class="repairer-card-left">
          <div class="initials-avatar-box ${worker.colorClass}">
            ${worker.initials}
          </div>
          <div class="repairer-meta-info">
            <h3 class="repairer-card-name">${worker.name}</h3>
            <p class="repairer-card-specialty">${worker.specialty}</p>
            <p class="repairer-card-location">${worker.location} · ${worker.distance}</p>
            <div class="repairer-card-rating">
              <span class="star-icon">&#9733;</span>
              <span>${worker.rating} · ${worker.reviewsCount} đánh giá</span>
            </div>
          </div>
        </div>

        <div class="repairer-card-actions">
          <button type="button" class="btn-view-profile" data-worker-id="${worker.id}">Xem hồ sơ</button>
          <button type="button" class="btn-contact-worker" data-worker-id="${worker.id}">Liên hệ</button>
        </div>
      </article>
    `).join('');

    // Bấm "Xem hồ sơ"
    repairersListEl.querySelectorAll('.btn-view-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        const wId = parseInt(btn.getAttribute('data-worker-id'), 10);
        activeRepairer = REPAIRERS_DATA.find(w => w.id === wId) || REPAIRERS_DATA[0];
        switchView('profile');
      });
    });

    // Bấm "Liên hệ"
    repairersListEl.querySelectorAll('.btn-contact-worker').forEach(btn => {
      btn.addEventListener('click', () => {
        const wId = parseInt(btn.getAttribute('data-worker-id'), 10);
        activeRepairer = REPAIRERS_DATA.find(w => w.id === wId) || REPAIRERS_DATA[0];
        switchView('chat');
      });
    });
  }

  // 5. Màn hình 3: Hồ sơ Người sửa chữa chi tiết
  function renderProfileDetails() {
    const pInitials = document.getElementById('profileWorkerInitials');
    const pName = document.getElementById('profileWorkerName');
    const pSpec = document.getElementById('profileWorkerSpecialty');
    const pLoc = document.getElementById('profileWorkerLocation');
    const pRating = document.getElementById('profileWorkerRating');
    const pBio = document.getElementById('profileWorkerBio');
    const pExp = document.getElementById('profileWorkerExp');
    const pServices = document.getElementById('profileWorkerServices');
    const pHours = document.getElementById('profileWorkerHours');

    if (pInitials) {
      pInitials.className = `profile-avatar-large ${activeRepairer.colorClass}`;
      pInitials.textContent = activeRepairer.initials;
    }
    if (pName) pName.textContent = activeRepairer.name;
    if (pSpec) pSpec.textContent = activeRepairer.specialty;
    if (pLoc) pLoc.textContent = `${activeRepairer.location} · ${activeRepairer.distance}`;
    if (pRating) pRating.innerHTML = `<span class="star-icon">&#9733;</span> ${activeRepairer.rating} · ${activeRepairer.reviewsCount} đánh giá`;
    if (pBio) pBio.textContent = activeRepairer.bio;
    if (pExp) pExp.textContent = activeRepairer.experience;
    if (pServices) pServices.textContent = activeRepairer.services;
    if (pHours) pHours.textContent = activeRepairer.hours;
  }

  const btnBackFromProfile = document.getElementById('btnBackFromProfile');
  if (btnBackFromProfile) {
    btnBackFromProfile.addEventListener('click', () => switchView('matched'));
  }

  const btnStartChatFromProfile = document.getElementById('btnStartChatFromProfile');
  if (btnStartChatFromProfile) {
    btnStartChatFromProfile.addEventListener('click', () => switchView('chat'));
  }

  // 6. Màn hình 4: Trò chuyện với Người sửa chữa
  function renderChatConversation() {
    const cInitials = document.getElementById('chatWorkerInitials');
    const cName = document.getElementById('chatWorkerName');
    const cSpec = document.getElementById('chatWorkerSpecialty');
    const cLoc = document.getElementById('chatWorkerLocation');
    const cRating = document.getElementById('chatWorkerRating');
    const cRequest = document.getElementById('chatRequestTitle');

    if (cInitials) {
      cInitials.className = `chat-worker-avatar ${activeRepairer.colorClass}`;
      cInitials.textContent = activeRepairer.initials;
    }
    if (cName) cName.textContent = activeRepairer.name;
    if (cSpec) cSpec.textContent = activeRepairer.specialty;
    if (cLoc) cLoc.textContent = `📍 ${activeRepairer.location} · ${activeRepairer.distance}`;
    if (cRating) cRating.innerHTML = `<span class="star-icon">&#9733;</span> ${activeRepairer.rating}`;
    if (cRequest) cRequest.textContent = currentPostData.issueTitle || 'Cần sửa quạt điện không chạy';
  }

  const btnBackFromChat = document.getElementById('btnBackFromChat');
  if (btnBackFromChat) {
    btnBackFromChat.addEventListener('click', () => switchView('matched'));
  }

  // Gửi tin nhắn mới trong khung chat
  const chatMessagesList = document.getElementById('chatMessagesList');
  const chatInputMsg = document.getElementById('chatInputMessage');
  const btnSendMsg = document.getElementById('btnSendMessage');
  const btnCallWorker = document.getElementById('btnCallWorker');

  function sendMessage() {
    const text = chatInputMsg.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Thêm tin nhắn của khách hàng
    const msgEl = document.createElement('div');
    msgEl.className = 'message-row outgoing';
    msgEl.innerHTML = `
      <div class="msg-avatar user">Tôi</div>
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <span class="msg-timestamp">${timeStr}</span>
      </div>
    `;
    chatMessagesList.appendChild(msgEl);
    chatInputMsg.value = '';
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;

    // Giả lập thợ trả lời sau 1 giây
    setTimeout(() => {
      const replyEl = document.createElement('div');
      replyEl.className = 'message-row incoming';
      replyEl.innerHTML = `
        <div class="msg-avatar worker">${activeRepairer.initials}</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble">Dạ vâng, tôi đã nhận được tin nhắn của bạn. Tôi sẽ chuẩn bị đồ nghề và có mặt đúng hẹn nhé!</div>
          <span class="msg-timestamp">${timeStr}</span>
        </div>
      `;
      chatMessagesList.appendChild(replyEl);
      chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
    }, 1100);
  }

  if (btnSendMsg) btnSendMsg.addEventListener('click', sendMessage);
  if (chatInputMsg) {
    chatInputMsg.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  if (btnCallWorker) {
    btnCallWorker.addEventListener('click', () => {
      showToast('Cuộc gọi điện thoại', `Đang kết nối đến người sửa chữa ${activeRepairer.name}: ${activeRepairer.phone}...`, 'success', 4000);
    });
  }

  function escapeHtml(string) {
    const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }

  // Khởi chạy mặc định: Màn hình 1 (Đăng bài sửa chữa)
  switchView('post');
});

function toggleRoleDropdown() {
    const menu = document.getElementById("roleMenu");
    menu.classList.toggle("show");
}
