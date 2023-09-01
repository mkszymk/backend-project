import ProductDTO from "../dao/DTOs/product.dto.js";
import { productsService } from "../repositories/index.js";
import CustomError from "../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import { loggerOutput } from "../utils/logger.js";

const getProducts = async (req, res) => {
  loggerOutput(
    "debug",
    `[ProductsController/GetProducts] Trying to get product list....`
  );
  try {
    loggerOutput("debug", "Getting products list");
    let { limit, page, query, sort } = req.query;
    let _limit = parseInt(limit);
    let _page = parseInt(page);
    loggerOutput("debug", "Sending products list");
    res.send(
      await productsService.getProducts(
        _limit ? _limit : 10,
        _page > 0 ? _page : 1,
        query,
        sort
      )
    );
  } catch (error) {
    loggerOutput("error", "Error sending products list.");
  }
};

const getProductById = async (req, res) => {
  let productId = req.params.pid;
  const product = await productsService.getProductById(productId);
  if (product.error) return res.status(404).send({ error: "404 Not found." });
  loggerOutput("debug", "Sending product by ID");
  res.send({ product });
};

const addProduct = async (req, res, next) => {
  loggerOutput("info", "Trying to add a new product.");
  const { email } = req.user;
  let product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.stock ||
    !product.category
  ) {
    try {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(product),
        messsage: "Error creating a new product: MISSING ARGUMENTS.",
        code: EErrors.MISSING_ARGUMENT_ERROR,
      });
    } catch (e) {
      return next(e);
    }
  }

  const addProductResponse = await productsService.addProduct(
    new ProductDTO({ ...product, owner: email })
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
  loggerOutput("debug", "Updating product.");
  return res.send(updateProductResponse);
};

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;
  const product = await productsService.getProductById(productId);
  const user = req.user;
  if (!user)
    return res.status(401).send({ success: false, message: "Not user found" });
  let deleteProductResponse;
  loggerOutput(
    "debug",
    `[ProductsController/deleteProduct] User role: ${user.role}`
  );

  if (!(user.role === "admin")) {
    loggerOutput(
      "debug",
      `[ProductsController/deleteProduct] User is not admin.`
    );
    if (user.email === product.payload.owner) {
      deleteProductResponse = await productsService.deleteProduct(productId);
      loggerOutput(
        "debug",
        `[ProductsController/deleteProduct] User is the owner.`
      );
    } else {
      loggerOutput(
        "debug",
        `[ProductsController/deleteProduct] User is not admin nor owner.`
      );
      loggerOutput(
        "debug",
        `[ProductsController/deleteProduct] User: ${user.email} // Owner: ${product.payload.owner}`
      );
      return res
        .status(403)
        .send({ success: false, messsage: "User is not the product owner." });
    }
  } else {
    loggerOutput("debug", `[ProductsController/deleteProduct] User admin.`);
    deleteProductResponse = await productsService.deleteProduct(productId);
  }

  if (deleteProductResponse.error)
    return res.status(deleteProductResponse.error).send(deleteProductResponse);
  loggerOutput("info", "Deleting product with ID " + productId);
  return res.send(deleteProductResponse);
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
