# Điện Máy Nhà Vui

Bản giao diện được tách từ `Dien_May_Nha_Vui_Website_UXUI_V2_40_Tuyen.zip`. Giữ màu đỏ, bố cục và các màn hình của mẫu đã chọn; tổ chức lại thành HTML, CSS và JavaScript thuần để dễ học và sửa.

## Mở website

Trong VS Code, mở thư mục này, chọn `index.html` rồi chạy **Open with Live Server** nếu đã có tiện ích Live Server.

Nếu dùng WampServer đang có trên máy:

1. Sao chép thư mục dự án vào thư mục `www` của WAMP, đặt tên `NhaVui`.
2. Bật WAMP và chờ dịch vụ Apache hoạt động.
3. Mở `http://localhost/NhaVui/`.

Chạy qua HTTP để các trang dùng chung giỏ hàng và dữ liệu thử. Mở bằng cách nhấp đúp file HTML có thể hiển thị giao diện, nhưng trình duyệt có thể tách dữ liệu lưu giữa các file.

## Cấu trúc

```text
NhaVui/
├── css/                 CSS theo vùng giao diện
├── images/
│   ├── brand/           Chữ tên thương hiệu minh họa
│   ├── logo/
│   ├── products/        17 hình sản phẩm lấy từ mẫu gốc
│   ├── banner 1.svg
│   ├── banner 2.svg
│   ├── banner 3.svg
│   ├── right 1.svg
│   └── right 2.svg
├── js/                  JavaScript theo chức năng
├── pages/
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── product.html
│   ├── register.html
│   └── ...              Danh mục, tài khoản, hỗ trợ, quản trị
├── docs/                Hướng dẫn, kết quả kiểm tra và bản gốc
├── tests/
│   └── verify.cjs
└── index.html
```

Các file CSS/JS bạn yêu cầu đều đã có. Bổ sung `ui.js`, `account.js`, `support.js`, `admin.js` và `admin.css` để giữ các màn hình còn lại của mẫu, tránh gom chúng vào `app.js`. Hình dùng SVG có sẵn trong mẫu thay vì đổi đuôi thành JPG.

## Đọc từ đâu

Đọc [hướng dẫn từng file](docs/HUONG_DAN.md), rồi mở lần lượt `index.html`, `css/style.css`, `js/product.js` và `js/cart.js`. Trang chủ, chi tiết, giỏ hàng, thanh toán, đăng nhập và đăng ký có bố cục HTML trong chính file trang. Các màn hình bổ sung được dựng từ file JS chức năng tương ứng.

Bản gốc trước khi chỉnh được giữ trong `docs/ban-goc-truoc-khi-tach.zip`. File ZIP bạn cung cấp ban đầu không bị sửa.

## Mức hoàn thành

Đã có giao diện và tương tác thử: banner, tìm kiếm, bộ lọc, yêu thích, so sánh, giỏ hàng, voucher, đặt đơn, tra cứu đơn, tài khoản, liên hệ và quản trị mẫu. [Kết quả kiểm tra](docs/KIEM_TRA.md) ghi rõ phần đã chạy thử.

Dữ liệu vẫn lưu bằng `localStorage`. Chưa có backend PHP/MySQL, đăng nhập bảo mật, phân quyền thật, thanh toán, gửi email hoặc đồng bộ tồn kho. Đơn tạo ở đây không xuất hiện trong phpMyAdmin. Khi thử biểu mẫu, dùng thông tin và mật khẩu giả.

Khi đã quen với giao diện, bước tiếp theo là nối riêng danh sách sản phẩm với MySQL, kiểm tra xong rồi mới làm giỏ hàng và đặt đơn. Lộ trình nằm ở cuối hướng dẫn.
