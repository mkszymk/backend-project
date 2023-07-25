import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/products.controller.js";
import { adminRoute } from "../controller/session.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", adminRoute, addProduct);

router.put("/:pid", adminRoute, updateProduct);

router.delete("/:pid", adminRoute, deleteProduct);

export default router;
