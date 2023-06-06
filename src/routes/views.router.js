import { Router } from "express";

const router = Router();

router.get("/products", async (req, res) => {
  const { page } = req.query || 1;
  const products = await (
    await fetch("http://localhost:8080/api/products?page=" + page)
  ).json();
  res.render("home", { style: "style.css", products: await products });
});

router.get("/cart/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId)
  ).json();
  res.render("cart", { style: "style.css", cart: await cart });
});

export default router;
