export default class ProductDTO {
  constructor(product) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.thumbnail = product.thumbnail ? product.thumbnail : "NO-IMG";
    this.code = product.code;
    this.stock = product.stock;
    this.status = product.status ? product.status : true;
    this.category = product.category;
    this.owner = product.owner || "admin";
  }
}
