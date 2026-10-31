// Nội dung hỗ trợ và biểu mẫu liên hệ.
"use strict";

const HELP = [
  ["buy", "Hướng dẫn mua hàng", "🛍️"],
  ["shipping", "Giao hàng & nhận hàng", "🚚"],
  ["return", "Đổi trả & bảo hành", "🛡️"],
  ["payment", "Thanh toán", "💳"],
  ["privacy", "Bảo mật thông tin", "🔐"],
];

const FAQ = {
  buy: [
    "Hướng dẫn mua hàng",
    "Bạn có thể tìm kiếm theo từ khóa, chọn danh mục, so sánh giá và xem thông số. Tại trang chi tiết, chọn “Thêm vào giỏ” hoặc “Mua ngay”. Sau đó điền thông tin và gửi yêu cầu đặt hàng.",
    "Tôi có thể đặt hàng không cần tài khoản?",
    "Có. Giao diện hỗ trợ mua nhanh và tra cứu đơn bằng mã.",
  ],
  shipping: [
    "Giao hàng & nhận tại cửa hàng",
    "Khách có thể chọn giao đến địa chỉ hoặc nhận tại cửa hàng. Thời gian và chi phí vận chuyển cần được xác nhận bởi nhân viên.",
    "Khi nào hàng được giữ cho khách?",
    "Sản phẩm chỉ được giữ sau khi nhân viên xác nhận yêu cầu và kiểm tra tồn kho.",
  ],
  return: [
    "Đổi trả & bảo hành",
    "Điều kiện và thời hạn đổi trả tùy theo loại sản phẩm và chính sách được công bố khi đưa hệ thống vào vận hành.",
    "Làm thế nào để yêu cầu bảo hành?",
    "Liên hệ bộ phận hỗ trợ, cung cấp mã đơn và mô tả tình trạng cần xử lý.",
  ],
  payment: [
    "Thanh toán",
    "Giao diện dự kiến hỗ trợ thanh toán khi nhận hàng hoặc chuyển khoản được đối soát thủ công.",
    "Thanh toán chuyển khoản được xác nhận ra sao?",
    "Nhân viên đối chiếu thông tin giao dịch, cập nhật trạng thái sau khi kiểm tra.",
  ],
  privacy: [
    "Bảo mật thông tin",
    "Thông tin cá nhân cần được xử lý đúng mục đích phục vụ đơn hàng và theo quy định hiện hành.",
    "Tôi nên bảo vệ tài khoản như thế nào?",
    "Không chia sẻ mật khẩu, tránh đăng nhập trên thiết bị lạ và kiểm tra kỹ địa chỉ website.",
  ],
};

function supportPage(initial = "") {
  if (FAQ[initial]) helpTopic = initial;
  return html`<div class="container page">
    ${crumb([["Trung tâm hỗ trợ"]])}
    <div
      class="category-hero"
      style="background:linear-gradient(105deg,#282d40,#45526c);min-height:155px"
    >
      <div>
        <span style="font-size:11px;opacity:.75">TRUNG TÂM HỖ TRỢ</span>
        <h1>Bạn cần chúng tôi giúp gì?</h1>
        <p>
          Tìm thông tin mua hàng, thanh toán, bảo hành và quy trình giao nhận.
        </p>
      </div>
      <div class="shape">🎧</div>
    </div>
    <div class="faq-grid">
      <div class="panel help-menu">
        ${HELP.map((x) => html`<button class="${helpTopic === x[0] ? "active" : ""}" data-action="help" data-id="${x[0]}"><span style="font-size:18px">${x[2]}</span>${x[1]}</button>`).join("")}
      </div>
      <div class="panel faq-content">
        <span class="overline">CÂU HỎI THƯỜNG GẶP</span>
        <h2 style="margin:9px 0 20px">
          ${esc(HELP.find((x) => x[0] === helpTopic)[1])}
        </h2>
        <details open>
          <summary>${esc(FAQ[helpTopic][0])}</summary>
          <p>${esc(FAQ[helpTopic][1])}</p>
        </details>
        <details>
          <summary>${esc(FAQ[helpTopic][2])}</summary>
          <p>${esc(FAQ[helpTopic][3])}</p>
        </details>
        <div class="notice yellow" style="margin-top:23px">
          Chính sách ở đây là khung nội dung minh họa; phải xác nhận các điều
          khoản cụ thể trước khi công bố lên website thật.
        </div>
        <div class="section-cta" style="margin-top:20px">
          <div>
            <b>Vẫn cần hỗ trợ?</b>
            <p class="muted mini" style="margin:4px 0 0">
              Bạn có thể gửi yêu cầu đến bộ phận chăm sóc khách hàng.
            </p>
          </div>
          <a href="#/track" class="btn btn-outline">Tra cứu đơn</a>
        </div>
      </div>
    </div>
  </div>`;
}

function promotions() {
  return html`<div class="container page">
    ${crumb([["Khuyến mãi"]])}
    <div class="category-hero">
      <div>
        <span>CHƯƠNG TRÌNH ƯU ĐÃI</span>
        <h1>Ưu đãi dành cho bạn</h1>
        <p>
          Khám phá các mẫu bố cục voucher, banner chương trình và thẻ sản phẩm
          giảm giá.
        </p>
      </div>
      <div class="shape">🎁</div>
    </div>
    <div class="section-head">
      <h2>Voucher nổi bật</h2>
      <span class="muted mini">Mã chỉ dùng minh họa UI</span>
    </div>
    <div class="coupon-grid section">
      ${[
        ["🎟️", "DEMO10", "Ưu đãi 10%", "Mã dùng thử giao diện"],
        ["🚚", "FREESHIP", "Ưu đãi phí giao", "Áp dụng theo chính sách"],
        ["🎁", "WELCOME", "Quà tặng khách mới", "Chỉ có hiệu lực khi cấu hình"],
      ]
        .map(
          (e) =>
            html`<div class="coupon">
              <span class="iconbox">${e[0]}</span>
              <div>
                <b>${e[2]}</b>
                <p>${e[3]}</p>
                <code>${e[1]}</code>
              </div>
              <button
                class="btn btn-outline btn-sm"
                data-action="copy-coupon"
                data-id="${e[1]}"
              >
                Lưu mã
              </button>
            </div>`,
        )
        .join("")}
    </div>
    <div class="section-head">
      <h2>Sản phẩm đang giảm giá</h2>
      <a class="linkred" href="#/category/dien-thoai">Xem thêm →</a>
    </div>
    <div class="product-grid">
      ${PRODUCTS.slice()
        .sort((a, b) => b.off - a.off)
        .slice(0, 8)
        .map(productCard)
        .join("")}
    </div>
  </div>`;
}

function contactPage() {
  return shell(
    "Liên hệ & yêu cầu hỗ trợ",
    "CHĂM SÓC KHÁCH HÀNG",
    html`<div class="two-col">
      <form class="panel pad" id="contact-form">
        <h2>Gửi yêu cầu của bạn</h2>
        <div class="input-group">
          <label>Họ và tên</label
          ><input name="name" required placeholder="Họ tên" />
        </div>
        <div class="input-group">
          <label>Email liên hệ</label
          ><input
            name="email"
            required
            type="email"
            placeholder="email@example.com"
          />
        </div>
        <div class="input-group">
          <label>Chủ đề</label
          ><select name="topic">
            <option>Tư vấn sản phẩm</option>
            <option>Đơn hàng</option>
            <option>Đổi trả / bảo hành</option>
            <option>Góp ý</option>
          </select>
        </div>
        <div class="input-group">
          <label>Nội dung</label
          ><textarea
            name="message"
            required
            rows="5"
            placeholder="Bạn cần chúng tôi hỗ trợ việc gì?"
          ></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Gửi yêu cầu</button>
      </form>
      <div class="panel pad">
        <h2>Kênh hỗ trợ</h2>
        <p>📞 Hotline hiển thị trong prototype: 1800 2097 (minh họa)</p>
        <p>✉ Hỗ trợ qua biểu mẫu bên cạnh</p>
        <p>🧭 <a href="#/stores" class="linkred">Tìm điểm bán và tư vấn</a></p>
        <p>🛡 <a href="#/support" class="linkred">Xem câu hỏi thường gặp</a></p>
        <div class="notice yellow">
          Yêu cầu gửi từ trang này chỉ được lưu vào bộ nhớ trình duyệt để mô
          phỏng quy trình CSKH.
        </div>
      </div>
    </div>`,
  );
}

function storesPage() {
  return shell(
    "Hệ thống cửa hàng",
    "ĐỊA ĐIỂM & TƯ VẤN",
    html`<div class="two-col">
      <div class="panel pad">
        <h2>Tìm điểm bán</h2>
        <div class="input-group">
          <label>Khu vực</label
          ><select id="store-city">
            <option value="all">Tất cả khu vực</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="hn">Hà Nội</option>
            <option value="dn">Đà Nẵng</option>
          </select>
        </div>
        <div id="store-results">${storeCards("all")}</div>
      </div>
      <div class="panel pad">
        <h2>Ghi chú</h2>
        <p>
          Điểm bán trong trang này là dữ liệu mẫu; không dùng để chỉ đường hoặc
          liên hệ thực tế.
        </p>
        <a class="btn btn-primary" href="#/contact">Yêu cầu tư vấn</a>
      </div>
    </div>`,
  );
}

function storeCards(city) {
  let stores = [
    ["hcm", "Chi nhánh trung tâm TP.HCM", "Vị trí minh họa · TP.HCM"],
    ["hn", "Chi nhánh Hà Nội", "Vị trí minh họa · Hà Nội"],
    ["dn", "Chi nhánh Đà Nẵng", "Vị trí minh họa · Đà Nẵng"],
  ];
  return stores
    .filter((x) => city === "all" || x[0] === city)
    .map(
      (x) =>
        html`<div class="address-card">
          <div>
            <b>📍 ${x[1]}</b>
            <p>${x[2]}</p>
          </div>
          <a href="#/contact" class="linkred">Liên hệ →</a>
        </div>`,
    )
    .join("");
}

function aboutPage() {
  return shell(
    "Giới thiệu Điện Máy Nhà Vui",
    "VỀ DỰ ÁN",
    html`<div class="two-col">
      <div class="panel pad">
        <h2>Mua sắm thuận tiện, trải nghiệm rõ ràng</h2>
        <p>
          Điện Máy Nhà Vui là dự án website thương mại điện tử điện máy.
          Prototype kết hợp tìm kiếm, bộ lọc, chi tiết sản phẩm, giỏ hàng, đặt
          hàng nhanh, tra cứu đơn và giao diện quản trị.
        </p>
        <p>
          Hệ thống thiết kế ưu tiên điều hướng trực quan, tính nhất quán và khả
          năng dùng trên điện thoại.
        </p>
        <a href="#/categories" class="btn btn-primary">Khám phá sản phẩm</a>
      </div>
      <div class="panel pad">
        <h2>Tầm nhìn sản phẩm</h2>
        <p>💡 Minh bạch thông tin</p>
        <p>🛍 Giảm số bước mua sắm</p>
        <p>📦 Dễ dàng theo dõi đơn hàng</p>
        <p>♿ Tương phản và cỡ chữ rõ ràng</p>
      </div>
    </div>`,
  );
}

onForm("newsletter-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  newsOpt = true;
  write("newsOpt", true);
  toast("✓ Đăng ký nhận thông tin mô phỏng thành công");
  form.reset();
});

onForm("contact-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  messages.unshift({
    name: val("name"),
    email: val("email"),
    topic: val("topic"),
    message: val("message"),
    resolved: false,
    date: new Date().toLocaleDateString("vi-VN"),
  });
  write("messages", messages);
  form.reset();
  toast("✓ Yêu cầu hỗ trợ demo đã được ghi nhận");
});

onAction("help", (button, e) => {
  const id = button.dataset.id;
  helpTopic = id;
  render(true);
});

document.addEventListener("change", (e) => {
  if (e.target.id === "store-city") {
    document.getElementById("store-results").innerHTML = storeCards(
      e.target.value,
    );
  }
});
