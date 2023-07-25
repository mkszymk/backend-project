import { cartsService } from "../repositories/index.js";

const getCarts = async (req, res) => {
  res.send(await cartsService.getCarts());
};

const addCart = async (req, res) => {
  res.send(await cartsService.addCart());
};

const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  const addProductResponse = await cartsService.addProductToCart(
    cartId,
    productId,
    parseInt(quantity) ? parseInt(quantity) : 1
  );
  if (addProductResponse.error)
    return res.status(addProductResponse.error).send(addProductResponse);
  res.send(addProductResponse);
};

const getCartById = async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartsService.getCartById(cartId);
  if (await cart.error) return res.sendStatus(cart.error);
  res.send({ cart });
};

const removeProductOfCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const apiResponse = await cartsService.removeProductOfCart(cartId, productId);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
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
