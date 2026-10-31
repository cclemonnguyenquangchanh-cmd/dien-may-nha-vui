// Danh sách yêu thích và so sánh sản phẩm.
"use strict";

function favorites() {
  let ps = PRODUCTS.filter((p) => favs.includes(p.id));
  return html`<div class="container page">
    ${crumb([["Sản phẩm yêu thích"]])}
    <div class="section-head">
      <h1>❤️ Sản phẩm yêu thích</h1>
      <span class="badge">${ps.length} sản phẩm</span>
    </div>
    ${ps.length ? html`<div class="product-grid">${ps.map(productCard).join("")}</div>` : emptyState("🤍", "Chưa có sản phẩm yêu thích", "Nhấn biểu tượng trái tim trên thẻ sản phẩm để lưu lại.")}
  </div>`;
}

onAction("fav", (button, e) => {
  const id = button.dataset.id;
  favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
  write("favorites", favs);
  render(true);
  toast(favs.includes(id) ? "❤️ Đã lưu vào yêu thích" : "Đã bỏ khỏi yêu thích");
});

onAction("compare-toggle", (button, e) => {
  const id = button.dataset.id;
  compareIds = compareIds.includes(id)
    ? compareIds.filter((x) => x !== id)
    : compareIds.length >= 3
      ? compareIds
      : [...compareIds, id];
  write("compare", compareIds);
  render(true);
  toast(
    compareIds.includes(id)
      ? "✓ Đã chọn để so sánh"
      : "Đã cập nhật danh sách so sánh",
  );
});

onAction("clear-compare", (button, e) => {
  compareIds = [];
  persist("compare", []);
});
