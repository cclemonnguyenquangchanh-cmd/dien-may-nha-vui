// Hồ sơ, địa chỉ và lịch sử đơn hàng mẫu.
"use strict";

function sampleOrders() {
  return [
    ...orders,
    {
      id: "DNV-261020-1024",
      name: "Người dùng demo",
      items: [{ id: "s25-ultra", n: 1 }],
      total: 28490000,
      status: "delivered",
      date: "20/10/2026",
    },
    {
      id: "DNV-261028-2048",
      name: "Người dùng demo",
      items: [{ id: "macbook-m5", n: 1 }],
      total: 24990000,
      status: "pending",
      date: "28/10/2026",
    },
  ];
}

const statusLabel = (s) =>
  ({
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    delivering: "Đang giao hàng",
    delivered: "Hoàn thành",
    cancelled: "Đã hủy",
  })[s] || s;

function orderCard(o) {
  let p = pById(o.items[0]?.id) || PRODUCTS[0];
  return html`<article class="panel order-card">
    <div class="order-header">
      <div>
        <b>${esc(o.id)}</b><span class="muted mini"> · ${esc(o.date)}</span>
      </div>
      <span class="status ${o.status}">${statusLabel(o.status)}</span>
    </div>
    <div class="order-body">
      <div class="imgbox">${productArt(p)}</div>
      <div>
        <b style="font-size:12px">${esc(p.name)}</b>
        <div class="muted mini">
          ${o.items.length} dòng sản phẩm ·
          ${o.items.reduce((a, i) => a + i.n, 0)} sản phẩm
        </div>
      </div>
    </div>
    <div class="order-footer">
      <div>
        <span class="muted mini">Tổng tiền</span><br /><strong
          style="color:var(--red)"
          >${money(o.total)}</strong
        >
      </div>
      <div class="chiprow">
        <a
          class="btn btn-outline btn-sm"
          href="#/track?code=${encodeURIComponent(o.id)}"
          >Xem chi tiết</a
        >${o.status === "pending" && orders.includes(o) ? html`<button class="btn btn-light btn-sm" data-action="cancel-order" data-id="${o.id}">Yêu cầu hủy</button>` : ""}
      </div>
    </div>
  </article>`;
}

function trackPage(code = "") {
  const o = sampleOrders().find(
    (o) => o.id.toLowerCase() === (code || "").trim().toLowerCase(),
  );
  let show = !!code;
  return html`<div class="container page">
    ${crumb([["Tra cứu đơn hàng"]])}
    <div class="track-wrap">
      <div class="panel track-hero">
        <span class="emoji">📦</span>
        <h1>Theo dõi đơn hàng</h1>
        <p class="muted">Nhập mã đơn hàng để xem trạng thái xử lý mới nhất.</p>
        <form
          id="track-form"
          style="max-width:510px;margin:23px auto 0;display:flex;gap:8px"
        >
          <input
            style="flex:1;min-width:0;padding:13px 14px;border:1px solid #dfe4eb;border-radius:8px"
            name="code"
            required
            placeholder="Ví dụ: DNV-261028-2048"
            value="${esc(code)}"
          /><button class="btn btn-primary" type="submit">
            Tra cứu ${icon("search", 17)}
          </button>
        </form>
        <p class="muted mini" style="margin:12px 0 0">
          Mã demo: DNV-261020-1024 hoặc DNV-261028-2048
        </p>
      </div>
      ${
        show
          ? o
            ? html`<div class="panel pad" style="margin-top:17px">
                <div class="section-head">
                  <h2>
                    Chi tiết đơn
                    <span style="color:var(--red)">${esc(o.id)}</span>
                  </h2>
                  <span class="status ${o.status}"
                    >${statusLabel(o.status)}</span
                  >
                </div>
                <div class="fieldgrid">
                  <div>
                    <span class="muted mini">Ngày đặt</span>
                    <p><b>${esc(o.date)}</b></p>
                  </div>
                  <div>
                    <span class="muted mini">Tổng đơn</span>
                    <p class="price" style="font-size:17px">
                      ${money(o.total)}
                    </p>
                  </div>
                </div>
                <div class="timeline">
                  ${[
                    ["Tiếp nhận", "✓"],
                    ["Xác nhận", "✓"],
                    ["Vận chuyển", "🚚"],
                    ["Hoàn thành", "✓"],
                  ]
                    .map(
                      (s, i) =>
                        html`<div
                          class="time-step ${o.status === "delivered" || (o.status === "pending" && i === 0) || (o.status === "confirmed" && i < 2) || (o.status === "delivering" && i < 3) ? "done" : ""}"
                        >
                          <div class="dot">${s[1]}</div>
                          <b>${s[0]}</b>
                        </div>`,
                    )
                    .join("")}
                </div>
                <div class="notice">
                  ${o.status === "pending" ? "Yêu cầu đang chờ nhân viên kiểm tra và xác nhận." : o.status === "delivered" ? "Đơn mẫu đã hoàn thành." : "Trạng thái được mô phỏng trong giao diện."}
                </div>
                <h3>Sản phẩm trong đơn</h3>
                ${o.items
                  .map((e) => {
                    let p = pById(e.id);
                    return p
                      ? html`<div class="order-body">
                          <div class="imgbox">${productArt(p)}</div>
                          <div>
                            <b>${esc(p.name)}</b>
                            <div class="muted mini">Số lượng: ${e.n}</div>
                          </div>
                        </div>`
                      : "";
                  })
                  .join("")}
              </div>`
            : html`<div class="panel empty" style="margin-top:17px">
                <span class="emoji">🔎</span>
                <h2>Chưa tìm thấy mã đơn này trong bản demo</h2>
                <p class="muted">
                  Hãy thử mã demo bên trên, hoặc kiểm tra lại mã đã nhập.
                </p>
              </div>`
          : ""
      }
    </div>
  </div>`;
}

function accountNav(active) {
  return html`<aside class="panel account-sidebar">
    <div class="profile-name">
      <div class="avatar">NV</div>
      <div>
        <b>${esc(profileData.name || "Thành viên Nhà Vui")}</b>
        <div class="muted mini">Tài khoản demo</div>
      </div>
    </div>
    ${[
      ["account", "Tổng quan"],
      ["profile", "Thông tin cá nhân"],
      ["addresses", "Sổ địa chỉ"],
      ["orders", "Đơn mua"],
      ["favorites", "Yêu thích"],
      ["vouchers", "Voucher"],
      ["notifications", "Thông báo"],
    ]
      .map(
        (x) =>
          html`<a
            class="sidelink ${active === x[0] ? "active" : ""}"
            href="#/${x[0]}"
            >${x[1]} →</a
          >`,
      )
      .join("")}<button class="sidelink" data-action="logout">
      Đăng xuất ↗
    </button>
  </aside>`;
}

function accountWrap(title, active, inside) {
  return html`<div class="container page">
    ${crumb([["Tài khoản", "#/account"], [title]])}
    <h1>${title}</h1>
    <div class="account-layout">
      ${accountNav(active)}
      <div>${inside}</div>
    </div>
  </div>`;
}

function profilePage() {
  return accountWrap(
    "Thông tin cá nhân",
    "profile",
    html`<div class="panel pad">
      <h2>Hồ sơ của bạn</h2>
      <form id="profile-form" class="profile-form">
        <div class="fieldgrid">
          <div class="input-group">
            <label>Họ và tên</label
            ><input required name="name" value="${esc(profileData.name)}" />
          </div>
          <div class="input-group">
            <label>Số điện thoại</label
            ><input name="phone" value="${esc(profileData.phone)}" />
          </div>
          <div class="input-group">
            <label>Email</label
            ><input
              type="email"
              name="email"
              value="${esc(profileData.email)}"
            />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">
          Lưu thông tin cá nhân
        </button>
      </form>
    </div>`,
  );
}

function addressesPage() {
  let body = html`<div class="panel pad">
    <div class="section-head">
      <h2>Địa chỉ nhận hàng</h2>
      <button class="btn btn-primary" data-action="address-new">
        + Thêm địa chỉ
      </button>
    </div>
    ${
      addressBook.length
        ? addressBook
            .map(
              (a, i) =>
                html`<div class="address-card">
                  <div>
                    <b>${esc(a.name)}</b> · ${esc(a.phone)}
                    <p>${esc(a.address)}</p>
                    ${i === 0 ? '<span class="badge">Địa chỉ ưu tiên</span>' : ""}
                  </div>
                  <div>
                    <button
                      data-action="address-edit"
                      data-id="${i}"
                      class="btn btn-light btn-sm"
                    >
                      Sửa</button
                    ><button
                      data-action="address-delete"
                      data-id="${i}"
                      class="btn btn-outline btn-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>`,
            )
            .join("")
        : emptyState(
            "📍",
            "Chưa có địa chỉ lưu",
            "Thêm địa chỉ để điền nhanh khi thanh toán",
            "#/checkout",
            "Đến thanh toán",
          )
    }
  </div>`;
  return accountWrap("Sổ địa chỉ", "addresses", body);
}

function ordersPage() {
  return accountWrap(
    "Đơn hàng của tôi",
    "orders",
    html`<div class="panel pad">
        <div class="section-head">
          <h2>${sampleOrders().length} đơn hàng</h2>
          <a href="#/track" class="linkred">Tra cứu theo mã →</a>
        </div>
        <div class="chiprow">
          ${[
            ["all", "Tất cả"],
            ["pending", "Chờ xác nhận"],
            ["delivered", "Hoàn thành"],
            ["cancelled", "Đã hủy"],
          ]
            .map(
              (x) =>
                html`<button
                  class="chip ${adminFilter === x[0] ? "active" : ""}"
                  data-action="order-tab"
                  data-id="${x[0]}"
                >
                  ${x[1]}
                </button>`,
            )
            .join("")}
        </div>
      </div>
      ${
        sampleOrders()
          .filter((o) => adminFilter === "all" || o.status === adminFilter)
          .map(
            (o) =>
              html`<div class="order-link-card">
                ${orderCard(o)}<a
                  class="btn btn-outline"
                  href="#/order/${encodeURIComponent(o.id)}"
                  >Xem chi tiết đơn →</a
                >
              </div>`,
          )
          .join("") ||
        emptyState(
          "📦",
          "Chưa có đơn phù hợp",
          "Chọn trạng thái khác để xem",
          "#/orders",
          "Tất cả đơn hàng",
        )
      }`,
  );
}

function orderDetailPage(id) {
  let o = sampleOrders().find((x) => x.id === decodeURIComponent(id));
  if (!o) return missing();
  return shell(
    "Chi tiết đơn " + o.id,
    "THEO DÕI GIAO HÀNG",
    html`<div class="panel pad">
      <div class="order-steps">
        <span class="done">✓ Tiếp nhận</span
        ><span class="${o.status !== "cancelled" ? "done" : ""}">Kiểm tra</span
        ><span>Đóng gói</span
        ><span
          >${o.status === "delivered" ? "✓ Giao thành công" : "Giao hàng"}</span
        >
      </div>
      <h3>Thông tin đơn hàng</h3>
      <p>Người nhận: <b>${esc(o.name)}</b></p>
      <p>
        Ngày tạo: <b>${esc(o.date)}</b> · Trạng thái:
        <b>${statusLabel(o.status)}</b>
      </p>
      <div class="order-products">
        ${o.items
          .map((e) => {
            let p = pById(e.id);
            return p
              ? html`<div>
                  <a href="#/product/${p.id}">${esc(p.name)}</a
                  ><b>${e.n} × ${money(p.price)}</b>
                </div>`
              : "";
          })
          .join("")}
      </div>
      <h2 class="price">${money(o.total)}</h2>
      <div class="actionbar">
        <a class="btn btn-light" href="#/orders">← Danh sách đơn</a
        ><a class="btn btn-outline" href="#/contact">Yêu cầu hỗ trợ</a
        >${o.status === "pending" ? html`<button class="btn btn-outline" data-action="cancel-order" data-id="${o.id}">Hủy đơn demo</button>` : ""}
      </div>
    </div>`,
  );
}

function notificationPage() {
  return accountWrap(
    "Thông báo",
    "notifications",
    html`<div class="panel pad">
      <div class="section-head">
        <h2>Thông báo của bạn</h2>
        <button class="btn btn-outline" data-action="read-all">
          Đánh dấu đã đọc
        </button>
      </div>
      ${
        notifications.length
          ? notifications
              .map(
                (n, i) =>
                  html`<div class="notice-card ${n.seen ? "" : "unread"}">
                    <div>
                      <b>${esc(n.title)}</b>
                      <p>${esc(n.message)}</p>
                    </div>
                    <button
                      class="btn btn-light btn-sm"
                      data-action="notification-remove"
                      data-id="${i}"
                    >
                      Xóa
                    </button>
                  </div>`,
              )
              .join("")
          : emptyState(
              "🔔",
              "Không có thông báo mới",
              "Mọi cập nhật demo sẽ xuất hiện tại đây.",
            )
      }
    </div>`,
  );
}

function accountHome() {
  if (!logged) return authPage(false);
  return accountWrap(
    "Tổng quan tài khoản",
    "account",
    html`<div class="account-overview">
        <a href="#/orders" class="stat-mini"
          ><b>${sampleOrders().length}</b><span>Đơn hàng</span></a
        ><a href="#/favorites" class="stat-mini"
          ><b>${favs.length}</b><span>Yêu thích</span></a
        ><a href="#/vouchers" class="stat-mini"
          ><b>${voucherList.length}</b><span>Voucher</span></a
        >
      </div>
      <div class="panel pad">
        <h2>Xin chào, ${esc(profileData.name || "khách hàng")} 👋</h2>
        <p class="muted">Quản lý toàn bộ hành trình mua sắm tại một nơi.</p>
        <div class="actionbar">
          <a class="btn btn-primary" href="#/orders">Đơn hàng của tôi</a
          ><a class="btn btn-outline" href="#/profile">Cập nhật hồ sơ</a
          ><a class="btn btn-light" href="#/addresses">Sổ địa chỉ</a>
        </div>
      </div>
      <div class="panel pad" style="margin-top:15px">
        <h2>Đơn hàng gần đây</h2>
        ${sampleOrders().slice(0, 2).map(orderCard).join("")}
      </div>`,
  );
}

function addressModal(i = -1) {
  let a = addressBook[i] || {
    name: profileData.name || "",
    phone: profileData.phone || "",
    address: "",
  };
  modal(
    i < 0 ? "Thêm địa chỉ nhận hàng" : "Chỉnh sửa địa chỉ",
    html`<form id="address-form">
      <input type="hidden" name="idx" value="${i}" />
      <div class="input-group">
        <label>Người nhận</label
        ><input required name="name" value="${esc(a.name)}" />
      </div>
      <div class="input-group">
        <label>Số điện thoại</label
        ><input required name="phone" value="${esc(a.phone)}" />
      </div>
      <div class="input-group">
        <label>Địa chỉ chi tiết</label
        ><textarea name="address" required rows="3">${esc(a.address)}</textarea>
      </div>
      <button class="btn btn-primary btn-block" type="submit">
        Lưu địa chỉ
      </button>
    </form>`,
  );
}

function persist(k, v) {
  write(k, v);
  render(true);
}

onForm("track-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  e.preventDefault();
  let q = e.target.elements.code.value.trim();
  go("#/track?code=" + encodeURIComponent(q));
});

onForm("profile-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  profileData = {
    name: val("name"),
    phone: val("phone"),
    email: val("email"),
  };
  persist("profileData", profileData);
  toast("Đã cập nhật hồ sơ demo");
});

onForm("address-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  let i = Number(val("idx")),
    a = { name: val("name"), phone: val("phone"), address: val("address") };
  if (i < 0) addressBook.push(a);
  else addressBook[i] = a;
  write("addressBook", addressBook);
  closeModal();
  render(true);
  toast("✓ Đã lưu địa chỉ nhận hàng");
});

onAction("account-tab", (button, e) => {
  const id = button.dataset.id;
  accountTab = id;
  render(true);
});

onAction("account-profile", (button, e) => {
  accountTab = "profile";
  render(true);
});

onAction("cancel-order", (button, e) => {
  const id = button.dataset.id;
  const o = orders.find((o) => o.id === id);
  if (o && o.status === "pending") {
    o.status = "cancelled";
    write("orders", orders);
    render(true);
    toast("Đã ghi nhận yêu cầu hủy trong bản demo");
  }
});

onAction("order-tab", (button, e) => {
  const id = button.dataset.id;
  adminFilter = id;
  render(true);
});

onAction("read-all", (button, e) => {
  notifications.forEach((n) => (n.seen = true));
  persist("notifications", notifications);
});

onAction("notification-remove", (button, e) => {
  const id = button.dataset.id;
  notifications.splice(Number(id), 1);
  persist("notifications", notifications);
});

onAction("address-new", (button, e) => {
  addressModal();
});

onAction("address-edit", (button, e) => {
  const id = button.dataset.id;
  addressModal(Number(id));
});

onAction("address-delete", (button, e) => {
  const id = button.dataset.id;
  addressBook.splice(Number(id), 1);
  persist("addressBook", addressBook);
  toast("Đã xóa địa chỉ");
});

document.addEventListener("change", (e) => {
  if (e.target.id === "marketing-opt") {
    newsOpt = e.target.checked;
    write("newsOpt", newsOpt);
    toast("Đã lưu tùy chọn nhận thông tin");
  }
});
