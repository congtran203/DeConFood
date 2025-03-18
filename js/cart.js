function animationCart() {
  document.querySelector(".count-product-cart").style.animation =
    "slidein ease 1s";
  setTimeout(() => {
    document.querySelector(".count-product-cart").style.animation = "none";
  }, 1000);
}

function increasingNumber(e) {
  let qty = e.parentNode.querySelector(".input-qty");
  if (parseInt(qty.value) < qty.max) {
    qty.value = parseInt(qty.value) + 1;
  } else {
    qty.value = qty.max;
  }
  updateCartQuantity(e, parseInt(qty.value));
}

function decreasingNumber(e) {
  let qty = e.parentNode.querySelector(".input-qty");
  if (qty.value > qty.min) {
    qty.value = parseInt(qty.value) - 1;
  } else {
    qty.value = qty.min;
  }
  updateCartQuantity(e, parseInt(qty.value));
}

function updateCartQuantity(e, newQty) {
  let user = JSON.parse(localStorage.getItem("user"));
  let cartItemId = e.closest(".cart-item").getAttribute("data-id");

  let productIndex = user.cart.findIndex((item) => item.id == cartItemId);
  if (productIndex !== -1) {
    user.cart[productIndex].soluong = newQty;
  }

  localStorage.setItem("user", JSON.stringify(user));

  updateAmountCart();
  updateTotalCart();
}

// Open & Close Cart
function openCart() {
  showCart();
  document.querySelector(".modal-cart").classList.add("open");
  body.style.overflow = "hidden";
}

function closeCart() {
  document.querySelector(".modal-cart").classList.remove("open");
  body.style.overflow = "auto";
  updateAmountCart();
}

//Show gio hang
async function showCart() {
  if (localStorage.getItem("user") != null) {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user.cart.length != 0) {
      document.querySelector(".gio-hang-trong").style.display = "none";
      document.querySelector("button.thanh-toan").classList.remove("disabled");
      let productcarthtml = "";
      for (let item of user.cart) {
        let response = await fetch(`http://localhost:3000/food/${item.id}`);
        let product = await response.json();

        if (product) {
          productcarthtml += `<li class="cart-item" data-id="${product.id}">
              <div class="cart-item-info">
                  <p class="cart-item-title">
                      ${product.title}
                  </p>
                  <span class="cart-item-price price" data-price="${
                    product.price
                  }">
                  ${vnd(parseInt(product.price))}
                  </span>
              </div>
              <p class="product-note"><i class="fa-light fa-pencil"></i><span>${
                item.note
              }</span></p>
              <div class="cart-item-control">
                  <button class="cart-item-delete" onclick="deleteCartItem(${
                    product.id
                  }, this)">Xóa</button>
                  <div class="buttons_added">
                      <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                      <input class="input-qty" max="100" min="1" name="" type="number" value="${
                        item.soluong
                      }">
                      <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                  </div>
              </div>
          </li>`;
        }
      }
      document.querySelector(".cart-list").innerHTML = productcarthtml;
    } else {
      document.querySelector(".gio-hang-trong").style.display = "flex";
    }
  }

  document
    .querySelector(".modal-cart")
    .addEventListener("click", () => closeCart());
  document
    .querySelector(".them-mon")
    .addEventListener("click", () => closeCart());
  document
    .querySelector(".cart-container")
    .addEventListener("click", (e) => e.stopPropagation());

  updateAmountCart();
  updateTotalCart();
}

// Thêm sản phẩm vào giỏ hàng
function addCart(index) {
  let user = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : [];

  let soluong = document.querySelector(".input-qty").value;
  let popupDetailNote = document.querySelector("#popup-detail-note").value;
  let note =
    popupDetailNote && popupDetailNote.trim() !== ""
      ? popupDetailNote
      : "Không có ghi chú";

  let productcart = {
    id: index,
    soluong: parseInt(soluong),
    note: note,
  };

  let vitri = user.cart.findIndex((item) => item.id === productcart.id);

  if (vitri === -1) {
    user.cart.push(productcart);
  } else {
    user.cart[vitri].soluong += parseInt(productcart.soluong);
  }

  localStorage.setItem("user", JSON.stringify(user));

  closeModal();
  updateAmountCart();
}

function deleteCartItem(id, del) {
  let cartParent = del.closest(".cart-item");
  cartParent.remove();

  let user = JSON.parse(localStorage.getItem("user"));
  let vitri = user.cart.findIndex((item) => (item.id = id));

  if (vitri !== -1) {
    user.cart.splice(vitri, 1);
  }

  if (user.cart.length === 0) {
    document.querySelector(".gio-hang-trong").style.display = "flex";
    document.querySelector("button.thanh-toan").classList.add("disabled");
  }

  localStorage.setItem("user", JSON.stringify(user));
  updateTotalCart();
}

//Cap nhat so luong
function getAmountCart() {
  let user = JSON.parse(localStorage.getItem("user"));
  let amount = 0;
  user.cart.forEach((item) => {
    amount += item.soluong;
  });
  return amount;
}

function updateAmountCart() {
  let amount = getAmountCart();
  document.querySelector(".count-product-cart").innerText = amount;
}
updateAmountCart();

//Cap nhat gia
async function getTotalCart() {
  let user = JSON.parse(localStorage.getItem("user"));
  let total = 0;
  for (let item of user.cart) {
    let response = await fetch(`http://localhost:3000/food/${item.id}`);
    let product = await response.json();

    if (product) {
      total += product.price * item.soluong;
    }
  }

  return total;
}

async function updateTotalCart() {
  let total = await getTotalCart();
  document.querySelector(".text-price").innerText = vnd(total);
}
updateTotalCart();

