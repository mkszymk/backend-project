import { Router } from "express";
import ProductManager from "../src/ProductManager.js";

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  let { limit } = req.query;
  const products = await productManager.getProducts();
  if (!limit) return res.send({ products });
  res.send({ products: products.splice(0, parseInt(limit)) });
});

router.get("/:pid", async (req, res) => {
  let productId = req.params.pid;
  const product = await productManager.getProductById(parseInt(productId));
  if (product.error) return res.sendStatus(product.error);
  res.send({ product });
});

router.post("/", async (req, res) => {
  let product = req.body;
  const addProductResponse = await productManager.addProduct(
    product.title,
    product.description,
    product.price,
    product.thumbnail,
    product.code,
    product.stock
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  return res.status(200).send(addProductResponse);
});

export default router;
