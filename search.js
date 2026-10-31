// Tìm kiếm sản phẩm và gợi ý khi nhập.
"use strict";

function search(query) {
  const q = (query || "").toLowerCase().trim();
  const base = q
    ? PRODUCTS.filter((p) =>
        [p.name, p.brand, catName(p.cat)].join(" ").toLowerCase().includes(q),
      )
    : PRODUCTS;
  return listing(
    base,
    `Kết quả tìm kiếm: “${query || "Tất cả sản phẩm"}”`,
    "",
    "🔎",
    true,
  );
}

onForm("search-form", (form, e) => {
  const f = new FormData(form);
  const val = (key) => String(f.get(key) || "").trim();
  e.preventDefault();
  let q = e.target.querySelector('input[name="keyword"]').value.trim();
  go("#/search?q=" + encodeURIComponent(q));
});

document.addEventListener("input", (e) => {
  if (e.target.id === "site-search") {
    let q = e.target.value.trim().toLowerCase(),
      box = document.getElementById("search-suggestions");
    if (!box) return;
    if (q.length < 2) {
      box.innerHTML = "";
      return;
    }
    let matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    ).slice(0, 5);
    box.innerHTML = matches.length
      ? matches
          .map(
            (p) =>
              html`<a href="#/product/${p.id}"
                ><span>${esc(p.name)}</span><b>${money(p.price)}</b></a
              >`,
          )
          .join("")
      : "";
    rewriteLinks(box);
  }
});
