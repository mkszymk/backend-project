import { Router } from "express";
import {
  getCarts,
  addCart,
  addProductToCart,
  getCartById,
  removeProductOfCart,
  replaceProducts,
  emptyCart,
} from "../controller/carts.controller.js";
import { userRoute } from "../controller/session.controller.js";

const router = Router();

router.get("/", getCarts);

router.post("/", addCart);

router.post("/:cid/product/:pid", userRoute, addProductToCart);

router.get("/:cid", getCartById);

router.delete("/:cid/products/:pid", removeProductOfCart);

router.put("/:cid", replaceProducts);

router.delete("/:cid", emptyCart);

export default router;
