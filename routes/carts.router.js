import { Router } from "express";
import CartManager from "../src/CartManager.js";

const cartManager = new CartManager();
const router = Router();

router.post("/", async (req, res) => {
  const addCartResponse = await cartManager.addCart();
  res.send(addCartResponse);
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(parseInt(cartId));
  if (cart.error) return res.sendStatus(cart.error);
  res.send({ cart });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  console.log(parseInt(cartId));
  const addProductResponse = await cartManager.addProductToCart(
    parseInt(cartId),
    parseInt(productId),
    parseInt(quantity) ? parseInt(quantity) : 1
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  res.send(addProductResponse);
});

export default router;
