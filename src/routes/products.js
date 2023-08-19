import CustomRouter from "./router.js";
import * as products from "../controller/products.controller.js";

export default class ProductsRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN"], products.getProducts);

    this.get("/:pid", ["ADMIN"], products.getProductById);

    this.post("/", ["USER", "ADMIN"], products.addProduct);

    this.put("/:pid", ["ADMIN"], products.updateProduct);

    this.delete("/:pid", ["ADMIN"], products.deleteProduct);
  }
}
