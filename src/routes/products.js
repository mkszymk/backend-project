import CustomRouter from "./router.js";
import * as products from "../controller/products.controller.js";

export default class ProductsRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN", "USER", "PREMIUM", "API"], products.getProducts);

    this.get(
      "/:pid",
      ["ADMIN", "USER", "PREMIUM", "API"],
      products.getProductById
    );

    this.post("/", ["ADMIN", "PREMIUM", "API"], products.addProduct);

    this.put("/:pid", ["ADMIN", "PREMIUM", "API"], products.updateProduct);

    this.delete("/:pid", ["ADMIN", "PREMIUM", "API"], products.deleteProduct);
  }
}
