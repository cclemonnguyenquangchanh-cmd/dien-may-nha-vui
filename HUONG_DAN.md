# Hướng dẫn đọc và sửa website

Bạn đang làm phần giao diện trước. HTML đặt các khối nội dung lên trang, CSS chỉnh hình thức, JavaScript xử lý khi bấm nút hoặc nhập dữ liệu.

## 1. Bắt đầu ở trang chủ

Mở `index.html`. Trong thẻ `<main>`, các phần nằm theo thứ tự hiển thị: lợi ích mua hàng, danh mục và banner, Flash Sale, danh mục, thương hiệu, các nhóm sản phẩm và form nhận tin.

Muốn đổi tiêu đề “Điện thoại được quan tâm”, tìm chính câu đó trong `index.html` rồi sửa. Lưu file và tải lại trang để xem kết quả.

Các dòng `<link>` ở đầu file nạp CSS. Các dòng `<script defer>` nạp JavaScript. `defer` cho phép trình duyệt đọc xong HTML trước khi chạy phần xử lý trang. Giữ nguyên thứ tự các script khi bạn chưa thay đổi cách chúng phụ thuộc nhau.

Đầu trang và chân trang dùng chung nằm trong hai hàm `header()` và `footer()` của `js/ui.js`. Sửa menu tại đó sẽ áp dụng cho các trang, không cần chép lại ở từng file HTML.

## 2. Sửa hình thức ở đâu?

| File | Phần phụ trách |
| --- | --- |
| `css/style.css` | Màu chung, font, khung trang, nút, form và các thành phần dùng lại |
| `css/header.css` | Logo, thanh tìm kiếm, menu, điều hướng điện thoại |
| `css/banner.css` | Banner chính, danh mục bên trái, hai khối bên phải |
| `css/flashsale.css` | Flash Sale và đồng hồ xem thử |
| `css/category.css` | Danh mục, thương hiệu, bộ lọc |
| `css/product.css` | Lưới và thẻ sản phẩm |
| `css/product-detail.css` | Chi tiết và thông số |
| `css/cart.css` | Các dòng hàng, nút tăng giảm số lượng |
| `css/checkout.css` | Form nhận hàng và bảng tổng tiền |
| `css/footer.css` | Chân trang |
| `css/admin.css` | Khu quản trị mẫu |

Màu đỏ chính dùng biến `--red` trong `style.css`. Bản gốc có lớp CSS ban đầu và lớp chỉnh giao diện V2, vì vậy có những selector xuất hiện nhiều lần. Khi cùng độ ưu tiên, quy tắc phía sau có thể ghi đè quy tắc phía trước. Dùng ô tìm kiếm của VS Code để xem hết các vị trí trước khi sửa.

Các khối `@media` chỉnh giao diện theo chiều rộng màn hình. Sau khi sửa kích thước hoặc khoảng cách, kiểm tra cả máy tính và điện thoại.

## 3. Dữ liệu sản phẩm

Mở `js/product.js`, tìm `const PRODUCTS`. Mỗi phần tử là một sản phẩm. Ví dụ rút gọn:

```js
{
  id: "iphone-17",
  name: "iPhone 17 Pro Max 256GB",
  brand: "Apple",
  cat: "dien-thoai",
  price: 30990000,
  old: 34990000
}
```

Khi thêm sản phẩm, sao chép một phần tử đầy đủ đang có để giữ các trường như `type`, `off`, `rating`, `stock`, `variants`, `spec` và `color`.

`id` phải riêng biệt. `cat` phải khớp mã trong mảng `CATEGORIES`. Giá dùng số nguyên, không gõ dấu chấm phân cách vào giá trị. Hàm `money()` định dạng số khi hiển thị.

Hàm `productCard()` tạo thẻ sản phẩm dùng ở nhiều trang. Sửa bố cục thẻ tại đây sẽ áp dụng cho trang chủ, danh mục và tìm kiếm.

Hàm `productArt()` trả về thẻ `<img>`. Ảnh mặc định nằm ở `images/products/<id>.svg`. Muốn dùng JPG/PNG, đặt ảnh vào thư mục đó rồi sửa đường dẫn tại `productArt()`. Không đổi đuôi SVG thành JPG vì nội dung file vẫn là SVG. Sản phẩm thêm từ giao diện quản trị hiện dùng ảnh minh họa dự phòng.

Nếu đã sửa sản phẩm bằng quản trị thử, dữ liệu lưu trong trình duyệt có thể ghi đè giá trị vừa sửa trong mã nguồn. Vào **Quản trị → Cài đặt → Đặt lại dữ liệu demo** để trở về dữ liệu trong file. Thao tác này xóa dữ liệu thử của website trên trình duyệt đang dùng, nên chỉ thực hiện khi bạn muốn bỏ dữ liệu thử đó.

## 4. Các file JavaScript

| File | Trách nhiệm |
| --- | --- |
| `app.js` | Hàm chung, đọc/lưu dữ liệu, xác định trang và gọi phần hiển thị |
| `ui.js` | Header, footer, thông báo, hộp thoại và khung nội dung dùng lại |
| `product.js` | Sản phẩm mẫu, thẻ sản phẩm, chi tiết, danh mục, thương hiệu và đánh giá |
| `slider.js` | Đổi banner và nạp các nhóm sản phẩm ở trang chủ |
| `countdown.js` | Đồng hồ minh họa và màn hình Flash Sale |
| `search.js` | Tìm theo từ khóa và gợi ý |
| `filter.js` | Lọc theo hãng, giá và sắp xếp |
| `favorite.js` | Yêu thích và so sánh |
| `cart.js` | Thêm, xóa, tăng giảm số lượng và lưu giỏ |
| `cart-page.js` | Đưa các dòng sản phẩm vào trang giỏ hàng |
| `checkout.js` | Mã giảm giá, tổng tiền, đặt đơn và màn hình thành công |
| `register.js` | Xem thử đăng nhập/đăng ký và form quên mật khẩu |
| `account.js` | Hồ sơ, địa chỉ, thông báo, đơn hàng và tra cứu |
| `support.js` | Hỗ trợ, liên hệ và nội dung thông tin |
| `admin.js` | Bảng quản trị và chỉnh dữ liệu mẫu |

Website dùng JavaScript thuần, chưa cần framework hoặc bước build. Các file chia sẻ một số biến ở `app.js`, chẳng hạn `cart`, `orders` và `profileData`.

Một số hàm trả về nội dung bằng cú pháp `html` kèm dấu backtick. Hàm `html()` trong `app.js` ghép chuỗi, giúp phần HTML trong JavaScript dễ đọc. Dữ liệu người dùng đưa vào chuỗi phải qua `esc()` trước khi hiển thị; không chèn thẳng dữ liệu form vào HTML.

## 5. Nút “Thêm giỏ” chạy như thế nào?

1. `productCard()` tạo nút có `data-action="add"` và `data-id` của sản phẩm.
2. Bộ xử lý click trong `app.js` đọc tên thao tác.
3. `cart.js` đã đăng ký thao tác bằng `onAction('add', ...)`, nên hàm `add()` được gọi.
4. `add()` kiểm tra tồn kho mẫu rồi tăng số lượng trong biến `cart`.
5. `write('cart', cart)` lưu giỏ vào `localStorage`. Giao diện cập nhật số lượng và báo đã thêm hàng.

Ở trang giỏ, `cart-page.js` lấy `<template id="cart-item-template">` từ `pages/cart.html` để tạo từng dòng. Muốn sửa bố cục dòng hàng, sửa template đó. Muốn sửa cách tính tổng, đọc `cartTotal()`.

`onAction()` và `onForm()` là hai hàm nhỏ do dự án tự định nghĩa. Chúng giúp mỗi thao tác có một nơi đăng ký, tránh hai bộ xử lý cùng chạy như một số phần trong mẫu gốc.

## 6. Đường dẫn giữa các trang

```text
pages/product.html?id=iphone-17
```

`product.html` quyết định bố cục. `id=iphone-17` cho biết sản phẩm cần hiển thị. Thay `id` bằng `s25-ultra` sẽ mở sản phẩm khác có trong dữ liệu.

Danh mục dùng `pages/category.html?id=laptop`. Quản trị dùng `pages/admin.html?id=products` hoặc `pages/admin.html?id=orders`.

Hàm `pageUrl()` chuyển đường dẫn cũ như `#/cart` sang trang HTML tương ứng. Những liên kết giữ từ mẫu cũ vẫn có đích đến. Khi thêm liên kết trong HTML, bạn có thể viết đường dẫn file trực tiếp như các liên kết đã có trong `index.html`.

## 7. Tự thử website

Chạy qua Live Server hoặc WAMP. Thử đổi banner, tìm “macbook”, mở danh mục và chọn mức giá không có sản phẩm. Sau đó thêm hàng, tăng giảm số lượng, xóa hàng và tải lại trang để xem giỏ còn lưu hay không.

Ở thanh toán, dùng thông tin giả. Thử bỏ trống trường bắt buộc, nhập sai số điện thoại, nhập mã không tồn tại rồi nhập `NHAVUI10`. Mã này giảm 10%, tối đa 1.000.000đ cho giỏ từ 5.000.000đ. Sau khi tạo đơn, dùng mã đơn vừa nhận để tra cứu.

Thử đăng nhập bằng thông tin giả để xem khu tài khoản. Form chỉ bật trạng thái xem thử, không xác minh tài khoản và không lưu mật khẩu. Trong quản trị, thử chỉnh tồn kho rồi quay lại trang sản phẩm. Thay đổi này chỉ tác động dữ liệu thử trên trình duyệt.

## 8. Làm tiếp PHP/MySQL từng phần

| Bước | Công việc | Khi nào chuyển bước? |
| --- | --- | --- |
| 1 | Đọc và sửa được HTML/CSS; dùng thử các trang chính | Bạn biết sửa tiêu đề, ảnh, màu và tìm đúng file |
| 2 | Đối chiếu bảng sản phẩm, danh mục và ảnh trong MySQL với dữ liệu giao diện | Xác định được từng trường cần lấy từ cấu trúc bảng thực tế |
| 3 | Đọc danh sách và chi tiết sản phẩm bằng PHP | Dữ liệu MySQL hiển thị trong bố cục hiện tại |
| 4 | Chuyển giỏ sang PHP session; tính lại giá và kiểm tra tồn kho ở máy chủ | Máy chủ từ chối số lượng và giá không hợp lệ |
| 5 | Tạo đơn cùng chi tiết đơn trong giao dịch MySQL | Đơn lưu đầy đủ; lỗi giữa chừng không để dữ liệu dở dang |
| 6 | Đăng ký, đăng nhập, phân quyền khách hàng/nhân viên/quản lý | Mật khẩu được băm và quyền được kiểm tra ở máy chủ |
| 7 | Nối quản trị, hỗ trợ, trạng thái đơn; kiểm thử tình huống lỗi | Thao tác cập nhật đúng dữ liệu và kiểm tra đúng quyền |

Bước tiếp theo nên bắt đầu bằng danh sách sản phẩm. Bạn sẽ thấy dữ liệu MySQL thay cho mảng mẫu trong khi bố cục vẫn được giữ. Chưa cần chuyển cả website sang PHP trong một lượt.
