/**
 * ==========================================================================
 * ReUseHub - Xử lý Chức năng Đăng nhập & Đăng ký (Login & Register Script)
 * Quản lý tài khoản bằng LocalStorage - Chỉ tài khoản đã đăng ký mới được đăng nhập
 * Dự án BTL Lập trình Web - Nhóm 3
 * ==========================================================================
 */

// Hàm thông báo Toast tiếng Việt độc lập
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

// ============================================================================
// QUẢN LÝ DỮ LIỆU TÀI KHOẢN (LOCALSTORAGE)
// ============================================================================
const USERS_STORAGE_KEY = 'reusehub_registered_users';

// Danh sách tài khoản mẫu ban đầu (để hỗ trợ kiểm thử tiện lợi)
const DEFAULT_ACCOUNTS = [
  {
    fullName: 'Trần Thợ Sửa',
    account: '0901234567',
    email: 'tho.tran@gmail.com',
    phone: '0901234567',
    password: 'password123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    fullName: 'Phạm Đức Chiến',
    account: '0903888123',
    email: 'chien.pham@gmail.com',
    phone: '0903888123',
    password: 'password123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    fullName: 'Nguyễn Văn An',
    account: 'demo@reusehub.vn',
    email: 'demo@reusehub.vn',
    phone: '0987654321',
    password: 'password123',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return [...DEFAULT_ACCOUNTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_ACCOUNTS];
  } catch (err) {
    console.error('Lỗi đọc dữ liệu người dùng từ localStorage:', err);
    return [...DEFAULT_ACCOUNTS];
  }
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Lỗi lưu dữ liệu người dùng vào localStorage:', err);
  }
}

// Chuẩn hóa chuỗi tài khoản (bỏ khoảng trắng, thường hóa email, giữ số nếu là SĐT)
function normalizeAccountInput(val) {
  return (val || '').trim().toLowerCase();
}

function normalizePhone(val) {
  return (val || '').replace(/[\s.-]/g, '');
}

// Tìm tài khoản theo email hoặc SĐT
function findUserByAccount(accountVal) {
  const users = getRegisteredUsers();
  const normalized = normalizeAccountInput(accountVal);
  const cleanPhone = normalizePhone(accountVal);

  return users.find(u => {
    const uAccount = normalizeAccountInput(u.account);
    const uEmail = normalizeAccountInput(u.email);
    const uPhone = normalizePhone(u.phone || u.account);

    if (uAccount === normalized || uEmail === normalized) return true;
    if (cleanPhone && (uPhone === cleanPhone || normalizePhone(uAccount) === cleanPhone)) return true;
    return false;
  });
}

// ============================================================================
// KHỞI TẠO VÀ XỬ LÝ GIAO DIỆN
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Đảm bảo dữ liệu tài khoản mặc định đã được khởi tạo
  getRegisteredUsers();

  // Các phần tử chuyển Tab
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginFormSection = document.getElementById('loginFormSection');
  const registerFormSection = document.getElementById('registerFormSection');
  const linkRegisterBottom = document.getElementById('linkRegisterBottom');
  const linkLoginBottom = document.getElementById('linkLoginBottom');

  // Các phần tử Form Đăng nhập
  const loginForm = document.getElementById('loginForm');
  const emailOrPhoneInput = document.getElementById('emailOrPhone');
  const passwordInput = document.getElementById('password');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const emailOrPhoneError = document.getElementById('emailOrPhoneError');
  const passwordError = document.getElementById('passwordError');
  const btnSubmit = document.getElementById('btnLoginSubmit');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const btnGoogle = document.getElementById('btnGoogleLogin');
  const linkForgotPassword = document.getElementById('linkForgotPassword');

  // Các phần tử Form Đăng ký
  const registerForm = document.getElementById('registerForm');
  const regFullNameInput = document.getElementById('regFullName');
  const regEmailOrPhoneInput = document.getElementById('regEmailOrPhone');
  const regPasswordInput = document.getElementById('regPassword');
  const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
  const regFullNameError = document.getElementById('regFullNameError');
  const regEmailOrPhoneError = document.getElementById('regEmailOrPhoneError');
  const regPasswordError = document.getElementById('regPasswordError');
  const regConfirmPasswordError = document.getElementById('regConfirmPasswordError');
  const btnToggleRegPassword = document.getElementById('btnToggleRegPassword');
  const btnToggleRegConfirmPassword = document.getElementById('btnToggleRegConfirmPassword');
  const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
  const btnRegSubmitText = document.getElementById('btnRegSubmitText');

  // --------------------------------------------------------------------------
  // 1. Chuyển đổi giữa Tab Đăng nhập và Đăng ký
  // --------------------------------------------------------------------------
  function switchAuthTab(targetTab) {
    if (targetTab === 'register') {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      loginFormSection.style.display = 'none';
      registerFormSection.style.display = 'block';
      clearAllErrors();
      if (regFullNameInput) regFullNameInput.focus();
    } else {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      registerFormSection.style.display = 'none';
      loginFormSection.style.display = 'block';
      clearAllErrors();
      if (emailOrPhoneInput) emailOrPhoneInput.focus();
    }
  }

  if (tabLoginBtn) {
    tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
    tabLoginBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') switchAuthTab('login'); });
  }
  if (tabRegisterBtn) {
    tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
    tabRegisterBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') switchAuthTab('register'); });
  }
  if (linkRegisterBottom) {
    linkRegisterBottom.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab('register');
    });
  }
  if (linkLoginBottom) {
    linkLoginBottom.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab('login');
    });
  }

  // Tự động mở tab Đăng ký nếu URL chứa #register hoặc ?tab=register
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'register' || window.location.hash === '#register') {
      switchAuthTab('register');
    }
  } catch (err) {
    // Không ảnh hưởng nếu môi trường không hỗ trợ URLSearchParams
  }

  // --------------------------------------------------------------------------
  // 2. Chức năng Hiện / Ẩn Mật khẩu (Eye Toggle)
  // --------------------------------------------------------------------------
  function setupPasswordToggle(buttonEl, inputEl) {
    if (!buttonEl || !inputEl) return;
    buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = inputEl.getAttribute('type') === 'password';
      inputEl.setAttribute('type', isPassword ? 'text' : 'password');
      buttonEl.innerHTML = isPassword ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="23" x2="23" y2="1"></line>
        </svg>` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>`;
      buttonEl.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });
  }

  setupPasswordToggle(btnTogglePassword, passwordInput);
  setupPasswordToggle(btnToggleRegPassword, regPasswordInput);
  setupPasswordToggle(btnToggleRegConfirmPassword, regConfirmPasswordInput);

  // --------------------------------------------------------------------------
  // 3. Hàm kiểm tra hợp lệ & hiển thị thông báo lỗi
  // --------------------------------------------------------------------------
  function isValidEmail(val) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  }

  function isValidPhone(val) {
    const clean = normalizePhone(val);
    return /^(0|\+84)[0-9]{9}$/.test(clean);
  }

  function showError(input, errorEl, msg) {
    if (input) input.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('show');
    }
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }

  function clearAllErrors() {
    clearError(emailOrPhoneInput, emailOrPhoneError);
    clearError(passwordInput, passwordError);
    clearError(regFullNameInput, regFullNameError);
    clearError(regEmailOrPhoneInput, regEmailOrPhoneError);
    clearError(regPasswordInput, regPasswordError);
    clearError(regConfirmPasswordInput, regConfirmPasswordError);
  }

  // Tự động xóa lỗi khi người dùng nhập
  if (emailOrPhoneInput) emailOrPhoneInput.addEventListener('input', () => clearError(emailOrPhoneInput, emailOrPhoneError));
  if (passwordInput) passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));
  if (regFullNameInput) regFullNameInput.addEventListener('input', () => clearError(regFullNameInput, regFullNameError));
  if (regEmailOrPhoneInput) regEmailOrPhoneInput.addEventListener('input', () => clearError(regEmailOrPhoneInput, regEmailOrPhoneError));
  if (regPasswordInput) regPasswordInput.addEventListener('input', () => clearError(regPasswordInput, regPasswordError));
  if (regConfirmPasswordInput) regConfirmPasswordInput.addEventListener('input', () => clearError(regConfirmPasswordInput, regConfirmPasswordError));

  // --------------------------------------------------------------------------
  // 4. XỬ LÝ ĐĂNG KÝ TÀI KHOẢN MỚI
  // --------------------------------------------------------------------------
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError(regFullNameInput, regFullNameError);
      clearError(regEmailOrPhoneInput, regEmailOrPhoneError);
      clearError(regPasswordInput, regPasswordError);
      clearError(regConfirmPasswordInput, regConfirmPasswordError);

      let hasError = false;
      const fullNameVal = (regFullNameInput.value || '').trim();
      const emailOrPhoneVal = (regEmailOrPhoneInput.value || '').trim();
      const passVal = regPasswordInput.value || '';
      const confirmPassVal = regConfirmPasswordInput.value || '';

      // A. Kiểm tra Họ và tên
      if (!fullNameVal) {
        showError(regFullNameInput, regFullNameError, 'Vui lòng nhập họ và tên của bạn.');
        hasError = true;
      } else if (fullNameVal.length < 2) {
        showError(regFullNameInput, regFullNameError, 'Họ và tên phải có tối thiểu 2 ký tự.');
        hasError = true;
      }

      // B. Kiểm tra Email hoặc Số điện thoại
      if (!emailOrPhoneVal) {
        showError(regEmailOrPhoneInput, regEmailOrPhoneError, 'Vui lòng nhập email hoặc số điện thoại.');
        hasError = true;
      } else if (!isValidEmail(emailOrPhoneVal) && !isValidPhone(emailOrPhoneVal)) {
        showError(regEmailOrPhoneInput, regEmailOrPhoneError, 'Vui lòng nhập đúng định dạng email (ví dụ: ten@gmail.com) hoặc SĐT (10 số, vd: 0912345678).');
        hasError = true;
      } else {
        // Kiểm tra xem tài khoản đã tồn tại chưa
        const existingUser = findUserByAccount(emailOrPhoneVal);
        if (existingUser) {
          showError(regEmailOrPhoneInput, regEmailOrPhoneError, 'Tài khoản (email hoặc số điện thoại) này đã được đăng ký. Vui lòng chuyển sang tab Đăng nhập.');
          showToast('Tài khoản đã tồn tại', 'Thông tin này đã được đăng ký trên ReUseHub. Vui lòng đăng nhập.', 'error');
          hasError = true;
        }
      }

      // C. Kiểm tra Mật khẩu
      if (!passVal) {
        showError(regPasswordInput, regPasswordError, 'Vui lòng nhập mật khẩu.');
        hasError = true;
      } else if (passVal.length < 6) {
        showError(regPasswordInput, regPasswordError, 'Mật khẩu phải có tối thiểu 6 ký tự.');
        hasError = true;
      }

      // D. Kiểm tra Xác nhận mật khẩu
      if (!confirmPassVal) {
        showError(regConfirmPasswordInput, regConfirmPasswordError, 'Vui lòng xác nhận lại mật khẩu.');
        hasError = true;
      } else if (passVal !== confirmPassVal) {
        showError(regConfirmPasswordInput, regConfirmPasswordError, 'Mật khẩu xác nhận không trùng khớp.');
        hasError = true;
      }

      if (hasError) return;

      // Trạng thái đang đăng ký
      btnRegisterSubmit.classList.add('is-loading');
      btnRegisterSubmit.disabled = true;
      btnRegSubmitText.textContent = 'Đang tạo tài khoản...';

      setTimeout(() => {
        // Tạo đối tượng người dùng mới
        const isEmail = isValidEmail(emailOrPhoneVal);
        const isPhone = isValidPhone(emailOrPhoneVal);
        const userEmail = isEmail ? emailOrPhoneVal : `${normalizePhone(emailOrPhoneVal)}@reusehub.vn`;
        const newUser = {
          fullName: fullNameVal,
          hoTen: fullNameVal,
          account: emailOrPhoneVal,
          email: userEmail,
          phone: isPhone ? normalizePhone(emailOrPhoneVal) : '',
          password: passVal,
          createdAt: new Date().toISOString()
        };

        // Lưu vào LocalStorage
        const users = getRegisteredUsers();
        users.push(newUser);
        saveRegisteredUsers(users);

        btnRegisterSubmit.classList.remove('is-loading');
        btnRegisterSubmit.disabled = false;
        btnRegSubmitText.textContent = 'Đăng ký tài khoản';

        // Đặt lại form đăng ký
        registerForm.reset();

        showToast('Đăng ký thành công!', 'Tài khoản đã được tạo thành công! Bạn có thể dùng thông tin vừa tạo để đăng nhập ngay bây giờ.', 'success', 4000);

        // Chuyển sang tab Đăng nhập và tự động điền tài khoản vừa đăng ký
        switchAuthTab('login');
        if (emailOrPhoneInput) {
          emailOrPhoneInput.value = emailOrPhoneVal;
        }
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 5. XỬ LÝ ĐĂNG NHẬP (BẮT BUỘC PHẢI CÓ TÀI KHOẢN TRONG HỆ THỐNG MỚI ĐƯỢC VÀO)
  // --------------------------------------------------------------------------
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError(emailOrPhoneInput, emailOrPhoneError);
      clearError(passwordInput, passwordError);

      let hasError = false;
      const emailOrPhoneVal = (emailOrPhoneInput.value || '').trim();
      const passVal = passwordInput.value || '';

      // A. Kiểm tra định dạng đầu vào
      if (!emailOrPhoneVal) {
        showError(emailOrPhoneInput, emailOrPhoneError, 'Vui lòng nhập email hoặc số điện thoại.');
        hasError = true;
      } else if (!isValidEmail(emailOrPhoneVal) && !isValidPhone(emailOrPhoneVal)) {
        showError(emailOrPhoneInput, emailOrPhoneError, 'Vui lòng nhập đúng định dạng email hoặc số điện thoại (vd: 0912345678).');
        hasError = true;
      }

      if (!passVal) {
        showError(passwordInput, passwordError, 'Vui lòng nhập mật khẩu.');
        hasError = true;
      } else if (passVal.length < 6) {
        showError(passwordInput, passwordError, 'Mật khẩu phải có tối thiểu 6 ký tự.');
        hasError = true;
      }

      if (hasError) return;

      // B. KIỂM TRA TÀI KHOẢN ĐÃ ĐĂNG KÝ CHƯA
      const existingUser = findUserByAccount(emailOrPhoneVal);

      if (!existingUser) {
        // Tài khoản chưa được đăng ký trong hệ thống -> CHẶN ĐĂNG NHẬP VÀ YÊU CẦU ĐĂNG KÝ
        showError(
          emailOrPhoneInput, 
          emailOrPhoneError, 
          'Tài khoản chưa được đăng ký trên ReUseHub. Vui lòng bấm vào tab "Đăng ký" bên trên để tạo tài khoản trước.'
        );
        showToast(
          'Chưa có tài khoản', 
          'Tài khoản này chưa tồn tại trong hệ thống. Vui lòng đăng ký tài khoản trước khi đăng nhập.', 
          'error', 
          4500
        );
        return;
      }

      // C. KIỂM TRA MẬT KHẨU
      if (existingUser.password !== passVal) {
        showError(passwordInput, passwordError, 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
        showToast('Đăng nhập thất bại', 'Mật khẩu không đúng. Vui lòng thử lại hoặc sử dụng Quên mật khẩu.', 'error');
        return;
      }

     
      // D. ĐĂNG NHẬP HỢP LỆ VÀ CHUYỂN HƯỚNG
      btnSubmit.classList.add('is-loading');
      btnSubmit.disabled = true;
      btnSubmitText.textContent = 'Đang đăng nhập...';

      const userSession = {
        fullName: existingUser.fullName,
        account: existingUser.account,
        email: existingUser.email || '',
        phone: existingUser.phone || '',
        loginAt: new Date().toISOString(),
        isLoggedIn: true
      };

      try {
        // Lưu phiên đăng nhập cả vào sessionStorage và localStorage để tương thích toàn bộ hệ thống
        sessionStorage.setItem(
          'reusehub_current_user',
          JSON.stringify(userSession)
        );
        localStorage.setItem(
          'nguoiDung',
          JSON.stringify(userSession)
        );

        // Kiểm tra dữ liệu đã được lưu chưa
        const savedSession = sessionStorage.getItem(
          'reusehub_current_user'
        );

        if (!savedSession) {
          throw new Error('Không lưu được phiên đăng nhập.');
        }

        showToast(
          'Đăng nhập thành công!',
          `Chào mừng ${existingUser.fullName} trở lại ReUseHub.`,
          'success',
          2000
        );

        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect');
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = 'index.html';
          }
        }, 1100);

      } catch (err) {
        console.error('Lỗi lưu phiên đăng nhập:', err);

        btnSubmit.classList.remove('is-loading');
        btnSubmit.disabled = false;
        btnSubmitText.textContent = 'Đăng nhập';

        showToast(
          'Lỗi đăng nhập',
          'Không thể lưu phiên đăng nhập. Vui lòng thử lại.',
          'error'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Xử lý các liên kết phụ
  // --------------------------------------------------------------------------
  // Đăng nhập Google
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      showToast('Đăng nhập Google', 'Hệ thống đang cấu hình Google OAuth. Quý khách vui lòng đăng ký hoặc đăng nhập trực tiếp bằng Email / SĐT.', 'info');
    });
  }

  // Quên mật khẩu
  if (linkForgotPassword) {
    linkForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      const val = (emailOrPhoneInput.value || '').trim();
      if (!val) {
        showToast('Quên mật khẩu', 'Vui lòng nhập Email hoặc Số điện thoại vào ô bên trên rồi nhấn lại "Quên mật khẩu?".', 'info');
        if (emailOrPhoneInput) emailOrPhoneInput.focus();
        return;
      }

      const user = findUserByAccount(val);
      if (user) {
        showToast('Khôi phục mật khẩu', `Mã xác thực khôi phục mật khẩu đã được gửi tới ${val}. Mật khẩu hiện tại của bạn là: ${user.password}`, 'info', 6000);
      } else {
        showToast('Không tìm thấy tài khoản', `Không tìm thấy tài khoản tương ứng với "${val}". Vui lòng kiểm tra lại hoặc Đăng ký mới.`, 'error', 4000);
      }
    });
  }
});
