import { cartsService, productsService } from "../repositories/index.js";
import { loggerOutput } from "../utils/logger.js";

const getCarts = async (req, res) => {
  loggerOutput("debug", "Getting carts list");
  res.send(await cartsService.getCarts());
};

const addCart = async (req, res) => {
  loggerOutput("debug", "Adding a new cart.");
  res.send(await cartsService.addCart());
};

const addProductToCart = async (req, res) => {
  loggerOutput("debug", "Trying to add a product to the cart.");
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const user = req.user;
  const product = await productsService.getProductById(productId);
  if (user.email === product.payload.owner) {
    return res.status(403).send({
      success: false,
      message: "Owner can not add it's own product to cart.",
    });
  }
  const { quantity } = req.body;
  const addProductResponse = await cartsService.addProductToCart(
    cartId,
    productId,
    parseInt(quantity) ? parseInt(quantity) : 1
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  loggerOutput("debug", "Success adding the product to the cart.");
  res.send(addProductResponse);
};

const getCartById = async (req, res) => {
  loggerOutput("debug", `[api/Carts] Sending cart by ID`);
  const cartId = req.params.cid;
  const cart = await cartsService.getCartById(cartId);
  if (await cart.error) return res.sendStatus(cart.error);
  loggerOutput("debug", "Sending the cart by ID");
  res.send({ cart });
};

const removeProductOfCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const apiResponse = await cartsService.removeProductOfCart(cartId, productId);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  loggerOutput("debug", "Removing product of cart.");
  res.send(apiResponse);
};

const replaceProducts = async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body;
  const apiResponse = await cartsService.replaceProducts(cartId, products);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
};

const emptyCart = async (req, res) => {
  const cartId = req.params.cid;
  const apiResponse = await cartsService.emptyCart(cartId);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  loggerOutput("debug", "Removing products of cart.");
  res.send(apiResponse);
};

export {
  getCarts,
  addCart,
  addProductToCart,
  getCartById,
  removeProductOfCart,
  replaceProducts,
  emptyCart,
};
