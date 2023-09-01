import { Router } from "express";
import * as carts from "../controller/carts.controller.js";
import verifyToken from "../middlewares/sessions/verifyToken.js";

const router = new Router();

router.get("/", carts.getCarts);

router.post("/", carts.addCart);

router.post("/:cid/product/:pid", verifyToken, carts.addProductToCart);

router.get("/:cid", carts.getCartById);

router.delete("/:cid/products/:pid", carts.removeProductOfCart);

router.put("/:cid", carts.replaceProducts);

router.delete("/:cid", carts.emptyCart);

export default router;
