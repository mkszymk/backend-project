import CustomRouter from "./router.js";
import * as carts from "../controller/carts.controller.js";

export default class CartsRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN", "API"], carts.getCarts);

    this.post("/", ["USER", "PREMIUM", "API"], carts.addCart);

    this.post(
      "/:cid/product/:pid",
      ["USER", "PREMIUM", "API"],
      carts.addProductToCart
    );

    this.get("/:cid", ["USER", "PREMIUM", "API"], carts.getCartById);

    this.delete(
      "/:cid/products/:pid",
      ["USER", "PREMIUM", "API"],
      carts.removeProductOfCart
    );

    this.put("/:cid", ["USER", "PREMIUM", "API"], carts.replaceProducts);

    this.delete("/:cid", ["USER", "PREMIUM", "API"], carts.emptyCart);
  }
}
