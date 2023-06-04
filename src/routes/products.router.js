import { Router } from "express";
import DBProductManager from "../dao/managers/DB/ProductManager.db.js";

const dbProductManager = new DBProductManager();
const router = Router();

//*********************
//****MONGODB API:*****
//*********************

router.get("/", async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;
    let _limit = parseInt(limit);
    let _page = parseInt(page);
    res.send(
      await dbProductManager.getProducts(
        _limit ? _limit : 10,
        _page > 0 ? _page : 1,
        query,
        sort
      )
    );
  } catch (error) {
    console.log("Error: " + error);
  }
});

router.get("/:pid", async (req, res) => {
  let productId = req.params.pid;
  const product = await dbProductManager.getProductById(productId);
  if (product.error) return res.status(404).send({ error: "404 Not found." });
  res.send({ product });
});

router.post("/", async (req, res) => {
  let product = req.body;
  const addProductResponse = await dbProductManager.addProduct(product);
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  return res.status(200).send(addProductResponse);
});

router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const productInfo = req.body;
  const updateProductResponse = await dbProductManager.updateProduct(
    productId,
    productInfo
  );
  if (updateProductResponse.error)
    return res.status(updateProductResponse.error).send(updateProductResponse);

  return res.send(updateProductResponse);
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const deleteProductResponse = await dbProductManager.deleteProduct(productId);
  if (deleteProductResponse.error)
    return res.status(deleteProductResponse.error).send(deleteProductResponse);
  return res.send(deleteProductResponse);
});

export default router;
