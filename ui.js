// Đầu trang, chân trang và các thành phần dùng lại.
"use strict";

let toastTimer;

function toast(t) {
  const el = document.getElementById("toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2700);
}

function icon(k, size = 20) {
  const paths = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 2h3l3 13h14l2-9H5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-7 8-7s8 2 8 7"/>',
    heart:
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    home: '<path d="m3 10 9-7 9 7v11H3z"/><path d="M9 21v-7h6v7"/>',
    truck:
      '<path d="M1 5h14v12H1zM15 9h4l4 4v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>',
    store: '<path d="M3 10h18l-2-7H5zM5 10v11h14V10M9 21v-7h6v7"/>',
    shield:
      '<path d="m12 2 9 4v6c0 6-4 9-9 11-5-2-9-5-9-11V6z"/><path d="m8 12 3 3 5-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    package: '<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
    credit:
      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    logout: '<path d="M9 3H4v18h5M16 17l5-5-5-5M21 12H9"/>',
    headset: '<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 14v5h5v-5zM16 14v5h5v-5z"/>',
    chart: '<path d="M3 20h18M6 16V9M12 16V4M18 16v-7"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    coupon: '<path d="M2 7h20v4a2 2 0 0 0 0 4v3H2v-3a2 2 0 0 0 0-4zM13 7v11"/>',
    location:
      '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10 21h4"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
  };
  return html`<svg
    width="${size}"
    height="${size}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${paths[k] || paths.package}
  </svg>`;
}

const brand = () =>
  html`<a href="#/home" class="brand" aria-label="Trang chủ Điện Máy Nhà Vui"
    ><span class="brand-logo">⚡</span
    ><span class="brand-name"
      >ĐIỆN MÁY<br />NHÀ VUI<small>TECH & LIFESTYLE</small></span
    ></a
  >`;

function header() {
  let r = route();
  return html`<div class="topbar">
      <div class="container top-inner">
        <span>🚚 Freeship theo chương trình · Hàng chính hãng</span
        ><a href="#/stores">📍 Hệ thống cửa hàng</a
        ><a href="#/track">📦 Tra cứu đơn</a
        ><a href="#/support">☏ Hỗ trợ mua hàng</a>
      </div>
    </div>
    <header class="mainhead">
      <div class="container head-inner">
        ${brand()}<a class="navbtn" href="#/categories">☷ Danh mục</a>
        <form class="searchbar" id="search-form">
          <input
            id="site-search"
            name="keyword"
            autocomplete="off"
            aria-label="Tìm kiếm sản phẩm"
            placeholder="Tìm sản phẩm, thương hiệu, danh mục..."
            value="${r.page === "search" ? esc(r.query.get("q") || "") : ""}"
          /><button type="submit" aria-label="Tìm kiếm">
            ${icon("search", 20)}
          </button>
          <div class="search-suggestions" id="search-suggestions"></div>
        </form>
        <a href="#/notifications" class="head-action"
          >${icon("bell", 20)}<span class="txt">Thông báo</span
          >${notifications.some((n) => !n.seen) ? '<b class="notify-dot"></b>' : ""}</a
        ><a href="#/favorites" class="head-action"
          >${icon("heart", 20)}<span class="txt">Yêu thích</span></a
        ><a href="#/cart" class="head-action"
          >${icon("cart", 20)}<span class="txt">Giỏ hàng</span
          >${nCart() ? html`<b class="count">${nCart()}</b>` : ""}</a
        ><a href="#/${logged ? "account" : "login"}" class="head-action account"
          >${icon("user", 20)}<span class="txt"
            >${logged ? "Tài khoản" : "Đăng nhập"}</span
          ></a
        >
      </div>
    </header>
    <div class="subnav">
      <nav class="container">
        <a href="#/category/dien-thoai">📱 Điện thoại</a
        ><a href="#/category/laptop">💻 Laptop</a
        ><a href="#/category/tivi">📺 Tivi</a
        ><a href="#/category/may-lanh">❄️ Máy lạnh</a
        ><a href="#/category/may-giat">🧺 Máy giặt</a
        ><a href="#/brands">◆ Thương hiệu</a
        ><a href="#/flash-sale">⚡ Flash sale</a
        ><a href="#/promotions">🎁 Ưu đãi</a
        ><a href="#/compare"
          >⚖ So sánh ${compareIds.length ? `(${compareIds.length})` : ""}</a
        >
      </nav>
    </div>
    <nav class="mobile-nav">
      <a href="#/home" class="${r.page === "home" ? "active" : ""}"
        >${icon("home")}Trang chủ</a
      ><a href="#/categories" class="${r.page === "categories" ? "active" : ""}"
        >${icon("menu")}Danh mục</a
      ><a href="#/favorites" class="${r.page === "favorites" ? "active" : ""}"
        >${icon("heart")}Yêu thích</a
      ><a href="#/cart" class="${r.page === "cart" ? "active" : ""}"
        >${icon("cart")}Giỏ hàng</a
      ><a
        href="#/${logged ? "account" : "login"}"
        class="${["account", "login"].includes(r.page) ? "active" : ""}"
        >${icon("user")}Cá nhân</a
      >
    </nav>`;
}

function footer() {
  return html`<section class="container bottom-info">
      ${[
        ["🚚", "Giao hàng linh hoạt", "Nhận tại cửa hàng hoặc giao tận nơi"],
        ["🛡️", "Hàng chính hãng", "Chính sách rõ ràng, minh bạch"],
        ["💳", "Thanh toán an tâm", "Thanh toán thử nghiệm không mất phí"],
        ["🎧", "Hỗ trợ tận tâm", "Theo dõi đơn hàng dễ dàng"],
      ]
        .map(
          (a) =>
            html`<div class="trust-item">
              <span class="glyph">${a[0]}</span>
              <div><b>${a[1]}</b><small>${a[2]}</small></div>
            </div>`,
        )
        .join("")}
    </section>
    <footer class="footer">
      <div class="container">
        <div class="footgrid">
          <div>
            ${brand()}
            <p>
              Điện máy và công nghệ cho mọi gia đình. Website mẫu tương tác cho
              đồ án, không thực hiện giao dịch thực.
            </p>
          </div>
          <div>
            <h3>Mua sắm</h3>
            <a href="#/categories">Danh mục</a
            ><a href="#/flash-sale">Flash sale</a
            ><a href="#/brands">Thương hiệu</a
            ><a href="#/compare">So sánh sản phẩm</a>
          </div>
          <div>
            <h3>Hỗ trợ</h3>
            <a href="#/support">Câu hỏi thường gặp</a
            ><a href="#/contact">Liên hệ</a><a href="#/stores">Cửa hàng</a
            ><a href="#/about">Về Nhà Vui</a>
          </div>
          <div>
            <h3>Tài khoản</h3>
            <a href="#/account">Cá nhân</a><a href="#/orders">Đơn hàng</a
            ><a href="#/track">Tra cứu đơn</a
            ><a href="#/admin">Quản trị demo ↗</a>
          </div>
        </div>
        <div class="copyright">
          © 2026 Điện Máy Nhà Vui. Prototype UX/UI chạy bằng dữ liệu trình duyệt
          (localStorage). Giá và ảnh chỉ mang tính minh họa.
        </div>
      </div>
    </footer>`;
}

function crumb(arr = []) {
  return html`<div class="breadcrumb">
    <a href="#/home">Trang chủ</a
    >${arr.map((a) => `${icon("chevron", 12)}${a[1] ? html`<a href="${a[1]}">${esc(a[0])}</a>` : html`<b>${esc(a[0])}</b>`}`).join("")}
  </div>`;
}

function emptyState(
  emoji,
  title,
  desc,
  link = "#/home",
  label = "Tiếp tục mua sắm",
) {
  return html`<div class="panel empty">
    <span class="emoji">${emoji}</span>
    <h2>${title}</h2>
    <p class="muted">${desc}</p>
    <a class="btn btn-primary" href="${link}" style="margin-top:12px"
      >${label}</a
    >
  </div>`;
}

function shell(title, kicker, body, aside = "") {
  return html`<div class="container page">
    ${crumb([[title]])}
    <div class="page-hero">
      <div>
        <span class="overline">${esc(kicker)}</span>
        <h1>${esc(title)}</h1>
      </div>
      <div class="page-hero-glyph">✦</div>
    </div>
    ${
      aside
        ? html`<div class="two-col">
            <div>${body}</div>
            <aside>${aside}</aside>
          </div>`
        : body
    }
  </div>`;
}

function missing() {
  return html`<div class="container page">
    ${crumb([["Không tìm thấy trang"]])}${emptyState("🧭", "Không tìm thấy nội dung", "Đường dẫn hoặc sản phẩm có thể đã thay đổi.")}
  </div>`;
}

function modal(title, body) {
  let host = document.getElementById("modal-host");
  host.innerHTML = html`<div class="modal-backdrop" data-action="modal-close">
    <div
      class="modal-panel"
      role="dialog"
      aria-modal="true"
      aria-label="${esc(title)}"
    >
      <div class="section-head">
        <h2>${esc(title)}</h2>
        <button class="modal-x" data-action="modal-close" aria-label="Đóng">
          ×
        </button>
      </div>
      ${body}
    </div>
  </div>`;
  labelFields(host);
  rewriteLinks(host);
  host.querySelector("input:not([type=hidden])")?.focus();
}

function closeModal() {
  document.getElementById("modal-host").innerHTML = "";
}

onAction("modal-close", (button, e) => {
  closeModal();
});
