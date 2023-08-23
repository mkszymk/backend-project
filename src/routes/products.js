import CustomRouter from "./router.js";
import * as products from "../controller/products.controller.js";

export default class ProductsRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN", "USER", "PREMIUM"], products.getProducts);

    this.get("/:pid", ["ADMIN", "USER", "PREMIUM"], products.getProductById);

    this.post("/", ["ADMIN", "PREMIUM"], products.addProduct);

    this.put("/:pid", ["ADMIN", "PREMIUM"], products.updateProduct);

    this.delete("/:pid", ["ADMIN", "PREMIUM"], products.deleteProduct);
  }
}
