// Voucher, tổng tiền và đặt hàng thử.
"use strict";

const voucherList = read("vouchers", [
  {
    code: "NHAVUI10",
    value: 10,
    cap: 1000000,
    min: 5000000,
    text: "Giảm 10% tối đa 1 triệu",
    expiry: "30/11/2026",
  },
  {
    code: "WELCOME200",
    value: 0,
    amount: 200000,
    min: 3000000,
    text: "Giảm trực tiếp 200.000đ",
    expiry: "30/11/2026",
  },
  {
    code: "SHIP30",
    value: 0,
    amount: 30000,
    min: 500000,
    text: "Hỗ trợ 30.000đ",
    expiry: "30/11/2026",
  },
]);

function couponDiscount() {
  let c = voucherList.find((v) => v.code === coupon);
  if (!c || cartTotal() < c.min) return 0;
  return Math.min(
    c.cap || Infinity,
    c.amount || Math.round((cartTotal() * c.value) / 100),
  );
}

function payableTotal() {
  return Math.max(0, cartTotal() - couponDiscount());
}

function applyCoupon() {
  let v = (document.getElementById("coupon-input")?.value || coupon)
    .trim()
    .toUpperCase();
  let c = voucherList.find((x) => x.code === v);
  if (!c)
    return toast("Mã không tồn tại. Thử NHAVUI10, WELCOME200 hoặc SHIP30.");
  if (cartTotal() < c.min)
    return toast("Đơn hàng chưa đạt giá trị tối thiểu " + money(c.min));
  coupon = v;
  write("savedCoupon", coupon);
  render(true);
  toast("✓ Áp dụng mã " + v + " thành công");
}

function mountCheckout() {
  const hasItems = nCart() > 0;
  document.getElementById("checkout-empty").hidden = hasItems;
  document.getElementById("checkout-content").hidden = !hasItems;
  if (!hasItems) return;
  document.getElementById("checkout-summary").innerHTML = orderSummary();
  applyAddressToCheckout();
}

onForm("checkout-form", (form) => {
  if (!nCart()) return;
  const unavailable = Object.entries(cart).some(
    ([id, quantity]) => !pById(id) || quantity > (inventory[id] ?? 25),
  );
  if (unavailable) {
    toast("Vui lòng kiểm tra lại số lượng trong giỏ hàng.");
    return;
  }
  const fields = new FormData(form);
  const now = new Date();
  const id =
    "DNV-" +
    now.getTime().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  orders.unshift({
    id,
    name: fields.get("name").trim(),
    phone: fields.get("phone").trim(),
    email: fields.get("email").trim(),
    address: fields.get("address").trim(),
    note: fields.get("note").trim(),
    ship: fields.get("ship"),
    payment: fields.get("payment"),
    items: Object.entries(cart).map(([id, n]) => ({ id, n })),
    total: payableTotal(),
    coupon,
    status: "pending",
    date: now.toLocaleDateString("vi-VN"),
  });
  write("orders", orders);
  cart = {};
  coupon = "";
  write("cart", cart);
  write("savedCoupon", "");
  go("#/success/" + id);
});
onAction("save-voucher", (button) => {
  coupon = button.dataset.id;
  write("savedCoupon", coupon);
  toast("Đã lưu mã " + coupon);
});
onAction("copy-coupon", (button) => {
  coupon = button.dataset.id;
  write("savedCoupon", coupon);
  toast("Đã lưu mã " + coupon);
});

function orderSummary() {
  let items = Object.entries(cart).filter(([id, n]) => pById(id) && n > 0);
  return html`<div class="panel summary">
    <h3>🧾 Tóm tắt đơn hàng</h3>
    ${items
      .map(([id, n]) => {
        const p = pById(id);
        return html`<div class="sum-row">
          <span>${n} × ${esc(p.name)}</span><b>${money(p.price * n)}</b>
        </div>`;
      })
      .join("")}
    <div class="sum-row">
      <span>Phí vận chuyển</span><b>Tính khi xác nhận</b>
    </div>
    <div class="sum-row">
      <span>Giảm bằng voucher</span
      ><b class="linkred">−${money(couponDiscount())}</b>
    </div>
    <div class="sum-row total">
      <b>Tạm thanh toán</b><b>${money(payableTotal())}</b>
    </div>
    <div class="input-group">
      <label>Áp dụng voucher</label>
      <div class="coupon-row">
        <input
          id="coupon-input"
          placeholder="NHAVUI10"
          value="${esc(coupon)}"
        /><button type="button" class="btn btn-outline" data-action="coupon">
          Áp dụng
        </button>
      </div>
    </div>
    <a class="linkred" href="#/vouchers">Xem tất cả mã giảm giá →</a
    ><button
      class="btn btn-primary btn-block"
      type="submit"
      form="checkout-form"
    >
      XÁC NHẬN ĐẶT HÀNG
    </button>
    <div class="notice yellow">
      Số tiền, ưu đãi và đơn hàng trong prototype là dữ liệu mô phỏng. Không
      phát sinh thanh toán thật.
    </div>
  </div>`;
}

function success(id) {
  const o = orders.find((o) => o.id === id);
  if (!o) return missing();
  return html`<div class="container page">
    ${crumb([["Đặt hàng thành công"]])}
    <div class="panel notice-status" style="max-width:780px;margin:10px auto">
      <span class="emoji">🎉</span>
      <h1>Đã ghi nhận yêu cầu đặt hàng!</h1>
      <p class="muted">
        Mã đơn minh họa: <strong style="color:var(--red)">${esc(o.id)}</strong>
      </p>
      <p>
        Đơn đang ở trạng thái <b>chờ xác nhận</b>. Trong hệ thống thật, nhân
        viên cần kiểm tra tồn kho và liên hệ xác nhận trước khi giữ hàng.
      </p>
      <div class="notice">
        Không phát sinh giao dịch thật. Đơn này chỉ lưu trong trình duyệt để
        trải nghiệm thiết kế.
      </div>
      <div class="chiprow" style="justify-content:center;margin-top:20px">
        <a
          class="btn btn-primary"
          href="#/track?code=${encodeURIComponent(o.id)}"
          >Tra cứu đơn hàng</a
        ><a class="btn btn-outline" href="#/home">Về trang chủ</a>
      </div>
    </div>
  </div>`;
}

function applyAddressToCheckout() {
  if (route().page !== "checkout" || !addressBook.length) return;
  let f = document.getElementById("checkout-form");
  if (!f) return;
  let a = addressBook[0];
  if (f.elements.name && !f.elements.name.value) f.elements.name.value = a.name;
  if (f.elements.phone && !f.elements.phone.value)
    f.elements.phone.value = a.phone;
  if (f.elements.address && !f.elements.address.value)
    f.elements.address.value = a.address;
}

function vouchersPage() {
  return shell(
    "Kho voucher Nhà Vui",
    "ƯU ĐÃI CHỜ BẠN",
    html`<div class="voucher-list">
        ${voucherList
          .map(
            (v) =>
              html`<article class="voucher-ticket">
                <div class="voucher-icon">🎟️</div>
                <div>
                  <h3>${v.text}</h3>
                  <p>Đơn tối thiểu ${money(v.min)} · HSD ${v.expiry}</p>
                  <b>${v.code}</b>
                </div>
                <button
                  class="btn btn-outline"
                  data-action="save-voucher"
                  data-id="${v.code}"
                >
                  Sử dụng mã
                </button>
              </article>`,
          )
          .join("")}
      </div>
      <p class="muted mini">
        Voucher là mô phỏng dùng để thử trải nghiệm thanh toán.
      </p>`,
  );
}

onAction("coupon", (button, e) => {
  applyCoupon();
});
