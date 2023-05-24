import { Router } from "express";
import ProductManager from "../dao/managers/FileSystem/ProductManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/home", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { style: "style.css", products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", { style: "style.css" });
});

router.get("/chat", async (req, res) => {
  res.render("chat", { style: "chat.css" });
});

export default router;
