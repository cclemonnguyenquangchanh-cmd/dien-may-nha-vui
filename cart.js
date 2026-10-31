// Thay đổi giỏ hàng và lưu vào trình duyệt.
"use strict";

const nCart = () => Object.values(cart).reduce((a, b) => a + b, 0);

function add(id, buyNow = false) {
  const product = pById(id);
  if (!product) return;
  const available = inventory[id] ?? (product.stock ? 25 : 0);
  if ((cart[id] || 0) >= Math.min(99, available)) {
    toast("Số lượng trong giỏ đã đạt giới hạn tồn kho mẫu.");
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  write("cart", cart);
  if (buyNow) go("#/checkout");
  else {
    render(true);
    toast("Đã thêm sản phẩm vào giỏ hàng");
  }
}
onAction("add", (button) => add(button.dataset.id));
onAction("buy", (button) => add(button.dataset.id, true));
onAction("qty", (button) => {
  const id = button.dataset.id;
  const available = Math.min(99, inventory[id] ?? 25);
  const quantity = (cart[id] || 0) + Number(button.dataset.step);
  if (quantity > available) {
    toast("Đã đạt số lượng tồn kho mẫu.");
    return;
  }
  if (quantity <= 0) delete cart[id];
  else cart[id] = quantity;
  write("cart", cart);
  render(true);
});
onAction("remove", (button) => {
  delete cart[button.dataset.id];
  write("cart", cart);
  render(true);
  toast("Đã xóa sản phẩm khỏi giỏ");
});
onAction("clear-cart", () => {
  cart = {};
  write("cart", cart);
  render(true);
});
