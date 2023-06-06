import { Router } from "express";
import DBCartManager from "../dao/managers/DB/CartManager.db.js";

const dbCartManager = new DBCartManager();
const router = Router();

//*********************
//****MONGODB API:*****
//*********************

router.get("/", async (req, res) => {
  res.send(await dbCartManager.getCarts());
});

router.post("/", async (req, res) => {
  res.send(await dbCartManager.addCart());
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  const addProductResponse = await dbCartManager.addProductToCart(
    cartId,
    productId,
    parseInt(quantity) ? parseInt(quantity) : 1
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  res.send(addProductResponse);
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await dbCartManager.getCartById(cartId);
  if (await cart.error) return res.sendStatus(cart.error);
  res.send({ cart });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const apiResponse = await dbCartManager.removeProductOfCart(
    cartId,
    productId
  );
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body;
  const apiResponse = await dbCartManager.replaceProducts(cartId, products);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const apiResponse = await dbCartManager.emptyCart(cartId);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
});

export default router;
