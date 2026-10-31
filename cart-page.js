// Hiển thị các dòng sản phẩm trong trang giỏ hàng.
"use strict";

function cartTotal() {
  return Object.entries(cart).reduce(
    (a, [id, n]) => a + (pById(id)?.price || 0) * n,
    0,
  );
}

function mountCart() {
  const items = Object.entries(cart).filter(
    ([id, quantity]) => pById(id) && quantity > 0,
  );
  document.getElementById("cart-count").textContent = `${nCart()} sản phẩm`;
  document.getElementById("cart-empty").hidden = items.length > 0;
  document.getElementById("cart-content").hidden = items.length === 0;
  const list = document.getElementById("cart-items");
  list.replaceChildren();
  for (const [id, quantity] of items) {
    const product = pById(id);
    const row = document
      .getElementById("cart-item-template")
      .content.cloneNode(true);
    row.querySelectorAll("[data-product-link]").forEach((link) => {
      link.href = pageUrl("#/product/" + id);
    });
    row.querySelector("[data-picture]").innerHTML = productArt(product);
    row.querySelector("[data-name]").textContent = product.name;
    row.querySelector("[data-brand]").textContent = product.brand;
    row.querySelector("[data-price]").textContent = money(product.price);
    row.querySelector("[data-quantity]").textContent = quantity;
    row.querySelector("[data-line-total]").textContent = money(
      product.price * quantity,
    );
    row.querySelectorAll("[data-action]").forEach((button) => {
      button.dataset.id = id;
    });
    list.append(row);
  }
  document.querySelectorAll("[data-cart-total]").forEach((node) => {
    node.textContent = money(cartTotal());
  });
}
