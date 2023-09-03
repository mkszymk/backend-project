import { Router } from "express";
import * as carts from "../controller/carts.controller.js";
import privateAPI from "../middlewares/sessions/privateAPI.js";

const router = new Router();

router.get("/", privateAPI, carts.getCarts);

router.post("/", carts.addCart);

router.post("/:cid/product/:pid", privateAPI, carts.addProductToCart);

router.get("/:cid", privateAPI, carts.getCartById);

router.delete("/:cid/products/:pid", privateAPI, carts.removeProductOfCart);

router.put("/:cid", privateAPI, carts.replaceProducts);

router.delete("/:cid", privateAPI, carts.emptyCart);

export default router;
