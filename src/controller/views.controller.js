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
  req.session.user = {
    name: req.user.name,
    lastName: req.user.lastName,
    age: req.user.age,
    email: req.user.email,
    cart: req.user.cart,
  };
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
};
