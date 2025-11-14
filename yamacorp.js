window.onload = () => {
  // ヒーローアニメーション
  const heroText = document.querySelector(".hero-h1");
  const heroBtn = document.querySelector(".hero-btn");

  setTimeout(() => heroText.classList.add("show"), 300);

  // メニュー開閉
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const closeBtn = document.querySelector(".close-btn");

  menuToggle.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  // フォーム送信
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("お問い合わせありがとうございます！");
  });
};