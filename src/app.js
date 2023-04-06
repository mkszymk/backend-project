const { ProductManager } = require("./ProductManager.js");
const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.get("/products", async (req, res) => {
  let { limit } = req.query;
  const products = await productManager.getProducts();
  if (!limit) return res.send({ products });
  res.send({ products: products.splice(0, parseInt(limit)) });
});

app.get("/products/:pid", async (req, res) => {
  let productId = req.params.pid;
  const product = await productManager.getProductById(parseInt(productId));
  if (product.error) return res.sendStatus(product.error);
  res.send({ product });
});

app.listen(8080, () => {
  console.log("Escuchando en 8080");
});
