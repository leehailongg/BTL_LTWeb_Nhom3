/**
 * ==============================================================================
 * JAVASCRIPT CHO TRANG TRỢ LÝ AI REUSEHUB (support.js)
 * Tích hợp đầy đủ:
 * 1. Chuyển đổi mượt mà giữa các Màn hình (Tabs)
 * 2. Trợ lý Hội thoại Chat (Theo giao diện PDF chuẩn)
 * 3. 🤖 AI-1: Circularity Advisor (Gợi ý phương án tuần hoàn tối ưu)
 * 4. ✨ AI-2: Item Description AI (Sinh mô tả tin đăng tự động)
 * 5. 🎯 AI-3: Receiver Matcher (Đề xuất ghép nối nhu cầu thông minh)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // ============================================================================
  // 1. THANH ĐIỀU HƯỚNG VÀ DROPDOWN VAI TRÒ
  // ============================================================================
  const roleBtn = document.getElementById('roleBtn');
  const roleMenu = document.getElementById('roleMenu');
  const headerSearchInput = document.getElementById('headerSearchInput');

  if (roleBtn && roleMenu) {
    roleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isExpanded = roleMenu.classList.toggle('show');
      roleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!roleBtn.contains(e.target) && !roleMenu.contains(e.target)) {
        roleMenu.classList.remove('show');
        roleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = headerSearchInput.value.trim();
        if (query) {
          window.location.href = `index.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // ============================================================================
  // 2. CHUYỂN ĐỔI MÀN HÌNH (TABS SWITCHER CHO 4 MÀN HÌNH AI)
  // ============================================================================
  const tabButtons = document.querySelectorAll('.ai-tab-btn');
  const aiViews = document.querySelectorAll('.ai-view');

  function switchAiView(targetViewId) {
    // 1. Cập nhật trạng thái các nút Tabs
    tabButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-target') === targetViewId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // 2. Ẩn/Hiện màn hình tương ứng
    aiViews.forEach(view => {
      const isTarget = view.id === targetViewId;
      view.classList.toggle('active', isTarget);
    });

    // Cuộn nhẹ lên đầu khung làm việc
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-target');
      switchAiView(target);
    });
  });

  // ============================================================================
  // 3. HÀM TIỆN ÍCH CHUẨN HÓA TIẾNG VIỆT
  // ============================================================================
  function removeVietnameseTones(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  // ============================================================================
  // 4. MÀN HÌNH 1: TRỢ LÝ HỘI THOẠI AI (CHAT ASSISTANT)
  // ============================================================================
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('chatMessages');
  const suggestionButtons = document.querySelectorAll('.suggestion-btn');

  let isBotReplying = false;

  function generateChatResponse(userText) {
    const cleanText = removeVietnameseTones(userText);

    // Bắt từ khóa điều hướng sang 3 AI chuyên biệt
    if (cleanText.includes('tuan hoan') || cleanText.includes('phuong an') || cleanText.includes('ai-1') || cleanText.includes('advisor')) {
      return `
        <p><strong>🤖 AI-1: Circularity Advisor (Trợ lý gợi ý phương án tuần hoàn):</strong></p>
        <p>Công cụ này giúp bạn phân tích mức độ hỏng hóc của món đồ để đưa ra phương án tối ưu nhất giữa <em>Cho tặng</em>, <em>Sửa chữa</em> hoặc <em>Tái chế nguyên liệu</em> kèm lý giải minh bạch.</p>
        <p><button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('tabCircularity').click()">👉 Mở màn hình Circularity Advisor</button></p>
      `;
    }

    if (cleanText.includes('mo ta') || cleanText.includes('viet bai') || cleanText.includes('ai-2') || cleanText.includes('dang tin')) {
      return `
        <p><strong>✨ AI-2: Item Description AI (Sinh mô tả tin đăng tự động):</strong></p>
        <p>Chỉ cần nhập từ khóa thô (size, màu sắc, tình trạng...), AI sẽ tự động soạn thành bài đăng thanh lý hoặc cho tặng đầy đủ thông số và văn phong lịch sự.</p>
        <p><button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('tabDescription').click()">👉 Mở màn hình Item Description AI</button></p>
      `;
    }

    if (cleanText.includes('ghep noi') || cleanText.includes('nhu cau') || cleanText.includes('ai-3') || cleanText.includes('matcher')) {
      return `
        <p><strong>🎯 AI-3: Receiver Matcher (Đề xuất ghép nối nhu cầu):</strong></p>
        <p>Nhập nhu cầu của bạn (ví dụ đồ cho sinh viên, quạt điện, bàn ghế...), AI sẽ so khớp với kho đồ có sẵn, tính toán % tương thích và đưa món đồ phù hợp nhất lên đầu!</p>
        <p><button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('tabMatcher').click()">👉 Mở màn hình Receiver Matcher</button></p>
      `;
    }

    // 4 Chủ đề cơ bản ReUseHub
    const isBuy = ['mua', 'dat hang', 'gio hang', 'thanh toan', 'cach mua'].some(k => cleanText.includes(k));
    const isSell = ['dang ban', 'ban do', 'thanh ly', 'cach ban', 'cach dang ban'].some(k => cleanText.includes(k));
    const isOrder = ['theo doi', 'don hang', 'kiem tra don', 'van chuyen', 'ma don'].some(k => cleanText.includes(k));
    const isRepair = ['sua chua', 'sua do', 'tho sua', 'bi hong', 'bi hu'].some(k => cleanText.includes(k));

    if (isBuy && !isSell) {
      return `
        <p><strong>Hướng dẫn cách mua sản phẩm trên ReUseHub:</strong></p>
        <ol>
          <li><strong>Tìm kiếm món đồ:</strong> Nhập từ khóa vào ô tìm kiếm hoặc lọc danh mục tại <strong>Trang chủ</strong>.</li>
          <li><strong>Xem chi tiết:</strong> Nhấp vào sản phẩm để xem hình ảnh thực tế, tình trạng sử dụng và đánh giá người mua.</li>
          <li><strong>Đặt mua:</strong> Nhấn nút <strong>"Thêm vào giỏ hàng"</strong> hoặc <strong>"Mua ngay"</strong> để đến trang thanh toán.</li>
          <li><strong>Xác nhận:</strong> Điền thông tin giao nhận và hoàn tất đơn hàng.</li>
        </ol>
      `;
    }

    if (isSell) {
      return `
        <p><strong>Hướng dẫn cách đăng bán đồ cũ trên ReUseHub:</strong></p>
        <ol>
          <li><strong>Chuyển vai trò Người bán:</strong> Nhấn menu <strong>"Vai trò"</strong> ở góc trên bên phải &gt; chọn <strong>"🏪 Người bán"</strong>.</li>
          <li><strong>Tạo tin đăng:</strong> Nhập thông tin, tải ảnh thực tế món đồ và chọn mức giá thanh lý phù hợp.</li>
          <li><strong>Dùng AI hỗ trợ:</strong> Bạn có thể dùng tab <strong>✨ AI-2: Viết mô tả</strong> để tạo bài đăng nhanh và thu hút hơn!</li>
          <li><strong>Đăng bài:</strong> Bấm <strong>"Đăng bán ngay"</strong> để tiếp cận người mua.</li>
        </ol>
      `;
    }

    if (isOrder) {
      return `
        <p><strong>Hướng dẫn theo dõi trạng thái đơn hàng trên ReUseHub:</strong></p>
        <ol>
          <li><strong>Vào trang Đơn hàng:</strong> Nhấn liên kết <strong>"Theo dõi đơn hàng"</strong> hoặc vào trang <strong>"👤 Hồ sơ"</strong>.</li>
          <li><strong>Kiểm tra tiến độ:</strong> Xem chi tiết trạng thái đơn: <em>Chờ xác nhận</em>, <em>Đang giao hàng</em> hoặc <em>Đã giao thành công</em>.</li>
        </ol>
      `;
    }

    if (isRepair) {
      return `
        <p><strong>Hướng dẫn sử dụng Dịch vụ sửa chữa trên ReUseHub:</strong></p>
        <ol>
          <li><strong>Vào mục Sửa chữa:</strong> Chọn <strong>"🔧 Sửa chữa"</strong> trên thanh điều hướng.</li>
          <li><strong>Đăng bài sửa:</strong> Mô tả sự cố hỏng hóc của món đồ và nhận báo giá từ các thợ uy tín quanh khu vực.</li>
          <li><strong>Gợi ý:</strong> Bạn có thể dùng tab <strong>🤖 AI-1: Gợi ý Tuần hoàn</strong> để xem món đồ có nên sửa hay nên tái chế trước nhé!</li>
        </ol>
      `;
    }

    // Chào hỏi & cảm ơn
    if (['xin chao', 'chao ban', 'hello', 'hi'].some(k => cleanText.includes(k))) {
      return `
        <p>Xin chào bạn! 👋 Mình là trợ lý AI của <strong>ReUseHub</strong>.</p>
        <p>Hệ thống hiện tích hợp 3 mô hình AI hỗ trợ chuyên sâu:</p>
        <ul>
          <li>🤖 <strong>AI-1:</strong> Gợi ý phương án tuần hoàn (Cho tặng / Sửa chữa / Tái chế).</li>
          <li>✨ <strong>AI-2:</strong> Sinh mô tả tin đăng tự động từ từ khóa thô.</li>
          <li>🎯 <strong>AI-3:</strong> Đề xuất ghép nối nhu cầu người nhận với kho đồ sẵn có.</li>
        </ul>
        <p>Bạn có thể chọn các tab bên trên hoặc đặt câu hỏi vào ô bên dưới nhé!</p>
      `;
    }

    if (['cam on', 'thanks'].some(k => cleanText.includes(k))) {
      return `<p>Rất vui được hỗ trợ bạn! 🥰 Chúc bạn có những trải nghiệm tuyệt vời cùng ReUseHub! ♻️</p>`;
    }

    return `
      <p>Cảm ơn câu hỏi của bạn! Mình sẵn sàng hỗ trợ các vấn đề mua bán, đơn hàng, sửa chữa hoặc 3 công cụ AI tuần hoàn:</p>
      <ul>
        <li>🤖 <strong>AI-1:</strong> Gợi ý phương án tuần hoàn món đồ</li>
        <li>✨ <strong>AI-2:</strong> Soạn mô tả bài đăng bán/tặng</li>
        <li>🎯 <strong>AI-3:</strong> Ghép nối tìm kiếm món đồ phù hợp nhu cầu</li>
      </ul>
      <p>Bạn hãy nhập cụ thể hơn hoặc chọn một trong các nút gợi ý nhé!</p>
    `;
  }

  function appendUserChatMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotChatMessage(htmlContent) {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    row.innerHTML = `
      <div class="bot-avatar-small" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="10" width="22" height="18" rx="5" fill="#312e81"/>
          <ellipse cx="15" cy="19" rx="2.5" ry="3.5" fill="#a855f7"/>
          <ellipse cx="25" cy="19" rx="2.5" ry="3.5" fill="#a855f7"/>
        </svg>
      </div>
      <div class="message-bubble">${htmlContent}</div>
    `;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSendChatMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isBotReplying) return;

    appendUserChatMessage(trimmed);
    chatInput.value = '';
    isBotReplying = true;
    sendBtn.disabled = true;

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'message-row bot';
    typing.id = 'chatTyping';
    typing.innerHTML = `
      <div class="bot-avatar-small"><svg viewBox="0 0 40 40" fill="none"><rect x="9" y="10" width="22" height="18" rx="5" fill="#312e81"/></svg></div>
      <div class="message-bubble typing-bubble">
        <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const el = document.getElementById('chatTyping');
      if (el) el.remove();

      const reply = generateChatResponse(trimmed);
      appendBotChatMessage(reply);

      isBotReplying = false;
      sendBtn.disabled = false;
      chatInput.focus();
    }, 350);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSendChatMessage(chatInput.value);
    });
  }

  suggestionButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const q = this.getAttribute('data-question') || this.innerText.trim();
      handleSendChatMessage(q);
    });
  });

  // ============================================================================
  // 5. MÀN HÌNH 2: 🤖 AI-1: CIRCULARITY ADVISOR (GỢI Ý PHƯƠNG ÁN TUẦN HOÀN)
  // ============================================================================
  const formCircularity = document.getElementById('formCircularity');
  const circResult = document.getElementById('circResult');

  if (formCircularity) {
    formCircularity.addEventListener('submit', function (e) {
      e.preventDefault();

      const itemName = document.getElementById('circItemName').value.trim();
      const category = document.getElementById('circCategory').value;
      const damageRadio = document.querySelector('input[name="damageLevel"]:checked');
      const damageLevel = damageRadio ? damageRadio.value : 'good';
      const details = document.getElementById('circDetails').value.trim();

      if (!itemName) return;

      // Nút phân tích chuyển trạng thái đang xử lý
      const submitBtn = document.getElementById('btnAnalyzeCircularity');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ AI đang phân tích vòng đời món đồ...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-icon">🤖</span><span>Phân tích phương án tuần hoàn tối ưu</span>`;

        // Thuật toán phân tích phương án tối ưu
        let decisionType = '';
        let decisionHeading = '';
        let reasonHtml = '';
        let co2Saved = '12.5';
        let circularityScore = '95%';
        let resourceSaved = '88%';
        let actionBtnText = '';
        let actionBtnLink = '';

        if (damageLevel === 'good') {
          decisionType = '🎁 CHO TẶNG TRỰC TIẾP';
          decisionHeading = `Nên cho tặng trực tiếp hoặc thanh lý trao tay món "${itemName}"`;
          reasonHtml = `
            <p><strong>Lý do minh bạch từ AI:</strong></p>
            <ul>
              <li><strong>Giá trị sử dụng còn cao:</strong> Món đồ còn giữ được 90% - 98% công năng và thẩm mỹ, không cần can thiệp kỹ thuật sửa chữa.</li>
              <li><strong>Tối ưu năng lượng:</strong> Cho tặng trực tiếp người có hoàn cảnh khó khăn hoặc sinh viên là cách chuyển giao vòng đời ít phát thải nhất (không tốn chi phí vận chuyển tái chế hay linh kiện thay thế).</li>
              <li><strong>Thời gian giải phóng:</strong> Có thể tìm được người nhận trong vòng 24h - 48h trên cộng đồng ReUseHub.</li>
            </ul>
          `;
          co2Saved = '18.2 kg CO₂e';
          circularityScore = '98%';
          resourceSaved = '95%';
          actionBtnText = 'Tạo bài đăng Cho tặng (0đ) ngay';
          actionBtnLink = '#';
        } else if (damageLevel === 'light') {
          decisionType = '🔧 SỬA CHỮA QUA ĐỐI TÁC';
          decisionHeading = `Khuyến nghị sửa chữa qua đối tác ReUseHub cho "${itemName}"`;
          reasonHtml = `
            <p><strong>Lý do minh bạch từ AI:</strong></p>
            <ul>
              <li><strong>Khả năng phục hồi cao:</strong> Hư hỏng thuộc dạng nhẹ (đứt dây, kẹt nút, lỏng đinh ốc, thay phụ kiện nhỏ) với chi phí ước tính chỉ khoảng <strong>30.000đ - 90.000đ</strong>.</li>
              <li><strong>Hiệu quả kinh tế:</strong> Giá trị sử dụng sau sửa chữa tương đương 85% đồ mới, giúp tiết kiệm hơn 70% so với mua sản phẩm thay thế.</li>
              <li><strong>Đối tác có sẵn:</strong> Đội ngũ thợ sửa chữa ReUseHub có đầy đủ linh kiện thay thế chuẩn cho nhóm đồ ${category}.</li>
            </ul>
          `;
          co2Saved = '14.0 kg CO₂e';
          circularityScore = '88%';
          resourceSaved = '82%';
          actionBtnText = 'Kết nối thợ sửa chữa ReUseHub';
          actionBtnLink = 'repair.html';
        } else if (damageLevel === 'heavy') {
          decisionType = '🔧 SỬA CHỮA HOẶC TÁCH LINH KIỆN';
          decisionHeading = `Thẩm định sửa chữa hoặc tận dụng linh kiện "${itemName}"`;
          reasonHtml = `
            <p><strong>Lý do minh bạch từ AI:</strong></p>
            <ul>
              <li><strong>Đánh giá rủi ro:</strong> Món đồ bị hỏng chức năng chính. Chi phí sửa chữa có thể chiếm 40% - 60% giá trị món đồ.</li>
              <li><strong>Giải pháp linh hoạt:</strong> Khuyến nghị gửi thợ đối tác chẩn đoán miễn phí. Nếu chi phí vượt quá giới hạn, nên tháo tách các linh kiện còn tốt (khung vỏ, motor, adapter...) để làm phụ tùng thay thế tuần hoàn.</li>
            </ul>
          `;
          co2Saved = '8.5 kg CO₂e';
          circularityScore = '72%';
          resourceSaved = '65%';
          actionBtnText = 'Gửi thẩm định thợ sửa chữa';
          actionBtnLink = 'repair.html';
        } else {
          // broken
          decisionType = '♻️ THU GOM TÁI CHẾ NGUYÊN LIỆU';
          decisionHeading = `Chuyển về Điểm thu gom tái chế nguyên liệu cho "${itemName}"`;
          reasonHtml = `
            <p><strong>Lý do minh bạch từ AI:</strong></p>
            <ul>
              <li><strong>Không còn an toàn:</strong> Món đồ đã vỡ nát, cháy chập hoặc hư hại kết cấu nghiêm trọng (&lt; 40%), việc cố gắng sửa chữa không đảm bảo an toàn điện và an toàn chịu lực.</li>
              <li><strong>Phân tách nguyên liệu thô:</strong> Món đồ chứa các vật liệu tái chế giá trị cao (nhôm, đồng, nhựa ABS, thép, phôi gỗ). Chuyển về đơn vị thu gom giúp tránh thải rác ra bãi chôn lấp và tái sinh thành vật liệu mới.</li>
            </ul>
          `;
          co2Saved = '5.8 kg CO₂e';
          circularityScore = '60%';
          resourceSaved = '50%';
          actionBtnText = 'Đăng ký Điểm thu gom tái chế';
          actionBtnLink = '#';
        }

        // Render kết quả
        circResult.innerHTML = `
          <div class="circ-decision-card">
            <div class="circ-decision-header">
              <span class="circ-tag">${decisionType}</span>
              <span class="circ-score-badge">Chỉ số tuần hoàn: ${circularityScore}</span>
            </div>

            <h3 class="circ-heading">${decisionHeading}</h3>

            <div class="circ-reason-box">
              <h4>🔍 Phân tích minh bạch từ Circularity Advisor:</h4>
              ${reasonHtml}
              ${details ? `<p style="margin-top:8px; font-style:italic; color:#475569;">Ghi chú tình trạng bạn cung cấp: "${details}"</p>` : ''}
            </div>

            <div class="circ-meta-stats">
              <div class="meta-stat-item">
                <span class="stat-num">${co2Saved}</span>
                <span class="stat-label">Giảm phát thải môi trường</span>
              </div>
              <div class="meta-stat-item">
                <span class="stat-num">${resourceSaved}</span>
                <span class="stat-label">Tiết kiệm tài nguyên gốc</span>
              </div>
              <div class="meta-stat-item">
                <span class="stat-num">Tối ưu 100%</span>
                <span class="stat-label">Tuân thủ kinh tế tuần hoàn</span>
              </div>
            </div>

            <div class="circ-actions">
              <a href="${actionBtnLink}" class="btn btn-primary" onclick="if(this.getAttribute('href')==='#'){alert('Hệ thống đã ghi nhận yêu cầu của bạn!'); return false;}">
                <span>${actionBtnText}</span>
              </a>
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('tabDescription').click(); document.getElementById('descItemName').value='${itemName}';">
                <span>✨ Chuyển sang AI-2 Viết mô tả</span>
              </button>
            </div>
          </div>
        `;

        circResult.style.display = 'block';
        circResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    });
  }

  // ============================================================================
  // 6. MÀN HÌNH 3: ✨ AI-2: ITEM DESCRIPTION AI (SINH MÔ TẢ TIN ĐĂNG TỰ ĐỘNG)
  // ============================================================================
  const formDescription = document.getElementById('formDescription');
  const descResult = document.getElementById('descResult');
  const previewTitle = document.getElementById('previewTitle');
  const previewContent = document.getElementById('previewContent');
  const btnCopyDesc = document.getElementById('btnCopyDesc');
  const copyToast = document.getElementById('copyToast');

  // Thêm nhanh từ khóa
  document.querySelectorAll('.keyword-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      const kw = this.getAttribute('data-kw');
      const textarea = document.getElementById('descKeywords');
      if (textarea) {
        textarea.value = textarea.value ? `${textarea.value.trim()}, ${kw}` : kw;
        textarea.focus();
      }
    });
  });

  if (formDescription) {
    formDescription.addEventListener('submit', function (e) {
      e.preventDefault();

      const itemName = document.getElementById('descItemName').value.trim();
      const listingType = document.getElementById('descListingType').value;
      const rawKeywords = document.getElementById('descKeywords').value.trim();
      const tone = document.getElementById('descTone').value;
      const price = document.getElementById('descPrice').value.trim() || (listingType === 'giveaway' ? '0đ (Tặng miễn phí)' : 'Thương lượng');

      if (!itemName || !rawKeywords) return;

      const submitBtn = document.getElementById('btnGenerateDesc');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ AI đang viết bài đăng chuyên nghiệp...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-icon">✨</span><span>AI Sinh mô tả bài đăng chuyên nghiệp</span>`;

        // Tạo tiêu đề thu hút
        let generatedTitle = '';
        if (listingType === 'giveaway') {
          generatedTitle = `[CHO TẶNG 0Đ] ${itemName} - Còn dùng rất tốt, tặng bạn nào thực sự cần`;
        } else {
          generatedTitle = `[THANH LÝ] ${itemName} - Tình trạng đẹp, giá tốt (${price})`;
        }

        // Tạo nội dung mô tả dựa trên văn phong
        let fullDescription = '';

        if (tone === 'warm') {
          // Văn phong ấm áp
          fullDescription = 
`Chào mọi người trong cộng đồng ReUseHub! 👋

Mình có món đồ "${itemName}" muốn trao lại vòng đời mới cho bạn nào đang có nhu cầu sử dụng.

📌 THÔNG TIN CHI TIẾT MÓN ĐỒ:
• Tên sản phẩm: ${itemName}
• Chi tiết thực tế: ${rawKeywords}
• Tình trạng: Được giữ gìn cẩn thận, sạch sẽ và sẵn sàng sử dụng ngay.
• Chi phí: ${price}

🌱 LÝ DO TẶNG / CHUYỂN GIAO:
Món đồ này gắn bó với mình một thời gian, nay mình không còn dùng đến nên muốn gửi tặng/thanh lý giá rẻ để tránh lãng phí đồ dùng còn tốt. Rất mong món đồ sẽ hữu ích với bạn!

📍 HÌNH THỨC GIAO NHẬN:
• Bạn có thể qua xem trực tiếp để kiểm tra độ ưng ý, hoặc mình hỗ trợ gửi ship tiện lợi.
• Vui lòng nhắn tin trực tiếp qua ReUseHub để trao đổi nhé!

Cảm ơn mọi người đã cùng lan tỏa tinh thần sống xanh và tiêu dùng bền vững! ♻️
#ReUseHub #SongXanh #TuanHoan #ChoTang0d`;
        } else if (tone === 'concise') {
          // Văn phong ngắn gọn
          fullDescription = 
`[REUSEHUB] CẦN PASS: ${itemName}

1. THÔNG SỐ & ĐẶC ĐIỂM:
- Sản phẩm: ${itemName}
- Thông số kỹ thuật / Đặc điểm: ${rawKeywords}
- Tình trạng: Thực tế đúng 100% như mô tả, hoạt động ổn định.
- Giá: ${price}

2. GIAO HÀNG & LIÊN HỆ:
- Ưu tiên bạn nào nhắn sớm và chốt nhanh.
- Hỗ trợ ship COD toàn quốc hoặc kiểm tra trực tiếp.
- Inbox ReUseHub để lấy địa chỉ nhận hàng.`;
        } else {
          // Văn phong thân thiện chuẩn
          fullDescription = 
`Xin chào các thành viên ReUseHub! ✨

Mình cần thanh lý/chuyển nhượng món "${itemName}" với thông tin minh bạch như sau:

🔍 CHI TIẾT SẢN PHẨM:
- Tên đồ dùng: ${itemName}
- Đặc điểm chi tiết: ${rawKeywords}
- Hiện trạng: Hoạt động hoàn hảo, cam kết đúng mô tả và hình ảnh chụp thực tế.
- Mức giá hạt dẻ: ${price}

💡 ƯU ĐIỂM NỔI BẬT:
Món đồ còn độ mới cao, bền đẹp, rất phù hợp cho các bạn sinh viên hoặc gia đình muốn tiết kiệm chi phí mà vẫn sở hữu đồ chất lượng tốt.

📦 GIAO NHẬN:
- Hỗ trợ xem đồ trực tiếp hoặc đóng gói cẩn thận gửi ship nhanh.
- Mọi người quan tâm cứ nhắn tin trực tiếp cho mình qua hệ thống nhé!

Chúc mọi người mua sắm vui vẻ cùng ReUseHub! 💚
#ReUseHub #ThanhLyDoCu #DoCuGiaTot #TietKiem`;
        }

        previewTitle.textContent = generatedTitle;
        previewContent.value = fullDescription;
        descResult.style.display = 'block';
        descResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 380);
    });
  }

  // Nút sao chép mô tả
  if (btnCopyDesc && previewContent) {
    btnCopyDesc.addEventListener('click', function () {
      const textToCopy = `${previewTitle.textContent}\n\n${previewContent.value}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showCopyToast);
      } else {
        previewContent.select();
        document.execCommand('copy');
        showCopyToast();
      }
    });
  }

  function showCopyToast() {
    if (copyToast) {
      copyToast.style.display = 'block';
      setTimeout(() => { copyToast.style.display = 'none'; }, 2800);
    }
  }

  // ============================================================================
  // 7. MÀN HÌNH 4: 🎯 AI-3: RECEIVER MATCHER (ĐỀ XUẤT GHÉP NỐI NHU CẦU)
  // ============================================================================
  // Kho dữ liệu các món đồ sẵn có trên ReUseHub
  const availableItems = [
    {
      id: 1,
      title: 'Bàn học gỗ tự nhiên gấp gọn',
      category: 'Nội thất',
      price: '450.000đ',
      condition: 'Mới 92%',
      location: 'Quận 1, TP.HCM',
      keywords: ['ban', 'ban hoc', 'ban go', 'noi that', 'sinh vien', 'gap gon', 'go'],
      desc: 'Bàn gỗ chắc chắn, gấp gọn tiện lợi phòng trọ sinh viên.'
    },
    {
      id: 2,
      title: 'Quạt cây lửng Senko tiết kiệm điện',
      category: 'Điện gia dụng',
      price: '135.000đ',
      condition: 'Mới 88%',
      location: 'Bình Thạnh, TP.HCM',
      keywords: ['quat', 'quat dien', 'senko', 'gia dung', 'dien gia dung', 'quat cay', 'mat'],
      desc: 'Quạt chạy êm ru, 3 cấp độ gió, mô tơ dây đồng bền bỉ.'
    },
    {
      id: 3,
      title: 'Nồi cơm điện Sharp 1.8L nắp gài',
      category: 'Điện gia dụng',
      price: '190.000đ',
      condition: 'Mới 85%',
      location: 'Thủ Đức, TP.HCM',
      keywords: ['noi com', 'noi com dien', 'sharp', 'nau com', 'gia dung', 'bep'],
      desc: 'Lòng nồi chống dính còn tốt, nấu cơm dẻo và giữ ấm tốt.'
    },
    {
      id: 4,
      title: 'Áo khoác dạ nữ dáng dài ấm áp',
      category: 'Thời trang',
      price: '0đ (Cho tặng)',
      condition: 'Mới 95%',
      location: 'Quận 3, TP.HCM',
      keywords: ['ao', 'ao khoac', 'ao da', 'mua dong', 'ao am', 'thoi trang', 'cho tang', '0d', 'mien phi'],
      desc: 'Áo dạ 2 lớp dày dặn, màu be sang trọng, tặng bạn nào cần đồ ấm.'
    },
    {
      id: 5,
      title: 'Ghế xoay văn phòng lưng lưới',
      category: 'Nội thất',
      price: '170.000đ',
      condition: 'Mới 86%',
      location: 'Quận 10, TP.HCM',
      keywords: ['ghe', 'ghe xoay', 'van phong', 'ghe luoi', 'hoc tap', 'lam viec', 'noi that'],
      desc: 'Piston nâng hạ êm ái, lưng lưới thoáng mát ngồi lâu không mỏi.'
    },
    {
      id: 6,
      title: 'Kệ sách mini 3 tầng để bàn gỗ thông',
      category: 'Nội thất',
      price: '0đ (Cho tặng)',
      condition: 'Mới 90%',
      location: 'Tân Bình, TP.HCM',
      keywords: ['ke sach', 'ke go', 'sach', 'hoc tap', 'cho tang', '0d', 'sinh vien', 'noi that'],
      desc: 'Gỗ thông tự nhiên nhẹ bền, để vừa 30 quyển sách và tài liệu học tập.'
    },
    {
      id: 7,
      title: 'Bàn ủi khô Philips gọn nhẹ',
      category: 'Điện gia dụng',
      price: '85.000đ',
      condition: 'Mới 82%',
      location: 'Quận 5, TP.HCM',
      keywords: ['ban ui', 'ban la', 'philips', 'gia dung', 'quan ao'],
      desc: 'Nóng nhanh, mặt đế chống dính tốt, ủi đồ phẳng phiu nhanh chóng.'
    },
    {
      id: 8,
      title: 'Bộ giáo trình đại học & Sách Lập trình',
      category: 'Sách vở',
      price: '0đ (Cho tặng)',
      condition: 'Mới 96%',
      location: 'Thủ Đức, TP.HCM',
      keywords: ['sach', 'giao trinh', 'lap trinh', 'cntt', 'sinh vien', 'cho tang', '0d'],
      desc: 'Sách nhập môn C++, Python và Giải thuật cấu trúc dữ liệu.'
    }
  ];

  const formMatcher = document.getElementById('formMatcher');
  const matcherQueryInput = document.getElementById('matcherQuery');
  const matcherGrid = document.getElementById('matcherGrid');
  const matcherCount = document.getElementById('matcherCount');

  // Thuật toán chấm điểm % Tương thích
  function evaluateCompatibility(query, item) {
    const cleanQ = removeVietnameseTones(query);
    const queryTokens = cleanQ.split(/\s+/).filter(t => t.length > 1);

    if (queryTokens.length === 0) return { score: 70, reason: 'Món đồ có sẵn trong danh mục phổ biến' };

    let matchCount = 0;
    let matchedKeywords = [];

    // Kiểm tra từng từ khóa
    queryTokens.forEach(token => {
      const matchInTitle = removeVietnameseTones(item.title).includes(token);
      const matchInCat = removeVietnameseTones(item.category).includes(token);
      const matchInDesc = removeVietnameseTones(item.desc).includes(token);
      const matchInKeywords = item.keywords.some(k => removeVietnameseTones(k).includes(token));

      if (matchInTitle || matchInKeywords) {
        matchCount += 2;
        matchedKeywords.push(token);
      } else if (matchInCat || matchInDesc) {
        matchCount += 1;
        matchedKeywords.push(token);
      }
    });

    // Chấm điểm cơ bản
    let percentage = Math.min(99, Math.max(50, Math.round((matchCount / (queryTokens.length * 2)) * 100)));

    // Tăng điểm nếu là đồ tặng 0đ khi người dùng tìm đồ miễn phí
    if (cleanQ.includes('0d') || cleanQ.includes('tang') || cleanQ.includes('mien phi')) {
      if (item.price.includes('0đ')) percentage = Math.min(99, percentage + 20);
    }

    // Tăng điểm nếu tìm đồ sinh viên
    if (cleanQ.includes('sinh vien')) {
      if (item.keywords.includes('sinh vien')) percentage = Math.min(99, percentage + 15);
    }

    // Tạo lý do giải thích minh bạch
    let reason = '';
    if (percentage >= 90) {
      reason = `🔥 Khớp cực cao: Món đồ đáp ứng chính xác từ khóa "${matchedKeywords.slice(0, 2).join(', ')}" với mức giá và khu vực rất tối ưu.`;
    } else if (percentage >= 75) {
      reason = `⚡ Khớp tốt: Phù hợp với danh mục ${item.category} và mục đích sử dụng bạn đang cần tìm.`;
    } else {
      reason = `👍 Khớp một phần: Cùng nhóm đồ dùng sinh hoạt có độ bền tốt.`;
    }

    return { score: percentage, reason };
  }

  function renderMatchedItems(query) {
    if (!matcherGrid) return;

    // Tính điểm và sắp xếp giảm dần (Đưa món phù hợp nhất lên đầu)
    const evaluatedList = availableItems.map(item => {
      const evalResult = evaluateCompatibility(query, item);
      return {
        ...item,
        score: evalResult.score,
        reason: evalResult.reason
      };
    });

    // Sắp xếp: % tương thích cao nhất lên trước
    evaluatedList.sort((a, b) => b.score - a.score);

    // Render HTML các card
    matcherGrid.innerHTML = '';
    evaluatedList.forEach(item => {
      let badgeClass = 'compat-normal';
      if (item.score >= 88) badgeClass = 'compat-high';
      else if (item.score >= 75) badgeClass = 'compat-medium';

      const isFree = item.price.includes('0đ');

      const card = document.createElement('div');
      card.className = 'matched-item-card';
      card.innerHTML = `
        <div class="matcher-compat-badge ${badgeClass}">
          ${item.score}% Phù hợp
        </div>

        <div class="matched-item-header">
          <span class="matched-category">${item.category}</span>
          <h3 class="matched-title">${item.title}</h3>
          <div class="matched-price ${isFree ? 'price-free' : ''}">${item.price}</div>
        </div>

        <div class="matched-item-body">
          <p style="font-size:13px; color:#475569; line-height:1.45;">${item.desc}</p>
          
          <div class="ai-match-reason">
            <strong>🎯 AI Đề xuất:</strong> ${item.reason}
          </div>

          <div class="matched-meta">
            <span>⭐ Tình trạng: ${item.condition}</span>
            <span>📍 ${item.location}</span>
          </div>
        </div>

        <div class="matched-actions">
          <button type="button" class="btn btn-primary btn-sm" onclick="alert('Đã gửi yêu cầu ghép nối món đồ: ${item.title}. Người đăng sẽ liên hệ bạn sớm nhất!')">
            <span>${isFree ? '🎁 Đăng ký nhận ngay' : '🛍️ Đặt mua ngay'}</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Đã lưu món đồ vào danh sách quan tâm!')">
            <span>Lưu</span>
          </button>
        </div>
      `;
      matcherGrid.appendChild(card);
    });

    if (matcherCount) {
      matcherCount.textContent = `Tìm thấy ${evaluatedList.length} món đồ sẵn có phù hợp`;
    }
  }

  if (formMatcher && matcherQueryInput) {
    formMatcher.addEventListener('submit', function (e) {
      e.preventDefault();
      const q = matcherQueryInput.value.trim();
      if (!q) return;

      const submitBtn = document.getElementById('btnMatch');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ AI đang so khớp nhu cầu...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-icon">🎯</span><span>Ghép nối ngay</span>`;
        renderMatchedItems(q);
      }, 300);
    });
  }

  // Bấm các thẻ nhu cầu phổ biến
  document.querySelectorAll('.preset-tag').forEach(tag => {
    tag.addEventListener('click', function () {
      const q = this.getAttribute('data-query');
      if (matcherQueryInput) {
        matcherQueryInput.value = q;
        renderMatchedItems(q);
      }
    });
  });

  // Tải danh sách mặc định cho Matcher khi khởi tạo
  renderMatchedItems('bàn học sinh viên đồ dùng gia dụng giá rẻ');
});
