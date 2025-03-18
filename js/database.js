let APIurl = "http://localhost:3000";

export class Database {
  // Lấy dữ liệu từ API
  static async getData(url) {
    const response = await fetch(`${APIurl}${url}`);
    const data = await response.json();
    return data;
  }

  // Thêm dữ liệu vào API
  static async insertData(url, data) {
    const response = await fetch(`${APIurl}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  }

  // Cập nhật dữ liệu trong API
  static async updateData(url, data) {
    const response = await fetch(`${APIurl}${url}`, {
      method: "PUT", // PUT để cập nhật
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  }

  // Xóa dữ liệu trong API
  static async deleteData(url) {
    const response = await fetch(`${APIurl}${url}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  }
}
