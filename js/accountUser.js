import { kiemTraDangNhap } from "./signup_login.js";

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.remove("open");
  document.getElementById("account-user").classList.add("open");
  userInfo();
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function userInfo() {
  let user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("infoname").value = user.fullname;
  document.getElementById("infophone").value = user.phone;
  document.getElementById("infoemail").value = user.email;
  document.getElementById("infoaddress").value = user.address;
  if (user.email == undefined) {
    infoemail.value = "";
  }
  if (user.address == undefined) {
    infoaddress.value = "";
  }
}

// Thay doi thong tin
async function changeInformation() {
  // Lấy danh sách tài khoản từ API
  let response = await fetch("http://localhost:3000/accounts");
  if (!response.ok) {
    throw new Error("Không thể lấy dữ liệu tài khoản.");
  }
  let accounts = await response.json();

  // Lấy thông tin người dùng từ localStorage
  let user = JSON.parse(localStorage.getItem("user"));
  let infoname = document.getElementById("infoname").value;
  let infoemail = document.getElementById("infoemail").value;
  let infoaddress = document.getElementById("infoaddress").value;

  // Cập nhật thông tin người dùng
  user.fullname = infoname || user.fullname;

  if (infoemail.length > 0) {
    if (!emailIsValid(infoemail)) {
      document.querySelector(".inforemail-error").innerHTML =
        "Vui lòng nhập lại email!";
      return;
    } else {
      user.email = infoemail;
    }
  }

  if (infoaddress.length > 0) {
    user.address = infoaddress;
  }

  // Tìm vị trí tài khoản trong danh sách
  let index = accounts.findIndex((item) => item.phone === user.phone);
  if (index === -1) {
    throw new Error("Không tìm thấy tài khoản.");
  }

  // Cập nhật tài khoản trên API
  accounts[index].fullname = user.fullname;
  accounts[index].email = user.email;
  accounts[index].address = user.address;

  let updateResponse = await fetch(
    `http://localhost:3000/accounts/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accounts[index]),
    }
  );

  if (!updateResponse.ok) {
    throw new Error("Không thể cập nhật thông tin tài khoản.");
  }

  // Cập nhật localStorage
  localStorage.setItem("user", JSON.stringify(user));

  // Hiển thị thông báo và làm mới giao diện
  document.querySelector(".inforemail-error").innerHTML = "";
  alert("Cập nhật thông tin thành công!");
  kiemTraDangNhap();
}

// Đổi mật khẩu
async function changePassword() {
  let user = JSON.parse(localStorage.getItem("user"));
  let passwordCur = document.getElementById("password-cur-info");
  let passwordAfter = document.getElementById("password-after-info");
  let passwordConfirm = document.getElementById("password-comfirm-info");

  let check = true;

  // Validate current password
  if (passwordCur.value.length === 0) {
    document.querySelector(".password-cur-info-error").innerHTML =
      "Vui lòng nhập mật khẩu hiện tại";
    check = false;
  } else {
    document.querySelector(".password-cur-info-error").innerHTML = "";
  }

  // Validate new password
  if (passwordAfter.value.length === 0) {
    document.querySelector(".password-after-info-error").innerHTML =
      "Vui lòng nhập mật khẩu mới";
    check = false;
  } else {
    document.querySelector(".password-after-info-error").innerHTML = "";
  }

  if (passwordConfirm.value.length === 0) {
    document.querySelector(".password-after-comfirm-error").innerHTML =
      "Vui lòng nhập mật khẩu xác nhận";
    check = false;
  } else {
    document.querySelector(".password-after-comfirm-error").innerHTML = "";
  }

  if (check) {
    if (passwordCur.value === user.password) {
      document.querySelector(".password-cur-info-error").innerHTML = "";

      if (passwordAfter.value.length >= 6) {
        if (passwordConfirm.value === passwordAfter.value) {
          document.querySelector(".password-after-comfirm-error").innerHTML =
            "";

          user.password = passwordAfter.value;
          localStorage.setItem("user", JSON.stringify(user));

          let response = await fetch("http://localhost:3000/accounts");
          let accounts = await response.json();

          // Find and update the account in the API
          let accountChange = accounts.find((acc) => acc.phone === user.phone);
          if (accountChange) {
            accountChange.password = user.password;
            await fetch(`http://localhost:3000/accounts/${accountChange.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(accountChange),
            });

            alert("Mật khẩu đã được thay đổi thành công!");
          } else {
            alert("Không tìm thấy tài khoản.");
          }
        } else {
          document.querySelector(".password-after-comfirm-error").innerHTML =
            "Mật khẩu bạn nhập không trùng khớp";
        }
      } else {
        document.querySelector(".password-after-info-error").innerHTML =
          "Vui lòng nhập mật khẩu mới có số ký tự lớn hơn hoặc bằng 6";
      }
    } else {
      document.querySelector(".password-cur-info-error").innerHTML =
        "Bạn đã nhập sai mật khẩu hiện tại";
    }
  }
}

window.myAccount = myAccount;
window.changeInformation = changeInformation;
window.changePassword = changePassword;
