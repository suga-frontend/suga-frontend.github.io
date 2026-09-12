// スマホ用メニューの開閉
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("global-nav");

function setOpen(open) {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
  setOpen(toggle.getAttribute("aria-expanded") !== "true");
});

// メニュー内のリンクを押したら閉じる
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setOpen(false);
});

// Escapeキーで閉じて、ボタンにフォーカスを戻す
nav.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setOpen(false);
    toggle.focus();
  }
});
