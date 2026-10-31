// Các màn hình quản trị minh họa, chưa có phân quyền.
"use strict";

const adminLinks = [
  ["dashboard", "Tổng quan", "▦"],
  ["products", "Sản phẩm", "▤"],
  ["categories", "Danh mục", "☷"],
  ["orders", "Đơn hàng", "▣"],
  ["customers", "Khách hàng", "♙"],
  ["inventory", "Tồn kho", "▥"],
  ["promotions", "Khuyến mãi", "◇"],
  ["reports", "Báo cáo", "▥"],
  ["tickets", "Hỗ trợ", "☎"],
  ["reviews", "Đánh giá", "☆"],
  ["settings", "Cài đặt", "⚙"],
];

function adminPageV2(section = "dashboard") {
  let title = (adminLinks.find((x) => x[0] === section) || adminLinks[0])[1];
  return html`<div class="admin-page">
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-logo">
          <b>⚡ NHÀ VUI</b><small>COMMERCE STUDIO</small>
        </div>
        <div class="admin-nav-label">KHÔNG GIAN QUẢN TRỊ</div>
        <nav class="admin-nav">
          ${adminLinks.map((a) => html`<a class="${section === a[0] ? "active" : ""}" href="#/admin/${a[0]}"><span>${a[2]}</span>${a[1]}</a>`).join("")}<a
            href="#/home"
            >↗ Về cửa hàng</a
          >
        </nav>
        <div class="admin-nav-note">
          Prototype phục vụ đồ án. Các thay đổi chỉ lưu trên trình duyệt này.
        </div>
      </aside>
      <div class="admin-main">
        <div class="admin-top">
          <div>
            <div class="admin-breadcrumb">
              ĐIỆN MÁY NHÀ VUI / QUẢN TRỊ / ${title.toUpperCase()}
            </div>
            <h1>${title}</h1>
          </div>
          <div class="admin-ops">
            <a href="#/notifications" class="btn btn-light">🔔 Thông báo</a
            ><span class="avatar">QT</span>
          </div>
        </div>
        <div class="admin-intro">
          ${section === "dashboard" ? "Theo dõi toàn cảnh hoạt động kinh doanh" : "Quản lý " + title.toLowerCase() + " trong mô hình thương mại điện tử."}
          <span>Dữ liệu minh họa — không kết nối máy chủ</span>
        </div>
        ${adminBody(section)}
      </div>
    </div>
  </div>`;
}

function adminBody(section) {
  let all = sampleOrders(),
    sales = all.reduce((a, o) => a + o.total, 0);
  let kpis = [
    ["Doanh thu mẫu", money(sales), "↗ Tổng đơn hiện có"],
    ["Đơn hàng", String(all.length), "Quản lý trạng thái"],
    ["Sản phẩm", String(PRODUCTS.length), "Danh mục trực tuyến"],
    ["Yêu cầu hỗ trợ", String(messages.length), "Thông qua biểu mẫu"],
  ];
  let stats = html`<div class="admin-stats v2-stats">
    ${kpis
      .map(
        (x, i) =>
          html`<div class="panel stat">
            <div class="label">
              <span>${x[0]}</span><span>${["💰", "📦", "🛍️", "🎧"][i]}</span>
            </div>
            <strong class="value">${x[1]}</strong><small>${x[2]}</small>
          </div>`,
      )
      .join("")}
  </div>`;
  if (section === "dashboard")
    return html`${stats}
      <div class="admin-columns">
        <div class="panel admin-card">
          <div class="section-head">
            <h3>Doanh thu theo ngày</h3>
            <a class="linkred" href="#/admin/reports">Xem báo cáo →</a>
          </div>
          <div class="bars">
            ${[46, 68, 53, 89, 61, 100, 82].map((h, i) => html`<div class="bar" style="height:${h}%"><span>${["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}</span></div>`).join("")}
          </div>
        </div>
        <div class="panel admin-card">
          <h3>Trạng thái vận hành</h3>
          <div class="admin-kpi-list">
            ${["Chờ xác nhận", "Đang xử lý", "Đã giao", "Đã hủy"].map((s, i) => html`<div><span>${s}</span><b>${[all.filter((o) => o.status === "pending").length, 2, all.filter((o) => o.status === "delivered").length, all.filter((o) => o.status === "cancelled").length][i]} đơn</b></div>`).join("")}
          </div>
        </div>
      </div>
      ${adminTable(
        "Đơn hàng mới nhất",
        all
          .slice(0, 6)
          .map((o) => [
            o.id,
            o.name,
            money(o.total),
            statusLabel(o.status),
            html`<a class="linkred" href="#/order/${o.id}">Xem →</a>`,
          ]),
      )}`;
  if (section === "products" || section === "inventory") {
    let isStock = section === "inventory";
    return html`<div class="admin-toolbar">
        <input
          id="admin-search"
          placeholder="⌕  Tìm sản phẩm trong bảng..."
          aria-label="Tìm sản phẩm"
        /><button class="btn btn-primary" data-action="product-new">
          + Thêm sản phẩm</button
        ><button
          class="btn btn-light"
          data-action="export-csv"
          data-id="products"
        >
          ↓ Xuất CSV
        </button>
      </div>
      <div class="panel admin-card">
        <div class="section-head">
          <h3>
            ${isStock ? "Quản lý tồn kho" : "Danh sách sản phẩm"}
            (${PRODUCTS.length})
          </h3>
          <span class="badge">Đồng bộ tại trình duyệt</span>
        </div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="admin-data-rows">
              ${PRODUCTS.map(
                (p) =>
                  html`<tr>
                    <td><a href="#/product/${p.id}">${esc(p.name)}</a></td>
                    <td>${esc(p.brand)}</td>
                    <td>${money(p.price)}</td>
                    <td>
                      <span
                        class="status ${Number(inventory[p.id] ?? 25) === 0 ? "cancelled" : "delivered"}"
                        >${inventory[p.id] ?? 25}</span
                      >
                    </td>
                    <td>
                      <button
                        class="btn btn-light btn-sm"
                        data-action="${isStock ? "inventory-edit" : "product-edit"}"
                        data-id="${p.id}"
                      >
                        ${isStock ? "Cập nhật kho" : "Chỉnh sửa"}
                      </button>
                    </td>
                  </tr>`,
              ).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }
  if (section === "orders")
    return html`<div class="admin-toolbar">
        <input id="admin-search" placeholder="⌕  Mã đơn / khách hàng" /><select
          id="admin-status-filter"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="delivered">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option></select
        ><button
          class="btn btn-light"
          data-action="export-csv"
          data-id="orders"
        >
          ↓ Xuất CSV
        </button>
      </div>
      <div class="panel admin-card">
        <h3>Danh sách đơn hàng</h3>
        <div class="table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày</th>
                <th>Tổng</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody id="admin-data-rows">
              ${all
                .map(
                  (o) =>
                    html`<tr data-status="${o.status}">
                      <td><b>${o.id}</b></td>
                      <td>${esc(o.name)}</td>
                      <td>${o.date}</td>
                      <td>${money(o.total)}</td>
                      <td>
                        <select data-admin-status="${o.id}">
                          ${[
                            ["pending", "Chờ xác nhận"],
                            ["delivered", "Hoàn thành"],
                            ["cancelled", "Hủy"],
                          ]
                            .map(
                              (x) =>
                                html`<option
                                  value="${x[0]}"
                                  ${o.status === x[0] ? "selected" : ""}
                                >
                                  ${x[1]}
                                </option>`,
                            )
                            .join("")}
                        </select>
                      </td>
                      <td>
                        <a class="linkred" href="#/order/${o.id}">Xem →</a>
                      </td>
                    </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  if (section === "categories")
    return html`<div class="admin-toolbar">
        <a class="btn btn-primary" href="#/categories"
          >Xem giao diện danh mục ↗</a
        >
      </div>
      <div class="admin-category-grid">
        ${CATEGORIES.map(
          (c) =>
            html`<a href="#/category/${c[0]}" class="panel"
              ><span>${c[2]}</span>
              <h3>${c[1]}</h3>
              <p>${PRODUCTS.filter((p) => p.cat === c[0]).length} sản phẩm</p>
              <b>Xem danh mục →</b></a
            >`,
        ).join("")}
      </div>`;
  if (section === "customers")
    return `${stats}${adminTable("Khách hàng và người nhận", [...new Map(all.map((o) => [o.name, [o.name, o.phone || "Chưa có", "Khách hàng mua hàng", String(all.filter((x) => x.name === o.name).length) + " đơn", html`<a href="#/admin/orders" class="linkred">Đơn hàng →</a>`]])).values()])}`;
  if (section === "promotions")
    return html`<div class="admin-toolbar">
        <a class="btn btn-primary" href="#/vouchers">Mở kho voucher ↗</a>
      </div>
      <div class="voucher-list">
        ${voucherList
          .map(
            (v) =>
              html`<article class="voucher-ticket">
                <div class="voucher-icon">🎟</div>
                <div>
                  <h3>${v.text}</h3>
                  <p>Đơn từ ${money(v.min)}</p>
                  <b>${v.code}</b>
                </div>
                <button
                  class="btn btn-outline"
                  data-action="voucher-edit"
                  data-id="${v.code}"
                >
                  Sửa điều kiện
                </button>
              </article>`,
          )
          .join("")}
      </div>`;
  if (section === "reports")
    return html`${stats}
      <div class="admin-columns">
        <div class="panel admin-card">
          <h3>Doanh thu 7 ngày (minh họa)</h3>
          <div class="bars">
            ${[50, 60, 80, 45, 85, 95, 72].map((x, i) => html`<div class="bar" style="height:${x}%"><span>${["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}</span></div>`).join("")}
          </div>
        </div>
        <div class="panel admin-card">
          <h3>Phân bổ danh mục</h3>
          ${CATEGORIES.slice(0, 5)
            .map(
              (x) =>
                html`<div class="admin-kpi-list">
                  <div>
                    <span>${x[1]}</span
                    ><b
                      >${PRODUCTS.filter((p) => p.cat === x[0]).length} sản
                      phẩm</b
                    >
                  </div>
                </div>`,
            )
            .join("")}<button
            data-action="export-csv"
            data-id="orders"
            class="btn btn-primary"
          >
            ↓ Xuất báo cáo CSV
          </button>
        </div>
      </div>`;
  if (section === "tickets")
    return html`<div class="panel admin-card">
      <div class="section-head">
        <h3>Yêu cầu khách hàng (${messages.length})</h3>
        <a href="#/contact" class="linkred">Xem form gửi tin →</a>
      </div>
      ${
        messages.length
          ? messages
              .map(
                (m, i) =>
                  html`<div class="ticket-row">
                    <div>
                      <b>${esc(m.name)} · ${esc(m.topic)}</b>
                      <p>${esc(m.message)}</p>
                      <small>${esc(m.email)}</small>
                    </div>
                    <button
                      class="btn btn-outline"
                      data-action="ticket-toggle"
                      data-id="${i}"
                    >
                      ${m.resolved ? "↶ Mở lại" : "✓ Đã xử lý"}
                    </button>
                  </div>`,
              )
              .join("")
          : emptyState(
              "🎧",
              "Chưa có yêu cầu demo",
              "Hãy thử gửi một yêu cầu ở trang Liên hệ.",
              "#/contact",
              "Gửi yêu cầu",
            )
      }
    </div>`;
  if (section === "reviews")
    return html`<div class="panel admin-card">
      <h3>Đánh giá (${customReviews.length})</h3>
      ${
        customReviews.length
          ? customReviews
              .map(
                (v, i) =>
                  html`<div class="ticket-row">
                    <div>
                      <b>${esc(v.name)} · ${v.stars} sao</b>
                      <p>${esc(v.comment)}</p>
                    </div>
                    <button
                      class="btn btn-outline"
                      data-action="review-delete"
                      data-id="${i}"
                    >
                      Xóa đánh giá
                    </button>
                  </div>`,
              )
              .join("")
          : emptyState(
              "⭐",
              "Chưa có đánh giá",
              "Để thử, mở một sản phẩm và gửi đánh giá.",
              "#/category/dien-thoai",
              "Xem sản phẩm",
            )
      }
    </div>`;
  if (section === "settings")
    return html`<div class="panel admin-card">
      <h2>Thiết lập bản demo</h2>
      <p>
        Quản lý lựa chọn và dữ liệu mô phỏng trong trình duyệt. Không thay đổi
        dữ liệu server.
      </p>
      <label class="checkitem"
        ><input
          type="checkbox"
          id="marketing-opt"
          ${newsOpt ? "checked" : ""}
        />
        Đồng ý nhận thông báo khuyến mãi mô phỏng</label
      >
      <div class="actionbar">
        <button class="btn btn-outline" data-action="reset-data">
          Đặt lại dữ liệu demo</button
        ><a href="#/home" class="btn btn-primary">Về website</a>
      </div>
    </div>`;
  return emptyState(
    "📋",
    "Không tìm thấy mục quản trị",
    "Chọn một mục trong menu quản trị.",
    "#/admin",
    "Về tổng quan",
  );
}

function adminTable(title, rows) {
  return html`<div class="panel admin-card" style="margin-top:18px">
    <div class="section-head">
      <h3>${title}</h3>
      <button
        class="btn btn-light btn-sm"
        data-action="export-csv"
        data-id="orders"
      >
        ↓ Xuất dữ liệu
      </button>
    </div>
    <div class="table-scroll">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Mã / Tên</th>
            <th>Khách hàng / Liên hệ</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                html`<tr>
                  ${row.map((x) => html`<td>${x}</td>`).join("")}
                </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function productModal(id = "") {
  let p = pById(id) || {
    id: "",
    name: "",
    brand: "",
    cat: "dien-thoai",
    price: 0,
    old: 0,
    off: 0,
    type: "phone",
    stock: true,
    color: "#c5d0df",
    rating: 4.8,
    variants: ["Tiêu chuẩn"],
    spec: ["Sản phẩm công nghệ"],
  };
  modal(
    id ? "Sửa sản phẩm" : "Thêm sản phẩm",
    html`<form id="admin-product-form">
      <input type="hidden" name="productId" value="${esc(p.id)}" />
      <div class="fieldgrid">
        <div class="input-group">
          <label>Tên sản phẩm</label
          ><input name="name" required value="${esc(p.name)}" />
        </div>
        <div class="input-group">
          <label>Thương hiệu</label
          ><input name="brand" required value="${esc(p.brand)}" />
        </div>
        <div class="input-group">
          <label>Danh mục</label
          ><select name="cat">
            ${CATEGORIES.map((c) => html`<option value="${c[0]}" ${p.cat === c[0] ? "selected" : ""}>${c[1]}</option>`).join("")}
          </select>
        </div>
        <div class="input-group">
          <label>Giá bán (đ)</label
          ><input
            type="number"
            min="1000"
            name="price"
            required
            value="${p.price || ""}"
          />
        </div>
        <div class="input-group">
          <label>Giá niêm yết (đ)</label
          ><input
            type="number"
            min="1000"
            name="old"
            required
            value="${p.old || ""}"
          />
        </div>
        <div class="input-group">
          <label>Tồn kho</label
          ><input
            type="number"
            min="0"
            name="qty"
            required
            value="${inventory[p.id] ?? 25}"
          />
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-block">
        Lưu sản phẩm
      </button>
    </form>`,
  );
}

function stockModal(id) {
  let p = pById(id);
  if (!p) return;
  modal(
    "Cập nhật kho • " + p.name,
    html`<form id="stock-form">
      <input type="hidden" name="id" value="${p.id}" />
      <div class="input-group">
        <label>Số lượng tồn kho</label
        ><input
          type="number"
          name="qty"
          min="0"
          max="9999"
          required
          value="${inventory[p.id] ?? 25}"
        />
      </div>
      <button class="btn btn-primary btn-block" type="submit">
        Cập nhật tồn kho
      </button>
    </form>`,
  );
}

function voucherModal(code) {
  let v = voucherList.find((x) => x.code === code);
  if (!v) return;
  modal(
    "Điều chỉnh voucher " + code,
    html`<form id="voucher-edit-form">
      <input type="hidden" name="code" value="${code}" />
      <div class="input-group">
        <label>Giá trị đơn tối thiểu (đ)</label
        ><input type="number" name="min" min="0" value="${v.min}" required />
      </div>
      <div class="input-group">
        <label>Mức giảm cố định (đ, để 0 nếu theo %)</label
        ><input
          type="number"
          name="amount"
          min="0"
          value="${v.amount || 0}"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary btn-block">
        Lưu thay đổi
      </button>
    </form>`,
  );
}

function doExport(kind) {
  let rows =
    kind === "products"
      ? [
          ["Mã", "Tên", "Thương hiệu", "Danh mục", "Giá", "Tồn kho"],
          ...PRODUCTS.map((p) => [
            p.id,
            p.name,
            p.brand,
            p.cat,
            p.price,
            inventory[p.id] ?? 25,
          ]),
        ]
      : [
          ["Mã đơn", "Người nhận", "Ngày", "Tổng", "Trạng thái"],
          ...sampleOrders().map((o) => [
            o.id,
            o.name,
            o.date,
            o.total,
            o.status,
          ]),
        ];
  let csv =
    "\uFEFF" +
    rows
      .map((r) =>
        r.map((x) => '"' + String(x).replace(/"/g, '""') + '"').join(","),
      )
      .join("\r\n");
  let b = new Blob([csv], { type: "text/csv;charset=utf-8" }),
    url = URL.createObjectURL(b),
    a = document.createElement("a");
  a.href = url;
  a.download = "nhavui_" + kind + ".csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast("Đã tạo tệp CSV dữ liệu mô phỏng");
}

onForm("admin-product-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  let id = val("productId"),
    name = val("name"),
    brand = val("brand"),
    cat = val("cat"),
    price = Number(val("price")),
    old = Number(val("old")),
    qty = Number(val("qty"));
  if (id) {
    let p = pById(id);
    if (p) {
      Object.assign(p, {
        name,
        brand,
        cat,
        price,
        old,
        off: Math.max(0, Math.round((1 - price / old) * 100)),
      });
      adminChanges[id] = { name, brand, cat, price, old, off: p.off };
      write("adminChanges", adminChanges);
    }
  } else {
    let nid = "custom-" + Date.now();
    let p = {
      id: nid,
      name,
      brand,
      cat,
      price,
      old,
      off: Math.max(0, Math.round((1 - price / old) * 100)),
      type: ["laptop", "tivi"].includes(cat) ? cat : "phone",
      color: "#b4cbdd",
      rating: 4.8,
      stock: true,
      variants: ["Tiêu chuẩn"],
      spec: ["Hàng công nghệ mẫu", "Bảo hành theo chính sách"],
    };
    PRODUCTS.push(p);
    manualProducts.push(p);
    write("manualProducts", manualProducts);
    id = nid;
  }
  inventory[id] = qty;
  write("inventory", inventory);
  closeModal();
  render(true);
  toast("✓ Đã lưu thông tin sản phẩm");
});

onForm("stock-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  inventory[val("id")] = Number(val("qty"));
  write("inventory", inventory);
  closeModal();
  render(true);
  toast("✓ Đã cập nhật tồn kho demo");
});

onForm("voucher-edit-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  let v = voucherList.find((x) => x.code === val("code"));
  if (v) {
    v.min = Number(val("min"));
    v.amount = Number(val("amount"));
    write("vouchers", voucherList);
  }
  closeModal();
  render(true);
  toast("✓ Đã cập nhật điều kiện mã ưu đãi");
});

onAction("reset-confirm", () => {
  const keys = [
    "cart",
    "favorites",
    "compare",
    "addressBook",
    "profileData",
    "messages",
    "reviews",
    "notifications",
    "inventory",
    "adminChanges",
    "manualProducts",
    "orders",
    "user",
    "savedCoupon",
    "vouchers",
    "campaignIndex",
    "countdownEnd",
    "newsOpt",
  ];
  keys.forEach((key) => localStorage.removeItem("dnv_" + key));
  go("#/home");
});

document.addEventListener("change", (e) => {
  if (e.target.dataset.adminStatus) {
    let id = e.target.dataset.adminStatus,
      o = orders.find((o) => o.id === id);
    if (!o) {
      let s = sampleOrders().find((o) => o.id === id);
      if (s) {
        toast("Đơn lịch sử minh họa không thể cập nhật. Tạo đơn mới để thử.");
        render(true);
      }
      return;
    }
    o.status = e.target.value;
    write("orders", orders);
    render(true);
    toast("✓ Cập nhật trạng thái đơn hàng");
  }
  if (e.target.id === "admin-status-filter") {
    document
      .querySelectorAll("#admin-data-rows tr")
      .forEach(
        (tr) =>
          (tr.style.display =
            e.target.value === "all" || tr.dataset.status === e.target.value
              ? ""
              : "none"),
      );
  }
});

onAction("product-new", (button, e) => {
  productModal();
});

onAction("product-edit", (button, e) => {
  const id = button.dataset.id;
  productModal(id);
});

onAction("inventory-edit", (button, e) => {
  const id = button.dataset.id;
  stockModal(id);
});

onAction("voucher-edit", (button, e) => {
  const id = button.dataset.id;
  voucherModal(id);
});

onAction("ticket-toggle", (button, e) => {
  const id = button.dataset.id;
  messages[Number(id)].resolved = !messages[Number(id)].resolved;
  persist("messages", messages);
});

onAction("review-delete", (button, e) => {
  const id = button.dataset.id;
  customReviews.splice(Number(id), 1);
  persist("reviews", customReviews);
});

onAction("export-csv", (button, e) => {
  const id = button.dataset.id;
  doExport(id);
});

onAction("reset-data", (button, e) => {
  modal(
    "Đặt lại dữ liệu mô phỏng",
    html`<p>
        Tất cả giỏ hàng, địa chỉ, đánh giá, sản phẩm thêm mới và đơn hàng sẽ
        được xóa khỏi trình duyệt này.
      </p>
      <div class="actionbar">
        <button class="btn btn-light" data-action="modal-close">Hủy</button
        ><button class="btn btn-primary" data-action="reset-confirm">
          Xác nhận đặt lại
        </button>
      </div>`,
  );
});

document.addEventListener("input", (e) => {
  if (e.target.id === "admin-search") {
    let q = e.target.value.toLowerCase();
    document
      .querySelectorAll("#admin-data-rows tr")
      .forEach(
        (tr) =>
          (tr.style.display = tr.textContent.toLowerCase().includes(q)
            ? ""
            : "none"),
      );
  }
});
