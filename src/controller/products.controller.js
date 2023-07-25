import ProductDTO from "../dao/DTOs/product.dto.js";
import { productsService } from "../repositories/index.js";

const getProducts = async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;
    let _limit = parseInt(limit);
    let _page = parseInt(page);
    res.send(
      await productsService.getProducts(
        _limit ? _limit : 10,
        _page > 0 ? _page : 1,
        query,
        sort
      )
    );
  } catch (error) {
    console.log("Error: " + error);
  }
};

const getProductById = async (req, res) => {
  let productId = req.params.pid;
  const product = await productsService.getProductById(productId);
  if (product.error) return res.status(404).send({ error: "404 Not found." });
  res.send({ product });
};

const addProduct = async (req, res) => {
  let product = req.body;
  const addProductResponse = await productsService.addProduct(
    new ProductDTO(product)
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  return res.status(200).send(addProductResponse);
};

const updateProduct = async (req, res) => {
  const productId = req.params.pid;
  const productInfo = req.body;
  const updateProductResponse = await productsService.updateProduct(
    productId,
    productInfo
  );
  if (updateProductResponse.error)
    return res.status(updateProductResponse.error).send(updateProductResponse);

  return res.send(updateProductResponse);
};

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;
  const deleteProductResponse = await productsService.deleteProduct(productId);
  if (deleteProductResponse.error)
    return res.status(deleteProductResponse.error).send(deleteProductResponse);
  return res.send(deleteProductResponse);
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
