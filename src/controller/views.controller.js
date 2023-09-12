import ProductDTO from "../dao/DTOs/product.dto.js";
import TicketManager from "../services/DB/TicketManager.db.js";
import {
  cartsService,
  productsService,
  usersService,
} from "../repositories/index.js";
import { usersModel } from "../dao/models/user.model.js";
import { createHash, generateProduct, generateUserToken } from "../utils.js";
import {
  generateToken,
  sendRestoreMail,
  validateToken,
  decryptToken,
} from "../utils/restorePassword.js";
import { loggerOutput } from "../utils/logger.js";

const ticketManager = new TicketManager();

const getProductsPage = async (req, res) => {
  const token = req.cookies["authToken"];
  loggerOutput("debug", `[getProductsPage] Token received: ${token}`);
  const userData = req.user;
  loggerOutput("debug", "[getProductsPage] USER: " + userData);
  if (!userData) return;
  const { page } = req.query || 1;
  const products = await (
    await fetch("http://localhost:8080/api/products?page=" + page, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();
  req.logger.info(
    `${new Date().toLocaleTimeString()} - Rendering main page with products.`
  );
  res.render("home", {
    style: "style.css",
    products: await products,
    ...userData,
    admin: userData.role === "admin" ? true : false,
    premium: userData.role === "premium" ? true : false,
  });
};

const getCartPage = async (req, res) => {
  const cartId = req.user.cart;
  const token = req.cookies["authToken"];
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();
  const total = await cartsService.getCartTotal(cartId);
  await cartsService.getProductsWithStock(cartId);
  req.logger.info(`${new Date().toLocaleTimeString()} - Rendering cart page.`);
  res.render("cart", { style: "style.css", cart: await cart, total });
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
  const response = await (
    await fetch("http://localhost:8080/api/users/register", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    })
  ).json();
  if (response.success) return res.redirect("/login");
  else return res.redirect("/register");
};

const postLogin = async (req, res) => {
  loggerOutput("info", `[PostLogin] Login successful`);
  let user = req.user;
  loggerOutput("info", `[PostLogin] Logged: ${user}`);
  const token = generateUserToken(user);
  loggerOutput("debug", `[PostLogin] Token: ${token}`);
  try {
    res.cookie("authToken", token, {
      httpOnly: true,
    });
    const userDb = await usersModel.findOne({ _id: user._id });
    userDb.last_connection = Date.now().toString();
    await userDb.save();
    res.redirect("/products");
  } catch (e) {
    res.redirect("/login");
  }
};

const getMainPage = async (req, res) => {
  res.redirect("/login");
};

const getLogoutPage = async (req, res) => {
  try {
    const userDb = await usersModel.findOne({ _id: req.user._id });
    loggerOutput("debug", `[Logout] User: ${req.user._id}`);
    userDb.last_connection = Date.now().toString();
    await userDb.save();
  } catch (e) {
    loggerOutput("error", `[Logout] error: ${e}`);
  }
  req.headers.authorization = null;
  res.clearCookie("authToken");

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
  const email = req.body.email;
  loggerOutput(
    "debug",
    `[VIEWS/postLostPassord] Restore password email received: ${email}`
  );
  try {
    const user = await usersModel.findOne({ email });
    if (!user) return res.redirect("/lostpassword?e=404&m=Email not found");
    const token = generateToken({ email: user.email });
    const sendMailSuccess = await sendRestoreMail(email, token);
    if (sendMailSuccess) {
      res.redirect("/lostpassword?e=200&m=Mensaje enviado exitosamente");
    } else {
      res.redirect("/lostpassword?e=500&m=No se ha podido enviar el correo");
    }
  } catch (e) {
    loggerOutput("error", e);
    res.redirect(
      "/lostpassword?e=500&m=Error del servidor, intente nuevamente"
    );
  }
};

const getManageProductsPage = async (req, res) => {
  const token = req.cookies["authToken"];
  loggerOutput("debug", "Rendering products manager");
  const products = await (
    await fetch("http://localhost:8080/api/products?limit=999", {
      headers: { Authorization: "Bearer " + token },
    })
  ).json();
  res.render("manageproducts", {
    style: "manageProducts.css",
    products: await products,
  });
};

const postAddProduct = async (req, res) => {
  loggerOutput("info", "Trying to add a new product");
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

const getTicketPage = async (req, res) => {
  const ticketCode = req.params.tid;
  const ticket = await ticketManager.getTicketByCode(ticketCode);
  const userEmail = req.user.email;
  if (ticket.success) {
    if (ticket.ticket.purchaser == userEmail)
      return res.render("purchase", {
        style: "style.css",
        ticket: ticket.ticket,
      });
  } else {
    return res.redirect("http://localhost:8080/");
  }
};

const postPurchase = async (req, res) => {
  let ticket;
  const cartId = req.user.cart;
  const email = req.user.email;

  const productsStock = await cartsService.getProductsWithStock(cartId);
  if (productsStock.productsWithStock.length > 0) {
    const productsWithStockTotal = await productsService.getProductsTotal(
      productsStock.productsWithStock
    );
    ticket = await ticketManager.createTicket(productsWithStockTotal, email);
    if (ticket.success) {
      for await (const product of productsStock.productsWithStock) {
        await cartsService.removeProductOfCart(cartId, product.id);
      }
      return res.send({ success: true, ticketCode: ticket.ticketCode });
    } else {
      return res.status(500).send({ success: false });
    }
  } else {
    return res.status(500).send({ success: false });
  }
};

const deleteEmptyCart = async (req, res) => {
  loggerOutput("info", `[DeleteEmptyCart] Removing products of cart...`);
  const token = req.cookies["authToken"];
  const cartId = req.user.cart;
  const apiResponse = await (
    await fetch("http://localhost:8080/api/carts/" + cartId, {
      method: "DELETE",
      headers: { Authorization: token },
    })
  ).json();
  if (apiResponse.success) {
    return res.send({ success: true });
  } else {
    return res.send({ success: false });
  }
};

const getMockingProducts = async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    const product = generateProduct();
    products.push(product);
  }
  res.send(products);
};

const getRestorePassword = async (req, res) => {
  const { token } = req.query;
  loggerOutput("debug", "Recibido token, analizando...");
  const validation = validateToken(token);
  if (validation) {
    const decoded = decryptToken(token);
    res.render("restorepassword", {
      style: "credentials.css",
      email: decoded.email,
      token: token,
    });
  } else {
    res.send(
      "<h1>Link no válido...</h1><a href='http://localhost:8080/'>Volver a la página principal</a>"
    );
  }
};

const postRestorePassword = async (req, res) => {
  const { token, password } = req.body;
  const validation = validateToken(token);
  if (validation) {
    const email = decryptToken(token).email;
    try {
      const user = await usersModel.findOne({ email });
      if (!user)
        return res
          .status(404)
          .send({ success: false, message: "User not found." });
      const cr_password = createHash(password);
      user.password = cr_password;
      await user.save();
      loggerOutput("info", "Contraseña actualizada para " + email);
      res.redirect("/");
    } catch (e) {
      loggerOutput("error", e);
    }
  } else {
    res.status(403).send({ success: false, message: "Token not valid" });
  }
};

const getProfilePage = async (req, res) => {
  const userData = req.user;
  res.render("profile", {
    style: "style.css",
    ...userData,
    admin: userData.role === "admin" ? true : false,
    premium: userData.role === "premium" ? true : false,
  });
};

export {
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
  getManageProductsPage,
  postAddProduct,
  getTicketPage,
  postPurchase,
  deleteEmptyCart,
  getMockingProducts,
  getRestorePassword,
  postRestorePassword,
  getProfilePage,
};
