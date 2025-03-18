const PHIVANCHUYEN = 30000;
let priceFinal = document.getElementById("checkout-cart-price-final");

// Hàm xử lý thanh toán
function thanhtoanpage(option, product) {
  let totalBillOrder = document.querySelector(".total-bill-order");
  let includeShipping = true;

  showProductCart();

  // Sự kiện khi nhấn nút đặt hàng
  document.querySelector(".complete-checkout-btn").onclick = () => {
    xulyDathang();
  };
}

// Hiển thị hàng trong giỏ
function showProductCart() {
  let user = JSON.parse(localStorage.getItem("user"));
  let products = JSON.parse(localStorage.getItem("products"));

  if (!user || !user.cart || !products) {
    console.log("Giỏ hàng trống hoặc không tồn tại dữ liệu.");
    return;
  }

  let listOrder = document.getElementById("list-order-checkout");
  let listOrderHtml = "";
  let totalCartPrice = 0;

  user.cart.forEach((item) => {
    let product = products.find((product) => product.id === item.id);
    if (product) {
      let productTotal = item.soluong * product.price;
      totalCartPrice += productTotal;

      listOrderHtml += `
          <div class="food-total">
            <div class="count">${item.soluong}x</div>
            <div class="info-food">
                <div class="name-food">${product.title}</div>
            </div>
          </div>
          <div class="priceFlx">
            <div class="text">
                Tiền hàng 
                <span class="count">${item.soluong} món</span>
            </div>
            <div class="price-detail">
                <span>${vnd(productTotal)}</span>
            </div>
          </div>`;
    } else {
      console.log(`Không tìm thấy sản phẩm với ID: ${item.id}`);
    }
  });

  // Thêm dòng phí vận chuyển (chỉ hiển thị một lần)
  listOrderHtml += `
      <div class="priceFlx chk-ship">
        <div class="text">Phí vận chuyển</div>
        <div class="price-detail chk-free-ship">
            <span>${vnd(PHIVANCHUYEN)}</span>
        </div>
      </div>
    `;

  listOrder.innerHTML = listOrderHtml;

  // Cập nhật giá tổng cộng
  priceFinal.innerText = vnd(totalCartPrice + PHIVANCHUYEN);
}

// Hàm lấy sản phẩm từ giỏ hàng
function getProduct(item) {
  let user = JSON.parse(localStorage.getItem("user")) || {}; // Lấy đối tượng user từ localStorage
  let cart = user.cart || []; // Lấy giỏ hàng từ user, nếu không có giỏ hàng thì gán là mảng rỗng

  // Tìm sản phẩm trong giỏ hàng của user
  return cart.find((product) => product.id === item.id);
}

//Open Page Checkout
let nutthanhtoan = document.querySelector(".thanh-toan");
let checkoutpage = document.querySelector(".checkout-page");
nutthanhtoan.addEventListener("click", () => {
  checkoutpage.classList.add("active");
  thanhtoanpage(1);
  closeCart();
  body.style.overflow = "hidden";
});

// Close Page Checkout
function closecheckout() {
  checkoutpage.classList.remove("active");
  body.style.overflow = "auto";
}

// Create id order
function createId(arr) {
  let id = arr.length + 1;
  let check = arr.find((item) => item.id == "DH" + id);
  while (check != null) {
    id++;
    check = arr.find((item) => item.id == "DH" + id);
  }
  return "DH" + id;
}

async function xulyDathang(product) {
  let user = JSON.parse(localStorage.getItem("user"));

  let orderDetails = localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [];
  let order = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : [];
  let madon = createId(order);
  let tongtien = 0;

  if (product == undefined) {
    user.cart.forEach((item) => {
      item.madon = madon;
      item.price = getpriceProduct(item.id);
      tongtien += item.price * item.soluong;
      orderDetails.push(item);
    });
  } else {
    product.madon = madon;
    product.price = getpriceProduct(product.id);
    tongtien += product.price * product.soluong;
    orderDetails.push(product);
  }

  let tennguoinhan = document.querySelector("#tennguoinhan").value;
  let sdtnhan = document.querySelector("#sdtnhan").value;
  let diachinhan = document.querySelector("#diachinhan").value;

  if (tennguoinhan == "" || sdtnhan == "" || diachinhan == "") {
    alert("Vui lòng điền đầy đủ thông tin!");
  } else {
    let donhang = {
      id: madon,
      khachhang: user.phone,
      ghichu: document.querySelector(".note-order").value,
      tenguoinhan: tennguoinhan,
      sdtnhan: sdtnhan,
      diachinhan: diachinhan,
      items: orderDetails,
      tongtien: tongtien,
      trangthai: 0,
    };

    order.unshift(donhang);

    order.unshift(donhang);
    if (product == null) {
      user.cart.length = 0;
    }
    await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donhang),
    });
    localStorage.setItem("order", JSON.stringify(order));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    alert("Đăt hàng thành công");
    setTimeout((e) => {
      window.location = "/";
    }, 2000);
  }
}

function getpriceProduct(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  let sp = products.find((item) => {
    return item.id == id;
  });
  return sp.price;
}
