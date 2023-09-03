import { Router } from "express";
import * as products from "../controller/products.controller.js";
import privateAPI from "../middlewares/sessions/privateAPI.js";
import { usePolicies } from "../middlewares/policies/policies.js";

const router = Router();

router.get("/", privateAPI, products.getProducts);

router.get("/:pid", privateAPI, products.getProductById);

router.post(
  "/",
  privateAPI,
  usePolicies(["premium", "admin"]),
  products.addProduct
);

router.put(
  "/:pid",
  privateAPI,
  usePolicies(["premium", "admin"]),
  products.updateProduct
);

router.delete(
  "/:pid",
  privateAPI,
  usePolicies(["premium", "admin"]),
  products.deleteProduct
);

export default router;
