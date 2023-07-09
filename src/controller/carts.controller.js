import DBCartManager from "../dao/managers/DB/CartManager.db.js";

const dbCartManager = new DBCartManager();

const getCarts = async (req, res) => {
  res.send(await dbCartManager.getCarts());
};

const addCart = async (req, res) => {
  res.send(await dbCartManager.addCart());
};

const addProductToCart = async (req, res) => {
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
};

const getCartById = async (req, res) => {
  const cartId = req.params.cid;
  const cart = await dbCartManager.getCartById(cartId);
  if (await cart.error) return res.sendStatus(cart.error);
  res.send({ cart });
};

const removeProductOfCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const apiResponse = await dbCartManager.removeProductOfCart(
    cartId,
    productId
  );
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
};

const replaceProducts = async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body;
  const apiResponse = await dbCartManager.replaceProducts(cartId, products);
  if (apiResponse.error) return res.status(apiResponse.error).send(apiResponse);
  res.send(apiResponse);
};

const emptyCart = async (req, res) => {
  const cartId = req.params.cid;
  const apiResponse = await dbCartManager.emptyCart(cartId);
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
