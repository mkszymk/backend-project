import CustomRouter from "./router.js";
import * as carts from "../controller/carts.controller.js";
import { userRoute } from "../controller/session.controller.js";

export default class CartsRouter extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], carts.getCarts);

    this.post("/", ["PUBLIC"], carts.addCart);

    this.post(
      "/:cid/product/:pid",
      ["PUBLIC"],
      userRoute,
      carts.addProductToCart
    );

    this.get("/:cid", ["PUBLIC"], carts.getCartById);

    this.delete("/:cid/products/:pid", ["PUBLIC"], carts.removeProductOfCart);

    this.put("/:cid", ["PUBLIC"], carts.replaceProducts);

    this.delete("/:cid", ["PUBLIC"], carts.emptyCart);
  }
}
