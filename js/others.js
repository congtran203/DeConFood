// Back to top
window.onscroll = () => {
  let backTopTop = document.querySelector(".back-to-top");
  if (document.documentElement.scrollTop > 100) {
    backTopTop.classList.add("active");
  } else {
    backTopTop.classList.remove("active");
  }
};

// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (lastScrollY < window.scrollY) {
    headerNav.classList.add("hide");
  } else {
    headerNav.classList.remove("hide");
  }
  lastScrollY = window.scrollY;
});

// Close popup
const body = document.querySelector("body");
let modalContainer = document.querySelectorAll(".modal");
let modalBox = document.querySelectorAll(".mdl-cnt");
let formLogSign = document.querySelector(".forms");

// Click vùng ngoài sẽ tắt Popup
modalContainer.forEach((item) => {
  item.addEventListener("click", closeModal);
});

modalBox.forEach((item) => {
  item.addEventListener("click", (event) => event.stopPropagation());
});

function closeModal() {
  modalContainer.forEach((item) => {
    item.classList.remove("open");
  });
  body.style.overflow = "auto";
}


