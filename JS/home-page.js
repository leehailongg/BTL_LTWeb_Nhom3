/* ================= DỮ LIỆU SẢN PHẨM MẪU ================= */
const products = [
  {
    id: 1,
    name: "Bàn học gỗ tự nhiên",
    category: "Nội thất",
    rating: 4.9,
    price: 450000,
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
    desc: "Thiết kế tối giản, bền đẹp, phù hợp góc học tập và làm việc."
  },
  {
    id: 2,
    name: "Nồi cơm điện mini",
    category: "Gia dụng",
    rating: 4.8,
    price: 250000,
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
    desc: "Nồi cơm điện mini chống dính, nhỏ gọn tiện lợi cho sinh viên và người sống một mình."
  },
  {
    id: 3,
    name: "Điện thoại cũ",
    category: "Điện tử",
    rating: 4.7,
    price: 800000,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    desc: "Điện thoại thông minh cũ nguyên bản, pin bền, mọi chức năng hoạt động mượt mà."
  },
  {
    id: 4,
    name: "Kệ sách nhiều tầng",
    category: "Nội thất",
    rating: 4.9,
    price: 300000,
    img: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400",
    desc: "Kệ sách nhiều ngăn đựng tài liệu tiện lợi, chất liệu gỗ chắc chắn và sạch đẹp."
  },
  {
    id: 5,
    name: "Máy xay sinh tố",
    category: "Gia dụng",
    rating: 4.8,
    price: 350000,
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400",
    desc: "Máy xay công suất tốt, cối thủy tinh chịu lực, lưỡi dao inox sắc bén."
  },
  {
    id: 6,
    name: "Túi du lịch bền đẹp",
    category: "Phụ kiện",
    rating: 4.6,
    price: 200000,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    desc: "Túi xách du lịch vải dù chống nước, nhiều ngăn chứa đồ, quai đeo êm ái."
  },
  {
    id: 7,
    name: "Bàn học gỗ tối giản",
    category: "Nội thất",
    rating: 4.9,
    price: 520000,
    img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400",
    desc: "Bàn học hiện đại chân gỗ sồi, màu sắc sang trọng, phù hợp mọi không gian."
  },
  {
    id: 8,
    name: "Nồi cơm điện gia đình",
    category: "Gia dụng",
    rating: 4.8,
    price: 290000,
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
    desc: "Nồi cơm điện dung tích 1.8L phù hợp 4-6 người ăn, nấu cơm dẻo và giữ nhiệt lâu."
  }
];

/* ================= DANH SÁCH VOUCHER ================= */
const availableVouchers = [
  {
    code: "GIAM20K",
    title: "Giảm 20.000đ",
    desc: "Áp dụng cho mọi đơn hàng",
    type: "fixed",
    value: 20000,
    minOrder: 0
  },
  {
    code: "REUSE10",
    title: "Giảm 10% tổng đơn",
    desc: "Giảm tối đa 100.000đ cho đơn hàng",
    type: "percent",
    value: 0.1,
    max: 100000,
    minOrder: 0
  },
  {
    code: "GIAM50K",
    title: "Giảm 50.000đ",
    desc: "Áp dụng cho đơn hàng từ 200.000đ",
    type: "fixed",
    value: 50000,
    minOrder: 200000
  },
  {
    code: "FREESHIP",
    title: "Miễn phí vận chuyển",
    desc: "Freeship toàn quốc",
    type: "freeship",
    value: 0,
    minOrder: 0
  }
];

/* ================= TRẠNG THÁI ỨNG DỤNG ================= */
const BUYER_ORDERS_STORAGE_KEY = 'reusehub_buyer_orders';
const SELLER_ORDERS_STORAGE_KEY = 'reusehub_seller_orders';
const BUYER_CART_STORAGE_KEY = 'reusehub_cart';

// 1. Giỏ hàng
let cart = [];

// 2. Danh sách đơn hàng đã đặt
let orders = [];

// 3. Biến đếm số thứ tự đơn hàng (STT tự động tăng: 1, 2, 3...)
let orderCounter = 0;

// 4. Mã đơn hàng đang được chọn xem trong Theo dõi đơn hàng
let selectedOrderCode = null;

// 5. Voucher đang được áp dụng (mặc định chưa chọn)
let appliedVoucher = null;

// 6. Sản phẩm đang xem chi tiết & Số sao đánh giá
let currentDetailProduct = products[0];
let currentRatingValue = 5;

function loadBuyerCart() {
  try {
    const raw = localStorage.getItem(BUYER_CART_STORAGE_KEY);
    if (raw) cart = JSON.parse(raw);
  } catch (e) {
    cart = [];
  }
}

function saveBuyerCart() {
  try {
    localStorage.setItem(BUYER_CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Lỗi lưu giỏ hàng:", e);
  }
}

function loadBuyerOrders() {
  try {
    const raw = localStorage.getItem(BUYER_ORDERS_STORAGE_KEY);
    if (raw) {
      orders = JSON.parse(raw);
      if (orders.length > 0) {
        orderCounter = orders.reduce((max, o) => Math.max(max, o.stt || 0), 0);
        if (!selectedOrderCode) {
          selectedOrderCode = orders[0].code;
        }
      }
    }
  } catch (e) {
    orders = [];
  }
  syncOrdersWithSeller();
}

function saveBuyerOrders() {
  try {
    localStorage.setItem(BUYER_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Lỗi lưu đơn hàng người mua:", e);
  }
}

function syncOrdersWithSeller() {
  try {
    const sellerRaw = localStorage.getItem(SELLER_ORDERS_STORAGE_KEY);
    if (!sellerRaw) return;
    const sellerOrders = JSON.parse(sellerRaw);
    let changed = false;

    orders.forEach(o => {
      const match = sellerOrders.find(so => so.id === o.code || so.code === o.code || so.id === o.id);
      if (match && match.status && match.status !== o.status) {
        o.status = match.status;
        changed = true;
      }
    });

    if (changed) {
      saveBuyerOrders();
    }
  } catch (e) {
    console.warn("Lỗi đồng bộ đơn hàng từ người bán:", e);
  }
}

/* ================= ĐỊNH DẠNG TIỀN TỆ ================= */
function formatCurrency(amount) {
  if (amount < 0) amount = 0;
  return amount.toLocaleString('vi-VN') + 'đ';
}

/* ================= CHUYỂN ĐỔI GIAO DIỆN CÁC TRANG (SPA) ================= */
function showView(viewName) {
  // Ẩn tất cả các view
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => v.classList.remove('active'));

  // Hiển thị view được chọn
  const activeView = document.getElementById(`view-${viewName}`);
  if (activeView) {
    activeView.classList.add('active');
  }

  // Cập nhật trạng thái active trên Menu Header
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) {
    activeNav.classList.add('active');
  }

  // Cuộn lên đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Cập nhật dữ liệu khi vào từng view
  if (viewName === 'cart') {
    renderCart();
  } else if (viewName === 'checkout') {
    updateCheckoutSummary();
  } else if (viewName === 'tracking') {
    renderTracking();
  } else if (viewName === 'review') {
    renderReviewView();
  }
}

/* ================= TRANG 1: HIỂN THỊ & TÌM KIẾM SẢN PHẨM ================= */
function renderProducts(items) {
  const container = document.getElementById('productList');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
      Không tìm thấy sản phẩm phù hợp.
    </div>`;
    return;
  }

  container.innerHTML = items.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" class="product-card-img" onclick="openProductDetail(${p.id})">
      <div class="product-card-body">
        <h3 class="product-card-title" onclick="openProductDetail(${p.id})">${p.name}</h3>
        <div class="product-card-meta">
          ${p.category} · <span class="star">★</span> ${p.rating}
        </div>
        <div class="product-card-footer">
          <div class="product-card-price">${formatCurrency(p.price)}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-sm btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="quickAddToCart(${p.id})">+ Giỏ hàng</button>
            <span class="product-card-link" onclick="openProductDetail(${p.id})">Chi tiết ›</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Lọc sản phẩm theo danh mục
function filterCategory(catName, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (catName === 'Tất cả' || catName === 'Giá tốt hôm nay') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === catName);
    renderProducts(filtered);
  }
}

// Tìm kiếm sản phẩm
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// Thêm nhanh vào giỏ hàng ngay tại trang chủ
function quickAddToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
    existing.selected = true;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: `${product.category} · ★ ${product.rating}`,
      price: product.price,
      qty: 1,
      img: product.img,
      selected: true
    });
  }

  updateCartBadge();
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

/* ================= TRANG 2: CHI TIẾT SẢN PHẨM ================= */
function openProductDetail(productId) {
  const found = products.find(p => p.id === productId);
  if (found) {
    currentDetailProduct = found;
  }

  document.getElementById('detailImg').src = currentDetailProduct.img;
  document.getElementById('detailTitle').textContent = currentDetailProduct.name;
  document.getElementById('detailCategory').textContent = `${currentDetailProduct.category} · Đã qua sử dụng`;
  document.getElementById('detailPrice').textContent = formatCurrency(currentDetailProduct.price);
  document.getElementById('detailRating').textContent = `${currentDetailProduct.rating}/5`;
  document.getElementById('detailDesc').textContent = currentDetailProduct.desc;

  showView('detail');
}

// Thêm sản phẩm hiện tại vào giỏ hàng
function addToCartCurrentProduct() {
  const existing = cart.find(item => item.id === currentDetailProduct.id);
  if (existing) {
    existing.qty += 1;
    existing.selected = true;
  } else {
    cart.push({
      id: currentDetailProduct.id,
      name: currentDetailProduct.name,
      category: `${currentDetailProduct.category} · ★ ${currentDetailProduct.rating}`,
      price: currentDetailProduct.price,
      qty: 1,
      img: currentDetailProduct.img,
      selected: true
    });
  }

  updateCartBadge();
  alert(`Đã thêm "${currentDetailProduct.name}" vào giỏ hàng!`);
}

// Mua ngay từ trang chi tiết
function buyNowCurrentProduct() {
  addToCartCurrentProduct();
  showView('cart');
}

/* ================= TRANG 3: GIỎ HÀNG ================= */
function renderCart() {
  const container = document.getElementById('cartItemsList');
  if (!container) return;

  // Nếu giỏ hàng trống: Báo không có đơn hàng / sản phẩm
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-state-icon">🛒</div>
        <h3>Không có sản phẩm nào trong giỏ hàng</h3>
        <p>Giỏ hàng của bạn đang trống. Hãy thêm các món đồ yêu thích để tiến hành thanh toán nhé!</p>
        <button class="btn btn-primary" onclick="showView('home')">Khám phá sản phẩm ngay</button>
      </div>
    `;
    // Reset tiền về 0
    const cartItemCountText = document.getElementById('cartItemCountText');
    if (cartItemCountText) cartItemCountText.textContent = `(0 sản phẩm)`;
    const cartSummaryItems = document.getElementById('cartSummaryItems');
    if (cartSummaryItems) cartSummaryItems.textContent = `Tạm tính (0 sản phẩm)`;
    const cartSubtotalText = document.getElementById('cartSubtotalText');
    if (cartSubtotalText) cartSubtotalText.textContent = '0đ';
    const cartTotalText = document.getElementById('cartTotalText');
    if (cartTotalText) cartTotalText.textContent = '0đ';
    const cartDiscountRow = document.getElementById('cartDiscountRow');
    if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    const selectAllCheckbox = document.getElementById('selectAllCart') || document.querySelector('.cart-header-row input[type="checkbox"]');
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    updateCartBadge();
    return;
  }

  // Cập nhật trạng thái checkbox "Chọn tất cả"
  const selectAllCheckbox = document.getElementById('selectAllCart') || document.querySelector('.cart-header-row input[type="checkbox"]');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = cart.length > 0 && cart.every(item => item.selected !== false);
  }

  // Khi có sản phẩm: Render bảng danh sách sản phẩm
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <!-- Thông tin sản phẩm -->
      <div class="cart-item-info">
        <input type="checkbox" ${item.selected !== false ? 'checked' : ''} onchange="toggleItemSelect(${index}, this.checked)">
        <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-text">
          <h4>${item.name}</h4>
          <p>${item.category}</p>
          <span class="return-badge">Đổi trả miễn phí trong 7 ngày</span>
        </div>
      </div>

      <!-- Đơn giá -->
      <div>${formatCurrency(item.price)}</div>

      <!-- Tăng giảm số lượng -->
      <div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>

      <!-- Thành tiền và Xóa -->
      <div>
        <strong>${formatCurrency(item.price * item.qty)}</strong>
        <span class="del-link" onclick="deleteCartItem(${index})">Xóa</span>
      </div>
    </div>
  `).join('');

  // Tính tiền
  calculateCartTotals();
}

// Thay đổi số lượng
function changeQty(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        cart.splice(index, 1);
      } else {
        cart[index].qty = 1;
      }
    }
    renderCart();
    updateCartBadge();
  }
}

// Xóa sản phẩm khỏi giỏ
function deleteCartItem(index) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    cart.splice(index, 1);
    renderCart();
    updateCartBadge();
  }
}

// Chọn / Bỏ chọn từng sản phẩm trong giỏ hàng
function toggleItemSelect(index, isChecked) {
  if (cart[index]) {
    cart[index].selected = isChecked;
  }
  const selectAllCheckbox = document.getElementById('selectAllCart') || document.querySelector('.cart-header-row input[type="checkbox"]');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = cart.length > 0 && cart.every(item => item.selected !== false);
  }
  calculateCartTotals();
}

// Chọn hoặc bỏ chọn tất cả sản phẩm
function toggleSelectAllCart(checkbox) {
  const isChecked = checkbox.checked;
  cart.forEach(item => {
    item.selected = isChecked;
  });
  const checkboxes = document.querySelectorAll('#cartItemsList input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = isChecked);
  calculateCartTotals();
}

// Tính toán tổng tiền giỏ hàng bao gồm Voucher (chỉ tính các sản phẩm được chọn)
function calculateCartTotals() {
  const selectedItems = cart.filter(item => item.selected !== false);
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Tính mức giảm giá của Voucher (nếu có)
  let discount = 0;
  if (appliedVoucher) {
    if (subtotal > 0 && subtotal < appliedVoucher.minOrder) {
      alert(`Đơn hàng các sản phẩm được chọn tối thiểu ${formatCurrency(appliedVoucher.minOrder)} để áp dụng mã ${appliedVoucher.code}. Đã hủy áp dụng voucher.`);
      appliedVoucher = null;
    } else if (subtotal >= appliedVoucher.minOrder) {
      if (appliedVoucher.type === 'fixed') {
        discount = appliedVoucher.value;
      } else if (appliedVoucher.type === 'percent') {
        discount = subtotal * appliedVoucher.value;
        if (appliedVoucher.max && discount > appliedVoucher.max) {
          discount = appliedVoucher.max;
        }
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  // Cập nhật giao diện Trang Giỏ hàng
  const cartItemCountEl = document.getElementById('cartItemCountText');
  if (cartItemCountEl) {
    cartItemCountEl.textContent = `(${cart.length} sản phẩm)`;
  }
  const cartSummaryItemsEl = document.getElementById('cartSummaryItems');
  if (cartSummaryItemsEl) {
    cartSummaryItemsEl.textContent = `Tạm tính (${selectedItemsCount} sản phẩm)`;
  }
  const cartSubtotalTextEl = document.getElementById('cartSubtotalText');
  if (cartSubtotalTextEl) {
    cartSubtotalTextEl.textContent = formatCurrency(subtotal);
  }
  const cartTotalTextEl = document.getElementById('cartTotalText');
  if (cartTotalTextEl) {
    cartTotalTextEl.textContent = formatCurrency(finalTotal);
  }

  const discountRow = document.getElementById('cartDiscountRow');
  const voucherLabel = document.getElementById('cartVoucherLabel');

  if (discountRow && voucherLabel) {
    if (appliedVoucher && discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('cartVoucherCode').textContent = appliedVoucher.code;
      document.getElementById('cartDiscountText').textContent = `-${formatCurrency(discount)}`;
      voucherLabel.textContent = `🏷 Đã áp dụng mã: ${appliedVoucher.code}`;
    } else {
      discountRow.style.display = 'none';
      voucherLabel.textContent = appliedVoucher ? `🏷 Đã áp dụng: ${appliedVoucher.code}` : `🏷 Chọn hoặc nhập mã voucher`;
    }
  }

  updateCartBadge();
  return { subtotal, discount, finalTotal, selectedItemsCount, selectedCount: selectedItems.length };
}

// Cập nhật số đỏ trên icon giỏ hàng Header
function updateCartBadge() {
  const totalBadgeCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeEl = document.getElementById('cartCount');
  if (badgeEl) {
    badgeEl.textContent = totalBadgeCount;
  }
  saveBuyerCart();
}

// Nút chuyển sang Đặt hàng
function goToCheckout() {
  if (cart.length === 0) {
    alert("Không có sản phẩm nào trong giỏ hàng để mua! Hãy thêm sản phẩm trước.");
    return;
  }
  const selectedItems = cart.filter(item => item.selected !== false);
  if (selectedItems.length === 0) {
    alert("Vui lòng chọn ít nhất 1 sản phẩm để tiến hành mua hàng!");
    return;
  }
  showView('checkout');
}

/* ================= TRANG 4: ĐẶT HÀNG & THANH TOÁN ================= */
function updateCheckoutSummary() {
  const totals = calculateCartTotals();
  if (!totals) return;

  const selectedItems = cart.filter(item => item.selected !== false);
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  const checkoutQtyEl = document.getElementById('checkoutQtyText');
  if (checkoutQtyEl) checkoutQtyEl.textContent = `${selectedCount} sản phẩm`;
  
  const checkoutSubtotalEl = document.getElementById('checkoutSubtotalText');
  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatCurrency(totals.subtotal);
  
  const checkoutTotalEl = document.getElementById('checkoutTotalText');
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatCurrency(totals.finalTotal);

  const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  const checkoutVoucherLabel = document.getElementById('checkoutVoucherLabel');

  if (checkoutDiscountRow && checkoutVoucherLabel) {
    if (appliedVoucher && totals.discount > 0) {
      checkoutDiscountRow.style.display = 'flex';
      document.getElementById('checkoutVoucherCode').textContent = appliedVoucher.code;
      document.getElementById('checkoutDiscountText').textContent = `-${formatCurrency(totals.discount)}`;
      checkoutVoucherLabel.textContent = `🏷 Đã áp dụng: ${appliedVoucher.code}`;
    } else {
      checkoutDiscountRow.style.display = 'none';
      checkoutVoucherLabel.textContent = `🏷 Chọn hoặc nhập mã voucher`;
    }
  }
}

function focusAddressForm() {
  document.getElementById('orderAddress').focus();
}

// Gửi yêu cầu đơn hàng mới đến người bán (lưu vào cả reusehub_seller_orders và reusehub_seller_products)
function sendOrderToSeller(order) {
  try {
    // 1. Thêm vào danh sách đơn hàng người bán (reusehub_seller_orders)
    const raw = localStorage.getItem(SELLER_ORDERS_STORAGE_KEY);
    let sellerOrders = [];
    if (raw) {
      sellerOrders = JSON.parse(raw);
    } else {
      sellerOrders = [
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
        }
      ];
    }

    const sellerOrderItem = {
      id: order.code,
      code: order.code,
      stt: order.stt,
      productName: order.items.map(i => `${i.name} (x${i.qty})`).join(', '),
      buyerName: order.customer.name,
      buyerPhone: order.customer.phone,
      date: order.date,
      price: order.total,
      status: "Chờ xác nhận",
      isUrgent: true,
      address: order.customer.address || "Chưa cung cấp",
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      voucherCode: order.voucherCode,
      total: order.total
    };

    const existingIndex = sellerOrders.findIndex(so => so.id === order.code);
    if (existingIndex >= 0) {
      sellerOrders[existingIndex] = sellerOrderItem;
    } else {
      sellerOrders.unshift(sellerOrderItem);
    }
    localStorage.setItem(SELLER_ORDERS_STORAGE_KEY, JSON.stringify(sellerOrders));

    // 2. Thêm vào kho sản phẩm người bán (reusehub_seller_products) với trạng thái "Chờ duyệt"
    // để hiển thị ngay tại mục "Chờ admin duyệt" trên trang người bán (Màn hình 7 và Dashboard)
    const SELLER_PRODUCTS_KEY = "reusehub_seller_products";
    let sellerProducts = [];
    const prodRaw = localStorage.getItem(SELLER_PRODUCTS_KEY);
    if (prodRaw) {
      sellerProducts = JSON.parse(prodRaw);
    } else {
      sellerProducts = [
        {
          id: 1,
          name: "Bàn học gỗ",
          category: "Nội thất",
          price: 450000,
          date: "12/06/2024",
          status: "Đang bán",
          location: "Hà Nội - Cầu Giấy",
          condition: "Đã qua sử dụng (90%)",
          description: "Bàn học gỗ ép công nghiệp cao cấp, bề mặt phủ melamine chống trầy.",
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
          description: "Nồi cơm điện mini Sharp dung tích 1.2L.",
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
          description: "Điện thoại Android máy phụ.",
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
          description: "Kệ sách 4 tầng gỗ cao su tự nhiên.",
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
          description: "Máy xay sinh tố đa năng.",
          icon: "🥤"
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
          description: "Túi du lịch cỡ trung.",
          icon: "🧳"
        }
      ];
    }

    const prodName = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');
    const prodCategory = (order.items[0] && order.items[0].category ? order.items[0].category.split('·')[0].trim() : "Đồ dùng");

    const newProdItem = {
      id: "order-" + order.code,
      orderCode: order.code,
      name: prodName,
      category: prodCategory,
      price: order.total,
      date: order.date,
      status: "Chờ duyệt", // <-- TRẠNG THÁI "Chờ duyệt" để hiển thị ngay tại mục "Chờ admin duyệt"
      location: order.customer.address || "Hà Nội",
      condition: "Đơn mua: " + order.customer.name + " (" + order.customer.phone + ")",
      description: "Đơn hàng #" + order.code + " đang chờ duyệt. Khách hàng: " + order.customer.name + " (" + order.customer.phone + "). Địa chỉ: " + order.customer.address + ". Ghi chú: " + (order.customer.note || "Không có"),
      icon: "📦",
      isOrder: true
    };

    const existingProdIdx = sellerProducts.findIndex(p => p.id === newProdItem.id || p.orderCode === order.code);
    if (existingProdIdx >= 0) {
      sellerProducts[existingProdIdx] = newProdItem;
    } else {
      sellerProducts.unshift(newProdItem);
    }
    localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(sellerProducts));
  } catch (e) {
    console.error("Lỗi gửi đơn hàng đến người bán:", e);
  }
}

// Đặt hàng: Tạo đơn hàng mới theo STT tự động
function placeOrder() {
  const selectedItems = cart.filter(item => item.selected !== false);
  if (selectedItems.length === 0) {
    alert("Không có sản phẩm nào được chọn để đặt hàng!");
    return;
  }

  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const note = document.getElementById('orderNote').value.trim();

  if (!name || !phone) {
    alert("Vui lòng nhập đầy đủ họ tên và số điện thoại nhận hàng!");
    return;
  }

  const totals = calculateCartTotals();

  // Tăng số thứ tự đơn hàng (STT)
  orderCounter += 1;
  // Tạo mã đơn theo STT: RH001, RH002, RH003...
  const orderCode = "RH" + String(orderCounter).padStart(3, '0');

  // Tạo đối tượng đơn hàng mới với trạng thái ban đầu: "Chờ xác nhận"
  const newOrder = {
    stt: orderCounter,
    code: orderCode,
    id: orderCode,
    date: new Date().toLocaleDateString('vi-VN'),
    customer: {
      name: name,
      phone: phone,
      address: address || "Chưa cung cấp",
      note: note || "Không có"
    },
    items: JSON.parse(JSON.stringify(selectedItems)), // Chỉ lưu lại danh sách sản phẩm ĐÃ CHỌN mua
    subtotal: totals.subtotal,
    discount: totals.discount,
    voucherCode: appliedVoucher ? appliedVoucher.code : null,
    total: totals.finalTotal,
    status: "Chờ xác nhận" // TRẠNG THÁI BAN ĐẦU: CHỜ XÁC NHẬN
  };

  // Thêm đơn hàng vào đầu danh sách người mua
  orders.unshift(newOrder);
  selectedOrderCode = newOrder.code;
  saveBuyerOrders();

  // GỬI YÊU CẦU ĐƠN HÀNG ĐẾN NGƯỜI BÁN (Vào cả danh sách đơn và mục Chờ admin duyệt)
  sendOrderToSeller(newOrder);

  // Thông báo đặt hàng thành công
  alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n---------------------------------\n• Số thứ tự đơn: #${newOrder.stt}\n• Mã đơn hàng: #${newOrder.code}\n• Trạng thái: Chờ xác nhận\n• Tổng tiền: ${formatCurrency(newOrder.total)}\n• Đơn hàng đã được gửi thành công!\n• Cảm ơn bạn đã đồng hành cùng ReuseHub!`);

  // Xóa các sản phẩm đã mua khỏi giỏ hàng (giữ lại các sản phẩm chưa chọn mua nếu có)
  cart = cart.filter(item => item.selected === false);
  appliedVoucher = null;
  updateCartBadge();

  // Tự động chuyển ngay sang màn hình Theo dõi đơn hàng
  showView('tracking');
}

/* ================= TRANG 5: THEO DÕI ĐƠN HÀNG ================= */
function renderTracking() {
  syncOrdersWithSeller();
  const container = document.getElementById('trackingContainer');
  if (!container) return;

  // 1. Trường hợp CHƯA CÓ đơn hàng nào: Báo không có đơn
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-state-icon">📦</div>
        <h3>Bạn chưa có đơn hàng nào</h3>
        <p>Hiện tại không có đơn hàng nào trong hệ thống. Khi bạn đặt hàng, hệ thống sẽ tự động cấp mã đơn theo số thứ tự (STT: RH001, RH002...) để bạn tiện theo dõi tại đây.</p>
        <button class="btn btn-primary" onclick="showView('home')">Mua sắm ngay</button>
      </div>
    `;
    return;
  }

  // 2. Trường hợp ĐÃ CÓ đơn hàng:
  // Nếu chưa chọn đơn nào thì chọn đơn mới nhất
  if (!selectedOrderCode && orders.length > 0) {
    selectedOrderCode = orders[0].code;
  }

  const currentOrder = orders.find(o => o.code === selectedOrderCode) || orders[0];
  const isPending = currentOrder.status === "Chờ xác nhận";
  const isShipping = currentOrder.status === "Đang giao" || currentOrder.status === "Đã xác nhận";
  const isCompleted = currentOrder.status === "Hoàn tất" || currentOrder.status === "Đã giao";
  const isCancelled = currentOrder.status === "Đã hủy";

  // Xác định Badge trạng thái
  let badgeHtml = '';
  if (isPending) {
    badgeHtml = `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:600; padding:6px 14px; border-radius:6px; border:1px solid #fde68a; display:inline-flex; align-items:center; gap:6px;">⏳ Chờ xác nhận</span>`;
  } else if (isShipping) {
    badgeHtml = `<span class="badge badge-shipping" style="background-color:#ecfdf5; color:#065f46; font-weight:600; padding:6px 14px; border-radius:6px; border:1px solid #a7f3d0; display:inline-flex; align-items:center; gap:6px;">🚚 Đang giao</span>`;
  } else if (isCompleted) {
    badgeHtml = `<span class="badge" style="background-color:#dcfce7; color:#15803d; font-weight:600; padding:6px 14px; border-radius:6px; border:1px solid #86efac; display:inline-flex; align-items:center; gap:6px;">✔ Hoàn tất</span>`;
  } else if (isCancelled) {
    badgeHtml = `<span class="badge" style="background-color:#fee2e2; color:#b91c1c; font-weight:600; padding:6px 14px; border-radius:6px; border:1px solid #fca5a5; display:inline-flex; align-items:center; gap:6px;">✕ Đã hủy</span>`;
  } else {
    badgeHtml = `<span class="badge badge-shipping">${currentOrder.status}</span>`;
  }

  // Stepper logic
  let step1Class = "step completed";
  let line1Class = (isPending || isShipping || isCompleted) ? "step-line active" : "step-line";
  
  let step2Class = isPending ? "step active" : ((isShipping || isCompleted) ? "step completed" : "step");
  let step2Circle = isPending ? "⏳" : ((isShipping || isCompleted) ? "✔" : "○");
  let step2Name = isPending ? "Chờ xác nhận" : "Đã xác nhận";
  let step2Time = isPending ? "Đang xử lý" : currentOrder.date;

  let line2Class = (isShipping || isCompleted) ? "step-line active" : "step-line";

  let step3Class = isShipping ? "step completed" : (isCompleted ? "step completed" : "step");
  let step3Circle = isShipping ? "🚚" : (isCompleted ? "✔" : "○");
  let step3Time = isShipping ? "Đang vận chuyển" : (isCompleted ? "Đã vận chuyển" : "Chờ lấy hàng");

  let line3Class = isCompleted ? "step-line active" : "step-line";

  let step4Class = isCompleted ? "step completed" : "step";
  let step4Circle = isCompleted ? "✔" : "○";
  let step4Time = isCompleted ? "Giao thành công" : "Dự kiến 2-3 ngày";

  container.innerHTML = `
    <!-- Thanh lựa chọn đơn hàng theo STT -->
    <div class="order-select-bar">
      <span>Chọn đơn hàng:</span>
      <select onchange="changeOrderSelect(this.value)">
        ${orders.map(o => `
          <option value="${o.code}" ${o.code === currentOrder.code ? 'selected' : ''}>
            Đơn hàng #${o.code} (STT ${o.stt}) - [${o.status}] - ${formatCurrency(o.total)}
          </option>
        `).join('')}
      </select>
    </div>

    <!-- Khung thông tin chi tiết đơn hàng đang chọn -->
    <div class="tracking-card">
      <div class="tracking-card-header">
        <div>
          <strong>Đơn hàng #${currentOrder.code}</strong>
          <span style="font-size: 13px; color: #6b7280; margin-left: 8px;">(Số thứ tự: #${currentOrder.stt})</span>
          <span style="font-size: 12px; color: #9ca3af; margin-left: 8px;">· Ngày đặt: ${currentOrder.date}</span>
        </div>
        ${badgeHtml}
      </div>

      <!-- Thanh tiến trình Stepper -->
      <div class="stepper">
        <div class="${step1Class}">
          <div class="step-circle">✔</div>
          <div class="step-name">Đã đặt hàng</div>
          <div class="step-time">${currentOrder.date}</div>
        </div>
        <div class="${line1Class}"></div>

        <div class="${step2Class}">
          <div class="step-circle">${step2Circle}</div>
          <div class="step-name">${step2Name}</div>
          <div class="step-time">${step2Time}</div>
        </div>
        <div class="${line2Class}"></div>

        <div class="${step3Class}">
          <div class="step-circle">${step3Circle}</div>
          <div class="step-name">Đang giao</div>
          <div class="step-time">${step3Time}</div>
        </div>
        <div class="${line3Class}"></div>

        <div class="${step4Class}">
          <div class="step-circle">${step4Circle}</div>
          <div class="step-name">Đã giao</div>
          <div class="step-time">${step4Time}</div>
        </div>
      </div>

      <!-- Danh sách sản phẩm của đơn hàng này -->
      <div style="margin: 16px 0;">
        <h4 style="font-size: 14px; margin-bottom: 8px;">Sản phẩm trong đơn (${currentOrder.items.length} món):</h4>
        ${currentOrder.items.map(item => `
          <div class="order-product-row">
            <div class="order-prod-thumb">
              <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="order-prod-info">
              <h4>${item.name}</h4>
              <p>${item.category} · Số lượng: ${item.qty}</p>
            </div>
            <div class="order-prod-price">${formatCurrency(item.price * item.qty)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Tóm tắt thanh toán của đơn -->
      <div style="background: #f9fafb; padding: 12px 16px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; flex-wrap:wrap; gap:8px;">
          <span>Người nhận: <strong>${currentOrder.customer.name} (${currentOrder.customer.phone})</strong></span>
          <span>Địa chỉ: <strong>${currentOrder.customer.address}</strong></span>
        </div>
        ${currentOrder.customer.note && currentOrder.customer.note !== "Không có" ? `
          <div style="margin-bottom:4px; color:#4b5563;">
            <span>Ghi chú: <em>${currentOrder.customer.note}</em></span>
          </div>
        ` : ''}
        ${currentOrder.voucherCode ? `
          <div style="display:flex; justify-content:space-between; color:#dc2626; margin-bottom:4px;">
            <span>Voucher giảm giá (${currentOrder.voucherCode}):</span>
            <span>-${formatCurrency(currentOrder.discount)}</span>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between; font-weight:600; padding-top:6px; border-top:1px dashed #d1d5db; margin-top:6px;">
          <span>Phương thức thanh toán:</span>
          <span>Thanh toán khi nhận hàng (COD)</span>
        </div>
      </div>

      <!-- Footer tổng tiền và các nút thao tác -->
      <div class="tracking-footer">
        <div class="tracking-total">
          <span>Tổng tiền:</span> <strong>${formatCurrency(currentOrder.total)}</strong>
        </div>
        <div class="tracking-buttons">
          <button class="btn btn-outline" onclick="viewOrderDetailAlert('${currentOrder.code}')">Xem chi tiết</button>
          <button class="btn btn-primary" onclick="alert('Đang kết nối chat tới người bán của đơn #${currentOrder.code}...')">Liên hệ người bán</button>
          ${isShipping || isCompleted ? `
            <button class="btn btn-outline" style="border-color:#0d5c46; color:#0d5c46;" onclick="goToReviewOrder('${currentOrder.code}')">Đi tới Đánh giá</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Thay đổi đơn hàng đang xem trong dropdown
function changeOrderSelect(code) {
  selectedOrderCode = code;
  renderTracking();
}

// Tìm kiếm mã đơn hàng
function searchTrackingCode() {
  const input = document.getElementById('trackingCodeInput').value.trim().toUpperCase();
  if (!input) {
    alert("Vui lòng nhập mã đơn hàng cần tìm (VD: RH001 hoặc số STT: 1)!");
    return;
  }

  // Tìm theo mã đơn hoặc theo STT
  const found = orders.find(o => o.code === input || String(o.stt) === input);
  if (found) {
    selectedOrderCode = found.code;
    renderTracking();
    alert(`Đã tìm thấy đơn hàng #${found.code} (STT: ${found.stt})!`);
  } else {
    alert(`Không tìm thấy đơn hàng "${input}". Vui lòng kiểm tra lại!`);
  }
}

// Hiển thị chi tiết đơn hàng
function viewOrderDetailAlert(code) {
  const o = orders.find(item => item.code === code);
  if (!o) return;

  const itemList = o.items.map(i => `• ${i.name} (x${i.qty}): ${formatCurrency(i.price * i.qty)}`).join('\n');
  alert(`THÔNG TIN ĐƠN HÀNG #${o.code} (STT ${o.stt})\n------------------------------------\nNgày đặt: ${o.date}\nKhách hàng: ${o.customer.name} - ${o.customer.phone}\nĐịa chỉ: ${o.customer.address}\n\nDanh sách sản phẩm:\n${itemList}\n------------------------------------\nTạm tính: ${formatCurrency(o.subtotal)}\nGiảm giá: -${formatCurrency(o.discount)}\nTổng thanh toán: ${formatCurrency(o.total)}\nTrạng thái: ${o.status}`);
}

// Chuyển sang đánh giá đơn hàng đang chọn
function goToReviewOrder(code) {
  selectedOrderCode = code;
  showView('review');
}

/* ================= TRANG 6: ĐÁNH GIÁ ĐƠN HÀNG ================= */
function renderReviewView() {
  const container = document.getElementById('reviewProductBox');
  const badge = document.getElementById('reviewOrderBadge');
  const totalText = document.getElementById('reviewTotalText');

  if (orders.length === 0) {
    container.innerHTML = `<div style="padding: 20px 0; color: #888;">Bạn chưa có đơn hàng nào để đánh giá.</div>`;
    badge.textContent = `Chưa có đơn hàng`;
    totalText.textContent = `0đ`;
    return;
  }

  const currentOrder = orders.find(o => o.code === selectedOrderCode) || orders[0];
  badge.textContent = `Đơn hàng #${currentOrder.code} (STT ${currentOrder.stt}) · Đã giao`;
  totalText.textContent = formatCurrency(currentOrder.total);

  // Hiển thị các sản phẩm trong đơn để đánh giá
  container.innerHTML = currentOrder.items.map(item => `
    <div class="order-product-row mt-15">
      <div class="order-prod-thumb">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="order-prod-info">
        <h4>${item.name}</h4>
        <p>${item.category} · Số lượng: ${item.qty}</p>
      </div>
      <div class="order-prod-price">${formatCurrency(item.price * item.qty)}</div>
    </div>
  `).join('');
}

function setRating(stars) {
  currentRatingValue = stars;
  const starElements = document.querySelectorAll('#starContainer .star');
  
  starElements.forEach((star, idx) => {
    if (idx < stars) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });

  const hints = [
    "Rất không hài lòng (1 sao)",
    "Không hài lòng (2 sao)",
    "Bình thường (3 sao)",
    "Hài lòng (4 sao)",
    "Tuyệt vời! Rất hài lòng (5 sao)"
  ];
  document.getElementById('ratingHintText').textContent = hints[stars - 1];
}

function submitReview() {
  if (orders.length === 0) {
    alert("Bạn chưa có đơn hàng nào để gửi đánh giá!");
    return;
  }
  alert(`Cảm ơn bạn đã gửi đánh giá (${currentRatingValue} sao)!\nĐánh giá của bạn giúp cộng đồng ReuseHub an tâm mua sắm hơn.`);
  document.getElementById('reviewText').value = '';
  showView('home');
}

/* ================= MODAL CHỌN VOUCHER ================= */
function openVoucherModal() {
  const modal = document.getElementById('voucherModal');
  const container = document.getElementById('voucherListContainer');

  // Render danh sách voucher có sẵn
  container.innerHTML = availableVouchers.map(v => {
    const isSelected = appliedVoucher && appliedVoucher.code === v.code;
    return `
      <div class="voucher-card ${isSelected ? 'selected' : ''}">
        <div class="voucher-card-left">
          <span class="voucher-badge">${v.code}</span>
          <div class="voucher-card-title">${v.title}</div>
          <div class="voucher-card-desc">${v.desc}</div>
        </div>
        <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}" onclick="selectVoucher('${v.code}')">
          ${isSelected ? 'Đang dùng' : 'Áp dụng'}
        </button>
      </div>
    `;
  }).join('');

  modal.classList.add('show');
}

function closeVoucherModal(e) {
  if (!e || e.target.id === 'voucherModal' || e.target.classList.contains('modal-close')) {
    document.getElementById('voucherModal').classList.remove('show');
  }
}

function selectVoucher(code) {
  const v = availableVouchers.find(item => item.code === code);
  if (!v) return;

  const selectedItems = cart.filter(item => item.selected !== false);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (v.minOrder > 0 && subtotal < v.minOrder) {
    alert(`Đơn hàng các sản phẩm được chọn tối thiểu ${formatCurrency(v.minOrder)} để áp dụng mã ${v.code}!`);
    return;
  }

  appliedVoucher = v;
  calculateCartTotals();
  updateCheckoutSummary();
  closeVoucherModal({ target: { id: 'voucherModal' } });
  alert(`Đã áp dụng thành công voucher: ${v.code} (${v.title})!`);
}

function applyCustomVoucher() {
  const code = document.getElementById('customVoucherInput').value.trim().toUpperCase();
  if (!code) {
    alert("Vui lòng nhập mã voucher!");
    return;
  }

  const v = availableVouchers.find(item => item.code === code);
  if (v) {
    selectVoucher(v.code);
    document.getElementById('customVoucherInput').value = '';
  } else {
    alert(`Mã voucher "${code}" không hợp lệ hoặc đã hết hạn!`);
  }
}

function removeVoucher() {
  appliedVoucher = null;
  calculateCartTotals();
  updateCheckoutSummary();
  closeVoucherModal({ target: { id: 'voucherModal' } });
  alert("Đã hủy áp dụng voucher.");
}

/* ================= MENU VAI TRÒ (DROPDOWN) ================= */
function toggleRoleDropdown() {
  const menu = document.getElementById('roleMenu');
  menu.classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    const dropdowns = document.getElementsByClassName('dropdown-menu');
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
  }
};

/* ================= KHỞI TẠO BAN ĐẦU ================= */
window.onload = function() {
  // 1. Tải giỏ hàng và danh sách đơn hàng đã lưu từ LocalStorage
  loadBuyerCart();
  loadBuyerOrders();

  // 2. Hiển thị danh sách sản phẩm trang chủ
  renderProducts(products);

  // 3. Render giỏ hàng ban đầu
  renderCart();

  // 4. Render theo dõi đơn hàng
  renderTracking();

  // 5. Mặc định 5 sao cho form đánh giá
  setRating(5);

  // 6. Kiểm tra nếu chuyển từ trang khác sang giỏ hàng hoặc theo dõi đơn
  const openView = localStorage.getItem('openView');
  if (openView) {
    localStorage.removeItem('openView');
    showView(openView);
  }

  // 7. Lắng nghe thay đổi Storage khi người bán duyệt đơn từ trang seller.html
  window.addEventListener('storage', function(e) {
    if (e.key === SELLER_ORDERS_STORAGE_KEY || e.key === BUYER_ORDERS_STORAGE_KEY) {
      loadBuyerOrders();
      const trackingView = document.getElementById('view-tracking');
      if (trackingView && trackingView.classList.contains('active')) {
        renderTracking();
      }
    }
  });
};
