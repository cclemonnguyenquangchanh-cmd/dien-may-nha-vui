// Trang Flash Sale và đồng hồ minh họa.
"use strict";

// Đồng hồ phục vụ xem thử giao diện, không phải thời hạn ưu đãi thật.
const countdownEnd = read("countdownEnd", Date.now() + 2 * 60 * 60 * 1000);
write("countdownEnd", countdownEnd);
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((countdownEnd - Date.now()) / 1000));
  const time = [
    Math.floor(remaining / 3600),
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
  document.querySelectorAll("[data-countdown]").forEach((node) => {
    node.textContent = time;
  });
}
setInterval(updateCountdown, 1000);

function flashSalePage() {
  return shell(
    "Flash Sale — Giá tốt mỗi ngày",
    "SĂN DEAL THÔNG MINH",
    html`<div class="deal-banner">
        <div>
          <span>⚡ ƯU ĐÃI THỬ NGHIỆM</span>
          <h2>Deal công nghệ hấp dẫn</h2>
          <p>Chọn sản phẩm ngay, đơn hàng lưu trong trình duyệt.</p>
        </div>
        <b>−40%</b>
      </div>
      <div class="section-head">
        <h2>Tất cả sản phẩm đang ưu đãi</h2>
        <span class="badge">${PRODUCTS.length} sản phẩm</span>
      </div>
      <div class="product-grid">
        ${PRODUCTS.slice()
          .sort((a, b) => b.off - a.off)
          .map(productCard)
          .join("")}
      </div>`,
  );
}
