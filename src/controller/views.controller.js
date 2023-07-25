import UserDTO from "../dao/DTOs/user.dto.js";
import ProductDTO from "../dao/DTOs/product.dto.js";

const privateRoute = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const publicRoute = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/products");
  }
};

const adminRoute = (req, res, next) => {
  if (req.session.user.role == "user") {
    return res.status(403).send({ error: "403 - Forbidden" });
  } else {
    return next();
  }
};

const getProductsPage = async (req, res) => {
  const userData = req.session.user;
  if (!userData) return;
  const { page } = req.query || 1;
  const products = await (
    await fetch("http://localhost:8080/api/products?page=" + page)
  ).json();
  res.render("home", {
    style: "style.css",
    products: await products,
    ...userData,
    admin: userData.role === "admin" ? true : false,
  });
};

const getCartPage = async (req, res) => {
  const cartId = req.session.user.cart;
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId)
  ).json();
  res.render("cart", { style: "style.css", cart: await cart });
};

const getLoginPage = async (req, res) => {
  res.render("login", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
};

const getRegisterPage = async (req, res) => {
  res.render("register", { style: "credentials.css" });
};

const postRegister = async (req, res) => {
  res.redirect("/login");
};

const postLogin = async (req, res) => {
  if (!req.user) return res.redirect("/login?e=400&m=Credenciales inválidas");
  let user = new UserDTO(req.user);
  req.session.user = user.getRelevantInfo();
  res.redirect("/products");
};

const getMainPage = async (req, res) => {
  res.redirect("/login");
};

const getLogoutPage = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

const getLostPasswordPage = async (req, res) => {
  res.render("lostpassword", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
};

const postLostPassword = async (req, res) => {
  res.redirect("/login");
};

const getManageProductsPage = async (req, res) => {
  const products = await (
    await fetch("http://localhost:8080/api/products?limit=999")
  ).json();
  res.render("manageproducts", {
    style: "manageProducts.css",
    products: await products,
  });
};

const addProduct = async (req, res) => {
  try {
    const _product = new ProductDTO(req.body);
    const product = JSON.stringify(_product);
    const addProductResponse = (
      await fetch("http://localhost:8080/api/products/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: product,
      })
    ).json();
  } catch (e) {
    return console.log(e);
  }
};

export {
  privateRoute,
  publicRoute,
  getProductsPage,
  getCartPage,
  getLoginPage,
  getRegisterPage,
  postRegister,
  postLogin,
  getMainPage,
  getLogoutPage,
  getLostPasswordPage,
  postLostPassword,
  adminRoute,
  getManageProductsPage,
  addProduct,
};
