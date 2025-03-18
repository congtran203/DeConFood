import { Database } from "./database.js";

// Chuyen doi qua lai SignUp & Login
let signup = document.querySelector(".signup-link");
let login = document.querySelector(".login-link");
let container = document.querySelector(".signup-login .modal-container");
login.addEventListener("click", () => {
  container.classList.add("active");
});

signup.addEventListener("click", () => {
  container.classList.remove("active");
});

let signupBtn = document.getElementById("signup");
let loginBtn = document.getElementById("login");
let formSignupLogin = document.querySelector(".modal.signup-login");
signupBtn.addEventListener("click", () => {
  formSignupLogin.classList.add("open");
  container.classList.remove("active");
  body.style.overflow = "hidden";
});

loginBtn.addEventListener("click", () => {
  document.querySelector(".form-message-check-login").innerHTML = "";
  formSignupLogin.classList.add("open");
  container.classList.add("active");
  body.style.overflow = "hidden";
});

//Dang ky
let signupButton = document.getElementById("signup-button");
let loginButton = document.getElementById("login-button");

const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

signupButton.addEventListener("click", async (event) => {
  event.preventDefault();

  let fullNameUser = document.getElementById("fullname").value;
  let phoneUser = document.getElementById("phone").value;
  let passwordUser = document.getElementById("password").value;
  let passwordConfirmation = document.getElementById(
    "password_confirmation"
  ).value;

  // Kiểm tra tên
  if (fullNameUser.length == 0) {
    document.querySelector(".form-message-name").innerHTML =
      "Vui lòng nhập họ và tên";
    document.getElementById("fullname").focus();
    return;
  } else if (fullNameUser.length < 3) {
    document.querySelector(".form-message-name").innerHTML =
      "Vui lòng nhập họ và tên lớn hơn 3 kí tự";
    document.getElementById("fullname").focus();
    return;
  } else {
    document.querySelector(".form-message-name").innerHTML = "";
  }

  // Kiểm tra số điện thoại
  if (phoneUser.length === 0) {
    document.querySelector(".form-message-phone").innerHTML =
      "Vui lòng nhập vào số điện thoại";
    return;
  } else if (!regexPhoneNumber.test(phoneUser)) {
    document.querySelector(".form-message-phone").innerHTML =
      "Vui lòng nhập đúng số điện thoại";
    document.getElementById("phone").focus();
    return;
  } else {
    document.querySelector(".form-message-phone").innerHTML = "";
  }

  // Kiểm tra mật khẩu
  if (passwordUser.length == 0) {
    document.querySelector(".form-message-password").innerHTML =
      "Vui lòng nhập mật khẩu";
    return;
  } else if (passwordUser.length < 6) {
    document.querySelector(".form-message-password").innerHTML =
      "Vui lòng nhập mật khẩu lớn hơn 6 kí tự";
    return;
  } else {
    document.querySelector(".form-message-password").innerHTML = "";
  }

  // Kiểm tra xác nhận mật khẩu
  if (passwordConfirmation.length == 0) {
    document.querySelector(".form-message-password-confi").innerHTML =
      "Vui lòng nhập lại mật khẩu";
    return;
  } else if (passwordConfirmation !== passwordUser) {
    document.querySelector(".form-message-password-confi").innerHTML =
      "Mật khẩu không khớp";
    return;
  } else {
    document.querySelector(".form-message-password-confi").innerHTML = "";
  }

  // Kiểm tra xem số điện thoại đã tồn tại hay chưa
  let existingUser = await Database.getData(`/accounts?phone=${phoneUser}`);
  if (existingUser.length > 0) {
    document.querySelector(".form-message-phone").innerHTML =
      "Số điện thoại này đã được đăng ký.";
    return;
  }

  // Đăng ký tài khoản mới nếu tất cả hợp lệ
  let account = {
    fullname: fullNameUser,
    phone: phoneUser,
    password: passwordUser,
    address: "",
    email: "",
    cart: [],
    role: "customer",
  };

  let result = await Database.insertData("/accounts", account);

  if (result) {
    alert("Đăng ký thành công!");
  } else {
    alert("Đăng ký thất bại. Vui lòng thử lại.");
  }
});

//Dang nhap
loginButton.addEventListener("click", async (event) => {
  event.preventDefault();

  let phonelog = document.getElementById("phone-login").value;
  let passlog = document.getElementById("password-login").value;

  if (!phonelog || !passlog) {
    document.querySelector(".form-message-check-login").innerHTML =
      "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  let response = await fetch(
    `http://localhost:3000/accounts?phone=${phonelog}`
  );
  let users = await response.json();

  if (users.length === 0) {
    document.querySelector(".form-message-check-login").innerHTML =
      "Số điện thoại này chưa được đăng ký.";
    return;
  }

  let user = users[0];

  if (user.password !== passlog) {
    document.querySelector(".form-message-check-login").innerHTML =
      "Mật khẩu không chính xác.";
    return;
  }

  alert("Đăng nhập thành công!");
  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "/index.html";
});

// Kiểm tra xem có tài khoản đăng nhập không ?
export function kiemTraDangNhap() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user = JSON.parse(JSON.stringify(user));
    // ... kiemTraDangNhap
    document.querySelector(
      ".auth-container"
    ).innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.fullname} <i class="fa-sharp fa-solid fa-caret-down"></span>`;
    document.querySelector(
      ".header-middle-right-menu"
    ).innerHTML = `<li><a href="javascript:;" onclick="myAccount()"><i class="fa-light fa-circle-user"></i> Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-regular fa-bags-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="border"><a id="logout" href="javascript:;"><i class="fa-light fa-right-from-bracket"></i> Thoát tài khoản</a></li>`;
    document.querySelector("#logout").addEventListener("click", logOut);
  }
}

function checkAdmin() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role === "admin") {
    let node = document.createElement(`li`);
    node.innerHTML = `<a href="./admin.html"><i class="fa-light fa-gear"></i> Quản lý cửa hàng</a>`;
    document.querySelector(".header-middle-right-menu").prepend(node);
  }
}

kiemTraDangNhap();
checkAdmin();

function logOut() {
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}
