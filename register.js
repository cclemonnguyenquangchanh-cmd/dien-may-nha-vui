// Biểu mẫu tài khoản. Chưa có xác thực phía máy chủ.
"use strict";

function authPage() {
  return emptyState(
    "👤",
    "Bạn chưa đăng nhập",
    "Mở trang đăng nhập để thử giao diện tài khoản.",
    "#/login",
    "Đăng nhập",
  );
}
onForm("auth-form", (form) => {
  const name = form.elements.name?.value.trim();
  if (name) {
    profileData.name = name;
    write("profileData", profileData);
  }
  // Chỉ bật trạng thái xem thử. Không lưu và không kiểm tra mật khẩu.
  logged = true;
  write("user", true);
  go("#/account");
});

function forgotPage() {
  return shell(
    "Khôi phục mật khẩu",
    "BẢO MẬT TÀI KHOẢN",
    html`<form class="panel pad centered-form" id="forgot-form">
      <h2>Đặt lại mật khẩu</h2>
      <p class="muted">
        Bản demo chỉ mô phỏng gửi mã, không gửi email hoặc SMS thật.
      </p>
      <div class="input-group">
        <label>Email hoặc số điện thoại</label
        ><input required name="identity" placeholder="email@example.com" />
      </div>
      <button class="btn btn-primary btn-block" type="submit">
        Gửi yêu cầu khôi phục</button
      ><a href="#/login" class="linkred">← Quay lại đăng nhập</a>
    </form>`,
  );
}

onForm("forgot-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  toast("✓ Đã tiếp nhận yêu cầu. Bản demo không gửi mã thực tế.");
});

onAction("logout", (button, e) => {
  logged = false;
  write("user", false);
  accountTab = "all";
  toast("Đã đăng xuất khỏi tài khoản demo");
  go("#/login");
});
