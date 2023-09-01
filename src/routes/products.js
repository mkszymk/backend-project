import { Router } from "express";
import * as products from "../controller/products.controller.js";
import verifyToken from "../middlewares/sessions/verifyToken.js";
import { usePolicies } from "../middlewares/policies/policies.js";

const router = Router();

router.get("/", verifyToken, products.getProducts);

router.get("/:pid", verifyToken, products.getProductById);

router.post(
  "/",
  verifyToken,
  usePolicies(["premium", "admin"]),
  products.addProduct
);

router.put(
  "/:pid",
  verifyToken,
  usePolicies(["premium", "admin"]),
  products.updateProduct
);

router.delete(
  "/:pid",
  verifyToken,
  usePolicies(["premium", "admin"]),
  products.deleteProduct
);

export default router;
