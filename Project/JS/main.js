// Hàm chuyển trang dùng chung cho cả Sidebar và các nút nhấn trong trang
function switchPage(targetId, pathTitle) {
    const pageSections = document.querySelectorAll('.page-section');
    const navItems = document.querySelectorAll('.nav-item');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');

    // 1. Ép ẩn tất cả các trang
    pageSections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Ép hiển thị đúng trang được chọn
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 3. Cập nhật tên trang trên thanh Header
    if (breadcrumbCurrent && pathTitle) {
        breadcrumbCurrent.textContent = pathTitle;
    }

    // 4. Cập nhật màu active trên Sidebar
    navItems.forEach(nav => {
        if (nav.getAttribute('data-target') === targetId) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });

    // Cuộn lên trên cùng của trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    // Lắng nghe click trên các mục Sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const pathTitle = this.getAttribute('data-path');
            switchPage(targetId, pathTitle);
        });
    });

    // Lắng nghe nút Đổi Sáng/Tối (Dark Mode)
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const btnToggleDark = document.getElementById('btn-toggle-dark');

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
    if (btnToggleDark) btnToggleDark.addEventListener('click', toggleTheme);
});
