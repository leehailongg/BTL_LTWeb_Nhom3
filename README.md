# BTL_LTWeb_Nhom3
# ReUseHub – Tái sử dụng, cho tặng và sửa chữa đồ dùng

## 1. Giới thiệu dự án

**ReUseHub** là sản phẩm web frontend thuộc lĩnh vực **Kinh tế tuần hoàn (Circular Economy)**. Dự án hướng đến việc giúp người dùng quyết định nên cho tặng, sửa chữa hay tái sử dụng đồ dùng còn giá trị, đồng thời kết nối người có đồ với người nhận và các điểm sửa chữa/tái sử dụng.

Dự án được thực hiện trong học phần **Phát triển ứng dụng Web cơ bản – CSE122**, theo hình thức sản phẩm frontend nguyên mẫu có nhiều vai trò, các luồng nghiệp vụ, thao tác CRUD, responsive, tương tác JavaScript và trải nghiệm AI có thể mô phỏng ở phía frontend.

## 2. Bối cảnh và vấn đề

Nhiều đồ dùng bị bỏ đi dù vẫn có thể sửa chữa hoặc tái sử dụng. Người dùng có thể gặp khó khăn khi lựa chọn cách xử lý phù hợp; tin đăng đồ cũ có thể thiếu thông tin; các đơn vị tái sử dụng khó tiếp cận nguồn đồ; và việc đo lường tác động giảm rác còn khó khăn.

ReUseHub tập trung vào bốn vấn đề:
- **P1:** Khó chọn phương án xử lý đồ.
- **P2:** Tin đăng đồ cũ thiếu thông tin.
- **P3:** Đơn vị tái sử dụng khó tiếp cận nguồn.
- **P4:** Khó đo tác động giảm rác.

## 3. Mục tiêu

- Xây dựng hành trình người dùng rõ ràng cho một sản phẩm frontend.
- Thiết kế đủ màn hình cho từng vai trò theo nghiệp vụ thực tế.
- Mô phỏng CRUD và trạng thái nghiệp vụ có ý nghĩa.
- Sử dụng JavaScript/DOM cho tìm kiếm, lọc, kiểm tra biểu mẫu, popup, thẻ, trạng thái và hiển thị dữ liệu.
- Sử dụng dữ liệu JSON giả lập, LocalStorage, SessionStorage, MockAPI hoặc API công khai khi phù hợp.
- Xây dựng ít nhất **3 trải nghiệm AI** có thể mô phỏng ở frontend.
- Tổ chức công việc nhóm bằng Trello/Jira/Notion và quản lý mã nguồn bằng Git/GitHub, nhánh và pull request.

## 4. Các vai trò người dùng

| Vai trò | Trách nhiệm chính |
|---|---|
| Người có đồ | Đăng món đồ và chọn phương án xử lý |
| Người nhận | Tìm đồ và gửi yêu cầu nhận |
| Điểm sửa chữa/tái sử dụng | Quản lý dịch vụ và tiếp nhận đồ |
| Quản trị viên | Quản lý danh mục và kiểm duyệt tin đăng |

Ngoài các màn hình theo vai trò, nhóm cần xem xét các màn hình dùng chung khi cần, chẳng hạn trang chủ, đăng nhập, đăng ký, quên mật khẩu, hồ sơ, cài đặt, thông báo và trang lỗi 403/404.

## 5. Danh sách giao diện nền tảng

Danh sách dưới đây là **điểm khởi đầu để lập bảng kiểm kê màn hình**, không phải giới hạn tổng số màn hình. Nhóm phải bổ sung những màn hình cần thiết để hoàn thành đầy đủ các luồng nghiệp vụ đã được duyệt.

### 5.1. Người có đồ

| Tệp HTML | Giao diện | Nghiệp vụ chính |
|---|---|---|
| `owner-item-create.html` | Item Create | Đăng món đồ và chọn phương án |
| `owner-my-items.html` | My Items | Xem và quản lý các món đồ đã đăng |
| `owner-reuse-options.html` | Reuse Options | Tạo, xem, sửa hoặc xóa/chuyển trạng thái phương án tái sử dụng |

### 5.2. Người nhận

| Tệp HTML | Giao diện | Nghiệp vụ chính |
|---|---|---|
| `receiver-item-browse.html` | Item Browse | Duyệt, tìm kiếm và lọc đồ |
| `receiver-item-detail.html` | Item Detail | Xem chi tiết món đồ và gửi yêu cầu |
| `receiver-my-requests.html` | My Requests | Theo dõi và quản lý yêu cầu nhận đồ |

### 5.3. Điểm sửa chữa/tái sử dụng

| Tệp HTML | Giao diện | Nghiệp vụ chính |
|---|---|---|
| `partner-service-management.html` | Service Management | Quản lý dịch vụ |
| `partner-intake-list.html` | Intake List | Tiếp nhận và xử lý các yêu cầu/đồ dùng |
| `partner-impact-dashboard.html` | Impact Dashboard | Theo dõi và trình bày dữ liệu tác động |

### 5.4. Quản trị viên

| Tệp HTML | Giao diện | Nghiệp vụ chính |
|---|---|---|
| `admin-category-management.html` | Category Management | Quản lý danh mục |
| `admin-listing-moderation.html` | Listing Moderation | Kiểm duyệt tin đăng |
| `admin-circularity-report.html` | Circularity Report | Theo dõi và báo cáo dữ liệu kinh tế tuần hoàn |

**Lưu ý:** Không được coi 12 giao diện nền tảng trên là số lượng cuối cùng. Số màn hình thực tế phải căn cứ vào bảng kiểm kê màn hình và luồng người dùng đã được giảng viên duyệt. Ưu tiên độ đầy đủ của nghiệp vụ, không tạo trang vô nghĩa chỉ để tăng số lượng.

## 6. Yêu cầu chức năng và kỹ thuật

### 6.1. Điều hướng và responsive
- Các trang phải được liên kết với nhau nhất quán theo vai trò và luồng nghiệp vụ.
- Giao diện cần hoạt động phù hợp trên desktop, tablet và thiết bị di động.
- Đầu trang, điều hướng và các thành phần dùng chung cần nhất quán trong toàn dự án.

### 6.2. JavaScript và CRUD
- Có các tương tác thực chất như tìm kiếm, lọc, biểu mẫu, popup, thay đổi trạng thái và kết xuất dữ liệu.
- Biểu mẫu phải có kiểm tra dữ liệu hợp lệ.
- CRUD gồm: **Create** (tạo), **Read** (đọc), **Update** (sửa), **Delete** (xóa). Với dữ liệu nghiệp vụ, có thể dùng hủy, lưu trữ, vô hiệu hóa hoặc đóng thay cho xóa khi phù hợp.
- Các thực thể dữ liệu tối thiểu gồm `items`, `requests`, `partners`, `services`, `transfers` và `categories`.

### 6.3. Dữ liệu
Có thể sử dụng:
- File JSON cục bộ.
- LocalStorage hoặc SessionStorage.
- JSON Server hoặc MockAPI.
- API công khai.
- LLM API nếu nhóm có khả năng triển khai.

Dự án không bắt buộc phải có máy chủ thật. Dữ liệu giả lập nên được tổ chức tập trung, tránh viết cứng rải rác trong các trang.

### 6.4. Trạng thái giao diện
Mỗi chức năng quan trọng cần xem xét các trạng thái phù hợp: bình thường, đang tải, rỗng, thành công, lỗi, vô hiệu hóa, đang chờ, bị từ chối, hoàn thành và đã hủy/lưu trữ nếu nghiệp vụ có sử dụng. Không phải trang nào cũng cần tất cả trạng thái; nhóm cần triển khai các trạng thái phù hợp với chức năng.

## 7. Các tính năng AI bắt buộc

AI có thể được mô phỏng bằng dữ liệu JSON, quy tắc JavaScript, phản hồi định sẵn hoặc kết nối API LLM nếu nhóm đủ khả năng. AI không được chỉ là một khung chat trang trí; kết quả cần hỗ trợ quyết định hoặc tác động đến luồng nghiệp vụ.

### AI-1. Circularity Advisor
Gợi ý phương án **tái sử dụng, sửa chữa hoặc tái chế** dựa trên thông tin món đồ.

### AI-2. Item Description AI
Tạo mô tả tin đăng từ từ khóa hoặc hình ảnh mô phỏng.

### AI-3. Receiver Matcher
Gợi ý ghép món đồ với người nhận hoặc đối tác phù hợp.

### Luồng trải nghiệm bắt buộc cho mỗi tính năng AI
1. Người dùng nhập dữ liệu.
2. Kiểm tra tính hợp lệ.
3. Hiển thị trạng thái đang xử lý.
4. Trình bày kết quả.
5. Giải thích lý do hoặc cơ sở của kết quả.
6. Cho phép người dùng chấp nhận, sửa, từ chối, tạo lại hoặc lưu kết quả theo nghiệp vụ.
7. Lưu kết quả vào trạng thái ứng dụng khi người dùng lựa chọn.

Mỗi tính năng AI quan trọng cần có tình huống thất bại hoặc không chắc chắn, chẳng hạn thiếu dữ liệu hoặc không thể xử lý yêu cầu. Cần cung cấp lựa chọn phù hợp như chỉnh sửa, thử lại, bỏ qua, báo cáo hoặc xử lý thủ công.

## 8. Quy trình thiết kế và triển khai

Trước khi code chính thức, nhóm cần chuẩn bị và được duyệt:
- Sơ đồ trang.
- Luồng người dùng.
- Bảng kiểm kê màn hình đầy đủ.
- Wireframe/khung dây.
- Bản thiết kế desktop.
- Thiết kế responsive chính.
- Hướng dẫn thành phần giao diện tối thiểu.
- Các trạng thái đang tải, rỗng và lỗi.
- Bản mô phỏng tương tác AI.

Bảng kiểm kê màn hình cần có các cột:

| Vai trò | Mục tiêu người dùng | Nhiệm vụ người dùng | Màn hình | Tệp | CRUD/Trạng thái | AI | Người phụ trách |
|---|---|---|---|---|---|---|---|

Mỗi màn hình chỉ được xem là hoàn thành khi các hạng mục phù hợp đã được thực hiện: thiết kế Figma/Canva, HTML ngữ nghĩa, CSS, responsive, JavaScript, kiểm tra hợp lệ nếu có biểu mẫu, dữ liệu giả lập/API nếu cần, trạng thái rỗng/lỗi/đang tải khi phù hợp, khả năng tiếp cận cơ bản, pull request được duyệt, merge vào `dev`, video OBS và cập nhật README/bảng kiểm kê.

## 9. Phân công nhóm

Dự án được định hướng cho nhóm 3 sinh viên:

- **SV1:** Phụ trách chính vai trò Người có đồ; đồng phụ trách một phần giao diện dùng chung; chịu trách nhiệm responsive và kiểm tra giao diện phần mình.
- **SV2:** Phụ trách chính vai trò Người nhận; đồng phụ trách JavaScript/dữ liệu giả lập; đánh giá pull request của SV1 hoặc SV3.
- **SV3:** Phụ trách chính Điểm sửa chữa/tái sử dụng và Quản trị viên; chịu trách nhiệm tích hợp bố cục, điều hướng, dashboard/quản trị và phát hành; đánh giá tính nhất quán toàn dự án.

Nhóm có thể điều chỉnh phân công, nhưng **mỗi thành viên phải tự hoàn thành ít nhất một luồng end-to-end**, bao gồm thiết kế, HTML, CSS, JavaScript, dữ liệu, responsive, Git, ghi nhận thay đổi, pull request và video OBS. Không phân công một người chỉ làm tài liệu/Figma, một người chỉ HTML và một người chỉ JavaScript.

Mỗi thành viên cũng cần có ít nhất một trách nhiệm xuyên suốt, chẳng hạn hệ thống thiết kế/điều hướng/khả năng tiếp cận; JavaScript/dữ liệu/AI; hoặc responsive/tích hợp/phát hành/đảm bảo chất lượng.

## 10. Quản lý mã nguồn bằng Git/GitHub

Tên repository gợi ý: `cse122-reusehub-teamXX`

### Nhánh
- `main`
- `dev`
- `feature/<feature-name>`
- `fix/<bug-name>`
- `docs/<document-name>`

Ví dụ:
- `feature/owner-item-create`
- `feature/receiver-item-browse`
- `feature/partner-service-management`

### Quy trình làm việc
1. Tạo và theo dõi công việc trên Trello/Jira/Notion.
2. Tạo nhánh phù hợp.
3. Viết mã và kiểm thử.
4. Commit với nội dung mô tả rõ thay đổi.
5. Push nhánh lên GitHub.
6. Tạo pull request.
7. Thành viên khác review.
8. Merge vào `dev`.
9. Kiểm thử tích hợp.
10. Merge vào `main` khi sẵn sàng.

Dùng commit có ý nghĩa, ví dụ:
- `feat: add responsive dashboard layout`
- `feat: render data from mock json`
- `feat: add ai recommendation state`
- `fix: validate empty form inputs`
- `style: improve mobile navigation`
- `refactor: split reusable ui modules`
- `docs: update screen list and obs links`

Tránh các commit không mô tả nội dung như `update`, `done`, `final` hoặc `fix code`. Lịch sử phát triển cần thể hiện mối liên hệ giữa công việc, nhánh, commit, pull request, đánh giá, màn hình và video OBS.

## 11. Theo dõi công việc

Có thể sử dụng Trello, Jira hoặc Notion với các cột:
**Tồn đọng → Cần làm → Đang làm → Chờ duyệt → Hoàn thành**

Mỗi task cần có:
- Mã công việc.
- Giao diện/tệp liên quan.
- Người thực hiện.
- Hạn hoàn thành.
- Nhánh Git.
- Liên kết pull request/commit.
- Liên kết video OBS sau khi hoàn thành.

Các nhóm công việc nên bao gồm thiết kế, HTML ngữ nghĩa, CSS responsive, JavaScript, tích hợp dữ liệu, nguyên mẫu AI, kiểm thử đa trình duyệt/di động và hoàn thiện minh chứng.

## 12. Video OBS – Minh chứng bắt buộc

**Mỗi giao diện thực tế đã được duyệt trong bảng kiểm kê màn hình cuối cùng phải có một video OBS riêng.** Số video được tính theo số giao diện độc lập đã duyệt, không mặc định là 12.

Mỗi video phải:
1. Có mặt sinh viên thực hiện.
2. Hiển thị bản thiết kế Figma/Canva.
3. Mở đúng tệp HTML/CSS/JS.
4. Giải thích bố cục và logic.
5. Thực hiện ít nhất một chỉnh sửa trực tiếp.
6. Chạy thử tương tác.
7. Ghi nhận thay đổi (commit) lên GitHub.
8. Nêu rõ mã công việc, nhánh và commit.

Tên video gợi ý:
- `SV1-01-screen-name.mp4`
- `SV1-02-screen-name.mp4`
- `SV2-01-screen-name.mp4`
- `SV3-01-screen-name.mp4`

## 13. Cấu trúc repository tham khảo

```text
project-root/
├── README.md
├── docs/
│   ├── project-proposal.md
│   ├── roles-and-features.md
│   ├── screen-list.md
│   ├── team-assignment.md
│   └── ai-usage-report.md
├── design/
│   ├── figma-link.txt
│   └── mockups/
├── pages/
├── assets/
│   ├── images/
│   ├── icons/
│   └── data/
├── css/
│   ├── style.css
│   └── responsive.css
└── js/
    ├── main.js
    ├── api.js
    └── modules/
```

Đây là cấu trúc gợi ý; nhóm có thể điều chỉnh miễn sao mã nguồn rõ ràng, dễ bảo trì và các trang được liên kết nhất quán.

## 14. Báo cáo sử dụng AI

Tạo `docs/ai-usage-report.md` để khai báo:
- Công cụ AI đã sử dụng.
- Các prompt chính.
- Phần nội dung/mã do AI tạo.
- Phần sinh viên đã chỉnh sửa.
- Lỗi AI gặp phải.
- Cách sinh viên kiểm chứng kết quả.
- Điều sinh viên học được.
- Tính năng nào chỉ mô phỏng và tính năng nào gọi API thật.

## 15. Phạm vi MVP và mức độ ưu tiên

### Bắt buộc phải có
- Đầy đủ vai trò và các màn hình cần thiết theo bảng kiểm kê đã duyệt.
- Điều hướng xuyên suốt.
- Responsive.
- CRUD mô phỏng có ý nghĩa.
- Tìm kiếm, lọc và kiểm tra hợp lệ biểu mẫu.
- Dữ liệu giả lập hoặc API.
- Ít nhất 3 tính năng AI.
- Minh chứng quá trình làm việc trên Trello/Jira/Notion.
- Lịch sử Git, nhánh và pull request.
- Video OBS cho từng giao diện đã duyệt.

### Nên có
- Biểu đồ/dashboard.
- Thông báo nổi.
- Trạng thái rỗng, đang tải và lỗi.
- Thành phần giao diện và design token có thể tái sử dụng.
- Chế độ sáng/tối hoặc cải thiện khả năng tiếp cận nếu phù hợp.

### Có thì tốt
- Tích hợp LLM API thật.
- Hoạt ảnh/tương tác vi mô.
- PWA/bộ đệm cục bộ.
- Cá nhân hóa chủ đề.
- Biểu đồ/bản đồ nâng cao.

## 16. Tiêu chí hoàn thành

Dự án cần chứng minh được chuỗi liên kết:

**Ngữ cảnh → Vấn đề → Mục tiêu → Vai trò → Màn hình → Bản thiết kế → Công việc → Nhánh → Commit → Pull request → OBS → Sản phẩm.**

Chỉ đạt số lượng giao diện tối thiểu không đồng nghĩa với hoàn thành tốt. Tiêu chí quan trọng hơn là nghiệp vụ được mô phỏng đầy đủ, mỗi màn hình có chức năng và trạng thái phù hợp, các vai trò liên kết được với nhau, và quá trình phát triển có minh chứng.

## 17. Kết quả học tập mong đợi

Sau dự án, sinh viên cần thể hiện khả năng:
- Phân tích một vấn đề thực tế.
- Chia hệ thống thành vai trò, nhiệm vụ, luồng và màn hình.
- Thiết kế UI/UX bằng Figma/Canva.
- Viết HTML ngữ nghĩa.
- Sử dụng CSS/Bootstrap và responsive.
- Lập trình DOM, sự kiện và biểu mẫu bằng JavaScript.
- Làm việc với JSON/API.
- Mô phỏng trải nghiệm AI có ý nghĩa.
- Làm việc nhóm bằng Git/GitHub và review mã.
- Theo dõi công việc và giải thích sản phẩm qua video OBS.

---

## Trạng thái triển khai

README này mô tả yêu cầu và kế hoạch theo tài liệu đề bài. Nhóm cần cập nhật các thông tin thực tế sau khi triển khai:
- Danh sách màn hình cuối cùng đã được duyệt.
- Tên và phân công thành viên.
- Link Figma/Canva.
- Link Trello/Jira/Notion.
- Link repository và pull request.
- Link video OBS.
- Trạng thái hoàn thành thực tế của từng chức năng.
