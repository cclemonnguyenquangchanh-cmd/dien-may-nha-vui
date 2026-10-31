// Lọc danh mục theo giá, thương hiệu và sắp xếp.
"use strict";

function filtersBlock(ps) {
  let brands = [...new Set(ps.map((p) => p.brand))];
  return html`<aside class="panel filter-sidebar ${mobileFilter ? "show" : ""}">
    <div class="filter-title">
      <h3>${icon("filter", 17)} Bộ lọc</h3>
      <button class="btn btn-light btn-sm" data-action="reset-filter">
        Xóa lọc
      </button>
    </div>
    <div class="filter-block">
      <h4>Thương hiệu</h4>
      ${brands.map((b) => html`<label class="checkitem"><input type="radio" name="brand" data-filter-brand="${esc(b)}" ${filterBrand === b ? "checked" : ""} /> ${esc(b)}</label>`).join("")}<label
        class="checkitem"
        ><input
          type="radio"
          name="brand"
          data-filter-brand=""
          ${!filterBrand ? "checked" : ""}
        />
        Tất cả</label
      >
    </div>
    <div class="filter-block">
      <h4>Mức giá</h4>
      ${[
        ["all", "Tất cả mức giá"],
        ["under10", "Dưới 10 triệu"],
        ["10to20", "10 – 20 triệu"],
        ["over20", "Trên 20 triệu"],
      ]
        .map(
          (e) =>
            html`<label class="checkitem"
              ><input
                type="radio"
                name="price"
                data-filter-price="${e[0]}"
                ${filterPrice === e[0] ? "checked" : ""}
              />
              ${e[1]}</label
            >`,
        )
        .join("")}
    </div>
    <div class="filter-block" style="border:0">
      <h4>Cam kết</h4>
      <span class="stock">✔ Sản phẩm chính hãng</span><br /><span class="stock"
        >✔ Bảo hành theo chính sách</span
      >
    </div>
  </aside>`;
}

function listing(base, title, subtitle, emoji, isSearch = false) {
  let ps = base.slice();
  if (filterBrand) ps = ps.filter((p) => p.brand === filterBrand);
  if (filterPrice === "under10") ps = ps.filter((p) => p.price < 10000000);
  if (filterPrice === "10to20")
    ps = ps.filter((p) => p.price >= 10000000 && p.price <= 20000000);
  if (filterPrice === "over20") ps = ps.filter((p) => p.price > 20000000);
  if (sort === "price-asc") ps.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") ps.sort((a, b) => b.price - a.price);
  if (sort === "discount") ps.sort((a, b) => b.off - a.off);
  let banner = isSearch
    ? html`<div class="section-head">
        <h1 style="margin:0">${esc(title)}</h1>
      </div>`
    : html`<div class="category-hero">
        <div style="position:relative;z-index:2">
          <span style="font-size:11px;opacity:.8">BỘ SƯU TẬP SẢN PHẨM</span>
          <h1>${esc(title)}</h1>
          <p>${esc(subtitle)}</p>
          <span class="eyebrow">⚡ Sản phẩm chính hãng · Giá minh họa</span>
        </div>
        <div class="shape">${emoji}</div>
      </div>`;
  return html`<div class="container page">
    ${crumb([[title]])}${banner}
    <div class="filter-layout">
      ${filtersBlock(base)}
      <div>
        <div class="filter-toolbar">
          <div>
            <h2 class="heading">
              ${isSearch ? "Kết quả phù hợp" : "Sản phẩm nổi bật"}
              <span class="count-label">${ps.length} sản phẩm</span>
            </h2>
            <button
              class="btn btn-light btn-sm hide-desktop"
              data-action="toggle-filter"
            >
              ${icon("filter", 16)} Lọc sản phẩm
            </button>
          </div>
          <select class="sort-select" id="sort-select" aria-label="Sắp xếp">
            ${[
              ["popular", "Nổi bật"],
              ["price-asc", "Giá thấp đến cao"],
              ["price-desc", "Giá cao đến thấp"],
              ["discount", "Giảm giá nhiều"],
            ]
              .map(
                (a) =>
                  html`<option
                    value="${a[0]}"
                    ${sort === a[0] ? "selected" : ""}
                  >
                    ${a[1]}
                  </option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="product-grid">
          ${
            ps.length
              ? ps.map(productCard).join("")
              : html`<div class="panel empty" style="grid-column:1/-1">
                  <span class="emoji">🔎</span>
                  <h2>Không tìm thấy sản phẩm phù hợp</h2>
                  <p class="muted">Thử bỏ bớt bộ lọc hoặc tìm từ khóa khác.</p>
                  <button class="btn btn-outline" data-action="reset-filter">
                    Xóa bộ lọc
                  </button>
                </div>`
          }
        </div>
        <div class="section-cta" style="margin-top:20px">
          <span
            ><b>Không tìm thấy sản phẩm ưng ý?</b><br /><span class="muted mini"
              >Khám phá thêm danh mục hoặc tra cứu chính sách mua hàng.</span
            ></span
          ><a class="btn btn-outline" href="#/support">Xem hỗ trợ</a>
        </div>
      </div>
    </div>
  </div>`;
}

function category(id) {
  currentCategory = CATEGORIES.some((c) => c[0] === id) ? id : "dien-thoai";
  const c = CATEGORIES.find((c) => c[0] === currentCategory);
  return listing(
    PRODUCTS.filter((p) => p.cat === currentCategory),
    c[1],
    `Lựa chọn ${c[1].toLowerCase()} đa dạng, dễ so sánh giá và cấu hình.`,
    c[2],
  );
}

document.addEventListener("change", (e) => {
  if (e.target.matches("#sort-select")) {
    sort = e.target.value;
    render(true);
  }
  if (e.target.dataset.filterBrand !== undefined) {
    filterBrand = e.target.dataset.filterBrand;
    render(true);
  }
  if (e.target.dataset.filterPrice !== undefined) {
    filterPrice = e.target.dataset.filterPrice;
    render(true);
  }
});

onAction("reset-filter", (button, e) => {
  filterBrand = "";
  filterPrice = "all";
  render(true);
});

onAction("toggle-filter", (button, e) => {
  mobileFilter = !mobileFilter;
  render(true);
});
