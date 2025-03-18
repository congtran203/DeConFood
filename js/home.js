// Dinh gia tien
function vnd(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
const homeProducts = document.querySelector(".home-products");

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/food");
    const products = await response.json();
    localStorage.setItem("products", JSON.stringify(products));
    showHomeProduct(products);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    homeProducts.innerHTML = `<p>Đã xảy ra lỗi khi tải sản phẩm.</p>`;
  }
}

function showCategory(category) {
  let products = JSON.parse(localStorage.getItem("products"));

  if (category === "Trang chủ") {
    handleDisplayProducts(products);
  } else {
    let filterProducts = products.filter(
      (product) => product.category === category
    );
    handleDisplayProducts(filterProducts);
  }
}

// Hien thi san pham
function handleDisplayProducts(products) {
  const homeProducts = document.querySelector(".home-products");
  homeProducts.innerHTML = "";

  if (products.length === 0) {
    homeProducts.innerHTML = `<p class="no-results">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  products.forEach((product) => {
    const productHtml = `
      <div class="col-product">
        <article class="card-product">
          <div class="card-header">
            <a href="#" class="card-image-link" onclick="detailProduct(event, ${
              product.id
            })">
              <img class="card-image" src="./assets/img/products/${
                product.img
              }" alt="${product.title}" />
            </a>
          </div>
          <div class="food-info">
            <div class="card-content">
              <div class="card-title">
                <a href="#" class="card-title-link" onclick="detailProduct(event, ${
                  product.id
                })">${product.title}</a>
              </div>
            </div>
            <div class="card-footer">
              <div class="product-price">
                <span class="current-price">${vnd(product.price)}</span>
              </div>
              <div class="product-buy">
                <button class="card-button order-item" onclick="detailProduct(event, ${
                  product.id
                })">
                  <i class="fa-regular fa-cart-shopping-fast"></i> Đặt món
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
    homeProducts.innerHTML += productHtml;
  });
}

window.onload = fetchProducts;

// Phân trang
let perPage = 12;
let currentPage = 1;

function displayList(productAll, perPage, currentPage) {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const productShow = productAll.slice(start, end);
  handleDisplayProducts(productShow);
}

function showHomeProduct(products) {
  const productAll = products.filter((item) => item.status === 1);
  displayList(productAll, perPage, currentPage);
  setupPagination(productAll, perPage);
}

function setupPagination(productAll, perPage) {
  const pageNavList = document.querySelector(".page-nav-list");
  pageNavList.innerHTML = "";

  const pageCount = Math.ceil(productAll.length / perPage);
  for (let i = 1; i <= pageCount; i++) {
    const li = paginationChange(i, productAll);
    pageNavList.appendChild(li);
  }
}

function paginationChange(page, productAll) {
  const node = document.createElement("li");
  node.classList.add("page-nav-item");
  node.innerHTML = `<a href="javascript:void(0);">${page}</a>`;

  if (currentPage === page) node.classList.add("active");

  node.addEventListener("click", function () {
    currentPage = page;
    displayList(productAll, perPage, currentPage);
    document
      .querySelectorAll(".page-nav-item")
      .forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    document.getElementById("home-service").scrollIntoView();
  });
  return node;
}

function detailProduct(event, index) {
  let modal = document.querySelector(".modal.product-detail");
  let products = JSON.parse(localStorage.getItem("products"));

  event.preventDefault();

  let infoProduct = products.find((sp) => sp.id === String(index));

  let modalHtml = `<div class="modal-header">
  <img class="product-image" src="./assets/img/products/${
    infoProduct.img
  }" alt="">
  </div>
  <div class="modal-body">
      <h2 class="product-title">${infoProduct.title}</h2>
      <div class="product-control">
          <div class="priceBox">
              <span class="current-price">${vnd(infoProduct.price)}</span>
          </div>
          <div class="buttons_added">
              <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
              <input class="input-qty" max="100" min="1" name="" type="number" value="1">
              <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
          </div>
      </div>
      <p class="product-description">${infoProduct.desc}</p>
  </div>
  <div class="notebox">
          <p class="notebox-title">Ghi chú</p>
          <textarea class="text-note" id="popup-detail-note" placeholder="Nhập thông tin cần lưu ý..."></textarea>
  </div>
  <div class="modal-footer">
      <div class="price-total">
          <span class="thanhtien">Thành tiền</span>
          <span class="price">${vnd(infoProduct.price)}</span>
      </div>
      <div class="modal-footer-control">
          <button class="button-dathangngay" data-product="${
            infoProduct.id
          }">Đặt hàng ngay</button>
          <button class="button-dat" id="add-cart" onclick="animationCart()"><i class="fa-light fa-basket-shopping"></i></button>
      </div>
  </div>`;

  document.querySelector("#product-detail-content").innerHTML = modalHtml;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  //Them san pham vao gio hang
  let productBtn = document.querySelector(".button-dat");
  productBtn.addEventListener("click", (e) => {
    if (localStorage.getItem("user")) {
      addCart(infoProduct.id);
    } else {
      alert("Tài khoản chưa đăng nhập!!!");
    }
  });
}

//SEARCH
document.querySelector(".form-search-input").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("home-service").scrollIntoView();
});

document.querySelector(".form-search-input").addEventListener("input", (e) => {
  const searchValue = e.target.value.trim().toLowerCase();

  // Lấy danh sách sản phẩm từ API hoặc từ danh sách sản phẩm hiện tại
  fetch("http://localhost:3000/food")
    .then((response) => response.json())
    .then((products) => {
      // Lọc sản phẩm dựa trên tiêu đề
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchValue)
      );

      // Hiển thị sản phẩm đã lọc
      handleDisplayProducts(filteredProducts);
    })
    .catch((error) => console.error("Lỗi khi tìm kiếm sản phẩm:", error));
});

document.querySelector(".filter-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".advanced-search").classList.toggle("open");
  document.getElementById("home-service").scrollIntoView();
});

function closeSearchAdvanced() {
  document.querySelector(".advanced-search").classList.toggle("open");
}
