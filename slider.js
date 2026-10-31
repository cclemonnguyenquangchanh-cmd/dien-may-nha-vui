// Banner đổi riêng phần nội dung, không dựng lại cả trang.
"use strict";
const campaigns = [
  {
    tag: "CHÀO MỪNG ĐẾN NHÀ VUI",
    title: "Công nghệ nâng tầm cuộc sống",
    text: "Bộ sưu tập công nghệ được yêu thích",
    link: "#/category/dien-thoai",
    picture: "banner 1.svg",
  },
  {
    tag: "FLASH SALE",
    title: "Săn ưu đãi mỗi ngày",
    text: "Xem các sản phẩm đang có giá ưu đãi trong bản mẫu.",
    link: "#/flash-sale",
    picture: "banner 2.svg",
  },
  {
    tag: "MUA SẮM TẠI NHÀ VUI",
    title: "Chọn sản phẩm, xem chính sách",
    text: "Thông tin giao hàng, thanh toán và bảo hành.",
    link: "#/support",
    picture: "banner 3.svg",
  },
];
function mountHome() {
  const categoryList = document.querySelector("[data-category-list]");
  categoryList.innerHTML = CATEGORIES.map(
    (category) =>
      html`<a href="#/category/${category[0]}"
        ><span>${category[2]}</span>${category[1]}<span class="category-arrow"
          >›</span
        ></a
      >`,
  ).join("");
  document.querySelector("[data-category-cards]").innerHTML = CATEGORIES.slice(
    0,
    6,
  )
    .map(
      (category) =>
        html`<a class="category-card" href="#/category/${category[0]}"
          ><span>${category[2]}</span><b>${category[1]}</b
          ><small>Xem sản phẩm →</small></a
        >`,
    )
    .join("");
  const groups = {
    sale: PRODUCTS.slice(0, 4),
    phones: PRODUCTS.filter((product) => product.cat === "dien-thoai").slice(
      0,
      5,
    ),
    laptops: PRODUCTS.filter((product) =>
      ["laptop", "tivi", "may-tinh-bang"].includes(product.cat),
    ).slice(0, 5),
  };
  document.querySelectorAll("[data-products]").forEach((group) => {
    group.innerHTML = groups[group.dataset.products].map(productCard).join("");
  });
  showCampaign();
}
function showCampaign() {
  const banner = document.getElementById("home-banner");
  if (!banner) return;
  const campaign = campaigns[campaignIndex];
  banner.querySelector("[data-banner-tag]").textContent = campaign.tag;
  banner.querySelector("h1").textContent = campaign.title;
  banner.querySelector("[data-banner-text]").textContent = campaign.text;
  banner.querySelector("[data-banner-link]").href = pageUrl(campaign.link);
  banner.querySelector("[data-banner-picture]").src =
    siteRoot + "images/" + campaign.picture;
  banner
    .querySelectorAll('[data-action="hero-slide"]')
    .forEach((dot, index) => {
      dot.classList.toggle("active", index === campaignIndex);
      dot.setAttribute("aria-pressed", String(index === campaignIndex));
    });
}
for (const action of ["hero-next", "hero-prev", "hero-slide"]) {
  onAction(action, (button) => {
    campaignIndex =
      action === "hero-slide"
        ? Number(button.dataset.id)
        : (campaignIndex + (action === "hero-next" ? 1 : 2)) % campaigns.length;
    write("campaignIndex", campaignIndex);
    showCampaign();
  });
}
