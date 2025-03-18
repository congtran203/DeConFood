// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng
function orderHistory() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.add("open");
}
