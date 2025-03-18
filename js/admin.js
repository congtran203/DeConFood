function vnd(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for (let i = 0; i < sidebars.length; i++) {
  sidebars[i].onclick = function () {
    document
      .querySelector(".sidebar-list-item.active")
      .classList.remove("active");
    document.querySelector(".section.active").classList.remove("active");
    sidebars[i].classList.add("active");
    sections[i].classList.add("active");
  };
}

const closeBtn = document.querySelectorAll(".section");
for (let i = 0; i < closeBtn.length; i++) {
  closeBtn[i].addEventListener("click", (e) => {
    sidebar.classList.add("open");
  });
}

//do sidebar open and close
const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

async function fetchProducts(category = "Tất cả") {
  try {
    let url = "http://localhost:3000/food";
    if (category !== "Tất cả") {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Lỗi khi gọi API");
    const data = await response.json();

    displayList(data, perPage, currentPage); // Phân trang
    setupPagination(data, perPage); // Thiết lập phân trang
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById(
      "show-product"
    ).innerHTML = `<div class="error">Không thể tải sản phẩm</div>`;
  }
}

fetchProducts();

function showProductArr(arr) {
  let productHtml = "";
  arr.forEach((product) => {
    productHtml += `
          <div class="list">
            <div class="list-left">
              <img src="assets/img/products/${product.img}" alt="${
      product.title
    }">
              <div data-id="${product.id}" class="list-info">
                <h4>${product.title}</h4>
                <p class="list-note">${product.desc || "Không có mô tả"}</p>
                <span class="list-category">${product.category}</span>
              </div>
            </div>
            <div class="list-right">
              <div class="list-price">
                <span class="list-current-price">${vnd(
                  product.price
                )}</span>                   
              </div>
              <div class="list-control">
                <div class="list-tool">
                  <button class="btn-edit" data-id="${
                    product.id
                  }" onclick="editProduct(this)">
                    <i class="fa-light fa-pen-to-square"></i>
                  </button>
                  <button class="btn-delete" data-id="${
                    product.id
                  }" onclick="deleteProduct(this)"><i class="fa-regular fa-trash"></i></button>
                </div>                       
              </div>
            </div> 
          </div>`;
  });
  document.getElementById("show-product").innerHTML = productHtml;
}

document.getElementById("the-loai").addEventListener("change", (event) => {
  const selectedCategory = event.target.value;
  fetchProducts(selectedCategory);
});

// Phân trang
let perPage = 12;
let currentPage = 1;

function displayList(productAll, perPage, currentPage) {
  let start = (currentPage - 1) * perPage;
  let end = (currentPage - 1) * perPage + perPage;
  let productShow = productAll.slice(start, end);
  showProductArr(productShow);
}

function setupPagination(productAll, perPage) {
  document.querySelector(".page-nav-list").innerHTML = "";
  let page_count = Math.ceil(productAll.length / perPage);
  for (let i = 1; i <= page_count; i++) {
    let li = paginationChange(i, productAll, currentPage);
    document.querySelector(".page-nav-list").appendChild(li);
  }
}

function paginationChange(page, productAll, currentPage) {
  let node = document.createElement(`li`);
  node.classList.add("page-nav-item");
  node.innerHTML = `<a href="#">${page}</a>`;
  if (currentPage == page) node.classList.add("active");
  node.addEventListener("click", function () {
    currentPage = page;
    displayList(productAll, perPage, currentPage);
    let t = document.querySelectorAll(".page-nav-item.active");
    for (let i = 0; i < t.length; i++) {
      t[i].classList.remove("active");
    }
    node.classList.add("active");
  });
  return node;
}

// Open Popup Modal
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
  document.querySelectorAll(".add-product-e").forEach((item) => {
    item.style.display = "block";
  });
  document.querySelectorAll(".edit-product-e").forEach((item) => {
    item.style.display = "none";
  });
  document.querySelector(".add-product").classList.add("open");
});
// Close Popup Modal
let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
  closePopup[i].onclick = () => {
    modalPopup[i].classList.remove("open");
  };
}

//THÊM
function uploadImage(el) {
  const fileName = el.value.split("\\").pop();
  const path = `assets/img/products/${fileName}`;
  document.querySelector(".upload-image-preview").src = path;
}

function getPathImage(path) {
  let patharr = path.split("/");
  return patharr[patharr.length - 1];
}

let btnAddProductIn = document.getElementById("add-product-button");
btnAddProductIn.addEventListener("click", async (e) => {
  e.preventDefault();
  let imgProduct = getPathImage(
    document.querySelector(".upload-image-preview").src
  );
  let tenMon = document.getElementById("ten-mon").value;
  let price = document.getElementById("gia-moi").value;
  let moTa = document.getElementById("mo-ta").value;
  let categoryText = document.getElementById("chon-mon").value;

  if (tenMon == "" || price == "" || moTa == "") {
    alert("Nhập đầy đủ thông tin!!!");
  } else if (isNaN(price)) {
    alert("Giá tiền vui lòng nhập số");
  } else {
    let lastProdId = document.querySelector("#last-product-id");

    lastProdId = (parseInt(lastProdId.value) + 1).toString();

    const product = {
      title: tenMon,
      img: getPathImage(document.querySelector(".upload-image-preview").src), // Lấy tên file đúng
      price: Number(price),
      desc: moTa,
      category: categoryText,
      status: 1,
    };

    const res = await fetch("http://localhost:3000/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product), // Gửi toàn bộ đối tượng product
    });

    const data = await res.json();
    alert("Thêm sản phẩm thành công!");

    showProductArr();
    document.querySelector(".add-product").classList.remove("open");
    setDefaultValue();
  }
});

document
  .querySelector(".modal-close.product-form")
  .addEventListener("click", () => {
    setDefaultValue();
  });

function setDefaultValue() {
  document.querySelector(".upload-image-preview").src =
    "assets/img/products/blank-image.png";
  document.getElementById("ten-mon").value = "";
  document.getElementById("gia-moi").value = "";
  document.getElementById("mo-ta").value = "";
  document.getElementById("chon-mon").value = "Món chay";
}

let indexCur;
async function editProduct(element) {
  let id = element.getAttribute("data-id");
  try {
    const res = await fetch(`http://localhost:3000/food/${id}`);

    const product = await res.json();
    document.querySelectorAll(".add-product-e").forEach((item) => {
      item.style.display = "none";
    });
    document.querySelectorAll(".edit-product-e").forEach((item) => {
      item.style.display = "block";
    });
    document.querySelector(".add-product").classList.add("open");

    const imgSrc = product.img.startsWith("http")
      ? product.img
      : `assets/img/products/${product.img}`;
    document.querySelector(".upload-image-preview").src = imgSrc;

    document.querySelector(".upload-image-preview").src = imgSrc;
    document.getElementById("ten-mon").value = product.title;
    document.getElementById("gia-moi").value = product.price;
    document.getElementById("mo-ta").value = product.desc;
    document.getElementById("chon-mon").value = product.category;
    document.getElementById("id-mon").value = product.id;

    // Lưu lại `id` hiện tại để sử dụng khi cập nhật
    indexCur = id;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    alert("Không thể lấy thông tin sản phẩm để chỉnh sửa.");
  }
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Lấy thông tin từ form
  let imgProductCur = getPathImage(
    document.querySelector(".upload-image-preview").src
  );
  let titleProductCur = document.getElementById("ten-mon").value;
  let curProductCur = document.getElementById("gia-moi").value;
  let descProductCur = document.getElementById("mo-ta").value;
  let categoryText = document.getElementById("chon-mon").value;

  // Chuẩn bị dữ liệu cập nhật
  let updatedProduct = {
    title: titleProductCur,
    img: imgProductCur,
    category: categoryText,
    price: parseInt(curProductCur),
    desc: descProductCur,
    status: 1, // Cập nhật trạng thái nếu cần
  };

  try {
    // Gửi yêu cầu cập nhật tới API
    const res = await fetch(`http://localhost:3000/food/${indexCur}`, {
      method: "PATCH", // hoặc "PUT" tùy vào logic API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) {
      alert("Cập nhật sản phẩm thành công!");
      setDefaultValue();
      document.querySelector(".add-product").classList.remove("open");
    } else {
      const errorData = await res.json();
      console.error("Lỗi từ API:", errorData);
      alert("Cập nhật sản phẩm thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    alert("Không thể cập nhật sản phẩm.");
  }
});

//Xoa
async function deleteProduct(element) {
  let id = element.getAttribute("data-id");
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    try {
      await fetch(`http://localhost:3000/food/${id}`, { method: "DELETE" });
      alert("Sản phẩm đã được xóa.");
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm.");
    }
  }
}

//SEARCH
const searchInput = document.getElementById("form-search-product");

function handleSearch() {
  const searchValue = searchInput.value.trim().toLowerCase();

  fetch("http://localhost:3000/food")
    .then((response) => response.json())
    .then((products) => {
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchValue)
      );

      showProductArr(filteredProducts);
    })
    .catch((error) => {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    });
}

searchInput.addEventListener("input", () => {
  handleSearch();
});

//User
let addAccount = document.getElementById("signup-button");
let updateAccount = document.getElementById("btn-update-account");

document
  .querySelector(".modal.signup .modal-close")
  .addEventListener("click", () => {
    signUpFormReset();
  });

function openCreateAccount() {
  document.querySelector(".signup").classList.add("open");
  document.querySelectorAll(".edit-account-e").forEach((item) => {
    item.style.display = "none";
  });
  document.querySelectorAll(".add-account-e").forEach((item) => {
    item.style.display = "block";
  });
}

function signUpFormReset() {
  document.getElementById("fullname").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("password").value = "";
  document.querySelector(".form-message-name").innerHTML = "";
  document.querySelector(".form-message-phone").innerHTML = "";
  document.querySelector(".form-message-password").innerHTML = "";
}

function showUserArr(arr) {
  let accountHtml = "";
  if (arr.length == 0) {
    accountHtml = `<td colspan="5">Không có dữ liệu</td>`;
  } else {
    arr.forEach((account, index) => {
      // Kiểm tra và thay thế status nếu không có trong dữ liệu
      let tinhtrang =
        account.status === undefined || account.status === 0
          ? `<span class="status-no-complete">Bị khóa</span>`
          : `<span class="status-complete">Hoạt động</span>`;

      accountHtml += ` <tr>
            <td>${index + 1}</td>
            <td>${account.fullname}</td>
            <td>${account.phone}</td>
            <td>${tinhtrang}</td>
            <td class="control control-table">
            <button class="btn-edit" id="edit-account" data-id="${
              account.id
            }" onclick='editAccount(this)'>
              <i class="fa-light fa-pen-to-square"></i>
            </button>
            <button class="btn-delete" id="delete-account" data-id="${
              account.id
            }" onclick="deleteAcount(this)"><i class="fa-regular fa-trash"></i></button>
            </td>
        </tr>`;
    });
  }
  document.getElementById("show-user").innerHTML = accountHtml;
}

async function showUser() {
  let tinhTrang = parseInt(document.getElementById("tinh-trang-user").value);
  let search = document.getElementById("form-search-user").value.toLowerCase();

  try {
    const response = await fetch("http://localhost:3000/accounts");
    let accounts = await response.json();

    accounts = accounts.filter((account) => account.role === "customer");

    if (tinhTrang !== 2) {
      accounts = accounts.filter((account) => account.status === tinhTrang);
    }

    if (search) {
      accounts = accounts.filter(
        (account) =>
          account.fullname.toLowerCase().includes(search) ||
          account.phone.includes(search)
      );
    }

    showUserArr(accounts);
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);
  }
}

showUser();

//Them user
addAccount.addEventListener("click", async (e) => {
  e.preventDefault();

  // Lấy dữ liệu từ form
  let fullNameUser = document.getElementById("fullname").value.trim();
  let phoneUser = document.getElementById("phone").value.trim();
  let passwordUser = document.getElementById("password").value.trim();

  // Lấy các phần tử kiểm tra lỗi
  let fullNameIP = document.getElementById("fullname");
  let formMessageName = document.querySelector(".form-message-name");
  let formMessagePhone = document.querySelector(".form-message-phone");
  let formMessagePassword = document.querySelector(".form-message-password");

  // Xóa thông báo lỗi cũ
  formMessageName.innerHTML = "";
  formMessagePhone.innerHTML = "";
  formMessagePassword.innerHTML = "";

  // Validate dữ liệu
  let isValid = true;

  if (fullNameUser.length === 0) {
    formMessageName.innerHTML = "Vui lòng nhập họ và tên";
    fullNameIP.focus();
    isValid = false;
  } else if (fullNameUser.length < 3) {
    formMessageName.innerHTML = "Vui lòng nhập họ và tên lớn hơn 3 kí tự";
    isValid = false;
  }

  if (phoneUser.length === 0) {
    formMessagePhone.innerHTML = "Vui lòng nhập vào số điện thoại";
    isValid = false;
  } else if (phoneUser.length !== 10 || !/^\d{10}$/.test(phoneUser)) {
    formMessagePhone.innerHTML =
      "Vui lòng nhập vào số điện thoại hợp lệ (10 số)";
    document.getElementById("phone").value = "";
    isValid = false;
  }

  if (passwordUser.length === 0) {
    formMessagePassword.innerHTML = "Vui lòng nhập mật khẩu";
    isValid = false;
  } else if (passwordUser.length < 6) {
    formMessagePassword.innerHTML = "Vui lòng nhập mật khẩu lớn hơn 6 kí tự";
    document.getElementById("password").value = "";
    isValid = false;
  }

  // Nếu không hợp lệ, dừng tại đây
  if (!isValid) return;

  // Tạo đối tượng tài khoản
  let user = {
    fullname: fullNameUser,
    phone: phoneUser,
    password: passwordUser,
    address: "",
    email: "",
    status: 1,
    cart: [],
    role: "customer", // Hoặc "user" tùy theo yêu cầu
  };

  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch("http://localhost:3000/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Kiểm tra kết quả trả về
    if (response.ok) {
      alert("Tạo tài khoản thành công!");
      document.querySelector(".signup").classList.remove("open");
      showUser(); // Cập nhật lại danh sách người dùng
      signUpFormReset(); // Reset form
    } else {
      const errorData = await response.json();
      alert(`Lỗi khi tạo tài khoản: ${errorData.message || "Không rõ lỗi"}`);
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu đến API:", error);
    alert("Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.");
  }
});

let editingAccountId;

async function editAccount(element) {
  const id = element.getAttribute("data-id");

  document.querySelector(".signup").classList.add("open");
  document.querySelectorAll(".add-account-e").forEach((item) => {
    item.style.display = "none";
  });
  document.querySelectorAll(".edit-account-e").forEach((item) => {
    item.style.display = "block";
  });

  try {
    const response = await fetch("http://localhost:3000/accounts");
    const accounts = await response.json();

    const account = accounts.find((item) => item.id === id);

    if (!account) {
      alert("Không tìm thấy tài khoản.");
      return;
    }

    editingAccountId = account.id;

    document.getElementById("fullname").value = account.fullname;
    document.getElementById("phone").value = account.phone;
    document.getElementById("password").value = account.password;
    document.getElementById("user-status").checked = account.status === 1;
  } catch (error) {
    console.error("Lỗi khi tải thông tin tài khoản:", error);
    alert("Lỗi khi kết nối đến server.");
  }
}

updateAccount.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("user-status").checked ? 1 : 0;

  if (!fullname || !phone || !password) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const updatedAccount = {
    fullname,
    phone,
    password,
    status,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/accounts/${editingAccountId}`,
      {
        method: "PATCH", // Hoặc "PATCH" nếu chỉ cập nhật một phần
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAccount),
      }
    );

    if (response.ok) {
      alert("Cập nhật tài khoản thành công!");
      document.querySelector(".signup").classList.remove("open");
      signUpFormReset(); // Reset form
      await showUser(); // Cập nhật lại danh sách tài khoản
    } else {
      const errorData = await response.json();
      alert(
        `Lỗi khi cập nhật tài khoản: ${errorData.message || "Không rõ lỗi"}`
      );
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu cập nhật tài khoản:", error);
    alert("Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.");
  }
});
async function deleteAcount(element) {
  let id = element.getAttribute("data-id");
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
    try {
      const response = await fetch(`http://localhost:3000/accounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Người dùng đã được xóa.");
        await showUser();
      } else {
        const errorData = await response.json();
        alert(`Lỗi khi xóa người dùng: ${errorData.message || "Không rõ lỗi"}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Không thể xóa người dùng. Vui lòng thử lại sau.");
    }
  }
}

// Search user
const searchUserInput = document.getElementById("form-search-user");

function handleUserSearch() {
  const searchValue = searchUserInput.value.trim().toLowerCase();

  fetch("http://localhost:3000/accounts")
    .then((response) => response.json())
    .then((users) => {
      const filteredUsers = users.filter((user) => {
        const fullname = user.fullname ? user.fullname.toLowerCase() : "";
        const phone = user.phone ? user.phone : "";
        return fullname.includes(searchValue) || phone.includes(searchValue);
      });

      if (filteredUsers.length === 0) {
        document.getElementById("show-user").innerHTML = `
          <tr>
            <td colspan="5">Không tìm thấy người dùng phù hợp.</td>
          </tr>`;
      } else {
        showUserArr(filteredUsers);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tìm kiếm người dùng:", error);
    });
}

// Gắn sự kiện vào ô tìm kiếm
searchUserInput.addEventListener("input", handleUserSearch);


