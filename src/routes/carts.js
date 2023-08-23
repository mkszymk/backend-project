import CustomRouter from "./router.js";
import * as carts from "../controller/carts.controller.js";

export default class CartsRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN"], carts.getCarts);

    this.post("/", ["USER", "PREMIUM"], carts.addCart);

    this.post(
      "/:cid/product/:pid",
      ["USER", "PREMIUM"],
      carts.addProductToCart
    );

    this.get("/:cid", ["USER", "PREMIUM"], carts.getCartById);

    this.delete(
      "/:cid/products/:pid",
      ["USER", "PREMIUM"],
      carts.removeProductOfCart
    );

    this.put("/:cid", ["USER", "PREMIUM"], carts.replaceProducts);

    this.delete("/:cid", ["USER", "PREMIUM"], carts.emptyCart);
  }
}
