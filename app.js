// Hàm dùng chung và trạng thái của bản giao diện.
"use strict";

const money = (n) => Math.round(n).toLocaleString("vi-VN") + "đ";

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const pById = (id) => PRODUCTS.find((p) => p.id === id);

const catName = (id) =>
  (CATEGORIES.find((c) => c[0] === id) || ["", "Sản phẩm"])[1];

const read = (k, def) => {
  try {
    const v = JSON.parse(localStorage.getItem("dnv_" + k));
    return v ?? def;
  } catch {
    return def;
  }
};

const write = (k, v) => {
  try {
    localStorage.setItem("dnv_" + k, JSON.stringify(v));
  } catch {}
};

let cart = read("cart", {});

let favs = read("favorites", []);

let logged = read("user", false);

let orders = read("orders", []);

let selectedVariant = "";

let sort = "popular";

let filterBrand = "";

let filterPrice = "all";

let mobileFilter = false;

let helpTopic = "buy";

let accountTab = "all";

let detailTab = "spec";

let coupon = "";

let currentCategory = "dien-thoai";

let trackOpen = false;

let compareIds = read("compare", []);

let addressBook = read("addressBook", []);

let profileData = read("profileData", {
  name: "Khách hàng Nhà Vui",
  phone: "",
  email: "",
});

let messages = read("messages", []);

let customReviews = read("reviews", []);

let notifications = read("notifications", [
  {
    title: "Chào mừng đến với Nhà Vui",
    message: "Khám phá các sản phẩm mới và lưu voucher yêu thích.",
    seen: false,
  },
]);

let inventory = read("inventory", {});

let adminChanges = read("adminChanges", {});

let manualProducts = read("manualProducts", []);

let newsOpt = read("newsOpt", false);

let campaignIndex = 0;

let adminFilter = "all";

// File app.js được nạp trước. Các file chức năng đăng ký xử lý phía dưới.
const siteRoot = new URL("../", document.currentScript.src).href;
const actionHandlers = new Map();
const formHandlers = new Map();
function onAction(name, handler) {
  actionHandlers.set(name, handler);
}
function onForm(name, handler) {
  formHandlers.set(name, handler);
}
function html(parts, ...values) {
  return parts.reduce(
    (result, part, i) => result + part + (values[i] ?? ""),
    "",
  );
}

const pageFiles = {
  home: "index.html",
  categories: "pages/categories.html",
  category: "pages/category.html",
  brands: "pages/brands.html",
  brand: "pages/brand.html",
  "flash-sale": "pages/flash-sale.html",
  search: "pages/search.html",
  product: "pages/product.html",
  cart: "pages/cart.html",
  checkout: "pages/checkout.html",
  success: "pages/success.html",
  login: "pages/login.html",
  register: "pages/register.html",
  forgot: "pages/forgot.html",
  account: "pages/account.html",
  profile: "pages/profile.html",
  addresses: "pages/addresses.html",
  orders: "pages/orders.html",
  order: "pages/order.html",
  track: "pages/track.html",
  favorites: "pages/favorites.html",
  compare: "pages/compare.html",
  vouchers: "pages/vouchers.html",
  notifications: "pages/notifications.html",
  support: "pages/support.html",
  promotions: "pages/promotions.html",
  contact: "pages/contact.html",
  stores: "pages/stores.html",
  about: "pages/about.html",
  reviews: "pages/reviews.html",
  admin: "pages/admin.html",
};

// Hỗ trợ cả đường dẫn cũ #/product/iphone-17 và trang HTML riêng.
function pageUrl(hash) {
  const [pathname, query = ""] = hash.replace(/^#?\//, "").split("?");
  const [page, ...ids] = pathname.split("/");
  const url = new URL(pageFiles[page] || "pages/not-found.html", siteRoot);
  url.search = query;
  if (ids.length) url.searchParams.set("id", decodeURIComponent(ids.join("/")));
  return url.href;
}
function route() {
  const query = new URLSearchParams(location.search);
  return {
    page: document.body.dataset.page || "home",
    id: query.get("id") || "",
    query,
  };
}
function go(hash) {
  location.href = pageUrl(hash);
}
function rewriteLinks(root = document) {
  root.querySelectorAll('a[href^="#/"]').forEach((link) => {
    link.href = pageUrl(link.getAttribute("href"));
  });
}
function labelFields(root = document) {
  root.querySelectorAll(".input-group").forEach((group, i) => {
    const label = group.querySelector("label");
    const field = group.querySelector("input, select, textarea");
    if (!label || !field || label.contains(field)) return;
    field.id ||= `field-${document.body.dataset.page}-${i}`;
    label.htmlFor = field.id;
  });
}

function render(keepScroll = false) {
  const r = route();
  const main = document.querySelector("main");
  const isAdmin = r.page === "admin";
  document.getElementById("site-header").hidden = isAdmin;
  document.getElementById("site-footer").hidden = isAdmin;
  if (!isAdmin) {
    document.getElementById("site-header").innerHTML = header();
    document.getElementById("site-footer").innerHTML = footer();
  }
  const staticPages = {
    home: mountHome,
    product: mountProduct,
    cart: mountCart,
    checkout: mountCheckout,
    login: () => {},
    register: () => {},
  };
  const otherPages = {
    categories: categoriesPage,
    category: () => category(r.id),
    brands: brandsPage,
    brand: () => brandPage(r.id),
    "flash-sale": flashSalePage,
    search: () => search(r.query.get("q") || ""),
    success: () => success(r.id),
    forgot: forgotPage,
    account: accountHome,
    profile: profilePage,
    addresses: addressesPage,
    orders: ordersPage,
    order: () => orderDetailPage(r.id),
    track: () => trackPage(r.query.get("code") || ""),
    favorites,
    compare: comparePage,
    vouchers: vouchersPage,
    notifications: notificationPage,
    support: () => supportPage(r.id),
    promotions,
    contact: contactPage,
    stores: storesPage,
    about: aboutPage,
    reviews: () => reviewsPage(r.id),
    admin: () => adminPageV2(r.id || "dashboard"),
  };
  if (staticPages[r.page]) staticPages[r.page]();
  else main.innerHTML = (otherPages[r.page] || missing)();
  rewriteLinks();
  labelFields();
  updateCountdown();
  const heading = main.querySelector("h1");
  document.title =
    (heading?.textContent.trim() || "Trang chủ") + " | Điện Máy Nhà Vui";
  if (!keepScroll) window.scrollTo(0, 0);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  // Nhấn trong hộp thoại không được xem là nhấn vào nền bên ngoài.
  if (button.classList.contains("modal-backdrop") && event.target !== button)
    return;
  const handler = actionHandlers.get(button.dataset.action);
  if (handler) {
    event.preventDefault();
    handler(button, event);
  }
});
document.addEventListener("submit", (event) => {
  const handler = formHandlers.get(event.target.id);
  if (!handler) return;
  event.preventDefault();
  if (event.target.reportValidity()) handler(event.target, event);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#/")) location.replace(pageUrl(location.hash));
});
document.addEventListener("DOMContentLoaded", () => {
  if (location.hash.startsWith("#/")) {
    location.replace(pageUrl(location.hash));
    return;
  }
  coupon = read("savedCoupon", "");
  campaignIndex = read("campaignIndex", 0) % 3;
  render();
});
