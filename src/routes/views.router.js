import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/home", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { style: "style.css", products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", { style: "style.css" });
});

export default router;
