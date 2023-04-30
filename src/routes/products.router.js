import { Router } from "express";
import ProductManager from "../ProductManager.js";

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
    product.stock,
    product.status,
    product.category
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  return res.status(200).send(addProductResponse);
});

router.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const productInfo = req.body;
  const updateProductResponse = await productManager.updateProduct(
    productId,
    productInfo
  );
  if (updateProductResponse.error)
    return res.status(updateProductResponse.error).send(updateProductResponse);

  return res.send(updateProductResponse.message);
});

router.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const deleteProductResponse = await productManager.deleteProduct(productId);
  if (deleteProductResponse.error)
    return res.status(deleteProductResponse.error).send(deleteProductResponse);
  return res.send(deleteProductResponse);
});

export default router;
