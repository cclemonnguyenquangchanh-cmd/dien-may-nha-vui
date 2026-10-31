// Dữ liệu mẫu, thẻ sản phẩm và các trang liên quan.
"use strict";

function mountProduct() {
  const product = pById(route().id || "iphone-17");
  const content = document.getElementById("product-content");
  const missingBox = document.getElementById("product-missing");
  content.hidden = !product;
  missingBox.hidden = !!product;
  if (!product) {
    missingBox.innerHTML = missing();
    return;
  }
  if (!product.variants.includes(selectedVariant))
    selectedVariant = product.variants[0];
  document.getElementById("product-breadcrumb").innerHTML = crumb([
    [catName(product.cat), "#/category/" + product.cat],
    [product.name],
  ]);
  document.querySelectorAll("[data-product-name]").forEach((node) => {
    node.textContent = product.name;
  });
  document.getElementById("product-picture").innerHTML = productArt(product);
  document.getElementById("product-rating").textContent =
    `${product.rating}/5 · ${product.brand}`;
  document.getElementById("product-price").textContent = money(product.price);
  document.getElementById("product-old-price").textContent = money(product.old);
  document.getElementById("product-discount").textContent =
    `Giảm ${product.off}%`;
  const quantity = inventory[product.id] ?? (product.stock ? 25 : 0);
  document.getElementById("product-stock").textContent =
    quantity > 0 ? `Còn ${quantity} sản phẩm mẫu` : "Tạm hết hàng";
  document.getElementById("product-variants").innerHTML = product.variants
    .map(
      (variant) =>
        html`<button
          class="option ${variant === selectedVariant ? "selected" : ""}"
          data-action="variant"
          data-value="${esc(variant)}"
          aria-pressed="${variant === selectedVariant}"
        >
          ${esc(variant)}
        </button>`,
    )
    .join("");
  content
    .querySelectorAll(
      '[data-action="add"], [data-action="buy"], [data-action="fav"], [data-action="compare-toggle"]',
    )
    .forEach((button) => {
      button.dataset.id = product.id;
      if (["add", "buy"].includes(button.dataset.action))
        button.disabled = quantity <= 0;
    });
  document.getElementById("product-favorite").textContent = favs.includes(
    product.id,
  )
    ? "Đã lưu yêu thích"
    : "Lưu sản phẩm yêu thích";
  document.getElementById("product-reviews-link").href = pageUrl(
    "#/reviews/" + product.id,
  );
  document.getElementById("product-compare").textContent = compareIds.includes(
    product.id,
  )
    ? "Đã chọn so sánh"
    : "So sánh sản phẩm";
  document.querySelectorAll('[data-action="detail-tab"]').forEach((button) => {
    const active = button.dataset.id === detailTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const labels = {
    phone: ["Màn hình", "Bộ xử lý", "Camera", "Pin"],
    laptop: ["Màn hình", "Bộ xử lý", "Bộ nhớ", "Lưu trữ"],
  };
  const specs = product.spec
    .map(
      (spec, index) =>
        html`<tr>
          <th scope="row">
            ${(labels[product.type] || [])[index] || "Đặc điểm " + (index + 1)}
          </th>
          <td>${esc(spec)}</td>
        </tr>`,
    )
    .join("");
  document.getElementById("product-tab-content").innerHTML =
    detailTab === "spec"
      ? html`<h2>Thông số nổi bật</h2>
          <table class="spec-table">
            <tbody>
              ${specs}
              <tr>
                <th scope="row">Thương hiệu</th>
                <td>${esc(product.brand)}</td>
              </tr>
            </tbody>
          </table>`
      : detailTab === "desc"
        ? html`<h2>Giới thiệu ${esc(product.name)}</h2>
            <p>
              Sản phẩm thuộc danh mục ${esc(catName(product.cat))}. Thông tin,
              phiên bản và giá trên trang là dữ liệu mẫu phục vụ đồ án.
            </p>`
        : html`<h2>Đánh giá sản phẩm</h2>
            <p>Điểm ${product.rating}/5 là số liệu mẫu.</p>
            <a class="btn btn-outline" href="#/reviews/${product.id}"
              >Xem và viết đánh giá</a
            >`;
  document.getElementById("related-products").innerHTML = PRODUCTS.filter(
    (item) => item.id !== product.id,
  )
    .sort(
      (a, b) => Number(b.cat === product.cat) - Number(a.cat === product.cat),
    )
    .slice(0, 4)
    .map(productCard)
    .join("");
}
onAction("variant", (button) => {
  selectedVariant = button.dataset.value;
  render(true);
});
onAction("detail-tab", (button) => {
  detailTab = button.dataset.id;
  render(true);
});

const PRODUCTS = [
  {
    id: "iphone-17",
    name: "iPhone 17 Pro Max 256GB",
    brand: "Apple",
    cat: "dien-thoai",
    type: "phone",
    price: 30990000,
    old: 34990000,
    off: 11,
    color: "#c7b9a5",
    rating: 4.9,
    stock: true,
    variants: ["256GB", "512GB", "1TB"],
    spec: [
      "6.9 inch OLED",
      "Chip Apple A19 Pro",
      "Camera 48MP",
      "Pin dùng cả ngày",
    ],
  },
  {
    id: "s25-ultra",
    name: "Samsung Galaxy S25 Ultra 256GB",
    brand: "Samsung",
    cat: "dien-thoai",
    type: "phone",
    price: 28490000,
    old: 33990000,
    off: 16,
    color: "#a8b5bd",
    rating: 4.8,
    stock: true,
    variants: ["256GB", "512GB", "1TB"],
    spec: [
      "6.9 inch Dynamic AMOLED",
      "Snapdragon 8 Elite",
      "Camera 200MP",
      "Hỗ trợ S Pen",
    ],
  },
  {
    id: "xiaomi-15",
    name: "Xiaomi 15 Ultra 512GB",
    brand: "Xiaomi",
    cat: "dien-thoai",
    type: "phone",
    price: 21990000,
    old: 25990000,
    off: 15,
    color: "#70a8bf",
    rating: 4.8,
    stock: true,
    variants: ["512GB", "1TB"],
    spec: [
      "6.73 inch AMOLED",
      "Chip hiệu năng cao",
      "Camera Leica",
      "Sạc nhanh",
    ],
  },
  {
    id: "oppo-reno",
    name: "OPPO Reno 13 5G 256GB",
    brand: "OPPO",
    cat: "dien-thoai",
    type: "phone",
    price: 10990000,
    old: 12990000,
    off: 15,
    color: "#bde0cc",
    rating: 4.7,
    stock: true,
    variants: ["256GB", "512GB"],
    spec: [
      "AMOLED 120Hz",
      "Camera chân dung",
      "Pin dung lượng lớn",
      "Hỗ trợ 5G",
    ],
  },
  {
    id: "macbook-m5",
    name: "MacBook Air M5 13 inch",
    brand: "Apple",
    cat: "laptop",
    type: "laptop",
    price: 24990000,
    old: 27990000,
    off: 11,
    color: "#d9b1c7",
    rating: 4.9,
    stock: true,
    variants: ["16GB / 256GB", "16GB / 512GB"],
    spec: [
      "Màn hình Liquid Retina",
      "Apple M5",
      "16GB RAM",
      "Thiết kế mỏng nhẹ",
    ],
  },
  {
    id: "asus-vivo",
    name: "ASUS Vivobook 15 OLED",
    brand: "ASUS",
    cat: "laptop",
    type: "laptop",
    price: 15990000,
    old: 18990000,
    off: 16,
    color: "#79b1cc",
    rating: 4.7,
    stock: true,
    variants: ["i5 / 16GB", "i7 / 16GB"],
    spec: ["15.6 inch OLED", "Intel Core i5", "RAM 16GB", "SSD 512GB"],
  },
  {
    id: "lenovo-loq",
    name: "Lenovo LOQ Gaming 15",
    brand: "Lenovo",
    cat: "laptop",
    type: "laptop",
    price: 20490000,
    old: 23990000,
    off: 15,
    color: "#6b87a8",
    rating: 4.8,
    stock: true,
    variants: ["RTX 4050", "RTX 4060"],
    spec: ["Màn hình 144Hz", "Intel Core i5", "GeForce RTX", "SSD 512GB"],
  },
  {
    id: "ipad-air",
    name: "iPad Air 11 inch M3 WiFi",
    brand: "Apple",
    cat: "may-tinh-bang",
    type: "tablet",
    price: 15990000,
    old: 17990000,
    off: 11,
    color: "#a1b9cf",
    rating: 4.8,
    stock: true,
    variants: ["128GB", "256GB"],
    spec: [
      "11 inch Liquid Retina",
      "Chip Apple M3",
      "Hỗ trợ bút cảm ứng",
      "WiFi 6E",
    ],
  },
  {
    id: "galaxy-tab",
    name: "Samsung Galaxy Tab S10 FE",
    brand: "Samsung",
    cat: "may-tinh-bang",
    type: "tablet",
    price: 11990000,
    old: 13990000,
    off: 14,
    color: "#b8b1c8",
    rating: 4.7,
    stock: true,
    variants: ["128GB", "256GB"],
    spec: ["Màn hình 10.9 inch", "S Pen", "RAM 8GB", "Pin lớn"],
  },
  {
    id: "airpods",
    name: "Apple AirPods Pro thế hệ 2",
    brand: "Apple",
    cat: "am-thanh",
    type: "buds",
    price: 5190000,
    old: 6290000,
    off: 17,
    color: "#e5e7ed",
    rating: 4.9,
    stock: true,
    variants: ["Trắng"],
    spec: [
      "Chống ồn chủ động",
      "Âm thanh không gian",
      "Hộp sạc USB-C",
      "Kháng nước",
    ],
  },
  {
    id: "sony-head",
    name: "Sony WH-1000XM5 Wireless",
    brand: "Sony",
    cat: "am-thanh",
    type: "headphone",
    price: 6490000,
    old: 7990000,
    off: 19,
    color: "#292e39",
    rating: 4.8,
    stock: true,
    variants: ["Đen", "Bạc"],
    spec: [
      "Chống ồn chủ động",
      "Bluetooth",
      "Thời lượng pin dài",
      "Micro thoại",
    ],
  },
  {
    id: "apple-watch",
    name: "Apple Watch Series 11 GPS",
    brand: "Apple",
    cat: "dong-ho",
    type: "watch",
    price: 10490000,
    old: 11990000,
    off: 13,
    color: "#e7b8bc",
    rating: 4.8,
    stock: true,
    variants: ["42mm", "46mm"],
    spec: [
      "Màn hình Always-on",
      "Theo dõi vận động",
      "Chống nước",
      "Kết nối iPhone",
    ],
  },
  {
    id: "samsung-tv",
    name: "Samsung Smart TV 55 inch 4K",
    brand: "Samsung",
    cat: "tivi",
    type: "tv",
    price: 12990000,
    old: 15990000,
    off: 19,
    color: "#2578a7",
    rating: 4.8,
    stock: true,
    variants: ["55 inch", "65 inch"],
    spec: ["4K UHD", "Smart TV", "Tăng cường màu sắc", "Kết nối Wi-Fi"],
  },
  {
    id: "lg-tv",
    name: "LG OLED evo 65 inch 4K",
    brand: "LG",
    cat: "tivi",
    type: "tv",
    price: 37990000,
    old: 42990000,
    off: 12,
    color: "#a35eb5",
    rating: 4.9,
    stock: true,
    variants: ["55 inch", "65 inch", "77 inch"],
    spec: ["OLED 4K", "Bộ xử lý AI", "Dolby Vision", "webOS"],
  },
  {
    id: "lg-fridge",
    name: "Tủ lạnh LG Inverter 430 lít",
    brand: "LG",
    cat: "tu-lanh",
    type: "fridge",
    price: 13990000,
    old: 16490000,
    off: 15,
    color: "#a8b0bd",
    rating: 4.7,
    stock: true,
    variants: ["Bạc", "Đen"],
    spec: [
      "430 lít",
      "Inverter tiết kiệm điện",
      "Ngăn bảo quản tươi",
      "Làm lạnh đều",
    ],
  },
  {
    id: "toshiba-wash",
    name: "Máy giặt Toshiba Inverter 10kg",
    brand: "Toshiba",
    cat: "may-giat",
    type: "washer",
    price: 7990000,
    old: 9990000,
    off: 20,
    color: "#b6c3d3",
    rating: 4.7,
    stock: true,
    variants: ["10kg", "11kg"],
    spec: ["10kg", "Inverter", "Giặt thông minh", "Bảng điều khiển điện tử"],
  },
  {
    id: "daikin-ac",
    name: "Máy lạnh Daikin Inverter 1.5HP",
    brand: "Daikin",
    cat: "may-lanh",
    type: "ac",
    price: 11490000,
    old: 13990000,
    off: 18,
    color: "#d5e0eb",
    rating: 4.8,
    stock: true,
    variants: ["1HP", "1.5HP", "2HP"],
    spec: ["Inverter", "Làm lạnh nhanh", "Lọc không khí", "Tiết kiệm điện"],
  },
];

const CATEGORIES = [
  ["dien-thoai", "Điện thoại", "📱"],
  ["laptop", "Laptop", "💻"],
  ["may-tinh-bang", "Máy tính bảng", "📲"],
  ["am-thanh", "Âm thanh", "🎧"],
  ["dong-ho", "Đồng hồ", "⌚"],
  ["tivi", "Tivi", "📺"],
  ["tu-lanh", "Tủ lạnh", "🧊"],
  ["may-giat", "Máy giặt", "🫧"],
  ["may-lanh", "Máy lạnh", "❄️"],
];

function productCard(p) {
  let count = inventory[p.id] ?? (p.stock ? 25 : 0),
    unavail = count <= 0;
  return html`<article class="product-card" data-product="${esc(p.id)}">
    <span class="badge-discount">−${p.off}%</span
    ><button
      class="heart ${favs.includes(p.id) ? "active" : ""}"
      data-action="fav"
      data-id="${p.id}"
      aria-label="Yêu thích ${esc(p.name)}"
    >
      ${icon("heart", 16)}</button
    ><a href="#/product/${p.id}" class="imgbox">${productArt(p)}</a>
    <div class="product-info">
      <a class="product-title" href="#/product/${p.id}">${esc(p.name)}</a>
      <div class="rating">
        <span class="stars">★★★★★</span>
        <span class="muted">${p.rating} · ${p.brand}</span>
      </div>
      <div class="price-block">
        <span class="price">${money(p.price)}</span
        ><span class="oldprice">${money(p.old)}</span>
      </div>
      <span class="stock"
        >${unavail ? "● Tạm hết hàng" : "● Còn " + count + " sản phẩm"}</span
      >
      <div class="card-footer">
        <button
          class="btn btn-outline"
          ${unavail ? "disabled" : ""}
          data-action="add"
          data-id="${p.id}"
        >
          ${icon("plus", 14)} Thêm giỏ</button
        ><button
          class="btn btn-primary"
          ${unavail ? "disabled" : ""}
          data-action="buy"
          data-id="${p.id}"
        >
          Mua ngay
        </button>
      </div>
      <button
        class="compare-small ${compareIds.includes(p.id) ? "selected" : ""}"
        data-action="compare-toggle"
        data-id="${p.id}"
      >
        ⚖ ${compareIds.includes(p.id) ? "Đã chọn so sánh" : "Thêm vào so sánh"}
      </button>
    </div>
  </article>`;
}

function categoriesPage() {
  return shell(
    "Danh mục sản phẩm",
    "TÌM SẢN PHẨM PHÙ HỢP",
    html`<div class="category-cards wide">
        ${CATEGORIES.map((c) => html`<a href="#/category/${c[0]}" class="category-card"><span>${c[2]}</span><b>${c[1]}</b><small>${PRODUCTS.filter((p) => p.cat === c[0]).length} sản phẩm →</small></a>`).join("")}
      </div>
      <section class="section">
        <div class="section-head">
          <h2>Gợi ý dành cho bạn</h2>
          <a class="linkred" href="#/flash-sale">Xem deal →</a>
        </div>
        <div class="product-grid">
          ${PRODUCTS.slice(0, 5).map(productCard).join("")}
        </div>
      </section>`,
  );
}

function brandsPage() {
  let bs = [...new Set(PRODUCTS.map((p) => p.brand))];
  return shell(
    "Thương hiệu chính hãng",
    "KHÁM PHÁ ĐỐI TÁC",
    html`<div class="brand-directory">
      ${bs.map((b) => html`<a href="#/brand/${encodeURIComponent(b)}"><strong>${esc(b)}</strong><span>${PRODUCTS.filter((p) => p.brand === b).length} sản phẩm</span><b>Khám phá →</b></a>`).join("")}
    </div>`,
  );
}

function brandPage(name) {
  let x = decodeURIComponent(name);
  return listing(
    PRODUCTS.filter((p) => p.brand.toLowerCase() === x.toLowerCase()),
    "Thương hiệu " + x,
    "Danh mục sản phẩm " + x + " chính hãng",
    "◆",
  );
}

function comparePage() {
  let ps = compareIds.map(pById).filter(Boolean);
  return shell(
    "So sánh sản phẩm",
    "QUYẾT ĐỊNH DỄ DÀNG",
    ps.length
      ? html`<div class="compare-board">
            ${ps
              .map(
                (p) =>
                  html`<div class="panel compare-column">
                    <button
                      class="xbtn"
                      data-action="compare-toggle"
                      data-id="${p.id}"
                      title="Xóa khỏi so sánh"
                    >
                      ×</button
                    ><a href="#/product/${p.id}" class="compare-image"
                      >${productArt(p)}</a
                    >
                    <h3>${esc(p.name)}</h3>
                    <p class="price">${money(p.price)}</p>
                    <p>Thương hiệu: <b>${p.brand}</b></p>
                    <p>Đánh giá: <b>${p.rating}/5</b></p>
                    <div class="compare-spec">
                      ${p.spec.map((s) => html`<div>✓ ${esc(s)}</div>`).join("")}
                    </div>
                    <button
                      class="btn btn-primary btn-block"
                      data-action="add"
                      data-id="${p.id}"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>`,
              )
              .join("")}${
              ps.length < 3
                ? html`<div class="compare-add">
                    <p>Chọn tối đa 3 sản phẩm để đặt cạnh nhau.</p>
                    <a class="btn btn-outline" href="#/categories"
                      >+ Chọn thêm</a
                    >
                  </div>`
                : ""
            }
          </div>
          <button class="btn btn-light" data-action="clear-compare">
            Xóa danh sách so sánh
          </button>`
      : `${emptyState("⚖", "Chưa chọn sản phẩm so sánh", "Bấm “Thêm vào so sánh” tại bất kỳ thẻ sản phẩm nào.", "#/categories", "Khám phá danh mục")}`,
  );
}

function reviewsPage(id) {
  let p = pById(id) || PRODUCTS[0],
    arr = customReviews.filter((x) => x.productId === p.id);
  return shell(
    "Đánh giá " + p.name,
    "CỘNG ĐỒNG MUA SẮM",
    html`<div class="two-col">
      <div>
        <div class="panel pad">
          <h2>Điểm đánh giá ${p.rating}/5 ★★★★★</h2>
          ${
            arr.length
              ? arr
                  .map(
                    (r) =>
                      html`<div class="notice-card">
                        <div>
                          <b>${esc(r.name)} · ${"★".repeat(r.stars)}</b>
                          <p>${esc(r.comment)}</p>
                        </div>
                      </div>`,
                  )
                  .join("")
              : '<p class="muted">Chưa có đánh giá demo. Hãy gửi đánh giá đầu tiên.</p>'
          }
        </div>
      </div>
      <form id="review-form" class="panel pad">
        <input type="hidden" name="productId" value="${p.id}" />
        <h2>Viết đánh giá</h2>
        <div class="input-group">
          <label>Tên hiển thị</label
          ><input required name="name" placeholder="Tên của bạn" />
        </div>
        <div class="input-group">
          <label>Số sao</label
          ><select name="stars">
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="1">★☆☆☆☆</option>
          </select>
        </div>
        <div class="input-group">
          <label>Nội dung</label
          ><textarea
            required
            name="comment"
            rows="5"
            maxlength="500"
            placeholder="Cảm nhận của bạn"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi đánh giá demo</button>
      </form>
    </div>`,
  );
}

for (const p of manualProducts) if (!pById(p.id)) PRODUCTS.push(p);
for (const p of PRODUCTS)
  if (adminChanges[p.id]) Object.assign(p, adminChanges[p.id]);

function productArt(product) {
  const id = PRODUCTS.some(
    (item) => item.id === product.id && !product.id.startsWith("custom-"),
  )
    ? product.id
    : "iphone-17";
  return html`<img
    src="${siteRoot}images/products/${id}.svg"
    alt="Hình minh họa ${esc(product.name)}"
    width="300"
    height="220"
    loading="lazy"
  />`;
}

onForm("review-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  customReviews.unshift({
    productId: val("productId"),
    name: val("name"),
    comment: val("comment"),
    stars: Number(val("stars")),
  });
  persist("reviews", customReviews);
  toast("✓ Đã đăng đánh giá demo");
});
