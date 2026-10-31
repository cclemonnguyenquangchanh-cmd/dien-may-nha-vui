# Kết quả kiểm tra ngày 31/10/2026

## Kiểm tra mã nguồn

| Hạng mục | Kết quả |
| --- | --- |
| Cú pháp của 15 file JavaScript | Đạt với `node --check` |
| 31 đích điều hướng chính | Có file HTML tương ứng |
| 36 hàm dựng nội dung, gồm 11 mục quản trị | Chạy không lỗi trong môi trường kiểm tra logic |
| 902 tham chiếu file và liên kết tĩnh trong HTML | Không có file thiếu |
| Giới hạn số lượng theo tồn kho mẫu | Không thêm vượt giới hạn |
| Tổng tiền và voucher NHAVUI10 | Đúng mức giảm và trần 1.000.000đ |
| Tạo đơn thử | Lưu thông tin, giữ trạng thái chờ xác nhận, xóa giỏ sau khi tạo |
| Sản phẩm không đủ tồn kho | Không tạo thêm đơn |
| Thao tác đặt lại dữ liệu | Có đăng ký mở hộp xác nhận |

File kiểm tra logic nằm ở `tests/verify.cjs`, chạy bằng `node tests/verify.cjs`. Kiểm tra này không thay thế thao tác trên trình duyệt.

## Đã thử trong Chrome

Đã chạy website bằng máy chủ HTTP cục bộ và thực hiện:

- Mở trang chủ, chi tiết, danh mục, tìm kiếm, giỏ, thanh toán, xác nhận đơn, tra cứu, đăng ký, tài khoản và quản trị.
- Thêm iPhone vào giỏ, tăng từ một lên hai sản phẩm; tổng tăng từ 30.990.000đ lên 61.980.000đ.
- Điền thông tin giả rồi áp `NHAVUI10`. Tổng còn 60.980.000đ và thông tin người nhận vẫn còn sau khi áp mã.
- Tạo đơn thử, mở trang tra cứu của đơn đó và thấy trạng thái chờ xác nhận cùng hai sản phẩm đã mua thử.
- Lọc hãng Samsung, tiếp tục chọn dưới 10 triệu và thấy thông báo không có kết quả.
- Tìm “macbook”, thấy gợi ý và kết quả MacBook Air M5.
- Đăng ký bằng dữ liệu giả, chuyển được sang tài khoản và hiển thị tên vừa nhập.
- Sửa tồn kho mẫu từ 25 xuống 24 trong quản trị, tải lại trang và thấy giá trị còn lưu.
- Mở hộp xác nhận đặt lại dữ liệu, xác nhận và trở về trang chủ với trạng thái đăng xuất, giỏ trống. Dữ liệu thử do phiên kiểm tra tạo đã được dọn.

Ở chế độ màn hình hẹp, chiều rộng nội dung CSS đo được 381px và 469px do mức thu phóng của Chrome. Trang chủ đã được xem ở cả hai mức; giỏ và đăng ký được kiểm tra ở 381px. Không thấy tràn ngang tại các trang và mức đã đo. Ảnh trang chủ không có tài nguyên ảnh lỗi khi kiểm tra.

Không ghi nhận lỗi console trong các luồng được kiểm tra. Ảnh chụp được lưu ở [bản desktop](giao-dien-desktop.png) và [bản màn hình hẹp](giao-dien-mobile.png).

## Giới hạn

Chưa kiểm tra thủ công mọi biến thể của toàn bộ 32 file HTML, mọi trình duyệt hoặc thiết bị thật. Các kiểm tra trên xác nhận giao diện và dữ liệu thử trong trình duyệt; không xác nhận hệ thống bán hàng vận hành thực tế.

Không chỉnh dữ liệu trong `dienmaynhavui_db`. Chưa có kết nối PHP/MySQL, xác thực, phân quyền máy chủ, thanh toán hay gửi thông báo thật. Lựa chọn phiên bản sản phẩm phục vụ xem thử giao diện; giỏ mẫu quản lý số lượng theo mã sản phẩm.
